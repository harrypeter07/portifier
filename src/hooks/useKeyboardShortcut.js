import { useEffect } from 'react';

const useKeyboardShortcut = (key, ctrlKey, callback) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === key && event.ctrlKey === ctrlKey) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrlKey, callback]);
};

export default useKeyboardShortcut;