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

export default function ProfileTable({ wifiData }) {
  const onDownloadHandler = (wifiData) => {
    console.log(wifiData);
  };
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
          {wifiData.map((item, index) => (
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
                    onDownloadHandler(wifiData[index]);
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
