import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { id1200 } from "./data/1200Id.js";
import { id1500 } from "./data/1500Id.js";
import { id900 } from "./data/900Id.js";
import { idx } from "./data/bIds.js";
import parks from "./data/parks.json";
import park_names from "./data/park_names.json";
import "./RadioPanel.css";
import "./BuildingInfo.css";
import CustomSlider from "./customSlider.jsx";
//import pathways from "./data/co2.json";
import "./App.css";
import IsoApp from "./isoApp.jsx";
import pathways from "./data/trips.json";
import startIcon from "./icons/start.png";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

let maxValue = 500;
let minValue = 0;
let title = "15 Parks";
let buildingCount = 353;
let map;

export function renderToDOM(container, data) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clll4a01u01dc01plajw4bkhm",
    container,
    center: [-0.126323, 51.504758], // [-0.127997, 51.507969],
    zoom: 16,
    pitch: 45,
    minZoom: 15, // Set the minimum zoom level
    maxZoom: 18, // Set the maximum zoom level
    maxBounds: [
      [-0.140922, 51.500648],
      [-0.10464, 51.52127],
    ],
  });

  map.on("load", () => {
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
    map.moveLayer("add-3d-buildings");

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
        "line-width": 4,
      },
    });

    map.moveLayer("add-3d-buildings");

    map.flyTo({
      center: [-0.128343, 51.511364],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      speed: 0.02,
      zoom: 18,
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
        "#FD805D",
        animationPhase,
        "rgba(0, 0, 0, 0)",
      ]);

      if (animationPhase > 1) {
        return;
      }
      window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);

    // repeat
    setInterval(() => {
      startTime = undefined;
      window.requestAnimationFrame(frame);
    }, duration + 1500);
  });
}

export const App = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [showAnotherComponent, setShowAnotherComponent] = useState(false);

  useEffect(() => {
    renderToDOM(document.getElementById("map"));
  }, []);

  const handleButtonClick = (buttonId) => {
    if (selectedButton === buttonId) {
      setSelectedButton(null);
    } else {
      setSelectedButton(buttonId);
      setShowAnotherComponent(true);
    }
  };

  const renderSelectedComponent = () => {
    switch (selectedButton) {
      case "start":
        return <IsoApp />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`app-container ${showAnotherComponent ? "hide" : ""}`}>
        <div class="overlay">
          <h1>AI-Powered Planning and Designis</h1>

          <h1>for Complex Urban Projects</h1>
        </div>
      </div>
      <div style={{ width: "100vw", height: "100vh" }}>
        <div
          id="map"
          style={{
            width: "100%",
            height: "100%",
          }}
        ></div>
      </div>
      <div className={`app-container ${showAnotherComponent ? "hide" : ""}`}>
        <div className="buttons-container">
          <button
            className={`map-button ${
              selectedButton === "start" ? "selected" : ""
            }`}
            onClick={() => handleButtonClick("start")}
          >
            <img src={startIcon} alt="Icon" className="png-icon" />
          </button>
        </div>
      </div>
      {renderSelectedComponent()}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
