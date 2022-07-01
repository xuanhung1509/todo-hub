import { useRef } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTodoContext } from '../../context/TodoContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import './Popup.scss';

function Popup({ avatarURL, setShowPopup }) {
  const { currentUser, updateUserProfile } = useTodoContext();
  const navigate = useNavigate();
  const toastId = useRef(null);

  const handleChange = (e) => {
    const image = e.target.files[0];

    const storage = getStorage();
    const storageRef = ref(storage, `images/${uuidv4()}-${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    // Upload avatar to storage and get downloadURL
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (toastId.current === null) {
          toastId.current = toast('Upload in Progress', { progress });
        } else {
          toast.update(toastId.current, { progress });
        }
      },
      (error) => {
        setShowPopup(false);
        toast.error('Error occurred. Please try again.');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        updateUserProfile('photoURL', downloadURL);

        // Add avatar to database
        await updateDoc(doc(db, 'users', currentUser.uid), {
          avatarURL: downloadURL,
        });

        toast.done(toastId.current);
        toast.success('Profile picture updated!');
        setShowPopup(false);
      }
    );
  };

  const handleClick = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      navigate('/sign-in');
    } catch (error) {
      toast.error('Error occurred. Please try again.');
    }
  };

  return (
    <div className='popup'>
      {currentUser ? (
        <>
          <div className='avatar'>
            <img src={avatarURL} alt='' />
            <label>
              <FaPencilAlt fill='#fff' />
              <input
                type='file'
                accept='.jpg, .png, .jpeg'
                onChange={handleChange}
              />
            </label>
          </div>
          <div className='username'>{currentUser.displayName}</div>
          <div className='email'>{currentUser.email}</div>
          <button className='btn' onClick={handleClick}>
            Sign Out
          </button>
        </>
      ) : (
        <Link to='/sign-in' className='btn'>
          Sign In
        </Link>
      )}
    </div>
  );
}
export default Popup;
