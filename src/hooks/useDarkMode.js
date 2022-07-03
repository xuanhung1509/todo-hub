import { useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

function useDarkMode() {
  const [theme, setTheme] = useLocalStorageState('theme', {
    defaultValue: 'light',
  });

  // Initially set theme to dark if OS theme is dark
  useEffect(() => {
    const prefersDarkScheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (prefersDarkScheme) setTheme('dark');
    // eslint-disable-next-line
  }, []);

  // Toggle dark theme on switch
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return { theme, setTheme };
}
export default useDarkMode;
