import { createContext, useContext, useState, ReactNode } from 'react';
import Alert from '../components/Alert';
import { IAlert } from '../types';

// Create context
export const AlertContext = createContext<any>(null);

// Context provider
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  // State variable
  const [alert, setAlert] = useState<IAlert>({ type: 'default', text: '' });

  // Function to show alert and auto-clear it after 3 seconds
  const showAlert = ({ type, text }: IAlert) => {
    setAlert({ type: type, text: text });

    setTimeout(() => {
      setAlert({ type: 'default', text: '' });
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert type={alert.type} text={alert.text} />}
    </AlertContext.Provider>
  );
};

// Custom hook to access the AlertContext
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
