import { NextPage } from "next";
import { useSession } from "next-auth/react";
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Box, Paper, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Mapbox from '../components/Mapbox';

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

const HeatMapPage: NextPage = () => {
  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={12} height={291}>
                    <Item>
                        <Typography variant="h4">
                            Heat Map Page
                        </Typography>
                        <Typography height={111}> </Typography>
                    </Item>
                </Grid>
            </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={12} height={400}>
              <Mapbox />
            </Grid>
          </Grid>
        </Box>
    </ThemeProvider>
  );
};

export default HeatMapPage;
