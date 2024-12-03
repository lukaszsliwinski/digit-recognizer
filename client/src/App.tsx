import Upload from './Upload';
import Draw from './Draw';

function App() {
  return (
    <main className="flex justify-center items-center w-screen h-screen bg-background">
      <div className="flex justify-evenly items-center w-screen h-[80vh] bg-white/10 backdrop-blur-lg shadow-xl">
        <Upload />
        <Draw />
      </div>
    </main>
  );
}

export default App;
