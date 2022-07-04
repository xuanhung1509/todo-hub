import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronCircleRight, FaHome } from 'react-icons/fa';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  query,
  collection,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import OAuth from '../../components/OAth/OAuth';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const { username, email, password, password2 } = formData;

  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    // Reset error
    setErrors((prevState) => ({
      ...prevState,
      [id]: '',
    }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;

    if (value.trim().length === 0) {
      setErrors((prevState) => ({
        ...prevState,
        [id]: 'This field is required.',
      }));
    }
  };

  const isUsernameTaken = async () => {
    let taken = false;

    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      if (doc.exists) {
        taken = true;
      }
    });

    return taken;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    for (let key in formData) {
      if (formData[key].length === 0) {
        toast.error('Please fill in all fields.');
        return;
      }
    }

    // Check if username is taken
    if (await isUsernameTaken()) {
      setErrors((prevState) => ({
        ...prevState,
        username: 'Username is already taken.',
      }));
      return;
    }

    // Make sure password >= 8
    if (password.trim().length < 8) {
      setErrors((prevState) => ({
        ...prevState,
        password: 'Password must be at least 8 characters.',
      }));
      return;
    }

    // Make sure passwords match
    if (password !== password2) {
      setErrors((prevState) => ({
        ...prevState,
        password2: 'Passwords must match.',
      }));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: username,
      });

      // Save user to database
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      delete formDataCopy.password2;
      formDataCopy.timestamp = serverTimestamp();
      formDataCopy.completed = 0;

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      toast.success(`Welcome ${username} to Todohub`);
      navigate('/');
    } catch (error) {
      // Check if email is in use
      if (error.code === 'auth/email-already-in-use') {
        setErrors((prevState) => ({
          ...prevState,
          email: 'Email already in use.',
        }));
        return;
      }

      // Other cases
      const lowercaseErrorMessage = error.code
        .split('/')[1]
        .split('-')
        .join(' ');
      const errorMessage =
        lowercaseErrorMessage.slice(0, 1).toUpperCase() +
        lowercaseErrorMessage.slice(1) +
        '.';
      toast.error(errorMessage);
    }
  };

  const inputs = [
    {
      label: 'Username',
      id: 'username',
      type: 'text',
      value: username,
    },
    {
      label: 'Email',
      id: 'email',
      type: 'email',
      value: email,
    },
    {
      label: 'Password',
      id: 'password',
      type: 'password',
      value: password,
    },
    {
      label: 'Confirm password',
      id: 'password2',
      type: 'password',
      value: password2,
    },
  ];

  return (
    <div className='signin'>
      <h2 className='heading'>Welcome!</h2>
      <p className='subheading'>Create an account to set todo</p>

      <div className='signin-form'>
        <form onSubmit={handleSubmit}>
          {inputs.map(({ label, id, type, value }) => (
            <div className='form-group' key={id}>
              <label htmlFor={id}>{label}</label>
              <input
                type={type}
                name={id}
                id={id}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <small className='error'>{errors[id]}</small>
            </div>
          ))}

          <div className='signin-bar'>
            <div className='signin-text'>Sign Up</div>
            <button className='btn signin-btn'>
              <FaChevronCircleRight fill='#fff' size={28} />
            </button>
          </div>
        </form>

        <OAuth />

        <div className='signup-bar'>
          <Link to='/sign-in' className='link'>
            Sign In Instead
          </Link>
        </div>

        <div className='gohome-bar'>
          <Link to='/' className='btn'>
            <FaHome />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Register;
