import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { id1200 } from "./data/1200Id.js";
import { id1500 } from "./data/1500Id.js";
import { id600 } from "./data/build_flood.js";
import { idx } from "./data/bIds.js";
import parks from "./data/parks.json";
import park_names from "./data/park_names.json";
import "./RadioPanel.css";
import "./BuildingInfo.css";
import CustomSlider from "./customSlider.jsx";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2xtNXQwdHhvMWd3cjNmcDY2aGc4NDZrNSJ9.1OTywkIt0KA1sMPAxUrCzg";

let maxValue = 1600;
let minValue = 1400;
let title = "15 Parks";
let buildingCount = 1741;
let map;

const SliderPanel = () => {
  const [selectedOption, setSelectedOption] = useState("1500");

  const handleRadioChange = (event) => {
    //setSelectedOption(value);
  };

  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 1:
        setSelectedOption("1500");
        minValue = 1400;
        maxValue = 1600;
        buildingCount = 1741;
        updateBuildingColor();
        break;
      case 2:
        setSelectedOption("1200");
        minValue = 901;
        maxValue = 1400;
        buildingCount = 1052;
        updateBuildingColor();
        break;
      case 3:
        setSelectedOption("900");
        minValue = 601;
        maxValue = 1100;
        buildingCount = 653;
        updateBuildingColor();
        break;
      case 4:
        setSelectedOption("600");
        minValue = 0;
        maxValue = 600;
        buildingCount = 274;
        updateBuildingColor();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div>
        <div className="panel">
          <h2>Sea Level Rise</h2>
          <label>
            <input
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                backgroundColor: minValue >= 600 ? "white" : "#9ECAE1",
                display: "inline-block",
                width: "13px",
                height: "13px",
                padding: "1px",
                backgroundClip: "content-box",
                border: "1px solid #bbbbbb",
                borderRadius: "50%",
              }}
              type="radio"
              value="600"
              checked={selectedOption === "600"}
              onChange={handleRadioChange}
            />
            0.6m
          </label>
          <label>
            <input
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                backgroundColor: minValue >= 900 ? "white" : "#6BAED6",
                display: "inline-block",
                width: "13px",
                height: "13px",
                padding: "1px",
                backgroundClip: "content-box",
                border: "1px solid #bbbbbb",
                borderRadius: "50%",
              }}
              type="radio"
              value="900"
              checked={selectedOption === "900"}
              onChange={handleRadioChange}
            />
            0.9m
          </label>
          <label>
            <input
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                backgroundColor: minValue >= 1200 ? "white" : "#3182BD",
                display: "inline-block",
                width: "13px",
                height: "13px",
                padding: "1px",
                backgroundClip: "content-box",
                border: "1px solid #bbbbbb",
                borderRadius: "50%",
              }}
              type="radio"
              value="1200"
              checked={selectedOption === "1200"}
              onChange={handleRadioChange}
            />
            1.2m
          </label>
          <label>
            <input
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                backgroundColor: minValue >= 1500 ? "white" : "#08519C",
                display: "inline-block",
                width: "13px",
                height: "13px",
                padding: "1px",
                backgroundClip: "content-box",
                border: "1px solid #bbbbbb",
                borderRadius: "50%",
              }}
              type="radio"
              value="1500"
              checked={selectedOption === "1500"}
              onChange={handleRadioChange}
            />
            1.5m
          </label>
        </div>
        <div
          style={{ position: "absolute", left: 150, bottom: '26vh', height: 100 }}
        >
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
      <div className="transparent-panels">
        <h2 className="title">Urban Insight</h2>
        <div className="separator"></div>
        <h2 className="count">{buildingCount}</h2>
        <div className="middle-text">Buildings at the risk of flooding</div>
      </div>
    </>
  );
};

export function renderToDOM(container, data) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clmhvh77h006301pd60sjb4vx",
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

    map.addLayer({
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 13,
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
    updateBuildingColor();
    map.moveLayer("add-3d-buildings");
    map.flyTo({
      center: [-0.123730, 51.503625],  
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      speed: 0.03,
      zoom: 15.5,
      curve: 1,
      easing(t) {
        return t;
      },
    });

  });
}

export const updateBuildingColor = () => {
  const selectedColor = id600
    .filter(
      (buildingColor) =>
        buildingColor.range >= minValue && buildingColor.range <= maxValue
    )
    .map((buildingColor) => [
      ["==", ["id"], buildingColor.id],
      buildingColor.color,
    ]);

  const combinedExpressions = selectedColor.flat();
  combinedExpressions.push("white");
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
    <>
          
    {/* <h1>Identify <b>threats</b> and <b>risk zones</b> in your city</h1> */}
      <div style={{ width: "100vw", height: "80vh" }}>
        <div
          id="map"
          style={{
            width: "100%",
            height: "100%",
          }}
        ></div>
        <SliderPanel />
      </div>
    </>
  );
};

export default App;
