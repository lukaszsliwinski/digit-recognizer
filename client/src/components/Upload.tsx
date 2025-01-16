import { useState, useRef, ChangeEvent, FormEvent, DragEvent } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

import { useAlert } from '../context/AlertContext';

import Header from './Header';
import Button from './Button';
import Result from './Result';

function Upload() {
  // Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State variables
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [recognizedDigit, setRecognizedDigit] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const { showAlert } = useAlert();

  // Handle file upload and prepare for recognition
  const uploadFile = (file: File) => {
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      setSelectedFile(file);
      showAlert({
        type: 'warning',
        text: 'Important: if the image is unreadable, upload a better quality one!'
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          // Resize image to 28x28px using a canvas
          const canvas = document.createElement('canvas');
          canvas.width = 28;
          canvas.height = 28;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Draw resized image onto canvas
            ctx.drawImage(img, 0, 0, 28, 28);

            // Convert canvas content to Blob and update state
            canvas.toBlob((blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, { type: 'image/png' });
                setSelectedFile(resizedFile);
                setPreviewUrl(canvas.toDataURL('image/png'));
                setDisabled(false);
              }
            }, 'image/png');
          }
        };
      };
      reader.readAsDataURL(file);

      setDisabled(false);
      setRecognizedDigit(null);
    } else {
      resetState();
      showAlert({ type: 'error', text: 'Please select a valid JPG or PNG image.' });
    }
  };

  // Handle file selection
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    uploadFile(file!);
  };

  // Handle submit form and send the image to the server for recognition
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Prepare form data for the POST request
    const formData = new FormData();
    formData.append('img', selectedFile!);
    const headers = { 'Content-Type': 'multipart/form-data' };

    // Send request to the server
    axios
      .post('/api/recognize', formData, { headers: headers })
      .then((response) => {
        setRecognizedDigit(response.data.recognized_digit);
        setConfidence(response.data.confidence);
      })
      .catch(() => {
        resetState();
        showAlert({ type: 'error', text: 'Error uploading image, try again later!' });
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

  // Reset input and state
  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(undefined);
    setRecognizedDigit(null);
    setConfidence(null);
    setDisabled(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="mb-1 flex h-[620px] w-full flex-col items-center justify-evenly rounded-xl bg-neutral-50 shadow-xl xs:mb-4 sm:w-[460px] lg:mb-0">
      <div className="h-16">
        <Header text={'Upload an image'} />
        <p className="mt-1 text-sm font-semibold text-gray-400">
          - black number on white background -
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${isDragOver ? 'bg-white text-gray-300' : 'bg-neutral-50 text-gray-400'} flex h-56 w-56 items-center justify-center rounded border-2 border-dashed border-gray-400 hover:cursor-pointer hover:text-gray-300 xxs:h-64 xxs:w-64 xs:h-80 xs:w-80`}
        >
          {previewUrl ? (
            <img
              id="preview"
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-center">
              <FontAwesomeIcon icon={faCloudArrowUp} size="3x" />
              <p>
                Click or drag an image here
                <br />
                (jpg/jpeg/png)
              </p>
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
        <div className="mt-4 flex flex-col items-center justify-center xxs:flex-row">
          <Button type="submit" click={undefined} disabled={disabled} text={'RECOGNIZE'} />
          <Button type="button" click={resetState} disabled={undefined} text={'CLEAR'} />
        </div>
      </form>
      <Result result={recognizedDigit?.toString()} confidence={confidence!} />
    </section>
  );
}

export default Upload;
