import Upload from './Upload';
import Draw from './Draw';

function App() {
  return (
    <main className="flex justify-center items-center w-full min-h-screen bg-background bg-cover bg-fixed bg-center">
      <div className="flex flex-col lg:flex-row justify-evenly items-center w-full min-h-screen p-2 xs:p-8 lg:p-0 lg:h-[80vh] lg:min-h-[650px] bg-white/10 backdrop-blur-lg shadow-xl">
        <Upload />
        <Draw />
      </div>
    </main>
  );
}

export default App;
