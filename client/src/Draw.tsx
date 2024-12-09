import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import Header from './components/Header';
import Button from './components/Button';
import Result from './components/Result';

function Draw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [recognizedDigit, setRecognizedDigit] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialization when the component
  // mounts for the first time
  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d');
        
      if (ctxRef.current) {
        ctxRef.current.lineCap = 'round';
        ctxRef.current.strokeStyle = 'black';
        ctxRef.current.lineWidth = 20;

        // Fill the canvas with a white background
        ctxRef.current.fillStyle = 'white';
        ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);

  // Function for starting the drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) {
      setDisabled(false);
    }

    ctxRef?.current?.beginPath();
    ctxRef?.current?.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    ctxRef?.current?.closePath();
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }

    ctxRef?.current?.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    ctxRef?.current?.stroke();
  };


  const recognize = async () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/png');
      const response = await fetch(dataURL);
      const blob = await response.blob(); // Convert to Blob
    
      // Create form data to send the image file and prepare axios data
      const formData = new FormData();
      formData.append('img', blob, 'digit.png');
      const headers = {'Content-Type': 'multipart/form-data'}

      // POST request
      axios
        .post('/api/recognize', formData, {headers: headers})
        .then(response => {
          setRecognizedDigit(response.data.recognized_digit);
          setConfidence(response.data.confidence);
        })
        .catch(() => {
          alert('error');
          resetState();
        });
      }
  }

  const resetState = () => {
    if (ctxRef.current && canvasRef.current) {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Redraw the white background after clearing
        ctxRef.current.fillStyle = 'white';
        ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // disable recognize btn
        setDisabled(true);
        setRecognizedDigit(null);
        setConfidence(null);
    }
  };

  return (
    <section className="flex flex-col justify-evenly items-center bg-neutral-50 w-[460px] h-[620px] rounded-xl shadow-xl">
      <Header text={'Draw a digit'} />
      {/* TODO: cursor pencil */}
      <canvas
        className="border-2 border-gray-400 rounded w-80 h-80 hover:cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        width="320"
        height="320"
      />
      <div className="flex justify-center ">
        <Button type="button" click={recognize} disabled={disabled} text={'RECOGNIZE'} />
        <Button type="button" click={resetState} disabled={undefined} text={'CLEAR'} />
      </div>
      <Result result={recognizedDigit?.toString()} confidence={confidence!} />
    </section>
  );
}

export default Draw;