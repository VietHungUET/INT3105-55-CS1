// src/components/Header.js
import React from 'react';
import { NavLink } from 'react-router-dom'; // Sử dụng NavLink thay vì Link
import logo from '../../assets/logo.png';
import './HeaderStyle.css';

function Header() {
  return (
    <header className='header'>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" exact activeClassName="active">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" activeClassName="active">About</NavLink>
          </li>
          <li>
            <NavLink to="/history" activeClassName="active">History</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
