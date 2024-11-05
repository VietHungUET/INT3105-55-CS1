import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Auth.css';
import logImage from '../../assets/log.svg';
import registerImage from '../../assets/register.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faPhone } from '@fortawesome/free-solid-svg-icons';

const Auth = () => {
  const location = useLocation();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  useEffect(() => {
    if (location.state && location.state.isSignUpMode !== undefined) {
      setIsSignUpMode(location.state.isSignUpMode);
    }
  }, [location.state]);

  const handleSignUpClick = () => setIsSignUpMode(true);
  const handleSignInClick = () => setIsSignUpMode(false);

  return (
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form">
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faPhone} /></i>
              <input type="text" placeholder="Phone number" />
            </div>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faLock} /></i>
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>

          <form className="sign-up-form">
            <h2 className="title">Register</h2>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faUser} /></i>
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faPhone} /></i>
              <input type="phone" placeholder="Phone number" />
            </div>
            <div className="input-field">
              <i><FontAwesomeIcon icon={faLock} /></i>
              <input type="password" placeholder="Password" />
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
