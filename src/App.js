import { Suspense } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen.jsx';
import IndexRoutes from './routes/IndexRoutes.jsx';

function App()
{
  return (
    <Suspense fallback={<LoadingScreen  />}>
      <main className={"h-full w-full"} id="scroll-container">
        <IndexRoutes />
      </main>
    </Suspense>
  );
}

export default App;
