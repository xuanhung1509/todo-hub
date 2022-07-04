import { useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

function useDarkMode() {
  const [isEnabled, setIsEnabled] = useLocalStorageState('dark-theme', {
    defaultValue: false,
  });

  // Initially set theme to dark if OS theme is dark
  useEffect(() => {
    const prefersDarkScheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (prefersDarkScheme) setIsEnabled(true);
    // eslint-disable-next-line
  }, []);

  // Toggle dark theme on switch
  useEffect(() => {
    const className = 'dark-theme';
    const bodyClass = window.document.body.classList;

    isEnabled ? bodyClass.add(className) : bodyClass.remove(className);
  }, [isEnabled]);

  return [isEnabled, setIsEnabled];
}
export default useDarkMode;
