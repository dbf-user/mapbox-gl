import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { id1200 } from "./data/1200Id.js";
import { id1500 } from "./data/1500Id.js";
import { id900 } from "./data/900Id.js";
import { idsX } from "./data/bIds.js";
import "./RadioPanel.css";
import CustomSlider from "./customSlider.jsx";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

let minValue = 0;
let cId = "#31a354";
let map;

const SliderPanel = () => {
  const [selectedOption, setSelectedOption] = useState("50");

  const handleRadioChange = (event) => {
    //setSelectedOption(value);
  };

  const [value, setValue] = useState(4);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 1:
        setSelectedOption("500");
        minValue = 251;
        cId = "#edf8e9";
        updateBuildingColor(cId);
        break;
      case 2:
        setSelectedOption("250");
        minValue = 101;
        cId = "#bae4b3";
        updateBuildingColor(cId);
        break;
      case 3:
        setSelectedOption("100");
        minValue = 51;
        cId = "#74c476";
        updateBuildingColor(cId);
        break;
      case 4:
        setSelectedOption("50");
        minValue = 0;
        cId = "#31a354";
        updateBuildingColor(cId);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="panel">
        <h2>Distance:</h2>
        <label>
          <input
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              backgroundColor: minValue >= 50 ? "white" : "#31a354",
              display: "inline-block",
              width: "13px",
              height: "13px",
              padding: "1px",
              backgroundClip: "content-box",
              border: "1px solid #bbbbbb",
              borderRadius: "50%",
            }}
            type="radio"
            value="50"
            checked={selectedOption === "50"}
            onChange={handleRadioChange}
          />
          50m
        </label>
        <label>
          <input
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              backgroundColor: minValue >= 100 ? "white" : "#74c476",
              display: "inline-block",
              width: "13px",
              height: "13px",
              padding: "1px",
              backgroundClip: "content-box",
              border: "1px solid #bbbbbb",
              borderRadius: "50%",
            }}
            type="radio"
            value="100"
            checked={selectedOption === "100"}
            onChange={handleRadioChange}
          />
          100m
        </label>
        <label>
          <input
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              backgroundColor: minValue >= 250 ? "white" : "#bae4b3",
              display: "inline-block",
              width: "13px",
              height: "13px",
              padding: "1px",
              backgroundClip: "content-box",
              border: "1px solid #bbbbbb",
              borderRadius: "50%",
            }}
            type="radio"
            value="250"
            checked={selectedOption === "250"}
            onChange={handleRadioChange}
          />
          250m
        </label>
        <label>
          <input
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              backgroundColor: minValue >= 500 ? "white" : "#edf8e9",
              display: "inline-block",
              width: "13px",
              height: "13px",
              padding: "1px",
              backgroundClip: "content-box",
              border: "1px solid #bbbbbb",
              borderRadius: "50%",
            }}
            type="radio"
            value="500"
            checked={selectedOption === "500"}
            onChange={handleRadioChange}
          />
          500m
        </label>
      </div>
      <div style={{ position: "absolute", left: 130, bottom: 60, height: 100 }}>
        <CustomSlider
          orientation="vertical"
          value={value}
          onChange={handleChange}
          step={1}
          min={1}
          max={4}
        />
      </div>
    </div>
  );
};

export function renderToDOM(container, data) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/mapbox/dark-v11",
    container,
    center: [-0.1328665, 51.5162463],
    zoom: 13,
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
        "fill-extrusion-color": "#aaa",

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
    updateBuildingColor(cId);
  });
}

export const updateBuildingColor = (cId) => {
  const expressions = idsX.map((entry) => [
    ["==", ["id"], entry.id],
    entry.color,
  ]);

  const selectedColor = expressions.filter(
    (buildingColor) => buildingColor[1] == cId
  );

  const combinedExpressions = selectedColor.flat();
  combinedExpressions.push("#aaa");
  map.setPaintProperty("add-3d-buildings", "fill-extrusion-color", [
    "case",
    ...combinedExpressions,
  ]);
};

export const App = () => {
  useEffect(() => {
    renderToDOM(document.getElementById("map"));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        id="map"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
      <SliderPanel />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
