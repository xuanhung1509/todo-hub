import { useState, useEffect } from 'react';
import { FaCrown } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTodoContext } from '../../context/TodoContext';
import iconUser from '../../assets/icon-user.png';
import Spinner from '../Spinner/Spinner';
import './LeaderBoard.scss';

function LeaderBoard() {
  const { currentUser } = useTodoContext();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getAllUsers = async () => {
      const users = [];
      const querySnap = await getDocs(collection(db, 'users'));

      querySnap.forEach(async (doc) => {
        users.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      console.log(users);

      // Sort the 3 most users having the most completed tasks
      let sortedUsers = users.sort((a, b) => b.completed - a.completed);
      sortedUsers = sortedUsers.slice(0, 3);
      setUsers(sortedUsers);
      setTotal(sortedUsers.reduce((acc, cur) => acc + cur.completed, 0));
      setIsLoading(false);
    };

    getAllUsers();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className='leaderboard'>
      <div className='icon-crown'>
        <FaCrown size={26} />
      </div>
      <div className='leaderboard-header'>
        <h1 className='heading'>Top 3 Most Productive Users</h1>
        <div>
          <span>User</span>
          <span>Score</span>
        </div>
      </div>
      <ul className='user-list'>
        {users.map((user, index) => (
          <li key={user.id} className='user-item'>
            <div className='index'>{index + 1}</div>
            <div className='avatar'>
              <img src={user.avatarURL || iconUser} alt='' />
            </div>
            <div className='main'>
              <div className='username'>
                {user.username}
                {currentUser && currentUser.uid === user.id && (
                  <small className='label'>you</small>
                )}
              </div>
              <div
                className='progress'
                style={{ width: `${(user.completed / total) * 100}%` }}
              ></div>
            </div>
            <div className='score'>{user.completed}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default LeaderBoard;
