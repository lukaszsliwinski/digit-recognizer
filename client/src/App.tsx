import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const getData = () => {
    axios
      .get('/data')
      .then(response => {
        response.data.test.forEach((el: string) => {
          console.log(el);
        })
      })
      .catch(error => console.error(error))
  }

  return (
    <div>
      <button onClick={getData}>get data and console</button>
    </div>
  );
}

export default App;
