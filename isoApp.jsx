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

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

let maxValue = 500;
let minValue = 0;
let title = "15 Parks";
let buildingCount = 353;
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
        buildingCount = 370;
        updateBuildingColor(cId);
        break;
      case 2:
        setSelectedOption("250");
        minValue = 101;
        maxValue = 500;
        buildingCount = 1531;
        cId = "#bae4b3";
        updateBuildingColor(cId);
        break;
      case 3:
        setSelectedOption("100");
        minValue = 51;
        maxValue = 500;
        buildingCount = 412;
        cId = "#74c476";
        updateBuildingColor(cId);
        break;
      case 4:
        setSelectedOption("50");
        minValue = 0;
        maxValue = 500;
        buildingCount = 353;
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
    style: "mapbox://styles/digital-blue-foam/clll4a01u01dc01plajw4bkhm",
    container,
    center: [-0.127997, 51.507969],
    zoom: 16,
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
    updateBuildingColor(cId);

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

export const updateBuildingColor = (cId) => {
  const expressions = idx.map((entry) => [
    ["==", ["id"], entry.id],
    entry.color,
  ]);

  const selectedColor = expressions.filter(
    (buildingColor) => buildingColor[1] == cId
  );

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
      <div class="overlay">
        <div class="overlay-content">
          <h2>Welcome to My Website</h2>
          <p>This is a black-transparent overlay example.</p>
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
        <SliderPanel />
      </div>
      <div className="transparent-panels">
        <h2 className="title">{buildingCount}</h2>
        <div className="middle-text">Buildings are close to park</div>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
