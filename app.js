import mapboxgl from 'mapbox-gl';
import { MapboxLayer } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

import build from "./data/street_betweenness_trafalgar.json";

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
    'line-color': ['get', 'color'],
    'line-emissive-strength': 2,
    'line-width': ['*', 100, ['get', 'betweenness_metric_e']]
  }

});


    map.setConfigProperty('basemap', 'lightPreset', 'night');
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
    map.setConfigProperty('basemap', 'showPlaceLabels', false);
    map.setConfigProperty('basemap', 'showRoadLabels', false);
    map.setConfigProperty('basemap', 'showTransitLabels', false);

    
    map.moveLayer('lines'); // Move the 3D buildings layer above the lines layer
    
  });
}