import { useEffect } from 'react';
import { BiSun, BiMoon } from 'react-icons/bi';
import useLocalStorageState from 'use-local-storage-state';
import './ThemeToggler.scss';

function ThemeToggler() {
  const [theme, setTheme] = useLocalStorageState('theme', 'light');
  const handleClick = () => {
    setTheme((prevState) => (prevState === 'light' ? 'dark' : 'light'));
  };

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

  return (
    <div className='theme-toggler'>
      <button className='btn theme-toggler-btn' onClick={handleClick}>
        <div className='switch'>
          {theme === 'dark' ? (
            <BiMoon size={10} fill='hsl(220deg, 98%, 61%)' />
          ) : (
            <BiSun size={10} fill='#fff' />
          )}
        </div>
      </button>
    </div>
  );
}
export default ThemeToggler;
