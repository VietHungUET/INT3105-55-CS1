
import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';
import Result from '../../components/Result/Result';

function Home() {

  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/create', { url });
      const data = response.data;
      setShortUrl(data.shortUrl);
      setError('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while creating the short URL.');
      }
      setShortUrl('');
    }
  };
  return (
    <div className="subheader">
      {/* Content before waves */}
      <div className="inner-header flex">


        {/* Main Content */}
        <div className="inputContainer">
          <h1>URL <span>Shortener</span></h1>
          <h2> Simplify your links, track and manage them </h2>
          <div>
            <input
              type="text"
              placeholder="Enter a long link here"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button onClick={handleClick}>Shorten</button>
          </div>

          <Result shortUrl={shortUrl} />
        </div>


      </div>


      {/* Waves Container */}
      <div className="waves-container">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>


    </div>
  );
}

export default Home;
