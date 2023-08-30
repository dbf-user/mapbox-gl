import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { id1200 } from "./data/1200Id.js";
import { id1500 } from "./data/1500Id.js";
import { id900 } from "./data/900Id.js";
import { idx } from "./data/bIds.js";
import { MapboxLayer } from "@deck.gl/mapbox";
import parks from "./data/parks.json";
import { TripsLayer } from "@deck.gl/geo-layers";
import park_names from "./data/park_names.json";
import trips from "./data/tripsUpdated.json"; //
import "./RadioPanel.css";
import "./BuildingInfo.css";
import CustomSlider from "./customSlider.jsx";

//import pathways from "./data/co2.json";
import "./App.css";
import treeIcon from "./icons/tree-silhouette.png";
import co2Icon from "./icons/Co2.png";
import houseIcon from "./icons/flooded-house.png";
import otherIcon from "./icons/other.png";
import Floods from "./floods.jsx";
import IsoApp from "./isoApp.jsx";
import Co2App from "./co2.jsx";
import pathways from "./data/trips.json";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

let maxValue = 500;
let minValue = 0;
let title = "15 Parks";
let buildingCount = 353;
let animationId = null;
let map;

export function renderToDOM(container, data) {
  const map = new mapboxgl.Map({
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

  return map;
}

export const App = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [showAnotherComponent, setShowAnotherComponent] = useState(false);
  const [myTime, setTime] = useState(300);

  const trailLength = 180;

  useEffect(() => {
    const animate = () => {
      if (animationId) {
        window.cancelAnimationFrame(animationId);
      }
      animationId = window.requestAnimationFrame(animate);
      setTime((t) => (t + 1) % 1800);
    };

    animate();
    return () => window.cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    if (map) {
      if (map.getLayer("trips")) {
        map.getLayer("trips").implementation.setProps({ currentTime: myTime });
      }
    }
  }, [myTime]);

  useEffect(() => {
    map = renderToDOM(document.getElementById("map"));

    const heatMarkersLayer = new MapboxLayer({
      type: TripsLayer,
      id: "trips",
      data: trips,
      getPath: (d) => d.geometry.coordinates,
      getTimestamps: (d) => d.properties.timestamps,
      getColor: [253, 128, 93],
      opacity: 0.9,
      widthMinPixels: 4,
      jointRounded: true,
      trailLength: 180,
      currentTime: myTime,
      shadowEnabled: false,
    });

    map.on("load", () => {
      map.addLayer(heatMarkersLayer);

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

    });
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
        return <IsoApp />;
      case "flood":
        return <Floods />;
      case "co2":
        return <Co2App />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`app-container ${showAnotherComponent ? "hide" : ""}`}>
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
      <div className="buttons-container">
        <button
          className={`map-button ${
            selectedButton === "park" ? "selected" : ""
          }`}
          onClick={() => handleButtonClick("park")}
        >
          <img src={treeIcon} alt="Icon" className="png-icon" />
        </button>
        <button
          className={`map-button ${selectedButton === "co2" ? "selected" : ""}`}
          onClick={() => handleButtonClick("co2")}
        >
          <img src={co2Icon} alt="Icon" className="co2-icon" />
        </button>
        <button
          className={`map-button ${
            selectedButton === "flood" ? "selected" : ""
          }`}
          onClick={() => handleButtonClick("flood")}
        >
          <img src={houseIcon} alt="Icon" className="png-icon" />
        </button>
        <button
          className={`map-button ${
            selectedButton === "other" ? "selected" : ""
          }`}
          onClick={() => handleButtonClick("other")}
        >
          <img src={otherIcon} alt="Icon" className="png-icon" />
        </button>
      </div>

      {renderSelectedComponent()}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
