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
import { CreateTableEndpoint } from "../back-end/DynamoCreateTable";

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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempFile = e.target.files?.[0];
    tempFile ? setFile(tempFile) : alert("Not a valid file");
  };

  const onFileParse = () => {
    fileReader.onload = async ({ target }) => {
      const csv = Papa.parse(target?.result as any);
      const data = csv?.data;
      console.log(data);
    };
    fileReader.readAsText(file as Blob);
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
          <Grid item height={120}>
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
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={1} paddingTop={0}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} md={2} height={300} minWidth={700} color="white">
            <ProfileTable wifiData={wifiData} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={1} paddingTop={0}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} md={2} height={300} minWidth={700} color="white">
            <Button
              variant="contained"
              onClick={() => {
                CreateTableEndpoint();
              }}
              style={{
                maxWidth: "100px",
                maxHeight: "56px",
                minWidth: "100px",
                minHeight: "56px",
              }}
            >
              Create Table
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default FlightData;
