import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './context/TodoContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

function App() {
  const theme = 'light';

  return (
    <TodoProvider>
      <Router>
        <div className={`background ${theme === 'dark' && 'dark'}`}></div>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </TodoProvider>
  );
}
export default App;
