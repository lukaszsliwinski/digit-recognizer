import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const getData = () => {
    axios
      .post('/api/predict')
      .then(response => {
        console.log(response);
      })
      .catch(error => console.error(error))
  }

  return (
    <div>
      <button onClick={getData}>predict</button>
    </div>
  );
}

export default App;
