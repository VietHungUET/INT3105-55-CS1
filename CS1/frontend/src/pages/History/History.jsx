import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import './History.css'; 

const History = () => {
  // pha cè data
  const data = [
    {
      id: 1,
      shortened: 'short.ly/abc123',
      original: 'https://www.example.com/some/long/url/here',
      date: '2024-11-01',
    },
    {
      id: 2,
      shortened: 'short.ly/xyz456',
      original: 'https://www.example.com/another/long/url/here',
      date: '2024-11-02',
    },
    
  ];

  const handleRemove = (id) => {
    
    console.log(`Remove link with ID: ${id}`);
  };

  
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
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                <span>{item.shortened}</span>
                <button onClick={() => handleCopy(item.shortened)} className="copy-button">
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </td>
              <td>
                <span>{item.original}</span>
                <button onClick={() => handleCopy(item.original)} className="copy-button">
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </td>
              <td>{item.date}</td>
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
};

export default History;
