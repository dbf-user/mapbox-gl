import mapboxgl from "mapbox-gl";
import { id1200 } from "./data/1200Id.js";
import { id1500 } from "./data/1500Id.js";
import { id900 } from "./data/900Id.js";

import pathways from "./data/co2.json";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

export function renderToDOM(container, data) {
  const map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clll4a01u01dc01plajw4bkhm", 
    container,
    center: [-0.122596,51.506727],


    zoom: 15,
    pitch: 0,
  });

  map.on("load", () => {
    map.addLayer({
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": "#7182A6",

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
      }
    });

    map.moveLayer('add-3d-buildings');

    let startTime;
    const duration = 3000;
  
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
