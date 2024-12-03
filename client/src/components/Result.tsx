import { useEffect, useState } from "react";

interface IResult {
  result: string | undefined,
  confidence: string | undefined
}

function Result({ result, confidence } : IResult) {
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    if (confidence) {
      let counter = 0;
      let i = setInterval(() => {
        setPercent(counter);
        counter++;
        if (counter === parseInt(confidence)+1) {
          clearInterval(i);
        }
      }, 5)
    } else {
      setPercent(0);
    }
  }, [confidence]);
  
  return (
    <div className="grid grid-cols-2 gap-x-16 font-semibold">
      
      <div className="relative size-20">
        <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          {/* Background Circle */}
          <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" stroke-width="3"></circle>
          {/* Progress Circle */}
          <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-blue-600" stroke-width="3" stroke-dasharray="100" stroke-dashoffset={100-percent} stroke-linecap="round"></circle>
        </svg>

        {/* Percentage Text */}
        <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <span className="text-center text-xl text-blue-600">{percent ? `${percent}%` : ''}</span>
        </div>
      </div>
      
      <div className="w-20 h-20 shadow rounded-full text-center text-5xl leading-[76px]">{result}</div>

      <div className="mt-2 text-xs text-center">CONFIDENCE</div>
      <div className="mt-2 text-xs text-center">RECOGNIZED</div>
    </div>
  )
}

export default Result;