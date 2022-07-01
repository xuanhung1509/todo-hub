import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronCircleRight, FaHome } from 'react-icons/fa';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import OAuth from '../../components/OAth/OAuth';
import './SignIn.scss';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success(`Welcom back, ${userCredential.user.displayName}`);

      navigate('/');
    } catch (error) {
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
  ];

  return (
    <div className='signin'>
      <h2 className='heading'>Welcome back!</h2>
      <p className='subheading'>Login to your account to get the work done</p>

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
              />
            </div>
          ))}

          <div className='forgot-password-bar'>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>
          <div className='signin-bar'>
            <div className='signin-text'>Sign In</div>
            <button className='btn signin-btn'>
              <FaChevronCircleRight size={28} />
            </button>
          </div>
        </form>

        <OAuth />

        <div className='signup-bar'>
          <Link to='/sign-up' className='btn'>
            Sign Up Instead
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
export default SignIn;
