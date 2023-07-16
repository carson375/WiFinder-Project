import { NextPage } from "next";
import { useSession } from "next-auth/react";
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

const loginMessage = 'Log in to your user profile to view previous flight paths, and data sets. If you do not have a user profile you can create an account through the login page.';
const flightPathMessage = 'Navigate to the flight path page to enter the route the drone will follow. The map is interactive, so enter checkpoints, barriers, and the path into the user interface. After the flight path has been established click the submit button to send the data to the drone.';
const heatMapMessage = 'After the drone has finished the desired flight path navigate to the heat map page to view the data. On the heat map page the data can be viewed in a visual or csv format.';


const HomePage: NextPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <img alt="my image" src="./teamPhoto.jpg" />
              </Grid>
              <Grid item xs={6} md={8} height={291}>
                <Item>
                  <Typography variant="h4">
                    WiFinder Project
                  </Typography>
                  <Typography variant="h6">
                    From Left to Right Developed By:
                  </Typography>
                  <br /><br />
                  <Typography variant="h6">
                    Zach Goodwin, Parker Carson, Kevin Wenger, Ryan McKinley, & Kaiden McGraw
                  </Typography>
                  <Typography height={111}> </Typography>
                </Item>
              </Grid>
            </Grid>
            </Box>
            <Box sx={{ flexGrow: 1 }} p={6} paddingTop={2}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Item>
                  <Typography variant='h6'>Login Page</Typography>
                  <br />
                  <Typography>{loginMessage}</Typography>
                  <Typography height={178}> </Typography>
                </Item>
              </Grid>
              <Grid item xs={6} md={4}>
                <Item>
                  <Typography variant='h6'>Flight Path Page</Typography>
                  <br />
                  <Typography>{flightPathMessage}</Typography>
                  <Typography height={130}></Typography>
                </Item>
              </Grid>
              <Grid item xs={6} md={4}>
                <Item>
                  <Typography variant='h6'>Heat Map Page</Typography>
                  <br />
                  <Typography>{heatMapMessage}</Typography>
                  <Typography height={178}></Typography>
                </Item>
              </Grid>
            </Grid>
          </Box>
        </ThemeProvider>
  );
};

export default HomePage;
