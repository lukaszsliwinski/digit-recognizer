import { useEffect, useState } from 'react';

function Alert({ text }: { text: string }) {
  // State variable
  const [visible, setVisible] = useState(false);

  // Show the alert when the text changes
  useEffect(() => {
    setVisible(true);

    // Hide the alert after 3 seconds
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 3000);

    // Cleanup timeout when the component unmounts or text changes
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div
      className={`fixed left-1/2 top-4 -translate-x-1/2 transform rounded-lg bg-red-500 px-4 py-2 text-center text-lg text-white shadow-lg transition-all duration-300 ease-in-out ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} `}
    >
      {text}
    </div>
  );
}

export default Alert;
