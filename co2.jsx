import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import build from "./data/isochrones.json";
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
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

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

    if(isOn===false){
      //Walk button event
    }else if (isOn===true){
      //Car button event
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
          fontFamily:'IBM Plex Mono, monospace',
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
          marginTop:"8px",
          fontFamily:'IBM Plex Mono, monospace',
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
        >
        </div>
        <CustomSwitch
          checked={isOn}
          color="default"
          inputProps={{ "aria-label": "toggle" }}
        />
      </Box>
    </Box>
  );
}

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
    map.loadImage("./data/school.png", (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat", image);

      // Add a data source containing one point feature.
      map.addSource("point", {
        type: "geojson",
        data: school_names,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "point", // reference the data source
        layout: {
          "icon-image": "cat", // reference the image
          "icon-size": 0.6,
        },
      });
    });

    map.loadImage("./data/hsptl.png", (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat1", image);

      // Add a data source containing one point feature.
      map.addSource("point1", {
        type: "geojson",
        data: hsptl_names,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points1",
        type: "symbol",
        source: "point1", // reference the data source
        layout: {
          "icon-image": "cat1", // reference the image
          "icon-size": 0.6,
        },
      });
    });

    map.on("click", "points", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.name;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", "points", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "";
    });
    ///
    map.on("click", "points1", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.name;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", "points1", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points1", () => {
      map.getCanvas().style.cursor = "";
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
    map.addLayer({
      id: "lines",
      type: "fill",
      source: "buildings",
      paint: {
        "fill-color": "#A7DD88",
        "fill-emissive-strength": 0.5,
        "fill-opacity": 0.8,
      },
    });

    map.addSource("paths", {
      type: "geojson",
      data: pathways,
      lineMetrics: true,
    });

    map.addLayer({
      id: "tp-line-line",
      type: "line",
      source: "paths",
      paint: {
        "line-color": "rgba(0, 0, 0, 0)",
        "line-emissive-strength": 2,
        "line-width": 6,
      },
    });

    map.addSource("walkPaths", {
      // Add source for walk.json
      type: "geojson",
      data: ways,
      lineMetrics: true,
    });

    map.addLayer({
      id: "walk-line-line", // Add a new layer ID
      type: "line",
      source: "walkPaths", // Use the new source
      paint: {
        "line-color": "rgba(0, 0, 0, 0)", // Blue color
        "line-emissive-strength": 2,
        "line-width": 6,
      },
    });

    map.addSource("buildings", {
      type: "geojson",
      data: build,
    });

    // Add a GeoJSON layer with lines
    map.addLayer({
      id: "lines",
      type: "fill",
      source: "buildings",
      paint: {
        "fill-color": ["get", "color"],
        "fill-outline-color": "#00008B",
        "fill-emissive-strength": 0.4,
        "fill-opacity": 0.6,
      },
    });

    map.moveLayer("tp-line-line");
    map.moveLayer("walk-line-line");
    map.moveLayer("add-3d-buildings");

    map.flyTo({
      center: [-0.127997, 51.507969],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      speed: 0.05,
      zoom: 14,
      curve: 1,
      easing(t) {
        return t;
      },
    });

    let startTime;
    const duration = 10000;

    const frame = (time) => {
      if (!startTime) startTime = time;
      const animationPhase = (time - startTime) / duration;

      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.setPaintProperty("tp-line-line", "line-gradient", [
        "step",
        ["line-progress"],
        "#C96A6A",
        animationPhase,
        "rgba(0, 0, 0, 0)",
      ]);

      map.setPaintProperty("walk-line-line", "line-gradient", [
        "step",
        ["line-progress"],
        "#225ea8", // Blue color
        animationPhase,
        "rgba(0, 0, 255, 0)",
      ]);

      if (animationPhase <= 1) {
        // Continue animation until completion
        window.requestAnimationFrame(frame);
      }
    };

    window.requestAnimationFrame(frame);
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
        <TogglePanel/>
      </div>
      <h1>Reduce Carbon Emissions for your neighborhood</h1>
    </>
  );
};

export default App;
