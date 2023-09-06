import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import build from "./data/isochrones.json";

import boundary_600 from "./data/boundary_600.json";
import boundary_700 from "./data/boundary_700.json";
import boundary_800 from "./data/boundary_800.json";
import boundary_900 from "./data/boundary_900.json";
import boundary_1000 from "./data/boundary_1000.json";
import boundary_1100 from "./data/boundary_1100.json";
import boundary_1200 from "./data/boundary_1200.json";
import boundary_1300 from "./data/boundary_1300.json";
import boundary_1400 from "./data/boundary_1400.json";



import pathways from "./data/co2.json";
import ways from "./data/walk.json";
import "./RadioPanel.css";
import "./BuildingInfo.css";
import CustomSlider from "./customSlider.jsx";
import school_names from "./data/school_names.json";
import hsptl_names from "./data/hsptl_names.json";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CustomSwitch from "./customSwitch.jsx";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2xtNXQwdHhvMWd3cjNmcDY2aGc4NDZrNSJ9.1OTywkIt0KA1sMPAxUrCzg";

let maxValue = 500;
let minValue = 0;
let title = "15 Parks";
let buildingCount = 353;
let map;

const SliderPanel = () => {
  return (
    <>
      <div className="transparent-panels">
        <h2 className="title">Urban Insight</h2>
        <div className="separator"></div>
        <h2 className="count">321</h2>
        <div className="ton-text">
          Tons of carbon emission are generated to reach key facilities
        </div>
      </div>
    </>
  );
};

const TogglePanel = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleState = () => {
    setIsOn(!isOn);
    if (isOn === false) {
      //Walk button event
      map.setLayoutProperty("tp-line-line", "visibility", "visible");
      map.setLayoutProperty("walk-line-line", "visibility", "none");
    } else if (isOn === true) {
      //Car button event
      map.setLayoutProperty("tp-line-line", "visibility", "none");
      map.setLayoutProperty("walk-line-line", "visibility", "visible");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        left: 20,
        bottom: 190,
        width: 120,
        borderRadius: 5,
        backgroundColor: "black",
        color: "white",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "-5px 0px 5px rgba(0, 0, 0, 0.2)",
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <Typography
        variant="h6"
        style={{
          marginBottom: "5px",
          lineHeight: "1.2",
          textAlign: "center",
          fontSize: 16,
          fontFamily: "IBM Plex Mono, monospace",
        }}
      >
        Trips to key facilities
      </Typography>
      <Divider sx={{ width: "100%", backgroundColor: "white" }} />
      <Typography
        variant="body1"
        style={{
          textAlign: "center",
          fontSize: 12,
          marginTop: "8px",
          fontFamily: "IBM Plex Mono, monospace",
        }}
      >
        Transport Mode
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onClick={toggleState}
      >
        <div
          style={{
            marginRight: "10px",
            fontSize: "24px",
          }}
        ></div>
        <CustomSwitch
          checked={isOn}
          color="default"
          inputProps={{ "aria-label": "toggle" }}
        />
      </Box>
    </Box>
  );
};

export function renderToDOM(container, data) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clll4a01u01dc01plajw4bkhm",
    container,
    center: [-0.127997, 51.507969],
    zoom: 16,
    pitch: 45,
    minZoom: 14, // Set the minimum zoom level
    maxZoom: 18, // Set the maximum zoom level
    maxBounds: [
      [-0.140922, 51.500648],
      [-0.10464, 51.52127],
    ],
  });

  map.on("load", () => {

    map.addSource("buildings", {
      type: "geojson",
      data: build,
    });

    map.addLayer({
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": "#7182A6",
        "fill-extrusion-ambient-occlusion-intensity": 0.8,
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.8,
      },
    });

    // Add a GeoJSON layer with lines


    map.addSource("1", {
      type: "geojson",
      data: boundary_600,
    });

    map.addLayer({
      'id': 'outline',
      'type': 'line',
      'source': '1',
      'layout': {},
      'paint': {
      'line-color': '#0000FF',
      'line-width': 3
      }
      });

      map.addSource("2", {
        type: "geojson",
        data: boundary_700,
      });
  
      map.addLayer({
        'id': 'outline1',
        'type': 'line',
        'source': '2',
        'layout': {},
        'paint': {
        'line-color': '#0055FF',
        'line-width': 3
        }
        });

        map.addSource("3", {
          type: "geojson",
          data: boundary_800,
        });
    
        map.addLayer({
          'id': 'outline2',
          'type': 'line',
          'source': '3',
          'layout': {},
          'paint': {
          'line-color': '#00AAFF',
          'line-width': 3
          }
          });

          map.addSource("4", {
            type: "geojson",
            data: boundary_900,
          });
      
          map.addLayer({
            'id': 'outline3',
            'type': 'line',
            'source': '4',
            'layout': {},
            'paint': {
            'line-color': '#00FFFF',
            'line-width': 3
            }
            });

            map.addSource("5", {
              type: "geojson",
              data: boundary_1000,
            });
        
            map.addLayer({
              'id': 'outline4',
              'type': 'line',
              'source': '5',
              'layout': {},
              'paint': {
              'line-color': '#00FFAA',
              'line-width': 3
              }
              });

              map.addSource("6", {
                type: "geojson",
                data: boundary_1100,
              });
          
              map.addLayer({
                'id': 'outline5',
                'type': 'line',
                'source': '6',
                'layout': {},
                'paint': {
                'line-color': '#FFFF00',
                'line-width': 3
                }
                });

  map.addSource("7", {
    type: "geojson",
    data: boundary_1200,
  });

  map.addLayer({
    'id': 'outline6',
    'type': 'line',
    'source': '7',
    'layout': {},
    'paint': {
    'line-color': '#FFAA00',
    'line-width': 3
    }
    });

    map.addSource("8", {
      type: "geojson",
      data: boundary_1300,
    });

    map.addLayer({
      'id': 'outline7',
      'type': 'line',
      'source': '8',
      'layout': {},
      'paint': {
      'line-color': '#FF5500',
      'line-width': 3
      }
      });

      map.addSource("9", {
        type: "geojson",
        data: boundary_1400,
      });
  
      map.addLayer({
        'id': 'outline8',
        'type': 'line',
        'source': '9',
        'layout': {},
        'paint': {
        'line-color': '#FF0000',
        'line-width': 3
        }
        });

    // map.moveLayer("add-3d-buildings");
  });

  return map;
}

export const App = () => {
  useEffect(() => {
    renderToDOM(document.getElementById("map"));
  }, []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <div
          id="map"
          style={{
            width: "100%",
            height: "100%",
          }}
        ></div>
        <SliderPanel />
        <TogglePanel />
      </div>
      <h1>Reduce <b>Carbon Emissions</b> for your neighborhood</h1>
    </>
  );
};

export default App;
