import { NextPage } from "next";
import * as React from 'react';
import { useRouter } from 'next/router'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Box, Paper, Grid, Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import testDatabase from '../testData/testDatabase.json'
import { useState } from "react";

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

const LoginPage: NextPage = () => {
  const navigate = useRouter();
  
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmitHandler = () => {
    const user = testDatabase.find(function(item, i){
      if(item.username === username){
        return item
      }
    })
    if(user?.userId === undefined) {
      alert('Username not found! Please try again');
    } else {
      setUserId(user.userId);
      // Somewhere in here we will need to do verification of password and userid and username etc
      navigate.push('/');
    }
  }

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={1}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={5} height={100} />
                <Grid item xs={6} md={2} height={100} color="white">
                    <Typography variant="h4" color="black">
                      Login Page
                    </Typography>
                </Grid>
                <Grid item xs={6} md={5} height={100} />
            </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={1}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4.5} />
            <Grid item xs={6} md={2.7}>
                <TextField variant="outlined" label="Username" fullWidth margin="normal" onChange={(e) => setUsername(e.target.value)}/>
                <TextField variant="outlined" label="Password" fullWidth type="password" onChange={(e) => setPassword(e.target.value)}/>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={1}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={5.35} />
            <Grid item xs={6} md={4}>
                <Button variant="contained" onClick={onSubmitHandler}>Submit</Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={1}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4.5} />
            <Grid item xs={6} md={5}>
              <Typography>Dont have an account? Create one below!</Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={.5}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={5} />
            <Grid item xs={6} md={5}>
              <Button variant="contained" onClick={() => {navigate.push('/create-account')}}>Create Account</Button>
            </Grid>
          </Grid>
        </Box>   

    </ThemeProvider>
  );
};

export default LoginPage;
