import { useEffect, useState } from 'react';

interface IAlert {
  type: 'default' | 'warning' | 'error';
  text: string;
}

function Alert({ type, text }: IAlert) {
  // State variable
  const [visible, setVisible] = useState(false);
  const [bgClass, setBgClass] = useState('');

  // Show the alert when the text and type changes
  useEffect(() => {
    switch (type) {
      case 'warning':
        setBgClass('bg-amber-500');
        break;
      case 'error':
        setBgClass('bg-red-500');
        break;
      case 'default':
        setBgClass('');
        break;
    }

    setVisible(true);

    // Hide the alert after 3 seconds
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 3000);

    // Cleanup timeout when the component unmounts or text changes
    return () => clearTimeout(timeout);
  }, [type, text]);

  return (
    <div
      className={`fixed left-1/2 top-8 -translate-x-1/2 transform rounded-lg ${bgClass} px-6 py-4 text-center text-xl text-white shadow-lg transition-all duration-300 ease-in-out ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} `}
    >
      {text}
    </div>
  );
}

export default Alert;
