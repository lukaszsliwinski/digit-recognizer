import { useState, ChangeEvent, FormEvent, DragEvent } from 'react';
import axios from 'axios';

import Header from './components/Header';
import Button from './components/Button';
import Result from './components/Result';

// TODO: turn alerts into custom snackbars

function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [recognizedDigit, setRecognizedDigit] = useState<number | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Reset app's state to initial values
  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(undefined);
    setRecognizedDigit(null);
    setDisabled(true);
  }

  // Upload file
  const uploadFile = (file: File) => {
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      setSelectedFile(file);

      // Resize the image to 28x28px
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        
        img.onload = () => {
          // Use canvas to resize the image
          const canvas = document.createElement('canvas');
          canvas.width = 28;
          canvas.height = 28;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, 28, 28);
            
            // Convert the canvas to a data url and set as the preview
            setPreviewUrl(canvas.toDataURL('image/png'));
          }
        }
      };
      reader.readAsDataURL(file);
      
      setDisabled(false);
      setRecognizedDigit(null);
    } else {
      resetState();
      alert('Please select a valid JPG or PNG image.');
    }
  }


  // Handle file selection
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    uploadFile(file!);
  };

  // Handle submit form
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Create form data to send the image file and prepare axios data
    const formData = new FormData();
    formData.append('img', selectedFile!);
    const headers = {'Content-Type': 'multipart/form-data'}

    // POST request
    axios
      .post('/api/recognize', formData, {headers: headers})
      .then(response => setRecognizedDigit(response.data.recognized_digit))
      .catch(() => {
        resetState();
        alert('Error uploading image, try again later!');
      });
  };

  // Handle click file input
  const handleClick = () => {
    document.getElementById('fileInput')?.click()
  };

  // Handle drag and drop
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    uploadFile(file);
  };

  return (
    <div>
      <Header text={'Upload an image'} />
      <form onSubmit={handleSubmit}>
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${isDragOver ? 'bg-[#f0f0f0]' : 'bg-white'} flex justify-center items-center w-80 h-80 border-2 border-dashed border-gray-400 rounded hover:cursor-pointer`}
        >
          {previewUrl ? (
            <img
              id="preview"
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-center text-gray-400">Click or drag an image here<br />(jpg/jpeg/png)</p>
          )}

          <input
            id="fileInput"
            className="hidden"
            type="file"
            onChange={handleUpload}
            accept=".jpg,.jpeg,.png"
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" click={undefined} disabled={disabled} text={'recognize'} />
          <Button type="button" click={resetState} disabled={undefined} text={'clear'} />
        </div>
      </form>
      <Result result={recognizedDigit?.toString()} />
    </div>
  );
}

export default Upload;
