import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../../assets/googleIcon.svg';
import './OAuth.scss';

function OAuth() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClickGoogle = async () => {
    // Sign in/up user with Google
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // If user not exists, add to database
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        username: user.displayName,
        email: user.email,
        timestamp: serverTimestamp(),
      });
    }

    toast.success(
      userSnap.exists()
        ? `Welcome back, ${user.displayName}`
        : `Welcome ${user.displayName} to Todohub`
    );
    navigate('/');
  };

  return (
    <div className='oauth-signin'>
      <p className='oauth-text'>
        Sign {pathname === '/sign-in' ? 'in' : 'up'} with
      </p>
      <div className='oauth-methods'>
        <button className='btn' onClick={handleClickGoogle}>
          <img src={googleIcon} alt='google' />
        </button>
      </div>
    </div>
  );
}
export default OAuth;
