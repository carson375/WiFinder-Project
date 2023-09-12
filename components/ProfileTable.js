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
import * as React from "react";
import { JsonArray, download } from "json-to-csv-in-browser";

export default function ProfileTable({ wifiData }) {
  const onDownloadHandler = (wifiData, name) => {
    let dataArray = [];
    wifiData.map((item) =>
      dataArray.push({
        longitude: item.geometry.coordinates[0],
        latitude: item.geometry.coordinates[1],
        height: item.geometry.coordinates[2],
        "wifi strength (db)": item.properties.db,
      })
    );
    const jsonArray = new JsonArray(dataArray);
    const str = jsonArray.convertToCSVstring();
    download(`${name}.csv`, str);
  };

  const onDataLoader = (wifiData) => {};
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Flight Number</TableCell>
            <TableCell align="right">Flight Name</TableCell>
            <TableCell align="right">Flight Date</TableCell>
            <TableCell align="right">Flight User</TableCell>
            <TableCell align="right">Download Flight</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wifiData.map((item) => (
            <TableRow
              key={item.crs.properties.number}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.crs.properties.number}
              </TableCell>
              <TableCell align="right">{item.crs.properties.name}</TableCell>
              <TableCell align="right">{item.crs.properties.date}</TableCell>
              <TableCell align="right">{item.crs.properties.user}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  onClick={() => {
                    onDownloadHandler(item.features, item.crs.properties.name);
                  }}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "56px",
                    minWidth: "100px",
                    minHeight: "56px",
                  }}
                >
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
