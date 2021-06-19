import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@material-ui/core';
import logo from './logo.svg';
import './App.css';

const serverAddress = 'http://localhost:3001/language'
const defaultLanguage = {
  id: 0,
  name: '???',
  updatedAt: (new Date()).toISOString()
};

const App = () => {
  const [bestLanguage, setBestLanguage] = useState(defaultLanguage);
  const [updatedLanguage, setUpdatedLanguage] = useState("");

  useEffect(() => {
    async function fetchLanguage() {
      const response = await axios(serverAddress);
      setBestLanguage(response.data)
    }
    fetchLanguage();
  }, []);

  const onChange = event => {
    setUpdatedLanguage(event.target.value)
  };

  const onSave = () => {
    const updated = {
      ...bestLanguage,
      name: updatedLanguage,
      updatedAt: (new Date()).toISOString()
    }
    axios.post(serverAddress, updated)
    setBestLanguage(updated);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          The best programming language is: "{bestLanguage.name}"
        </p>
        <div>
          <TextField id="input" className="input-new-language" label="Update best language" variant="filled" onChange={onChange} />
          <Button variant="contained" color="primary" onClick={onSave} >
            SEND
          </Button>
        </div>
      </header>
    </div>
  );
}

export default App;
