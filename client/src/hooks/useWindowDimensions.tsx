import { useEffect, useState } from 'react';

// Define the structure for screen dimensions
type WindowDimentions = {
  screenWidth: number | undefined;
  screenHeight: number | undefined;
};

const useWindowDimensions = (): WindowDimentions => {
  // State variable
  const [windowDimensions, setWindowDimensions] = useState<WindowDimentions>({
    screenWidth: undefined,
    screenHeight: undefined
  });

  useEffect(() => {
    // Update the state with the current window dimensions
    function handleResize(): void {
      setWindowDimensions({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      });
    }

    // Set dimensions on initial render
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener when component unmounts
    return (): void => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
