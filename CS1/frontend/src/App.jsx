// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import History from './pages/History';
import Home from './pages/Home/Home';
import Header from './components/Header/Header'; 
import './index.css'; 
import Background from './components/Background/Background';


function App() {
  return (
    <Router>
      <div className="App">
      <Header /> 
      

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History />} />
        </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
