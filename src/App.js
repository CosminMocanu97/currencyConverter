import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import "./App.css"

function App() {
  const [currencies, setCurrencies] = useState([])

  useEffect(() => {
    axios.get("https://api.currencyfreaks.com/latest?apikey=3cea30067384449893329465d4b99946")
      .then((response) => {

      console.log(response.data);
      console.log(Object.keys(response.data.rates).sort())

      setCurrencies(Object.keys(response.data.rates).sort())

    });
  }, []);

  return (
    <div className="App">
      <h1> Currency Converter </h1>
      <div className="inputDiv">
      <h3> Enter amount </h3>


      <TextField value = "1" fullWidth autoFocus variant="outlined" />
      </div>


      <div style={{display:"flex", justifyContent:"space-between"}}>


      <FormControl className = "FromCurrency">
        <Select
          value="EUR"
        >
         {currencies.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
      

        = 

    
        <FormControl className = "ToCurrency">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value="EUR"
        >
         {currencies.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
     
      
      </div>


    </div>
  );
}

export default App;
