import { NextPage } from "next";
import { useSession } from "next-auth/react";
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Box, Paper, Grid, Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from "next/router";
import { useState } from "react";
import testDatabase from '../testData/testDatabase.json'

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

const createUsernameSet = () => {
  const tempSet = new Set<string>([]);
  for(let i = 0; i < testDatabase.length; i++) {
    tempSet.add(testDatabase[i].username)
  }
  console.log(tempSet);
  return tempSet;
};

const usernameSet = createUsernameSet();

const CreateAccountPage: NextPage = () => {
  const navigate = useRouter();

  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmitHandler = () => {
    // This will need to be fleshed out to generate an new userId for now we can write make it just append to the exisiting list
    if(usernameSet.has(username.toLowerCase())) {
      console.log('Entered');
      alert('Username already taken please try again');
    } else {
      // Here we will need to make a call to IAM to generate a userId then we will need to do a post request along with some IAM to send this info to the database
      console.log(username);
      console.log(password);
      navigate.push('/');
    }
  }

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={1} paddingTop={20}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={4.8} height={100} />
                <Grid item xs={6} md={3} height={100} color="white">
                    <Typography variant="h4" color="black">
                      Create Account
                    </Typography>
                </Grid>
            </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={1}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4.5} />
            <Grid item xs={6} md={2.7}>
                <TextField variant="outlined" label="Create Username" fullWidth margin="normal" onChange={(e) => setUsername(e.target.value)} />
                <TextField variant="outlined" label="Create Password" fullWidth type="password" onChange={(e) => setPassword(e.target.value)} />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={1}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={5.35} />
            <Grid item xs={6} md={4}>
                <Button variant="contained" onClick={onSubmitHandler}>Create</Button>
            </Grid>
          </Grid>
        </Box>
    </ThemeProvider>
  );
};

export default CreateAccountPage;
