import mapboxgl from "mapbox-gl";
import pathways from "./data/co2.json";
import build from "./data/street_betweenness_trafalgar.json";

// import health from "";


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
      maxBounds: [[-0.140922, 51.500648],[-0.104640, 51.521270]], // Define the bounding box
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
        "fill-extrusion-opacity": 0.6,
      },
    });

    map.addSource("my-geojson-source", {
      type: "geojson",
      data: "./data/savoy-theatre_School.geojson", // Replace with the path to your GeoJSON file
    });

    map.addLayer({
      id: "my-geojson-layer",
      type: "fill", // Change to the appropriate layer type (e.g., fill, line, symbol)
      source: "my-geojson-source",
      paint: {
        "fill-color": "red", // Adjust styling as needed
        "fill-opacity": 0.5,
      },
    });

    map.addSource("my-geojson", {
      type: "geojson",
      data: "./data/slingsby_Hospital.geojson", // Replace with the path to your GeoJSON file
    });

    map.addLayer({
      id: "my-geojson",
      type: "fill", // Change to the appropriate layer type (e.g., fill, line, symbol)
      source: "my-geojson",
      paint: {
        "fill-color": "red", // Adjust styling as needed
        "fill-opacity": 0.5,
      },
    });

    map.addSource('buildings', {
      type: 'geojson',
      data: build
    });
    
    // Add a GeoJSON layer with lines
    map.addLayer({
      id: 'lines',
      type: 'line',
      slot: 'middle',
      source: 'buildings',
      
      paint: {
        'line-color': ['get', 'colors'],
        // 'line-emissive-strength': .4,
        'line-width': ['*', 100, ['get', 'betweenness_metric_e']]
      }
    
    });
    map.moveLayer('add-3d-buildings');

  });
}
