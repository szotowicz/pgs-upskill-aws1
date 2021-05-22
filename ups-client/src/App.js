import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import logo from './logo.svg';
import './App.css';

// TODO: to remove
const mockLanguage = {
  id: 0,
  name: 'C++',
  updatedAt: (new Date()).toISOString()
};

const defaultLanguage = {
  id: 0,
  name: '???',
  updatedAt: (new Date()).toISOString()
};

const App = () => {
  const [bestLanguage, setBestLanguage] = useState(defaultLanguage);
  const [updatedLanguage, setUpdatedLanguage] = useState("");

  useEffect(() => {
    // TODO: call API
    setBestLanguage(mockLanguage);
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
    console.log('TODO: call API', updated);
    setBestLanguage(updated);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          The best programming language is: {bestLanguage.name}
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
