import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css'; // Import CSS cho bảng

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

  return (
    <div>
      <h2>History</h2>
      <p>This is the History page. View the history of our URL shortening service!</p>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Short URL</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.shortenedUrl}>
              <td>
                <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                  {url.originalUrl}
                </a>
              </td>
              <td>
                <a href={`http://localhost:8000/short/${url.shortenedUrl}`} target="_blank" rel="noopener noreferrer">
                  {url.shortenedUrl}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
