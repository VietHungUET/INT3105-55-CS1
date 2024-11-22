import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import './History.css'; 

function History() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/my-urls', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUrls(response.data);
      } catch (err) {
        setError('Failed to fetch URLs');
      }
    };
    fetchUrls();
  }, []);

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="history-container">
      <h1>Your Shortened URLs</h1>
      <p>Here you can see all the links you've shortened.</p>

      {error && <p className="error">{error}</p>}

      <table className="history-table">
        <thead>
          <tr>
            <th>Shortened Links</th>
            <th>Original Links</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((item) => (
            <tr key={item.id}>
              <td>
                <span>{item.shortenedUrl}</span>
                <button onClick={() => handleCopy(item.shortenedUrl)} className="copy-button">
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </td>
              <td>
                <span title={item.originalUrl}>{item.originalUrl}</span>
                <button onClick={() => handleCopy(item.originalUrl)} className="copy-button">
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
