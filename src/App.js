import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const base_url = 'http://localhost:54544'
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  // eslint-disable-next-line
  const [selectedUrl, setSelectedUrl] = useState(JSON.parse(localStorage.getItem('selectedUrl')));

  useEffect(() => {
    axios.get(`${base_url}/revision-list/`)
      .then(response => {
        return response.data;
      })
      .then(data => setUrls(data));
  }, []);

  // eslint-disable-next-line
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlData = { url: newUrl, time: new Date(), checked: false };
    axios.get(base_url, {
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

    axios.put(`${base_url}/revision-list/${urlToChange.id}`, updatedUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.data)
      .catch(error => console.error(error));
  };

  const handleUnPick = () => {
    const uncheckedUrls = urls.filter(url => !url.checked);
    const randomUrl = uncheckedUrls[Math.floor(Math.random() * uncheckedUrls.length)];

    setSelectedUrl(randomUrl);
    localStorage.setItem('selectedUrl', JSON.stringify(randomUrl));

    if (randomUrl) {
      window.open(randomUrl.url, '_blank');
    }
  };

  const handlePick = () => {
    const uncheckedUrls = urls.filter(url => url.checked);
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

  return (
    <div className='container'>
      <div style={{ 'display': 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
        <button className='button' onClick={handleUnPick}>Pick a new URL</button>

        <button className='button' onClick={handlePick}>Pick a URL for revision</button>
      </div>

      <div>
        {/* <form style={styles.form} onSubmit={handleSubmit}>
        <input style={styles.input} value={newUrl} onChange={e => setNewUrl(e.target.value)} required />
        <button style={styles.button} type="submit">Add URL</button>
      </form>
       */}

        {
          selectedUrl &&
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
            <p style={{ margin: '0 10px 0 0', whiteSpace: 'nowrap' }}>Recently selected URL</p>
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(selectedUrl)}
              style={{ margin: '0 10px 0 0' }}
            />
            <a
              href={selectedUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'blue', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {selectedUrl.title}
            </a>
          </div>
        }

        <table className='table'>
          <thead>
            <tr>
              <th className='th'>Checkbox</th>
              <th className='th'>URL</th>
              <th className='th'>Creation Time</th>
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
              <tr key={index} className="tr" style={{ backgroundColor: item.checked ? 'lightgreen' : 'white' }}>
                <td className='td'><input type="checkbox" checked={item.checked} onChange={() => handleCheckboxChange(item)} /></td>
                <td className='td'><a href={item.url} style={{ color: 'blue' }} target="_blank" rel="noopener noreferrer">{item.title}</a></td>
                <td className='td'>{getDiff(item.last_update)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;