import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2Fyc29uMzc1IiwiYSI6ImNsbHdsdGxqdjB0MnUzcG9iYmlucjZmbDQifQ.-tQZS7qUZJNMIiLm_kD0rA";

export default function Mapbox({ mapData }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-83.012492);
  const [lat, setLat] = useState(39.999197);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      map.current.addSource("wifi", {
        type: "geojson",
        data: mapData,
      });
      // add heatmap layer here
      map.current.addLayer(
        {
          id: "wifi-heat",
          type: "heatmap",
          source: "wifi",
          maxzoom: 9,
          paint: {
            // Increase the heatmap weight based on frequency and property magnitude
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "db"],
              -100,
              0,
              0,
              1,
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              9,
              3,
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              -100,
              "rgb(33,102,172)",
              -80,
              "rgb(103,169,207)",
              -60,
              "rgb(209,229,240)",
              -40,
              "rgb(253,219,199)",
              -20,
              "rgb(239,138,98)",
              0,
              "rgba(178,24,43, 0)",
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              2,
              9,
              20,
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              9,
              0,
            ],
          },
        },
        "waterway-label"
      );

      map.current.addLayer(
        {
          id: "wifi-point",
          type: "circle",
          source: "wifi",
          minzoom: 7,
          paint: {
            // Size circle radius by earthquake magnitude and zoom level
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              ["interpolate", ["linear"], ["get", "db"], -100, 1, 0, 20],
              16,
              ["interpolate", ["linear"], ["get", "db"], -100, 5, 0, 60],
            ],
            // Color circle by earthquake magnitude
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "db"],
              -100,
              "rgba(33,102,172,0)",
              -80,
              "rgb(103,169,207)",
              -60,
              "rgb(209,229,240)",
              -40,
              "rgb(253,219,199)",
              -20,
              "rgb(239,138,98)",
              0,
              "rgb(178,24,43)",
            ],
            "circle-stroke-color": "white",
            "circle-stroke-width": 1,
            // Transition from heatmap to circle layer by zoom level
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
          },
        },
        "waterway-label"
      );
    });

    map.current.on("click", "wifi-point", (event) => {
      new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`Wifi Strength: ${event.features[0].properties.db} (db)`)
        .addTo(map.current);
    });

    // map.current.on("move", () => {
    //   setLng(map.current.getCenter().lng.toFixed(4));
    //   setLat(map.current.getCenter().lat.toFixed(4));
    //   setZoom(map.current.getZoom().toFixed(2));
    // });
  });

  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
