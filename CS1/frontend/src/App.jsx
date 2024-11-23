// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import History from './pages/History/History';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import './index.css';
import Auth from './pages/Auth/Auth';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fe/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/fe/auth" element={<Auth />} />
            <Route path="/history" element={<History />} />
            <Route path="/fe/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
