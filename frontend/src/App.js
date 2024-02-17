import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Salonsignup from './pages/salon/Salonsignup';
import Signup from './pages/user/Signup';
import Saloninfo from './pages/user/Saloninfo';
import Login from './pages/Login';
import { useContext, useState } from 'react';
import { store } from './store';
import Logo from '../src/assets/logo.png';
import Home from './pages/Home';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Profile from './pages/Profile';

function App() {
  // const [isScrolled, setIsScrolled] = useState(false);

  const { state, dispatch } = useContext(store);
  const { user } = state;
  const signoutHandler = () => {
    dispatch({ type: 'SIGNOUT' });
    localStorage.removeItem('user');
    window.location.href('/login');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer position="bottom-center" limit={1} theme="dark" />
        {user && (
          // <div className={isScrolled ? 'scrollednav' : 'navbar'}>
          <div className="navbar">
            <Link to="/">
              {' '}
              <img src={Logo} className="navbar-brand" />
            </Link>
            <div className="nav-items">
              <div className="nav-item-profile">
                <Link to="/profile/" className="nav-link">
                  <img
                    src={
                      user.image
                        ? `data:image/jpg;base64,${user.image}`
                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYduP9erFkId0aNuDIMKrBik4-nBSh0NSy5Q&usqp=CAU'
                    }
                    style={{
                      width: '3rem',
                      height: '3rem',
                      objectFit: 'cover',
                    }}
                  />
                </Link>
              </div>

              <div className="nav-item">
                <Link to="/login" onClick={signoutHandler} className="nav-link">
                  Logout{' '}
                </Link>
                <i className="fa-solid fa-right-from-bracket nav-icon"></i>
              </div>
            </div>
          </div>
        )}
        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/profile/" element={<Profile />} />
            <Route path="/saloninfo/:salonid" element={<Saloninfo />} />
            <Route path="/salonregister" element={<Salonsignup />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
