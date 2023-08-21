import mapboxgl from "mapbox-gl";
import { id1200 } from "./data/1200Id.js";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA";

export function renderToDOM(container, data) {
  const map = new mapboxgl.Map({
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

    const expressions = id1200.map((entry) => [
      ["==", ["id"], entry.id], // Check if the ID matches
      entry.color, // Return the color if the ID matches
    ]);

    const combinedExpressions = expressions.flat();
    combinedExpressions.push("#aaa"); // Default color
    map.setPaintProperty("add-3d-buildings", "fill-extrusion-color", [
      "case",
      ...combinedExpressions,
    ]);
  });
}
