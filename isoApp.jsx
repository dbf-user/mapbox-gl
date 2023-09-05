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
import "./IsoApp.css";
import treeIcon from "./icons/leave.png";
import co2Icon from "./icons/Co2.png";
import houseIcon from "./icons/flooded-house.png";
import otherIcon from "./icons/construction.png";
import Co2App from "./co2.jsx";
import IsoApp from "./isoApp.jsx";
import Floods from "./floods.jsx";
import Street from "./street.jsx";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

let maxValue = 500;
let minValue = 0;
let title = "15 Parks";
let buildingCount = 353;
let map;
let pageText;

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
        buildingCount = 370;
        updateBuildingColor();
        break;
      case 2:
        setSelectedOption("250");
        minValue = 101;
        maxValue = 500;
        buildingCount = 1531;
        updateBuildingColor();
        break;
      case 3:
        setSelectedOption("100");
        minValue = 51;
        maxValue = 500;
        buildingCount = 412;
        updateBuildingColor();
        break;
      case 4:
        setSelectedOption("50");
        minValue = 0;
        maxValue = 500;
        buildingCount = 353;
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
          <h2>Distance</h2>
          <div className="radio-separator"></div>
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
        <div
          style={{ position: "absolute", left: 150, bottom: 220, height: 100 }}
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
        <div className="middle-text">Buildings are close to a park</div>
      </div>
    </>
  );
};

export function renderToDOM(container, data) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clll4a01u01dc01plajw4bkhm",
    container,
    center: [-0.127997, 51.507969],
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
    map.loadImage("./data/park.png", (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cat", image);

      // Add a data source containing one point feature.
      map.addSource("point", {
        type: "geojson",
        data: park_names,
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "point", // reference the data source
        layout: {
          "icon-image": "cat", // reference the image
          "icon-size": 0.75,
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

    map.addLayer({
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": "white",
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
    updateBuildingColor();

    map.addSource("buildings", {
      type: "geojson",
      data: parks,
    });

    // Add a GeoJSON layer with lines
    map.addLayer({
      id: "lines",
      type: "fill",
      source: "buildings",
      paint: {
        "fill-color": "#A7DD88",
        "fill-emissive-strength": 0.2,
        "fill-opacity": 0.8,
      },
    });
    map.moveLayer("add-3d-buildings");
  });
}

export const updateBuildingColor = () => {
  const selectedColor = idx
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
      case "park":
        pageText = (
          <h1>
            Understanding <b>access to green spaces</b> is critical to build
            better cities
          </h1>
        );
        return <IsoApp />;
      case "co2":
        pageText = <h1>Reduce <b>carbon emissions</b> for your neighborhood</h1>;
        return <Co2App />;

      case "flood":
        pageText = <h1>Identify <b>threats</b> and <b>risk zones</b> in your city</h1>;
        return <Floods />;

      case "other":
        pageText = <h1>Evaluate and compare <b>development opportunities</b> for critical buildings and facilities in your city</h1>;
        return <Street />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* <div class="typewriter"> */}
      <div className={`app-container ${showAnotherComponent ? "hide" : ""}`}>
        <h1>
          Understanding <b>access to green spaces</b> is critical to build
          better cities
        </h1>
      </div>
      {pageText}
      <div style={{ width: "100vw", height: "80vh" }}>
        <div
          id="map"
          style={{
            width: "100%",
            height: "100%",
          }}
        ></div>
        <div className={`app-container ${showAnotherComponent ? "hide" : ""}`}>
          <SliderPanel />
        </div>

        <div className="iso-buttons-container">
          <button
            className={`iso-map-button ${
              selectedButton === "park" || selectedButton === null
                ? "iso-selected"
                : ""
            }`}
            onClick={() => handleButtonClick("park")}
          >
            <img src={treeIcon} alt="Icon" className="iso-png-icon" />
          </button>
          <button
            className={`iso-map-button ${
              selectedButton === "co2" ? "iso-selected" : ""
            }`}
            onClick={() => handleButtonClick("co2")}
          >
            <img src={co2Icon} alt="Icon" className="iso-co2-icon" />
          </button>
          <button
            className={`iso-map-button ${
              selectedButton === "flood" ? "iso-selected" : ""
            }`}
            onClick={() => handleButtonClick("flood")}
          >
            <img src={houseIcon} alt="Icon" className="iso-png-icon" />
          </button>
          <button
            className={`iso-map-button ${
              selectedButton === "other" ? "iso-selected" : ""
            }`}
            onClick={() => handleButtonClick("other")}
          >
            <img src={otherIcon} alt="Icon" className="iso-png-icon" />
          </button>
        </div>
      </div>
      {renderSelectedComponent()}
    </>
  );
};

export default App;
