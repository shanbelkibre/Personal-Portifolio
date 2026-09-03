import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '@/context/CMSContext';

export const KeyboardShortcuts: React.FC = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, setIsCMSDrawerOpen } = useCMS();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Listen for Ctrl+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsCMSDrawerOpen(true);
        } else {
          navigate('/admin');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn, navigate, setIsCMSDrawerOpen]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
