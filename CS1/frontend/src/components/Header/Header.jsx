import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png';
import './HeaderStyle.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = "User";
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSignInClick = () => {
    navigate('/auth', { state: { isSignUpMode: false } });
  };

  const handleRegisterClick = () => {
    navigate('/auth', { state: { isSignUpMode: true } });
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <nav className="nav-links">
        {/* Thêm nút Home */}
        <div className="home-button">
          <NavLink to="/" className="home-link">
            <FontAwesomeIcon icon={faHome} />
            <span className="home-text">Home</span>
          </NavLink>
        </div>

        {/* Kiểm tra nếu không phải trang /auth */}
        {location.pathname !== '/auth' && (
          isLoggedIn ? (
            <>
              <NavLink to="/history" activeClassName="active">History</NavLink>
              <div className="user-info">
                <span>{username}</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
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
