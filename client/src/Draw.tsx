import { useEffect, useRef, useState } from 'react';
import './Draw.css';

function Draw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialization when the component
  // mounts for the first time
  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d');
        
      if (ctxRef.current) {
        ctxRef.current.lineCap = 'round';
        ctxRef.current.strokeStyle = 'black';
        ctxRef.current.lineWidth = 10;
    }
    }
  }, []);

  // Function for starting the drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
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

  const clearCanvas = () => {
    if (ctxRef.current && canvasRef.current) {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="draw-area">
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        width={"280px"}
        height={"280px"}
      />
      <button onClick={clearCanvas}>clear</button>
    </div>
  );
}

export default Draw;