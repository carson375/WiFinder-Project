import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Box, Paper, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#999999',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

let theme = createTheme({
  palette: {
    primary: {
      main: '#00ff00',
      dark: '#0fff00',
      light: '01fff0',
    },
  },
});

const flightPathPageMessage = 'Welcome to the Flight Path Page! Enter your desired flight path into the interactive map below, using the path button. Add barriers and checkpoints to make your path more accurate, and once you are finished click the submit button. If there are any mistakes click the clear button to restart. Once the path has been submitted turn your drone on outdoors and watch the drone follow the path.';

const FlightPathPage: NextPage = () => {
  const navigate = useRouter();

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={12}>
                    <Item>
                        <Typography variant="h4">
                           Flight Path Page
                        </Typography>
                        <br />
                        <Typography variant="subtitle1">{flightPathPageMessage}</Typography>
                    </Item>
                </Grid>
            </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingTop={2}>
          <Grid container spacing={2}>
            <Grid item xs={2} md={1}>
              <Button 
                variant="contained" 
                onClick={() => {
                console.log("Barriers Button Clicked");
              }}>
                Barriers
              </Button>
            </Grid>
            <Grid item xs={2} md={1.25}>
              <Button 
                  variant="contained" 
                  onClick={() => {
                  console.log("Checkpoints Button Clicked");
                }}>
                Checkpoints
              </Button>
            </Grid>
            <Grid item xs={2} md={1}>
              <Button 
                  variant="contained" 
                  onClick={() => {
                  console.log("Path Button Clicked");
                }}>
                Path
              </Button>
            </Grid>
            <Grid item xs={2} md={7.05}></Grid>
            <Grid item xs={2} md={0.8}>
              <Button 
                    variant="contained" 
                    onClick={() => {
                    console.log("Clear Button Clicked");
                  }}>
                Clear
              </Button>
            </Grid>
            <Grid item xs={2} md={0.5}>
              <Button 
                    variant="contained" 
                    onClick={() => {
                    console.log("Submit Button Clicked");
                    navigate.push('/');
                  }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={0}>
          <Grid container spacing={2}>
            <Grid item xs={2} md={12}>
              <Item>
                <Typography>This is where the flight path API will go</Typography>
                <Typography height={120}> </Typography>
              </Item>
            </Grid>
          </Grid>
        </Box>
    </ThemeProvider>
  )
};

export default FlightPathPage;
