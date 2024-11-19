import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faLink, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Import biểu tượng avatar
import logo from '../../assets/logo.png';
import './HeaderStyle.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleSignInClick = () => {
    navigate('/auth', { state: { isSignUpMode: false } });
  };

  const handleRegisterClick = () => {
    navigate('/auth', { state: { isSignUpMode: true } });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      const avatar = document.querySelector('.user-avatar');
      const dropdownMenu = document.querySelector('.dropdown-menu');

      if (avatar && !avatar.contains(event.target) && dropdownMenu && !dropdownMenu.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <nav className="nav-links">
        <div className="home-button">
          <NavLink to="/" className="home-link">
            <FontAwesomeIcon icon={faHome} />
            <span className="home-text">Home</span>
          </NavLink>
        </div>

        {location.pathname !== '/auth' && (
          isLoggedIn ? (
            <>
              <div className="his-button">
                <NavLink to="/history" className="history-link">
                  <FontAwesomeIcon icon={faLink} />
                  <span className="history-text">History</span>
                </NavLink>
              </div>

              <div className="user-avatar" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faUserCircle} className="avatar-icon" />
              </div>

              {showMenu && (
                <div className="dropdown-menu">
                  <p className="username">{username}</p>
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
              )}
            </>
          ) : (
            <div className="auth-buttons">
              <button className="sign-in" onClick={handleSignInClick}>Sign In</button>
              <button className="register" onClick={handleRegisterClick}>Register</button>
            </div>
          )
        )}
      </nav>
    </header>
  );
}

export default Header;
