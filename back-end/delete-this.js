// Delete or rename this file just doing this for the back-end folder
import React, { useRef, useEffect, useState } from "react";

export default function Test() {
    console.log("Hello World");
}; 

// Import the Axios library
const axios = require('axios');

// Define the URL you want to send requests to
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

// Heat Map: Send a GET request 
axios.get(apiUrl)
  .then(response => {
    console.log('GET Request Response:', response.data);
  })
  .catch(error => {
    console.error('GET Request Error:', error);
  });

// Flight Path Data Page: Send a POST request with data
const postData = {
  title: 'foo',
  body: 'bar',
  userId: 1,
};
axios.post(apiUrl, postData)
  .then(response => {
    console.log('POST Request Response:', response.data);
  })
  .catch(error => {
    console.error('POST Request Error:', error);
  });

  // Flight Path Data Page: Send a GET request 
axios.get(apiUrl)
.then(response => {
  console.log('GET Request Response:', response.data);
})
.catch(error => {
  console.error('GET Request Error:', error);
});

// Flight Path Page: Send a POST request with data
const postData2 = {
  title: 'foo',
  body: 'bar',
  userId: 1,
};
axios.post(apiUrl, postData2)
  .then(response => {
    console.log('POST Request Response:', response.data);
  })
  .catch(error => {
    console.error('POST Request Error:', error);
  });