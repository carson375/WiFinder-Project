// Delete or rename this file just doing this for the back-end folder
import { Auth } from "aws-amplify";
import * as React from "react";
import { useState } from "react";

export const CreateTableEndpoint = async () => {
  //   const [userName, setUserName] = useState("");
  //   Auth.currentUserInfo().then((userInfo) => {
  //     setUserName(userInfo.username);
  //   });

  var AWS = require("aws-sdk");
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAWYNYJS7H4ZVUKJ4M",
    accessSecretKey: "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",
    endpoint:
      "https://us-east-1.console.aws.amazon.com/vpc/home?region=us-east-1#Endpoints:vpcEndpointId=vpce-08f60372368967ead",
  });

  var client = new AWS.DynamoDB();
  var documentClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: "carson.375",
    KeySchema: [
      { AttributeName: "FlightNumber", KeyType: "HASH" }, //Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: "FlightNumber", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  //   ddb.createTable(params, function (err, data) {
  //     if (err) {
  //       console.log("Error", err);
  //     } else {
  //       console.log("Table Created", data);
  //     }
  //   });

  client.createTable(params, function (tableErr, tableData) {
    console.log(AWS.config.accessSecretKey);
    if (tableErr) {
      console.error("Error JSON:", JSON.stringify(tableErr, null, 2));
    } else {
      console.log("Created table successfully!");
    }

    // Adding Sample Data
    var params = {
      TableName: "carson.375",
      Item: {
        FlightNumber: "flight1",
        FlightData: [
          {
            longitude: -83.0125,
            latitude: 39.999197,
            height: 0,
            "wifi strenght": 2.3,
          },
          {
            longitude: -83.0149,
            latitude: 39.999197,
            height: 0,
            "wifi strenght": 2.5,
          },
        ],
      },
    };

    console.log("Adding a new item...");
    documentClient.put(params, function (err, data) {
      if (err) {
        console.error("Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("Added item successfully!");
      }
    });
  });
};
