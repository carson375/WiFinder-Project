import { NextPage } from "next";
import * as React from "react";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, Box, Paper, Grid, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import wifiData from "../testData/testWifi.json";
import { useState } from "react";
import ProfileTable from "../components/ProfileTable";

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

const ProfilePage: NextPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={0} paddingTop={20}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={5} height={100} />
          <Grid item xs={6} md={2} height={100} color="white">
            <Typography variant="h4" color="black">
              Profile Page
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={1} paddingTop={5}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2.9} />
          <Grid item xs={6} md={2} height={300} minWidth={700} color="white">
            <ProfileTable wifiData={wifiData} />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default ProfilePage;
