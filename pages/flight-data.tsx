import { NextPage } from "next";
import * as React from "react";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, Box, Paper, Grid, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import wifiData from "../testData/testWifi.json";
import { useState } from "react";
import ProfileTable from "../components/ProfileTable";
// @ts-nocheck
import Papa from "papaparse";
import { Auth } from "aws-amplify";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#999999",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

let theme = createTheme({
  palette: {
    primary: {
      main: "#00ff00",
      dark: "#0fff00",
      light: "01fff0",
    },
  },
});

const FlightData: NextPage = () => {
  const [file, setFile] = useState<File>();
  const fileReader = new FileReader();
  const date = new Date();
  const [userName, setUserName] = useState("");
  const [newFile, setNewFile] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempFile = e.target.files?.[0];
    tempFile ? setFile(tempFile) : alert("Not a valid file");
    setNewFile(false);
  };

  const onFileParse = () => {
    fileReader.onload = async ({ target }) => {
      const csv = Papa.parse(target?.result as any);
      const data = csv?.data;
      wifiData.push(formatForHeatmap(data));
      alert("Data Successfully Uploaded!");
      setNewFile(true);
    };
    fileReader.readAsText(file as Blob);
  };

  Auth.currentUserInfo().then((userInfo) => {
    setUserName(userInfo.username);
  });

  const formatForHeatmap = (data: any) => {
    const fileNameLength = file?.name.length;
    const newJson = {
      type: "FeatureCollection",
      crs: {
        type: `${
          fileNameLength
            ? file?.name.substring(0, fileNameLength - 4)
            : file?.name
        }`,
        properties: {
          name: `${
            fileNameLength
              ? file?.name.substring(0, fileNameLength - 4)
              : file?.name
          }`,
          date: `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
          number: `${wifiData.length + 1}`,
          user: userName,
        },
      },
      features: [],
    };
    let dataPoints = [];
    for (let index = 1; index < data.length - 1; index++) {
      const tempIndex = data[index];
      let myObj = {
        type: "Feature",
        properties: { id: userName, db: Number(tempIndex[3]) },
        geometry: {
          type: "Point",
          coordinates: [
            Number(tempIndex[0]),
            Number(tempIndex[1]),
            tempIndex[2] == "" ? 0.0 : Number(tempIndex[2]),
          ],
        },
      };
      dataPoints.push(myObj);
    }
    newJson.features = dataPoints as any;
    return newJson;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ flexGrow: 1 }}
        p={6}
        paddingBottom={0}
        paddingTop={20}
        justifyContent="center"
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item height={100} color="white">
            <Typography variant="h4" color="black">
              Flight Data
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={0} paddingTop={0}>
        <Grid
          container
          spacing={0}
          justifyContent="center"
          alignItems="center"
          direction="row"
        >
          <Grid item height={120} paddingRight={9}>
            <Typography color="black">Upload Flight Data:</Typography>
            <input type={"file"} accept={".csv"} onChange={onFileChange} />
            <Button
              variant="contained"
              onClick={() => {
                onFileParse();
              }}
              style={{
                maxWidth: "100px",
                maxHeight: "56px",
                minWidth: "100px",
                minHeight: "56px",
              }}
            >
              Upload
              <input type="file" hidden />
            </Button>
          </Grid>
          <Grid item height={120}>
            <Typography color="black">Download Current Flight Data:</Typography>
            <a
              href="https://172.20.10.9/FlightData.txt"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="contained"
                style={{
                  maxWidth: "220px",
                  maxHeight: "56px",
                  minWidth: "220px",
                  minHeight: "56px",
                }}
              >
                Download
              </Button>
            </a>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={1} paddingTop={0}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} md={2} height={300} minWidth={700} color="white">
            {newFile && <ProfileTable wifiData={wifiData} />}
            {!newFile && <ProfileTable wifiData={wifiData} />}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default FlightData;
