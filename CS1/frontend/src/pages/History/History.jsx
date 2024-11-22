import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import './History.css'; // Import CSS cho bảng
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function History() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = cookies.get('token');
        const response = await axios.get('http://localhost:8000/my-urls', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUrls(response.data);
        console.log(response.data);
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

  const handleRemove = async (id) => {
    try {
      const token = cookies.get('token');
      const response = await axios.delete(`http://localhost:8000/api/urls/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status !== 204) {
        throw new Error('Failed to delete URL');
      }

      // Cập nhật trạng thái sau khi xóa thành công
      setUrls(urls.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting URL:', error);
      setError('Failed to delete URL');
    }
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
            <th>Remove</th>
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
                <span>{item.originalUrl}</span>
                <button onClick={() => handleCopy(item.originalUrl)} className="copy-button">
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleRemove(item.id)} className="remove-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;