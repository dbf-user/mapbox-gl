import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import build from "./data/isochrones.json";
import pathways from "./data/co2.json";
import ways from "./data/walk.json";
import "./RadioPanel.css";
import "./BuildingInfo.css";
import "./Street.css";
import CustomSlider from "./customSlider.jsx";
import school_names from "./data/school_names.json";
import hsptl_names from "./data/hsptl_names.json";
import parkIcon from "./data/park.png";
import gro from "./data/grocery.json";
import met from "./data/metro.json";
import resto from "./data/rest.json";
import pharmacy from "./data/pharm.json";
import banking from "./data/bank.json";
import bar_pub from "./data/bar.json";
import walkSchool from "./data/walkSchools.json";

import l_square from "./data/l_square.json";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CustomSwitch from "./customSwitch.jsx";

import hIcon from "./data/hsptl.png";
import sIcon from "./data/school.png";
import bank from "./icons/bank.png";
import bar from "./icons/bar.png";
import grocery from "./icons/grocery.png";
import metroIcon from "./icons/metroIcon.png";
import rest from "./icons/rest.png";
import pharm from "./icons/pharm.png";
import legend2 from "./icons/co2legend2.png";
import { Stack } from "@mui/system";

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

const LegendPanel = () => {
  return (
    <>
      <Box
        sx={{
          width: "120px",
          borderRadius: "4px",
          mb: 2,
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
          variant="body1"
          style={{
            marginBottom: "5px",
            lineHeight: "1.2",
            textAlign: "center",
            fontSize: 13,
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          Accessible Area
        </Typography>
        <Divider sx={{ width: "100%", backgroundColor: "white" }} />
        <img
          src={legend2}
          alt="Co2 legend"
          style={{ width: "auto", height: "60px", marginTop: "15px" }}
        />
      </Box>
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
      map.setLayoutProperty("points", "visibility", "visible");
      map.setLayoutProperty("points1", "visibility", "visible");
      map.setLayoutProperty("points2", "visibility", "none");
      map.setLayoutProperty("points3", "visibility", "none");
      map.setLayoutProperty("points4", "visibility", "none");
      map.setLayoutProperty("points5", "visibility", "none");
      map.setLayoutProperty("points6", "visibility", "none");
      map.setLayoutProperty("points7", "visibility", "none");
      map.setLayoutProperty("points_pharm", "visibility", "none");
      map.setLayoutProperty("points_school", "visibility", "none");
    } else if (isOn === true) {
      //Car button event
      map.setLayoutProperty("tp-line-line", "visibility", "none");
      map.setLayoutProperty("walk-line-line", "visibility", "visible");
      map.setLayoutProperty("points", "visibility", "none");
      map.setLayoutProperty("points1", "visibility", "none");
      map.setLayoutProperty("points2", "visibility", "visible");
      map.setLayoutProperty("points3", "visibility", "visible");
      map.setLayoutProperty("points4", "visibility", "visible");
      map.setLayoutProperty("points5", "visibility", "visible");
      map.setLayoutProperty("points6", "visibility", "visible");
      map.setLayoutProperty("points7", "visibility", "visible");
      map.setLayoutProperty("points_school", "visibility", "visible");
      map.setLayoutProperty("points_pharm", "visibility", "visible");
    }
  };

  return (
    <>
      <Stack sx={{ position: "fixed", left: 20, bottom: "23vh" }}>
        <LegendPanel />
        <Box
          sx={{
            width: "120px",
            borderRadius: "4px",
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
            <CustomSwitch
              checked={isOn}
              color="default"
              inputProps={{ "aria-label": "toggle" }}
            />
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export function renderToDOM(container, data) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clmkep6bq01rb01pj1f7phtt0",
    container,
    center: [-0.127997, 51.507969],
    zoom: 16,
    pitch: 45,
    minZoom: 13, // Set the minimum zoom level
    maxZoom: 18, // Set the maximum zoom level
    maxBounds: [
      [-0.140922, 51.500648],
      [-0.10464, 51.52127],
    ],
  });

  map.on("load", () => {
    map.loadImage(sIcon, (error, image) => {
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

    map.loadImage(hIcon, (error, image) => {
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

    map.loadImage(bank, (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat2", image);

      // Add a data source containing one point feature.
      map.addSource("point2", {
        type: "geojson",
        data: banking,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points2",
        type: "symbol",
        source: "point2", // reference the data source
        layout: {
          "icon-image": "cat2", // reference the image
          "icon-size": 0.6,
        },
      });
    });

    map.loadImage(bar, (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat3", image);

      // Add a data source containing one point feature.
      map.addSource("point3", {
        type: "geojson",
        data: bar_pub,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points3",
        type: "symbol",
        source: "point3", // reference the data source
        layout: {
          "icon-image": "cat3", // reference the image
          "icon-size": 0.6,
        },
      });
    });

    map.loadImage(grocery, (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat4", image);

      // Add a data source containing one point feature.
      map.addSource("point4", {
        type: "geojson",
        data: gro,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points4",
        type: "symbol",
        source: "point4", // reference the data source
        layout: {
          "icon-image": "cat4", // reference the image
          "icon-size": 0.6,
        },
      });
    });

    map.loadImage(metroIcon, (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat5", image);

      // Add a data source containing one point feature.
      map.addSource("point5", {
        type: "geojson",
        data: met,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points5",
        type: "symbol",
        source: "point5", // reference the data source
        layout: {
          "icon-image": "cat5", // reference the image
          "icon-size": 0.6,
        },
      });
    });

    map.loadImage(rest, (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat6", image);

      // Add a data source containing one point feature.
      map.addSource("point6", {
        type: "geojson",
        data: resto,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points6",
        type: "symbol",
        source: "point6", // reference the data source
        layout: {
          "icon-image": "cat6", // reference the image
          "icon-size": 0.6,
        },
      });
    });

    map.loadImage(parkIcon, (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat7", image);

      // Add a data source containing one point feature.
      map.addSource("point7", {
        type: "geojson",
        data: l_square,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points7",
        type: "symbol",
        source: "point7", // reference the data source
        layout: {
          "icon-image": "cat7", // reference the image
          "icon-size": 1,
        },
      });
    });

    map.loadImage(pharm, (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("pharm", image);

      // Add a data source containing one point feature.
      map.addSource("point_pharm", {
        type: "geojson",
        data: pharmacy,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points_pharm",
        type: "symbol",
        source: "point_pharm", // reference the data source
        layout: {
          "icon-image": "pharm", // reference the image
          "icon-size": 0.6,
        },
      });
    });

    map.loadImage(sIcon, (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("sIcon", image);

      // Add a data source containing one point feature.
      map.addSource("point_school", {
        type: "geojson",
        data: walkSchool,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points_school",
        type: "symbol",
        source: "point_school", // reference the data source
        layout: {
          "icon-image": "sIcon", // reference the image
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

    /////////////////////////
    map.on("click", "points2", (e) => {
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
    map.on("mouseenter", "points2", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points2", () => {
      map.getCanvas().style.cursor = "";
    });

    /////////////////////////
    map.on("click", "points3", (e) => {
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
    map.on("mouseenter", "points3", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points3", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "points_school", (e) => {
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
    map.on("mouseenter", "points_school", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points_school", () => {
      map.getCanvas().style.cursor = "";
    });
    /////////////////////////
    map.on("click", "points4", (e) => {
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
    map.on("mouseenter", "points4", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points4", () => {
      map.getCanvas().style.cursor = "";
    });
    /////////////////////////
    map.on("click", "points5", (e) => {
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
    map.on("mouseenter", "points5", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points5", () => {
      map.getCanvas().style.cursor = "";
    });
    /////////////////////////
    map.on("click", "points6", (e) => {
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
    map.on("mouseenter", "points6", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points6", () => {
      map.getCanvas().style.cursor = "";
    });
    ////////////////////////////////////////////////////
    map.on("click", "points7", (e) => {
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
    map.on("mouseenter", "points7", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points7", () => {
      map.getCanvas().style.cursor = "";
    });
    /////////////////////////
    map.on("click", "points_pharm", (e) => {
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
    map.on("mouseenter", "points_pharm", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points_pharm", () => {
      map.getCanvas().style.cursor = "";
    });

    map.addLayer({
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#34353D",
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
        "fill-extrusion-opacity": 1,
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
      visibility: "none",
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
      visibility: "visible",
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
        "fill-emissive-strength": 1,
        "fill-opacity": 0.6,
      },
    });

    map.moveLayer("tp-line-line");
    map.moveLayer("walk-line-line");
    map.moveLayer("add-3d-buildings");

    map.flyTo({
      center: [-0.127997, 51.507969],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      pitch: 0,
      speed: 0.2,
      zoom: 13.5,
      curve: 1,
      easing(t) {
        return t;
      },
    });

    let startTime;
    const duration = 8000;

    const frame = (time) => {
      if (!startTime) startTime = time;
      const animationPhase = (time - startTime) / duration;

      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.setPaintProperty("tp-line-line", "line-gradient", [
        "step",
        ["line-progress"],
        "#FD6C44",
        animationPhase,
        "rgba(0, 0, 0, 0)",
      ]);

      map.setPaintProperty("walk-line-line", "line-gradient", [
        "step",
        ["line-progress"],
        "#83D4FF", // Blue color
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
      <div style={{ width: "100vw", height: "80vh" }}>
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
      {/* <h1>Reduce <b>Carbon Emissions</b> for your neighborhood</h1> */}
    </>
  );
};

export default App;
