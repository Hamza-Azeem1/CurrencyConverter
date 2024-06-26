import { useState, useEffect } from 'react';
import Select from 'react-select';

const App = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [conversionRate, setConversionRate] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_HOST = import.meta.env.VITE_API_HOST;
  const API_URL = import.meta.env.VITE_API_URL;

  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    if (!API_KEY || !API_HOST || !API_URL) {
      setErrorMessage('API configuration is missing.');
      return;
    }

    fetch(API_URL, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    })
      .then(response => response.json())
      .then(data => {
        const rates = data.rates;
        const options = Object.keys(rates);
        setCurrencyOptions(options);

        const rate = rates[toCurrency] / rates[fromCurrency];
        setConversionRate(rate);
      })
      .catch(error => {
        console.error('Error fetching currency data:', error);
        setErrorMessage('Error fetching currency data.');
      });
  }, [API_KEY, API_HOST, API_URL, fromCurrency, toCurrency]);

  const handleConvert = () => {
    if (!amount) {
      setErrorMessage('Please enter an amount.');
      setConvertedAmount('');
      return;
    }
    if (isNaN(amount) || !/^\d+(\.\d{1,2})?$/.test(amount)) {
      setErrorMessage('Invalid input. Please enter a valid amount number. Alpabets and other character are invalid!');
      setConvertedAmount('');
      return;
    }
    const convertedValue = (parseFloat(amount) * conversionRate).toFixed(2);
    setConvertedAmount(convertedValue);
    setDisplayAmount(amount);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-200 to-green-200">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-700">Currency Converter</h1>
        <div className="mb-6">
          <input
            type="text"
            className="border rounded-md w-full p-3 focus:ring focus:ring-blue-300 border-blue-500 placeholder-gray-400 text-gray-800"
            placeholder="Enter amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="flex items-center mb-6">
          <Select
            className="w-1/2"
            options={currencyOptions.map(option => ({ value: option, label: option }))}
            value={{ value: fromCurrency, label: fromCurrency }}
            onChange={option => setFromCurrency(option.value)}
            placeholder="Select currency"
          />
          <span className="text-gray-600 mx-4">to</span>
          <Select
            className="w-1/2"
            options={currencyOptions.map(option => ({ value: option, label: option }))}
            value={{ value: toCurrency, label: toCurrency }}
            onChange={option => setToCurrency(option.value)}
            placeholder="Select currency"
          />
        </div>
        {errorMessage && (
          <p className="text-red-600 mb-4 text-sm">{errorMessage}</p>
        )}
        <button
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors w-full"
          onClick={handleConvert}
        >
          Convert
        </button>
        {convertedAmount && (
          <p className="text-xl font-semibold mt-6">
            {displayAmount} {fromCurrency} = {convertedAmount} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
