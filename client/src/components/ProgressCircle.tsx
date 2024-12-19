import { useState, useEffect } from "react";

const ProgressCircle = ({ percent }: { percent: number }) => {
  // State variable
  const [strokeColor, setStrokeColor] = useState<string>('rgb(255, 0, 0)');

  // Determine color based on the progress percentage
  const getColor = (percent: number): string => {
    if (percent <= 70) {
      const red = 255;
      const green = Math.round((percent / 70) * 200);
      return `rgb(${red}, ${green}, 0)`;
    } else {
      const red = Math.round(((100 - percent) / 30) * 200);
      const green = 200 + Math.round(((percent - 70) / 30) * 55);
      return `rgb(${red}, ${Math.min(green, 200)}, 0)`;
    }
  };

  // Update the color based on percentage
  useEffect(() => {
    const color = getColor(percent);
    setStrokeColor(color);
  }, [percent]);

  return (
    <div className="relative size-20">
      <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-gray-100"
          strokeWidth="3"
        ></circle>
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray="100"
          strokeDashoffset={100 - percent}
          strokeLinecap="round"
        ></circle>
      </svg>

      <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className="text-center text-2xl">{percent ? `${percent}%` : ''}</span>
      </div>
    </div>
  );
};

export default ProgressCircle;
