import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './App.css';

// TODO: turn alerts into custom snackbars

function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [recognizedDigit, setRecognizedDigit] = useState<number | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);

  // Reset app's state to initial values
  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(undefined);
    setRecognizedDigit(null);
    setDisabled(true);
  }

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
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
    } else {
      resetState();
      alert("Please select a valid JPG or PNG image.");
    }
  };

  // Handle submit file
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

  return (
    <div>
      <div>
        <h1>Upload an Image (jpg/jpeg/png)</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
          <button type="submit" disabled={disabled}>recognize</button>
        </form>
      </div>
      <h3>how the app sees the image:</h3>
      <img
        src={previewUrl}
        alt="Preview"
        style={{
          // TODO: move inline styles to css file
          width: "200px",  // Display size
          height: "200px", // Display size
          imageRendering: "pixelated", // Keeps pixels sharp when upscaling
        }}
      />
      <h2>recognized digit: {recognizedDigit}</h2>
    </div>
  );
}

export default Upload;
