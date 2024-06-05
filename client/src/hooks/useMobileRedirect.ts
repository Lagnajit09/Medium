import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useMobileRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);

    if (isMobileDevice()) {
      navigate('/mobile-view');
    }
  }, [navigate]);
};

export default useMobileRedirect;
