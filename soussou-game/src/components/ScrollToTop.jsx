import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Remonte en haut de la page à chaque changement de route
    // Utilise un défilement instantané pour éviter toute confusion
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;