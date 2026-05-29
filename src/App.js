import './App.css';
import IndexRoutes from './routes/IndexRoutes.jsx';
import { useLanguage } from './i18n/LanguageContext.jsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackTikTokPageView } from './helpers/tiktokPixel';

function App()
{
  const { direction, language, isArabic } = useLanguage();
  const location = useLocation();

  useEffect(() =>
  {
    trackTikTokPageView();
  }, [location.pathname, location.search]);

  return (
      <main className={`h-full w-full ${isArabic ? 'rtl-layout' : 'ltr-layout'}`} id="scroll-container" dir={direction} lang={language}>
        <IndexRoutes />
      </main>
  );
}

export default App;
