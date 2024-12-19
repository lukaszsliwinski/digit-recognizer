import { useEffect, useState } from 'react';

import ProgressCircle from './ProgressCircle';

// Props
interface IResult {
  result: string | undefined;
  confidence: string | undefined;
}

function Result({ result, confidence }: IResult) {
  // State variables
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    // Incrementally update the percent state to simulate animation
    if (confidence) {
      let counter = 0;
      let i = setInterval(() => {
        setPercent(counter);
        counter++;
        if (counter === parseInt(confidence) + 1) {
          clearInterval(i);
        }
      }, 5);
    } else {
      setPercent(0);
    }
  }, [confidence]);

  return (
    <div className="grid grid-cols-2 gap-x-8 font-semibold xxs:gap-x-16">
      <ProgressCircle percent={percent} />
      <div className="h-20 w-20 rounded-full text-center text-[56px] leading-[76px] shadow">
        {result}
      </div>
      <div className="mt-2 text-center text-xs">CONFIDENCE</div>
      <div className="mt-2 text-center text-xs">RECOGNIZED</div>
    </div>
  );
}

export default Result;
