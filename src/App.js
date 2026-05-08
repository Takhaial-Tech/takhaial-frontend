import './App.css';
import IndexRoutes from './routes/IndexRoutes.jsx';
import { useLanguage } from './i18n/LanguageContext.jsx';

function App()
{
  const { direction, language, isArabic } = useLanguage();

  return (
      <main className={`h-full w-full ${isArabic ? 'rtl-layout' : 'ltr-layout'}`} id="scroll-container" dir={direction} lang={language}>
        <IndexRoutes />
      </main>
  );
}

export default App;
