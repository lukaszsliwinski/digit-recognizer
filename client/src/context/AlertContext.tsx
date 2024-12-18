import { createContext, useContext, useState, ReactNode } from 'react';
import Alert from '../components/Alert';

// Create context
const AlertContext = createContext<any>(null);

// Context provider
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<string>('');

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

// useAlert reusable hook
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
