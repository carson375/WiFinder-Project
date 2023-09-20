import { NextPage } from "next";
import * as React from "react";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, Box, Paper, Grid, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import testDatabase from "../testData/testDatabase.json";
import { useState } from "react";
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

const Profile: NextPage = () => {
  const navigate = useRouter();

  const [userName, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);

  Auth.currentUserInfo().then((userInfo) => {
    setUserName(userInfo.username);
    console.log(userInfo.username);
  });

  const changePasswordHandler = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        Auth.changePassword(user, oldPassword, newPassword);
        alert("Password has been updated!");
        window.location.reload();
      })
      .catch((e) => {
        alert("Password update failed please try again.");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={1} paddingTop={20}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item height={100} color="white">
            <Typography variant="h4" color="black">
              Welcome {userName}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={1}>
        <Grid container spacing={0} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => {
              setChangePassword(true);
            }}
          >
            Change Password
          </Button>
        </Grid>
      </Box>
      {changePassword && userName !== "" && (
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={1}>
          <Grid container spacing={0} justifyContent="center">
            <Grid item>
              <TextField
                variant="outlined"
                label="Old Password"
                fullWidth
                margin="normal"
                type="password"
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                label="New Password"
                fullWidth
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={0} paddingTop={1} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => {
                changePasswordHandler();
              }}
            >
              Submit Password Change
            </Button>
          </Grid>
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={1}>
        <Grid container spacing={0} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => {
              Auth.signOut();
            }}
          >
            Sign Out
          </Button>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;
