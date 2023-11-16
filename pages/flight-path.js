import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, Box, Paper, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import FlightPath from "../components/FlightPath";
import { useState, useRef, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { JsonArray, download } from "json-to-csv-in-browser";

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

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2Fyc29uMzc1IiwiYSI6ImNsbHdsdGxqdjB0MnUzcG9iYmlucjZmbDQifQ.-tQZS7qUZJNMIiLm_kD0rA";

const flightPathPageMessage =
  "Welcome to the Flight Path Page! Enter your desired flight path into the interactive map below. Add barriers and checkpoints to make your path more accurate, and once you are finished click the path button to generate a flight path CSV. If there are any mistakes click the clear button to restart. Once the path has been submitted turn your drone on outdoors and watch the drone follow the path.";

const FlightPathPage = () => {
  const navigate = useRouter();
  const [barriers, setBarriers] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [clear, setClear] = useState(false);
  const [lng, setLng] = useState(-83.01243);
  const [lat, setLat] = useState(39.99913);
  const [zoom, setZoom] = useState(12.12);
  // @ts-ignore
  var currentMarkers = [];

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    // @ts-ignore: Object is possibly 'null'.
    map.current.on("move", () => {
      // @ts-ignore: Object is possibly 'null'.
      setLng(map.current.getCenter().lng.toFixed(5)); // @ts-ignore: Object is possibly 'null'.
      setLat(map.current.getCenter().lat.toFixed(5)); // @ts-ignore: Object is possibly 'null'.
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const handleBarrierChange = () => {
    setBarriers([...barriers, [Number(lng), Number(lat)]]);
  };

  const handleCheckpointChange = () => {
    setCheckpoints([...checkpoints, [Number(lng), Number(lat)]]);
    const marker = new mapboxgl.Marker()
      .setLngLat([Number(lng), Number(lat)])
      .addTo(map.current);
    currentMarkers.push(marker);
  };

  const onDownloadHandler = () => {
    let dataArray = [];
    checkpoints.map((item) =>
      dataArray.push({
        "Checkpoints Longitude": item[0],
        "Checkpoints Latitude": item[1],
      })
    );
    barriers.map((item) =>
      dataArray.push({
        "Barriers Longitude": item[0],
        "Barriers Latitude": item[1],
      })
    );
    const jsonArray = new JsonArray(dataArray);
    const str = jsonArray.convertToCSVstring();
    download(`flightPathPoints.csv`, str);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={12}>
            <Item>
              <Typography variant="h4">Flight Path Page</Typography>
              <br />
              <Typography variant="subtitle1">
                {flightPathPageMessage}
              </Typography>
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
                handleBarrierChange();
              }}
            >
              Barriers
            </Button>
          </Grid>
          <Grid item xs={2} md={1.25}>
            <Button
              variant="contained"
              onClick={() => {
                handleCheckpointChange();
              }}
            >
              Checkpoints
            </Button>
          </Grid>
          <Grid item xs={2} md={1}>
            <Button
              variant="contained"
              onClick={() => {
                onDownloadHandler();
              }}
            >
              Path
            </Button>
          </Grid>
          <Grid item xs={2} md={7.95}></Grid>
          <Grid item xs={2} md={0.8}>
            <Button
              variant="contained"
              onClick={() => {
                window.location.reload();
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={12} height={400}>
            <div>
              <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
              </div>
              <div ref={mapContainer} className="map-container">
                <div className="indicator">+</div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Typography>Checkpoints: </Typography>
            {checkpoints.map((item) => (
              <>
                <Typography>
                  Longitude: {item[0]}, Latitude: {item[1]}
                </Typography>
              </>
            ))}
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography>Barriers: </Typography>
            {barriers.map((item) => (
              <>
                <Typography>
                  Longitude: {item[0]}, Latitude: {item[1]}
                </Typography>
              </>
            ))}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default FlightPathPage;
