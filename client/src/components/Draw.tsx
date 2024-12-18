import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import useWindowDimensions from '../hooks/useWindowDimensions';
import { useAlert } from '../context/AlertContext';

import Header from './Header';
import Button from './Button';
import Result from './Result';

function Draw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [recognizedDigit, setRecognizedDigit] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState(false);

  const { showAlert } = useAlert();

  const { screenHeight, screenWidth } = useWindowDimensions();

  // Initialization when the component mounts for the first time
  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d');
      const canvas = canvasRef.current;
        
      if (ctxRef.current && screenWidth) {
        // set canvas dimenstions based on the screen width
        if (screenWidth >= 480) {
          canvas.width = 320;
          canvas.height = 320;
        } else if (screenWidth < 480 && screenWidth >= 360) {
          canvas.width = 256;
          canvas.height = 256;
        } else {
          canvas.width = 224;
          canvas.height = 224;
        };

        ctxRef.current.lineCap = 'round';
        ctxRef.current.strokeStyle = 'black';
        ctxRef.current.lineWidth = 20;
  
        // Fill the canvas with a white background
        ctxRef.current.fillStyle = 'white';
        ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [screenWidth]);

  // Prevent agains page scrolling when draw a digit on canvas on mobile
  useEffect(() => {
    const preventTouchScroll = (e: TouchEvent) => {
      if (canvasRef.current && canvasRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });
  
    return () => {
      document.removeEventListener('touchmove', preventTouchScroll);
    };
  }, []);

  // Start, end and draw functions
  const startDrawing = (x: number, y: number) => {
    if (disabled) {
      setDisabled(false);
    }

    ctxRef?.current?.beginPath();
    ctxRef?.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    ctxRef?.current?.closePath();
    setIsDrawing(false);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) {
      return;
    }

    ctxRef?.current?.lineTo(x, y);
    ctxRef?.current?.stroke();
  };


  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseUp = () => {
    endDrawing();
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (rect) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      startDrawing(x, y);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (rect) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      draw(x, y);
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    endDrawing();
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
          showAlert('Server error, try again later!');
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
    <section className="flex flex-col justify-evenly items-center bg-neutral-50 w-full sm:w-[460px] h-[620px] rounded-xl shadow-xl mt-1 xs:mt-4 lg:mt-0">
      <Header text={'Draw a digit'} />
      <div className="flex flex-col items-center">
        <canvas
          className="border-2 border-gray-400 rounded w-56 xxs:w-64 xs:w-80 h-56 xxs:h-64 xs:h-80 hover:cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={canvasRef}
        />
        <div className="flex justify-center items-center flex-col xxs:flex-row mt-4">
          <Button type="button" click={recognize} disabled={disabled} text={'RECOGNIZE'} />
          <Button type="button" click={resetState} disabled={undefined} text={'CLEAR'} />
        </div>
      </div>
      <Result result={recognizedDigit?.toString()} confidence={confidence!} />
    </section>
  );
}

export default Draw;