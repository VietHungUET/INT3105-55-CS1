import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';
import logImage from '../../assets/log.svg';
import registerImage from '../../assets/register.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faPhone } from '@fortawesome/free-solid-svg-icons';

const Auth = () => {
  const location = useLocation();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (location.state && location.state.isSignUpMode !== undefined) {
      setIsSignUpMode(location.state.isSignUpMode);
    }
  }, [location.state]);

  const handleSignUpClick = () => setIsSignUpMode(true);
  const handleSignInClick = () => setIsSignUpMode(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        username,
        password
      });

      const data = response.data;
      if (data.status === 'success') {
        // Lưu trữ token trong localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('username', data.data.user.username);
        console.log('Login successful:', data.data.user);
        window.location.href = `${process.env.REACT_APP_FRONTEND_URL ? process.env.REACT_APP_FRONTEND_URL : ''}/`;
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data.error);
      } else {
        console.error('Error during login:', error);
      }
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
        username,
        phone,
        password,
        confirmPassword
      });

      const data = response.data;
      if (data.status === 'success') {
        console.log('Registration successful:', data.data.user);
        setIsSignUpMode(false); // Chuyển về chế độ đăng nhập sau khi đăng ký thành công
      } else {
        console.error('Registration failed:', data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Registration failed:', error.response.data.error);
      } else {
        console.error('Error during registration:', error);
      }
    }
  };

  return (
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faUser} /></i>
              <input type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faLock} /></i>
              <input type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>

          <form className="sign-up-form" onSubmit={handleRegister}>
            <h2 className="title">Register</h2>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faUser} /></i>
              <input type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faPhone} /></i>
              <input type="phone"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faLock} /></i>
              <input type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faLock} /></i>
              <input type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <input type="submit" className="btn" value="Sign up" />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Welcome to ShrinHub! Sign up for free to easily shorten your links and track their performance. Join us now and simplify your sharing!</p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img src={logImage} className="image" alt="Log" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Log in to ShrinHub to manage your shortened links and track their performance.</p>
            <button className="btn transparent" onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img src={registerImage} className="image" alt="Register" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
