import { NextPage } from "next";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Select,
  Box,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Mapbox from "../components/Mapbox";
import wifiData from "../testData/testWifi.json";
import FlightPath from "components/FlightPath";

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

const HeatMapPage: NextPage = () => {
  const [dataIndex, setDataIndex] = useState<number>(0);
  const [isRender, setIsRender] = useState(false);
  const onCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataIndex(Number(e.target.value));
    setIsRender(true);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={12} height={140}>
            <Item>
              <Typography variant="h4">Heat Map Page</Typography>
              <Typography variant="h6">
                Select a flight path to generate the heat map.
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingTop={2}>
        <Grid container spacing={2}>
          <Grid item xs={2} md={1.5}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Flight Data</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Flight Data"
                onChange={(e) =>
                  onCsvChange(e as React.ChangeEvent<HTMLInputElement>)
                }
              >
                {wifiData.map((item, index) => (
                  <MenuItem value={index} key={index} defaultValue={index}>
                    {item.crs.properties.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} md={1.5}>
            <Button
              variant="contained"
              onClick={() => {
                setIsRender(false);
              }}
              style={{
                maxWidth: "100px",
                maxHeight: "56px",
                minWidth: "100px",
                minHeight: "56px",
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2} paddingTop={0.5}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={12} height={400}>
            {isRender && <Mapbox mapData={wifiData[dataIndex]} />}
            {!isRender && <FlightPath parentName="heat-map" />}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default HeatMapPage;
