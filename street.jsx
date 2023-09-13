import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import build from "./data/street_betweenness_trafalgar.json";
import pathways from "./data/co2.json";
import "./RadioPanel.css";
import "./BuildingInfo.css";
import "./Street.css";
import CustomSlider from "./customSlider.jsx";
import parks from "./data/parks.json";
import baseMap from "./data/dbf-GREEN-BASE.json";
import t from "./data/test.json";
import sol from "./data/geo.json";
import sol1 from "./data/dbf-big.json";
import sol4 from "./data/Sol4.json";
import { overlapBuildingIds } from "./data/overlapingBuildingsId";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import BuildingIcon from "./icons/building.jsx";
import MetroIcon from "./icons/metro.png";
import BusIcon from "./icons/bus.png";
import B1 from "./data/1-Solution-Blocks.json";
import B2 from "./data/2-Solution-Blocks.json";
import B3 from "./data/3-Solution-Blocks.json";
import B4 from "./data/4-Solution-Blocks.json";
import B7 from "./data/dbf-community-site-gradient.json";

// import B8 from "./data/p-1.json";
import B9 from "./data/p-2.json";
import B10 from "./data/p-3.json";
import B11 from "./data/p-4.json";
import B12 from "./data/p-5.json";






// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2xtNXQwdHhvMWd3cjNmcDY2aGc4NDZrNSJ9.1OTywkIt0KA1sMPAxUrCzg";

let maxValue = 500;
let minValue = 0;
let title = "15 Parks";
let buildingCount = 353;
let map;
let propertyName, address, Bus, Bdistance, Metro, Mdistance;
let show = false;
const communityBuild = [B1, B2, B3, B4, B7, B9, B10, B11, B12];
let currentIndex = 0;
let animationInterval;
let animationRequestId;
let currentBearing = 0;
let initBearing = 0;

const StreetPanel = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    show = true;
    switch (buttonName) {
      case "Community":
        //Caring button click event
        propertyName = "Endell Complex";
        address = "2 Endell St, London, UK";
        Bus = "Covent Garden";
        Bdistance = "140 m";
        Metro = "St. Giles High Street";
        Mdistance = "321 m";
        map.flyTo({
          center: [-0.123385, 51.514332],
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          speed: 0.3,
          zoom: 16,
          pitch: 60,
          curve: 1,
          easing(t) {
            return t;
          },
        });
        // clearInterval(animationInterval);
        // map.getSource("my_test").setData(sol);
        // map.getSource("my_test2").setData(sol4);
        animationInterval = setInterval(() => {
          AnimateBuilding("my_test1", communityBuild);
        }, 4000);
        setTimeout(() => {
          rotateCameraAround();
        }, 3000);

        break;
      case "Caring":
        map.flyTo({
          center: [-0.119385, 51.514826],
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          speed: 0.3,
          zoom: 16,
          pitch: 60,
          curve: 1,
          easing(t) {
            return t;
          },
        });
        clearInterval(animationInterval);
        stopCameraRotation();

        // map.getSource("my_test1").setData(sol1);
        // map.getSource("my_test2").setData(sol4);
        // animationInterval = setInterval(() => {
        //   AnimateBuilding("my_test", communityBuild);
        // }, 2000);
        //Community button click event
        propertyName = "Kemble Caring Center";
        address = "1 Kemble St, London, UK";
        Bus = "Holborn Underground";
        Bdistance = "320 m";
        Metro = "Kingsway";
        Mdistance = "120 m";

        break;
      case "Learning":
        //Learning button click event
        propertyName = "Surrey Edu-Hub";
        address = "12 Temple Pl, London, UK";
        Bus = "Temple Station";
        Bdistance = "90 m";
        Metro = "Temple (Stop N)";
        Mdistance = "141 m";
        map.flyTo({
          center: [-0.114492, 51.51152],
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          speed: 0.3,
          zoom: 16,
          pitch: 60,
          curve: 1,
          easing(t) {
            return t;
          },
        });
        clearInterval(animationInterval);
        stopCameraRotation();


        break;
      // case "Learning":
      //   map.flyTo({
      //     center: [-0.114492, 51.511485],
      //     essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      //     speed: 0.3,
      //     zoom: 17,
      //     pitch: 60,
      //     curve: 1,
      //     easing(t) {
      //       return t;
      //     },
      //   });
      //   break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        left: 20,
        bottom: "23vh",
        width: 120,
        borderRadius: 5,
        backgroundColor: "black",
        color: "white",
        padding: "1.85vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "-5px 0px 5px rgba(0, 0, 0, 0.2)",
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <Typography
        variant="h6"
        style={{
          marginBottom: "5px",
          lineHeight: "1.2",
          textAlign: "center",
          fontSize: 16,
          fontFamily: "IBM Plex Mono, monospace",
        }}
      >
        Development opportunities
      </Typography>
      <Divider sx={{ width: "100%", backgroundColor: "white" }} />
      <Typography
        variant="body1"
        style={{
          textAlign: "center",
          fontSize: 12,
          marginTop: "8px",
          fontFamily: "IBM Plex Mono, monospace",
        }}
      >
        Show potential development sites:
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<BuildingIcon />}
          sx={{
            width: "120px",
            backgroundColor: "#34C6F5",
            color: "white",
            textTransform: "capitalize",
            border: "2px solid white",
            justifyContent: "flex-start",
            transition: "border-color 0.3s",
            "&:hover": {
              backgroundColor: "#34C6F5 !important",
              borderColor: "#FFD700",
            },
            "&:active": {
              borderColor: "red",
            },
            "&:disabled": {
              backgroundColor: "#a0a0a0",
              borderColor: "#FFD700",
            },
          }}
          onClick={() => handleButtonClick("Caring")}
          disabled={activeButton === "Caring"}
        >
          Caring
        </Button>

        <Button
          variant="contained"
          startIcon={<BuildingIcon />}
          sx={{
            width: "120px",
            backgroundColor: "#A900F8",
            color: "white",
            textTransform: "capitalize",
            border: "2px solid white",
            justifyContent: "flex-start",
            transition: "border-color 0.3s",
            "&:hover": {
              backgroundColor: "#A900F8 !important",
              borderColor: "#FFD700",
            },
            "&:active": {
              borderColor: "red",
            },
            "&:disabled": {
              backgroundColor: "#a0a0a0",
              borderColor: "#FFD700",
            },
          }}
          onClick={() => handleButtonClick("Community")}
          disabled={activeButton === "Community"}
        >
          Community
        </Button>

        <Button
          variant="contained"
          startIcon={<BuildingIcon />}
          sx={{
            width: "120px",
            backgroundColor: "#0014F8",
            color: "white",
            textTransform: "capitalize",
            border: "2px solid white",
            justifyContent: "flex-start",
            transition: "border-color 0.3s",
            "&:hover": {
              backgroundColor: "#0014F8 !important",
              borderColor: "#FFD700",
            },
            "&:active": {
              borderColor: "red",
            },
            "&:disabled": {
              backgroundColor: "#a0a0a0",
              borderColor: "#FFD700",
            },
          }}
          onClick={() => handleButtonClick("Learning")}
          disabled={activeButton === "Learning"}
        >
          Learning
        </Button>
      </Box>
    </Box>
  );
};

const RightPanel = () => {
  return (
    <div className="st-container">
      <div className="st-title">Urban Insight</div>
      <div className="st-separator"></div>
      <div className="st-content">
        <div className="st-horizontal-lines">
          <div className="st-upper-text">{propertyName}</div>
          <div className="st-text">{address}</div>
          <div className="st-mid-text">Transit Proximity</div>
        </div>
        <div className="st-vertical-rows">
          <div className="st-row">
            <img src={MetroIcon} alt="Icon 1" className="st-icon" />
            <div className="st-text-align-prop">
              <div className="st-text-prop">{Bus}</div>
            </div>
            <div className="st-text-align-dist">
              <div className="st-text-dist">{Bdistance}</div>
            </div>
          </div>
          <div className="st-row">
            <img src={BusIcon} alt="Icon 1" className="st-icon" />
            <div className="st-text-align-prop">
              <div className="st-text-prop">{Metro}</div>
            </div>
            <div className="st-text-align-dist">
              <div className="st-text-dist">{Mdistance}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnimateBuilding = (source, buildings) => {
  map.getSource(source).setData(buildings[currentIndex]);
  currentIndex = (currentIndex + 1) % buildings.length;
};

const rotateCameraAround = () => {
  const duration = 120000;
  const speed = 5.0;
  const startTime = Date.now();

  const animate = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime < duration) {
      const rotation = initBearing + (elapsedTime / duration) * 360 * speed;
      currentBearing = rotation;
      map.rotateTo(currentBearing, { duration: 0 });
      animationRequestId = requestAnimationFrame(animate);
    }
  };

  animate();
};

const stopCameraRotation = () => {
  if (animationRequestId) {
    cancelAnimationFrame(animationRequestId);
    initBearing = map.getBearing();
  }
};

export function renderToDOM(container, data) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clmhvh77h006301pd60sjb4vx",
    container,
    center: [-0.126967, 51.5102496], 
    zoom: 16,
    pitch: 45,
    minZoom: 15, // Set the minimum zoom level
    maxZoom: 18, // Set the maximum zoom level
    maxBounds: [
      [-0.140922, 51.500648],
      [-0.10464, 51.52127],
    ],
  });

  const modelOrigin = [-0.119360145693761, 51.5148376818842];
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
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };

  const THREE = window.THREE;

  // configuration of the custom layer for a 3D model per the CustomLayerInterface
  const customLayer = {
    id: "3d-model",
    type: "custom",
    renderingMode: "3d",
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
      loader.load("./data/sol3.gltf", (gltf) => {
        this.scene.add(gltf.scene);
      });
      this.map = map;

      // use the Mapbox GL JS map canvas for three.js
      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
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
    },
  };

  // map.on('style.load', () => {
  //   map.addLayer(customLayer);
  //   });

  const getPopUp = (data) => `<strong>${data}</strong><p>
  <div style="font-weight:600; padding:4px;margin:0px 2px 0px 0px;display:inline;background-color:red;border-radius:6px;">test</div>
  </p>`;

  map.on("load", () => {
    clearInterval(animationInterval);
    stopCameraRotation();
    map.addLayer({
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": "#34353D",
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
        "fill-extrusion-opacity": 1,
      },
    });

    // //
    map.addSource("par", {
      type: "geojson",
      data: parks,
    });

    // Add a GeoJSON layer with lines
    map.addLayer({
      id: "park",
      type: "fill",
      source: "par",
      paint: {
        "fill-color": "#A7DD88",
        "fill-opacity": 0.4,
      },
    });

    map.addSource("base", {
      type: "geojson",
      data: baseMap,
    });

    // Add a GeoJSON layer with lines
    map.addLayer({
      id: "baseM",
      type: "fill",
      source: "base",
      paint: {
        "fill-color": "#A7DD88",
        "fill-opacity": .6,
      },
    });

    map.addSource("my_test", {
      type: "geojson",
      data: sol,
    });

    map.addLayer({
      id: "extrusion",
      type: "fill-extrusion",
      source: "my_test",
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-ambient-occlusion-intensity": 1,
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-opacity": 1,
      },
    });

    map.addSource("my_test1", {
      type: "geojson",
      data: sol1,
    });

    map.addLayer({
      id: "extrusion1",
      type: "fill-extrusion",
      source: "my_test1",
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-ambient-occlusion-intensity": 1,
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-opacity": 1,
      },
    });

    map.addSource("my_test2", {
      type: "geojson",
      data: sol4,
    });

    map.addLayer({
      id: "extrusion2",
      type: "fill-extrusion",
      source: "my_test2",
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-ambient-occlusion-intensity": 1,
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-opacity": 1,
      },
    });

    map.addSource("street", {
      type: "geojson",
      data: build,
    });

    // map.addSource("add-buildings", {
    //   type: "json",
    //   // data: build,
    // });

    // map.addLayer({
    //   id: "lines",
    //   type: "line",
    //   source: "street",
    //   paint: {
    //     "line-color": ["get", "color"],
    //     "line-emissive-strength": 2,
    //     "line-width": 6,
    //   },
    // });
    map.moveLayer("park");
    map.moveLayer("baseM");
    
    map.moveLayer("lines");
    map.moveLayer("extrusion");
    map.moveLayer("extrusion1");
    map.moveLayer("extrusion2");

    map.moveLayer("add-3d-buildings");

    map.flyTo({
      center: [-0.123385, 51.514332],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      speed: 0.2,
      zoom: 16.5,
      pitch: 60,
      curve: 1,
      easing(t) {
        return t;
      },
    });
    animationInterval = setInterval(() => {
      AnimateBuilding("my_test1", communityBuild);
    }, 800);
    setTimeout(() => {
      rotateCameraAround();
    }, 3000);

    const FilterIds = overlapBuildingIds.map((d) => d.id);
    let filter = ["match", ["id"], FilterIds, false, true];
    let filter_map = map.getFilter("add-3d-buildings");

    // if (filter_map === undefined) {
    filter_map = ["all", filter];
    // } else {
    //   filter_map = ["all", ...filter_map, filter];
    // }
    map.setFilter("add-3d-buildings", filter_map);
  });

  return map;
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
        <StreetPanel />
        {show ? <RightPanel /> : null}
      </div>
    </>
  );
};

export default App;
