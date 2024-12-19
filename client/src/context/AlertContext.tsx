import { createContext, useContext, useState, ReactNode } from 'react';
import Alert from '../components/Alert';

// Create context
const AlertContext = createContext<any>(null);

// Context provider
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  // State variable
  const [alert, setAlert] = useState<string>('');

  // Function to show alert and auto-clear it after 3 seconds
  const showAlert = (text: string) => {
    setAlert(text);

    setTimeout(() => {
      setAlert('');
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert text={alert} />}
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
