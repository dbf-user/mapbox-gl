import mapboxgl from 'mapbox-gl';
import { MapboxLayer } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

import build from "./data/isochrones.json";
import pathways from "./data/co2.json";

// Set your Mapbox token here
mapboxgl.accessToken = 'pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2w2b2h6aHE2MDd3NzNtcnI5ZjlieHkyZyJ9.lA1YnLC0rCHy9uUWQL0LDA';

export function renderToDOM(container, data) {
  const map = new mapboxgl.Map({
    // style: 'mapbox://styles/mapbox/dark-v9',
    container,
    center: [-0.1328665, 51.5162463],
    zoom: 13
  });


  map.on('load', () => {
// Add GeoJSON source
map.addSource('buildings', {
  'type': 'geojson',
  data: build,
});

map.addSource('paths', {
  'type': 'geojson',
  data: pathways,
  lineMetrics: true
});

// Add a GeoJSON layer with lines
// map.addLayer({
//   id: 'lines',
//   type: 'fill',

//   source: 'buildings',

//   paint: {
//     'fill-color': ['get', 'color'],
// 'fill-opacity': 0.5
//   }

// });

map.addLayer({
  id: "tp-line-line",
  type: "line",
  source: 'paths',
  paint: {
    "line-color": "rgba(0, 0, 0, 0)",
    'line-emissive-strength': 1,
    "line-width": 5,
  }
});


    map.setConfigProperty('basemap', 'lightPreset', 'dusk');
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
    map.setConfigProperty('basemap', 'showPlaceLabels', false);
    map.setConfigProperty('basemap', 'showRoadLabels', false);
    map.setConfigProperty('basemap', 'showTransitLabels', false);

    
    map.moveLayer('paths','lines'); // Move the 3D buildings layer above the lines layer
    
  

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
      "yellow",
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


