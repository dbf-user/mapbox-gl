import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import build from "./data/street_betweenness_trafalgar.json";
import pathways from "./data/co2.json";
import "./RadioPanel.css";
import "./BuildingInfo.css";
import CustomSlider from "./customSlider.jsx";

import t from "./data/test.json";
import sol from "./data/geo.json";
import sol1 from "./data/Solution-Blocks.json";
import sol4 from "./data/Sol4.json";

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
    center: [-0.118969, 51.511692],// [-0.127997, 51.507969], , 
    zoom: 16,
    pitch: 60,
    minZoom: 14, // Set the minimum zoom level
    maxZoom: 18, // Set the maximum zoom level
    maxBounds: [
      [-0.140922, 51.500648],
      [-0.10464, 51.52127],
    ],
  });


  const modelOrigin = [-0.119360145693761,51.5148376818842];
const modelAltitude = 0;
const modelRotate = [Math.PI / 2, 1.5, 0];
 
const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
modelOrigin,
modelAltitude
);
 
// transformation parameters to position, rotate and scale the 3D model onto the map
const modelTransform = {
translateX: modelAsMercatorCoordinate.x,
translateY: modelAsMercatorCoordinate.y,
translateZ: modelAsMercatorCoordinate.z,
rotateX: modelRotate[0],
rotateY: modelRotate[1],
rotateZ: modelRotate[2],
/* Since the 3D model is in real world meters, a scale transform needs to be
* applied since the CustomLayerInterface expects units in MercatorCoordinates.
*/
scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
};
 
const THREE = window.THREE;
const gui = new dat.GUI();

 
// configuration of the custom layer for a 3D model per the CustomLayerInterface
const customLayer = {
id: '3d-model',
type: 'custom',
renderingMode: '3d',
onAdd: function (map, gl) {
this.camera = new THREE.Camera();
this.scene = new THREE.Scene();
// create two three.js lights to illuminate the model
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, -70, 100).normalize();
this.scene.add(directionalLight);
 
const directionalLight2 = new THREE.DirectionalLight(0xffffff);
directionalLight2.position.set(0, 70, 100).normalize();
this.scene.add(directionalLight2);
 
// use the three.js GLTF loader to add the 3D model to the three.js scene
const loader = new THREE.GLTFLoader();
loader.load(
'./data/sol3.gltf',
(gltf) => {
this.scene.add(gltf.scene);
}
);
this.map = map;
 
// use the Mapbox GL JS map canvas for three.js
this.renderer = new THREE.WebGLRenderer({
canvas: map.getCanvas(),
context: gl,
antialias: true
});
 
this.renderer.autoClear = false;
},
render: function (gl, matrix) {
const rotationX = new THREE.Matrix4().makeRotationAxis(
new THREE.Vector3(1, 0, 0),
modelTransform.rotateX
);
const rotationY = new THREE.Matrix4().makeRotationAxis(
new THREE.Vector3(0, 1, 0),
modelTransform.rotateY
);
const rotationZ = new THREE.Matrix4().makeRotationAxis(
new THREE.Vector3(0, 0, 1),
modelTransform.rotateZ
);
 
const m = new THREE.Matrix4().fromArray(matrix);
const l = new THREE.Matrix4()
.makeTranslation(
modelTransform.translateX,
modelTransform.translateY,
modelTransform.translateZ
)
.scale(
new THREE.Vector3(
modelTransform.scale,
-modelTransform.scale,
modelTransform.scale
)
)
.multiply(rotationX)
.multiply(rotationY)
.multiply(rotationZ);
 
this.camera.projectionMatrix = m.multiply(l);
this.renderer.resetState();
this.renderer.render(this.scene, this.camera);
this.map.triggerRepaint();
}
};

// map.on('style.load', () => {
//   map.addLayer(customLayer);
//   });
  

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

    map.addSource('my_test', {
      'type': 'geojson',
      'data': sol
  });

  map.addLayer({
    'id': 'extrusion',
    'type': 'fill-extrusion',
    'source': 'my_test',
    'paint': {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ["get", "height"],
        'fill-extrusion-base': ["get", "base_height"],
        'fill-extrusion-opacity': 1
    }
});


    map.addSource('my_test1', {
      'type': 'geojson',
      'data': sol1
    });

    map.addLayer({
    'id': 'extrusion1',
    'type': 'fill-extrusion',
    'source': 'my_test1',
    'paint': {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ["get", "height"],
        'fill-extrusion-base': ["get", "base_height"],
        'fill-extrusion-opacity': 1
    }
    });

    map.addSource('my_test2', {
      'type': 'geojson',
      'data': sol4
    });

    map.addLayer({
    'id': 'extrusion2',
    'type': 'fill-extrusion',
    'source': 'my_test2',
    'paint': {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ["get", "height"],
        'fill-extrusion-base': ["get", "base_height"],
        'fill-extrusion-opacity': 1
    }
    });

    
    map.addSource('buildings', {
      'type': 'geojson',
      data: build,
    });
    
    map.addLayer({
      id: "lines",
      type: "line",
      source: 'buildings',
      paint: {
        'line-color': ['get', 'color'],
        'line-emissive-strength': 2,
        "line-width": 4,
      }, 
    });
    map.moveLayer('extrusion');
    map.moveLayer('extrusion1');
    map.moveLayer('extrusion2');

    map.moveLayer('add-3d-buildings');

  });
}

export const App = () => {
  useEffect(() => {
    renderToDOM(document.getElementById("map"));
  }, []);

  return (
    <>
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
