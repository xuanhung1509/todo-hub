import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronCircleRight, FaHome } from 'react-icons/fa';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        'Password reset email sent! You may need to check your spam box.'
      );
      navigate('/sign-in');
    } catch (error) {
      toast.error('Could not send password reset email.');
    }
  };

  return (
    <div className='signin'>
      <h2 className='heading'>Forgot Password</h2>
      <p className='subheading'>
        Fill in the email below to get password reset link
      </p>
      <div className='signin-form'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='signin-bar'>
            <div className='signin-text'>Continue</div>
            <button className='btn signin-btn'>
              <FaChevronCircleRight size={28} />
            </button>
          </div>
        </form>

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
export default ForgotPassword;
