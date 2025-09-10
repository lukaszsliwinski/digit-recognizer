import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import useWindowDimensions from '../hooks/useWindowDimensions';
import { useAlert } from '../context/AlertContext';

import Header from './Header';
import Button from './Button';
import Result from './Result';

function Draw() {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // State variables
  const [recognizedDigit, setRecognizedDigit] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState(false);

  const { showAlert } = useAlert();

  const { screenHeight, screenWidth } = useWindowDimensions();

  // Initialization when the component mounts or screenWidth changes
  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d');
      const canvas = canvasRef.current;

      if (ctxRef.current && screenWidth) {
        // set canvas dimenstions based on screen width
        if (screenWidth >= 480) {
          canvas.width = 384;
          canvas.height = 384;
        } else if (screenWidth < 480 && screenWidth >= 360) {
          canvas.width = 256;
          canvas.height = 256;
        } else {
          canvas.width = 224;
          canvas.height = 224;
        }

        // Configure drawing context
        ctxRef.current.lineCap = 'round';
        ctxRef.current.strokeStyle = 'black';
        ctxRef.current.lineWidth = 20;

        // Fill the canvas with a white background
        ctxRef.current.fillStyle = 'white';
        ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [screenWidth]);

  // Prevent scrolling on touch devices when interacting with the canvas
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

  // Start drawing on the canvas
  const startDrawing = (x: number, y: number) => {
    if (disabled) {
      setDisabled(false);
    }

    ctxRef?.current?.beginPath();
    ctxRef?.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  // End drawing
  const endDrawing = () => {
    ctxRef?.current?.closePath();
    setIsDrawing(false);
  };

  // Draw on the canvas
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

  // Send the drawing to the server for recognition
  const recognize = async () => {
    if (canvasRef.current) {
      // Convert canvas to data URL and then to Blob
      const dataURL = canvasRef.current.toDataURL('image/png');
      const response = await fetch(dataURL);
      const blob = await response.blob();

      // Prepare form data for the POST request
      const formData = new FormData();
      formData.append('img', blob, 'digit.png');
      const headers = { 'Content-Type': 'multipart/form-data' };

      // Send request to the server
      axios
        .post('/api/recognize', formData, { headers: headers })
        .then((response) => {
          setRecognizedDigit(response.data.recognized_digit);
          setConfidence(response.data.confidence);
        })
        .catch(() => {
          showAlert({ type: 'error', text: 'Server error, try again later!' });
          resetState();
        });
    }
  };

  // Reset the canvas and state
  const resetState = () => {
    if (ctxRef.current && canvasRef.current) {
      // clear the canvas and redraw white background
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.fillStyle = 'white';
      ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Reset state variables
      setDisabled(true);
      setRecognizedDigit(null);
      setConfidence(null);
    }
  };

  return (
    <section className="flex h-[85vh] sm:h-[720px] w-full flex-col items-center justify-evenly rounded-xl bg-neutral-50 shadow-xl sm:w-[520px]">
      <Header text={'Draw a digit'} />
      <div className="flex flex-col items-center">
        <canvas
          className="h-64 w-64 rounded border-2 border-gray-400 hover:cursor-crosshair xxs:h-64 xxs:w-64 xs:h-96 xs:w-96"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={canvasRef}
        />
        <div className="mt-4 flex flex-col items-center justify-center xxs:flex-row">
          <Button type="button" click={recognize} disabled={disabled} text={'RECOGNIZE'} />
          <Button type="button" click={resetState} disabled={undefined} text={'CLEAR'} />
        </div>
      </div>
      <Result result={recognizedDigit?.toString()} confidence={confidence!} />
    </section>
  );
}

export default Draw;
