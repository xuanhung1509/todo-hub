import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTodoContext } from '../../context/TodoContext';
import iconUser from '../../assets/icon-user.png';
import ThemeToggler from '../../components/ThemeToggler/ThemeToggler';
import LeaderBoard from '../../components/LeaderBoard/LeaderBoard';
import MyTodo from '../../components/MyTodo/MyTodo';
import Popup from '../../components/Popup/Popup';
import './Home.scss';

function Home() {
  const { isLoading, currentUser } = useTodoContext();
  const tabs = ['LeaderBoard', 'My Todo'];

  const [activeTab, setActiveTab] = useState('LeaderBoard');
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = (e) => {
    if (e.target.classList.contains('avatar')) {
      setShowPopup((prevState) => !prevState);
    }
  };

  return (
    <>
      <header className='header'>
        <div className='logo'>TODO</div>
        <div>
          <ThemeToggler />
          <div className='user-icon' onClick={handleClick}>
            <div className='avatar'>
              <img src={currentUser?.photoURL ?? iconUser} alt='avatar' />
            </div>
            {showPopup && (
              <Popup
                avatarURL={currentUser?.photoURL ?? iconUser}
                setShowPopup={setShowPopup}
              />
            )}
          </div>
        </div>
      </header>
      <nav className='navbar'>
        <ul className='tab-list'>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={`tab-item ${tab === activeTab && 'active'}`}
              onClick={(e) => setActiveTab(e.target.textContent)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>
      {!isLoading && (
        <div className='content'>
          {activeTab === 'LeaderBoard' ? (
            <LeaderBoard />
          ) : currentUser ? (
            <MyTodo />
          ) : (
            <Navigate to='/sign-in' />
          )}
        </div>
      )}
    </>
  );
}
export default Home;
