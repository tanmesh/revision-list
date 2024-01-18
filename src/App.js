import React, { useState, useEffect } from 'react';

function App() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  // eslint-disable-next-line
  const [selectedUrls, setSelectedUrls] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/urls')
      .then(response => response.json())
      .then(data => setUrls(data));
  }, []);

  // eslint-disable-next-line
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlData = { url: newUrl, time: new Date(), checked: false };
    fetch('http://localhost:3000/urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urlData),
    })
      .then(response => response.json())
      .then(data => setUrls(prevUrls => [...prevUrls, data]));
    setNewUrl('');
  };

  const handleCheckboxChange = (urlToChange) => {
    const updatedUrl = { ...urlToChange, checked: !urlToChange.checked, last_update: new Date() };

    setUrls(prevUrls => prevUrls.map(url => url.title === urlToChange.title ? updatedUrl : url));

    fetch(`http://localhost:3000/urls/${urlToChange.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUrl),
    })
      .then(response => response.json())
      .then(() => {
        setUrls(prevUrls => prevUrls.map(url => url.id === urlToChange.id ? updatedUrl : url));
      });
  };

  const handlePick = () => {
    const uncheckedUrls = urls.filter(url => !url.checked);
    const randomUrl = uncheckedUrls[Math.floor(Math.random() * uncheckedUrls.length)];

    if (randomUrl) {
      window.open(randomUrl.url, '_blank');
    }
  };

  const getDiff = (time) => {
    const diff = (new Date() - new Date(time)) / (1000 * 60 * 60 * 24);
    if (isNaN(diff)) {
      return "";
    } else {
      return diff.toFixed(0) + " days ago";
    }
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
    },
    form: {
      display: 'flex',
      marginBottom: '20px',
    },
    input: {
      marginRight: '10px',
      padding: '5px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '5px 10px',
      fontSize: '16px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: 'black',
      color: 'white',
      cursor: 'pointer',
    },
    table: {
      marginTop: '20px',
      borderCollapse: 'collapse',
      width: '100%',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    th: {
      border: '1px solid #ddd',
      padding: '5px',
      backgroundColor: '#007BFF',
      color: 'white',
    },
    td: {
      border: '1px solid #ddd',
      padding: '7px',
      textAlign: 'center',
    },
    tr: {
      transition: 'background-color 0.3s ease',
    },
    td_style: {
      'width': '350px',
      'overflow-wrap': 'break-word',
    }
  };

  return (
    <div style={styles.container}>
      {/* <form style={styles.form} onSubmit={handleSubmit}>
        <input style={styles.input} value={newUrl} onChange={e => setNewUrl(e.target.value)} required />
        <button style={styles.button} type="submit">Add URL</button>
      </form>
       */}

      <button style={styles.button} onClick={handlePick}>Pick a URL</button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Checkbox</th>
            <th style={styles.th}>URL</th>
            <th style={styles.th}>Creation Time</th>
          </tr>
        </thead>
        <tbody>
          {urls.sort((a, b) => {
            if (a.checked === b.checked) {
              return true;
              // return new Date(b.time) - new Date(a.time);
            }
            return a.checked ? 1 : -1;
          }).map((item, index) => (
            <tr key={index} style={{ ...styles.tr, backgroundColor: item.checked ? 'lightgreen' : 'white' }}>
              <td style={styles.td}><input type="checkbox" checked={item.checked} onChange={() => handleCheckboxChange(item)} /></td>
              <td style={styles.td}><a href={item.url}>{item.title}</a></td>
              <td style={styles.td}>{getDiff(item.last_update)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;