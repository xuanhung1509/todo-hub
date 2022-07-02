import { BiSun, BiMoon } from 'react-icons/bi';
import useDarkMode from '../../hooks/useDarkMode';
import './ThemeToggler.scss';

function ThemeToggler() {
  const { theme, setTheme } = useDarkMode();

  const handleClick = () => {
    setTheme((prevState) => (prevState === 'light' ? 'dark' : 'light'));
  };

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
