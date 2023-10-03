// Delete or rename this file just doing this for the back-end folder
import React, { useRef, useEffect, useState } from "react";
function Test() {}

// Import the Axios library
const axios = require("axios");

// Define the URL you want to send requests to
const apiUrl = "https://jsonplaceholder.typicode.com/posts";

function HeatMapGet() {
  // Heat Map: Send a GET request
  axios
    .get(apiUrl)
    .then((response) => {
      console.log("GET Request Response:", response.data);
    })
    .catch((error) => {
      console.error("GET Request Error:", error);
    });
}

function FlightTestDataPost() {
  // Flight Path Data Page: Send a POST request with data
  const postData = {
    title: "foo",
    body: "bar",
    userId: 1,
  };
  axios
    .post(apiUrl, postData)
    .then((response) => {
      console.log("POST Request Response:", response.data);
    })
    .catch((error) => {
      console.error("POST Request Error:", error);
    });
}

function FlightTestDataGet() {
  // Flight Path Data Page: Send a GET request
  axios
    .get(apiUrl)
    .then((response) => {
      console.log("GET Request Response:", response.data);
    })
    .catch((error) => {
      console.error("GET Request Error:", error);
    });
}

function FlightPathPost() {
  // Flight Path Page: Send a POST request with data
  const postData2 = {
    title: "foo",
    body: "bar",
    userId: 1,
  };
  axios
    .post(apiUrl, postData2)
    .then((response) => {
      console.log("POST Request Response:", response.data);
    })
    .catch((error) => {
      console.error("POST Request Error:", error);
    });
}

function TestGetRequest() {
  const AWS = require("aws-sdk");
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  exports.handler = async (event) => {
    const params = {
      TableName: "RyanMcKinley",
      Key: {
        RyanMcKinley: event.pathParameters.id,
      },
    };

    const result = await dynamoDB.get(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  };
}
