import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import axios from "axios";
import { api } from "../utils/api";
import { NUMBERSONLY_REGEX } from "../utils/regExp";
import "../stylesheets/App.css";

function App() {
  // holds all currencies options
  const [currencies, setCurrencies] = useState([])
  // stores the value of the base currency
  const [fromCurrency, setFromCurrency] = useState("")
  // stores the value of the conversion currency
  const [toCurrency, setToCurrency] = useState("")
  // holds the exchange rate value
  const [exchangeRate, setExchangeRate] = useState()
  // holds the currency amount to be converted
  const [currencyAmount, setCurrencyAmount] = useState(1)
  // holds the date/time of the last api update
  const [lastUpdateDate, setLastUpdateDate] = useState("")
  // used to determine if fetching was completed or not
  const [isLoading, setIsLoading] = useState(true)

  // get api data on mount
  useEffect(() => {
    axios.get(api + process.env.REACT_APP_API_KEY + "/latest/USD")
      .then((response) => {
        const initialToCurrency = "RON"
        const date = new Date(response.data.time_last_update_unix * 1000)
        setCurrencies(Object.keys(response.data.conversion_rates).sort())
        setFromCurrency(response.data.base_code)
        setToCurrency(initialToCurrency)
        setExchangeRate(response.data.conversion_rates[initialToCurrency])
        setLastUpdateDate(date.toLocaleString('en-GB', { timeZone: 'UTC' }))
        setIsLoading(false)
      }).catch(err => {
        console.log(err.response)
      })
  }, []);

  // get new api data when on of the currency changes
  useEffect(() => {
    if (fromCurrency !== "" && toCurrency !== "") {
      axios.get(api + process.env.REACT_APP_API_KEY + "pair/" + fromCurrency + "/" + toCurrency)
        .then((response) => {
          setExchangeRate(response.data.conversion_rate)
        }).catch(err => {
          console.log(err.response)
        })
    }
  }, [toCurrency, fromCurrency]);
  
  // function used to switch currencies
  const switchCurrencies = (baseCurrency, convertedCurrency) => {
    setFromCurrency(convertedCurrency)
    setToCurrency(baseCurrency)
  }

  if (isLoading) {
    return (
      <CircularProgress />
    )
  }
  else {
    return (
      <div className="App">
        <h2> Currency Converter </h2>
        <Divider />

        <div className="dropdownContainer">
          <FormControl className="fromCurrency">
            <InputLabel>From</InputLabel>
            <Select
              label="From"
              native
              value={fromCurrency}
              onChange={(Event) => setFromCurrency(Event.target.value)}
            >
              {currencies.map((option) => (
                <option key={option} value={option}> {option} </option>
              ))}
            </Select>
          </FormControl>

          <IconButton onClick={() => switchCurrencies(fromCurrency, toCurrency)}  >
            <ChangeCircleIcon className="switchIcon" />
          </IconButton>

          <FormControl className="toCurrency">
            <InputLabel>To</InputLabel>
            <Select
              label="To"
              native
              value={toCurrency}
              onChange={(Event) => setToCurrency(Event.target.value)}
            >
              {currencies.map((option) => (
                <option key={option} value={option}> {option} </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="inputContainer">
          <TextField  
            helperText={!NUMBERSONLY_REGEX.test(currencyAmount) ? "Please enter a numerical value" : ""}
            error={!NUMBERSONLY_REGEX.test(currencyAmount) ? true : false} 
            inputProps={{ maxLength: 9 }} label="Currency amount" value={currencyAmount}
            onChange={(Event) => setCurrencyAmount(Event.target.value)} fullWidth autoFocus variant="outlined" 
          />
        </div>

        <div className="resultContainer">
          <p> {1} {fromCurrency} = {(1 * exchangeRate).toFixed(4)} {toCurrency} </p>

          {currencyAmount !== "" && NUMBERSONLY_REGEX.test(currencyAmount) 
          ? 
          <p> {currencyAmount} {fromCurrency} = <br /> <span> {(currencyAmount * exchangeRate).toFixed(2)} {toCurrency} </span> </p> 
          : 
          ""}
        </div>

        <p className="dateTime"> Last updated: {lastUpdateDate} </p>

      </div>
    );
  }
}

export default App;
