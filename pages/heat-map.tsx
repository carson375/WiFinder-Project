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
// @ts-nocheck
import Papa from "papaparse";
import { Auth } from "aws-amplify";
import HeatMapLegend from "components/HeatMapLegend";

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
  const [file, setFile] = useState<File>();
  const fileReader = new FileReader();
  const [userName, setUserName] = useState("");
  const [heatMapOptions, setHeatMapOptions] = useState(wifiData);
  const date = new Date();

  const colors = [
    { value: "rgb(33,102,172)", label: "-100" },
    { value: "rgb(103,169,207)", label: "-80" },
    { value: "rgb(209,229,240)", label: "-60" },
    { value: "rgb(253,219,199)", label: "-40" },
    { value: "rgb(239,138,98)", label: "-20" },
    { value: "rgb(178,24,43)", label: "0" },
  ];

  const onCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataIndex(Number(e.target.value));
    setIsRender(true);
    console.log(e.target.value);
    console.log(wifiData);
    console.log(dataIndex);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempFile = e.target.files?.[0];
    tempFile ? setFile(tempFile) : alert("Not a valid file");
  };

  Auth.currentUserInfo().then((userInfo) => {
    setUserName(userInfo.username);
  });

  const onFileParse = () => {
    fileReader.onload = async ({ target }) => {
      const csv = Papa.parse(target?.result as any);
      const data = csv?.data;
      wifiData.push(formatForHeatmap(data));
      setHeatMapOptions(wifiData);
      setDataIndex(heatMapOptions.length - 1);
      setIsRender(true);
    };
    fileReader.readAsText(file as Blob);
  };

  const formatForHeatmap = (data: any) => {
    const fileNameLength = file?.name.length;
    const newJson = {
      type: "FeatureCollection",
      crs: {
        type: `${
          fileNameLength
            ? file?.name.substring(0, fileNameLength - 4)
            : file?.name
        }`,
        properties: {
          name: `${
            fileNameLength
              ? file?.name.substring(0, fileNameLength - 4)
              : file?.name
          }`,
          date: `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
          number: `${wifiData.length + 1}`,
          user: userName,
        },
      },
      features: [],
    };
    let dataPoints = [];
    for (let index = 1; index < data.length - 1; index++) {
      const tempIndex = data[index];
      let myObj = {
        type: "Feature",
        properties: { id: userName, db: Number(tempIndex[3]) },
        geometry: {
          type: "Point",
          coordinates: [
            Number(tempIndex[0]),
            Number(tempIndex[1]),
            tempIndex[2] == "" ? 0.0 : Number(tempIndex[2]),
          ],
        },
      };
      dataPoints.push(myObj);
    }
    newJson.features = dataPoints as any;
    return newJson;
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
                {heatMapOptions.map((item, index) => (
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
          <Grid item xs={2} md={2}>
            <Typography color="black">Upload Flight Data:</Typography>
            <input type={"file"} accept={".csv"} onChange={onFileChange} />
          </Grid>
          <Grid item xs={2} md={2}>
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
          <Grid item xs={2} md={1.2}>
            <Typography variant="h6">Legend (db):</Typography>
          </Grid>
          <Grid item xs={2} md={2}>
            <HeatMapLegend colors={colors} />
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
