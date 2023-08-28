import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import build from "./data/isochrones.json";
import pathways from "./data/co2.json";
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
let map;

export function renderToDOM(container, data) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clll4a01u01dc01plajw4bkhm",
    container,
    center: [-0.126323, 51.504758],// [-0.127997, 51.507969],
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


    map.addSource('paths', {
      'type': 'geojson',
      data: pathways,
      lineMetrics: true
    });
    
    
    map.addLayer({
      id: "tp-line-line",
      type: "line",
      source: 'paths',
      paint: {
        "line-color": "rgba(0, 0, 0, 0)",
        'line-emissive-strength': 2,
        "line-width": 4,
      }, 
    });

    map.addSource('buildings', {
      'type': 'geojson',
      data: build,
    });
    
    // Add a GeoJSON layer with lines
    map.addLayer({
      id: 'lines',
      type: 'fill',
      source: 'buildings',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-outline-color': '#00008B',
        'fill-emissive-strength': .4,
    'fill-opacity': 0.6
      }    
    });
    
    map.moveLayer('tp-line-line');
    map.moveLayer('add-3d-buildings');

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
        "rgba(0, 0, 0, 0)"
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
  useEffect(() => {
    renderToDOM(document.getElementById("map"));
  }, []);

  return (
    <>
      <div class="overlay">
        <h1>Reduce Carbon Emissions for your</h1>  

        <h1>neighborhood</h1>
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
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
