import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recognizedDigit, setRecognizedDigit] = useState<number | null>(null);

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle submit file
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('No file');
      return;
    }

    // Create form data to send the image file
    const formData = new FormData();
    formData.append('img', selectedFile);

    // Send POST request
    try {
      const response = await axios.post('/api/recognize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRecognizedDigit(response.data.recognized_digit);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <div>
        <h1>Upload an Image</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button type="submit">recognize</button>
        </form>
      </div>
      <h2>recognized digit: {recognizedDigit}</h2>
    </div>
  );
}

export default App;
