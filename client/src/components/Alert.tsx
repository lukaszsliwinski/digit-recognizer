import { useEffect, useState } from "react";

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
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg bg-red-500 text-white text-center text-lg transition-all duration-300 ease-in-out transform
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
    >
      {text}
    </div>
  );
}

export default Alert;
