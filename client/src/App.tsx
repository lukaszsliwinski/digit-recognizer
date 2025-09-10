import { AlertProvider } from './context/AlertContext';

import Draw from './components/Draw';

function App() {
  return (
    <AlertProvider>
      <main className="flex min-h-screen w-full items-center justify-center bg-background bg-cover bg-fixed bg-center">
        <div className="flex min-h-screen w-full flex-col items-center sm:justify-center bg-white/10 p-2 shadow-xl backdrop-blur-lg xs:p-4 lg:h-[90vh] lg:min-h-[650px] lg:flex-row lg:p-0">
          <Draw />
        </div>
      </main>
    </AlertProvider>
  );
}

export default App;
