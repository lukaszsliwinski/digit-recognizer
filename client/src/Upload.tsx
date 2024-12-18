import { useState, useRef, ChangeEvent, FormEvent, DragEvent } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

import { useAlert } from './context/AlertContext';

import Header from './components/Header';
import Button from './components/Button';
import Result from './components/Result';

function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [recognizedDigit, setRecognizedDigit] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { showAlert } = useAlert();

  // Reset app's state to initial values
  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(undefined);
    setRecognizedDigit(null);
    setConfidence(null);
    setDisabled(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Upload file
  const uploadFile = (file: File) => {
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        
        img.onload = () => {
          // Use canvas to resize the image to 28x28px
          const canvas = document.createElement('canvas');
          canvas.width = 28;
          canvas.height = 28;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, 28, 28);
            
            // Convert the canvas to Blob
            canvas.toBlob((blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, { type: 'image/png' });
                setSelectedFile(resizedFile);
                setPreviewUrl(canvas.toDataURL('image/png'));
                setDisabled(false);
              }
            }, 'image/png');  
          }
        }
      };
      reader.readAsDataURL(file);
      
      setDisabled(false);
      setRecognizedDigit(null);
    } else {
      resetState();
      showAlert('Please select a valid JPG or PNG image.');
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
      .post('/api/recogniz', formData, {headers: headers})
      .then(response => {
        setRecognizedDigit(response.data.recognized_digit);
        setConfidence(response.data.confidence);
      })
      .catch(() => {
        resetState();
        showAlert('Error uploading image, try again later!');
      });
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
    <section className="flex flex-col justify-evenly items-center bg-neutral-50 w-full sm:w-[460px] h-[620px] rounded-xl shadow-xl mb-1 xs:mb-4 lg:mb-0">
      <Header text={'Upload an image'} />
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${isDragOver ? 'bg-white text-gray-300' : 'bg-neutral-50 text-gray-400'} flex justify-center items-center w-56 xxs:w-64 xs:w-80 h-56 xxs:h-64 xs:h-80 border-2 border-dashed border-gray-400 rounded hover:cursor-pointer hover:text-gray-300`}
        >
          {previewUrl ? (
            <img
              id="preview"
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center">
              <FontAwesomeIcon icon={faCloudArrowUp} size="3x" />
              <p>Click or drag an image here<br />(jpg/jpeg/png)</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={handleUpload}
            accept=".jpg,.jpeg,.png"
          />
        </div>
        <div className="flex justify-center items-center flex-col xxs:flex-row mt-4">
          <Button type="submit" click={undefined} disabled={disabled} text={'RECOGNIZE'} />
          <Button type="button" click={resetState} disabled={undefined} text={'CLEAR'} />
        </div>
      </form>
      <Result result={recognizedDigit?.toString()} confidence={confidence!} />
    </section>
  );
}

export default Upload;
