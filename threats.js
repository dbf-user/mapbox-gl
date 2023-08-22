import mapboxgl from "mapbox-gl";
import { id1200 } from "./data/1200Id.js";
import { id1500 } from "./data/1500Id.js";
import { id900 } from "./data/900Id.js";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

  export function renderToDOM(container, data) {
    const map = new mapboxgl.Map({
      style: "mapbox://styles/digital-blue-foam/clll4a01u01dc01plajw4bkhm", 
      container,
      center: [-0.127997,51.507969],  
      zoom: 16,
      pitch: 45, 
      maxBounds: [[-0.145147, 51.496071],[-0.104640, 51.521270]], // Define the bounding box
      minZoom: 15, // Set the minimum zoom level
      maxZoom: 18, // Set the maximum zoom level
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
        'fill-extrusion-ambient-occlusion-intensity': 0.8,
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
    const expressions = id1200.map((entry) => [
      ["==", ["id"], entry.id], // Check if the ID matches
      entry.color, // Return the color if the ID matches
    ]);

    const combinedExpressions = expressions.flat();
    combinedExpressions.push("grey"); // Default color
    map.setPaintProperty("add-3d-buildings", "fill-extrusion-color", [
      "case",
      ...combinedExpressions,
    ]);


    map.moveLayer('add-3d-buildings');


  });
}
