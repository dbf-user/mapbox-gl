import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import build from "./data/street_betweenness_trafalgar.json";
import pathways from "./data/co2.json";
import "./RadioPanel.css";
import "./BuildingInfo.css";
import "./Street.css";
import legend2 from "./icons/scr.png";
// import "./IsoApp.css";
import "./App.css";
import CustomSlider from "./customSlider.jsx";
import parks from "./data/parks.json";
import baseMap from "./data/dbf-GREEN-BASE.json";
import t from "./data/test.json";
// import sol from "./data/geo.json";
// import sol1 from "./data/dbf-big.json";
// import sol4 from "./data/Sol4.json";
import sol from "./data/learning/site03-b2.json";
import sol1 from "./data/community/site01-b1.json";
import sol4 from "./data/caring/site02-b1.json";
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
import SB1 from "./data/community/site01-b1.json";
import SB2 from "./data/community/site01-b2.json";
import SB3 from "./data/community/site01-b3.json";
import SB4 from "./data/community/site01-b4.json";
import SB5 from "./data/community/site01-b5.json";
import SB6 from "./data/community/site01-b6.json";
import SB7 from "./data/community/site01-b7.json";
import SB8 from "./data/community/site01-b8.json";
import SB9 from "./data/community/site01-b9.json";
import SB10 from "./data/community/site01-b10.json";
import SB11 from "./data/community/site01-b11.json";
import SB12 from "./data/community/site01-b12.json";
import SB13 from "./data/community/site01-b13.json";
import SB14 from "./data/community/site01-b14.json";
import CB1 from "./data/caring/site02-b1.json";
import CB2 from "./data/caring/site02-b2.json";
import CB3 from "./data/caring/site02-b3.json";
import CB4 from "./data/caring/site02-b4.json";
import CB5 from "./data/caring/site02-b5.json";
import CB6 from "./data/caring/site02-b6.json";
import CB7 from "./data/caring/site02-b7.json";
import CB8 from "./data/caring/site02-b8.json";
import CB9 from "./data/caring/site02-b9.json";
import CB10 from "./data/caring/site02-b10.json";
import CB11 from "./data/caring/site02-b11.json";
import LB1 from "./data/learning/site03-b1.json";
import LB2 from "./data/learning/site03-b2.json";
import LB3 from "./data/learning/site03-b3.json";
import LB4 from "./data/learning/site03-b4.json";
import LB5 from "./data/learning/site03-b5.json";
import LB6 from "./data/learning/site03-b6.json";
import LB7 from "./data/learning/site03-b7.json";
import LB8 from "./data/learning/site03-b8.json";
import LB9 from "./data/learning/site03-b9.json";
import LB10 from "./data/learning/site03-b10.json";
import treeIcon from "./icons/tree-silhouette.png";
import co2Icon from "./icons/Co2.png";
import houseIcon from "./icons/flooded-house.png";
import otherIcon from "./icons/constr.png";
import Co2App from "./co2.jsx";
import IsoApp from "./isoApp.jsx";
import Floods from "./floods.jsx";
import StreetNew from "./streetnw.jsx";
//import Street from "./street.jsx";
import parkIcon from "./data/park.png";
import CustomPlay from "./customPlay.jsx";
import CustomSwitch from "./customSwitch";
import { Stack } from "@mui/system";

// Set your Mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlnaXRhbC1ibHVlLWZvYW0iLCJhIjoiY2xtNXQwdHhvMWd3cjNmcDY2aGc4NDZrNSJ9.1OTywkIt0KA1sMPAxUrCzg";

let maxValue = 500;
let minValue = 0;
let title = "15 Parks";
let buildingCount = 353;
let map;
let show = false;
let mapStat;
const communityBuild = [
  SB1,
  SB2,
  SB3,
  SB4,
  SB5,
  SB6,
  SB7,
  SB8,
  SB9,
  SB10,
  SB11,
  SB12,
  SB13,
  SB14,
];
const caringBuild = [CB1, CB2, CB3, CB4, CB5, CB6, CB7, CB8, CB9, CB10, CB11];
const learningBuild = [LB1, LB2, LB3, LB4, LB5, LB6, LB7, LB8, LB9, LB10];
let currentIndex = 0;
let animationInterval;
let animationRequestId;
let currentBearing = 0;
let initBearing = 0;
let pageTextO;

const StreetPanel = ({ setShowRightPanel, setData }) => {
  const [activeButton, setActiveButton] = useState(null);
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    setShowRightPanel(false);
    show = true;
    switch (buttonName) {
      case "Community":
        setShowRightPanel(true);
        mapStat=false;
        setData({
          propertyName: "Endell Complex",
          address: "2 Endell St, London, UK",
          Bus: "Covent Garden",
          Bdistance: "140 m",
          Metro: "St. Giles High Street",
          Mdistance: "321 m",
        });
        map.flyTo({
          center: [-0.123385, 51.514332],
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          speed: 0.4,
          zoom: 16,
          pitch: 60,
          curve: 1,
          easing(t) {
            return t;
          },
        });
        // map.getSource("my_test").setData(sol);
        // map.getSource("my_test2").setData(sol4);
        clearInterval(animationInterval);
        stopCameraRotation();
        animationInterval = setInterval(() => {
          AnimateBuilding("my_test1", communityBuild);
        }, 150);
        setTimeout(() => {
          rotateCameraAround();
        }, 3000);

        break;
      case "Caring":
        setShowRightPanel(true);
        mapStat=false;
        setData({
          propertyName: "Kemble Caring Center",
          address: "1 Kemble St, London, UK",
          Bus: "Holborn Underground",
          Bdistance: "320 m",
          Metro: "Kingsway",
          Mdistance: "120 m",
        });
        map.flyTo({
          center: [-0.119385, 51.514826],
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          speed: 0.4,
          zoom: 17,
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
        animationInterval = setInterval(() => {
          AnimateBuilding("my_test2", caringBuild);
        }, 150);
        setTimeout(() => {
          rotateCameraAround();
        }, 3000);

        break;
      case "Learning":
        //Learning button click event
        setShowRightPanel(true);
        mapStat=false;
        setData({
          propertyName: "Surrey Edu-Hub",
          address: "12 Temple Pl, London, UK",
          Bus: "Temple Station",
          Bdistance: "90 m",
          Metro: "Temple (Stop N)",
          Mdistance: "141 m",
        });
        map.flyTo({
          center: [-0.114492, 51.51152],
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          speed: 0.4,
          zoom: 17,
          pitch: 60,
          curve: 1,
          easing(t) {
            return t;
          },
        });
        clearInterval(animationInterval);
        stopCameraRotation();
        // map.getSource("my_test1").setData(sol1);
        // map.getSource("my_test").setData(sol);
        animationInterval = setInterval(() => {
          AnimateBuilding("my_test", learningBuild);
        }, 150);
        setTimeout(() => {
          rotateCameraAround();
        }, 3000);
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
        // visibility:"hidden",
        position: "fixed",
        left: 20,
        bottom: "23vh",
        width: 120,
        borderRadius: 2,
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
         {/* <Box>
      <CustomPlay
              //checked={isOn}
              color="default"
              inputProps={{ "aria-label": "toggle" }}
            />
      </Box> */}
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

const LegendPanel = () => {
  return (
    <>
      <Box
        sx={{
          width: "150px",
          borderRadius: 2,
          mb: 2,
          backgroundColor: "black",
          color: "white",
          padding: 2,
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
                fontSize: 14,
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
          Street Betweenness
        </Typography>
        <Divider sx={{ width: "100%", backgroundColor: "white" }} />
        <img
          src={legend2}
          alt="Co2 legend"
          style={{ width: "auto", marginTop: "15px" }}
        />
      </Box>
    </>
  );
};

const TogglePanel = ({sdata}) => {
    const [isOn, setIsOn] = useState(false);
    const toggleState = () => {
      setIsOn(!isOn);
      if (isOn === false) {
        //stop button event
        clearInterval(animationInterval);
        stopCameraRotation();
      } else if (isOn === true) {
        //play button event
        animationInterval = setInterval(() => {
            AnimateBuilding("my_test1", communityBuild, sdata);
          }, 150);
          setTimeout(() => {
            rotateCameraAround();
          }, 200);
      }
    };
  
    return (
      <>
        <Stack sx={{ position: "fixed", left: 20, bottom: "23vh" }}>
        <LegendPanel />
          <Box
            sx={{
              width: "150px",
              borderRadius: 2,
              backgroundColor: "black",
              color: "white",
              padding: 2,
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
              Explore Design Scenarios
            </Typography>
            <Divider sx={{ width: "100%", backgroundColor: "white" }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
  
                cursor: "pointer",
                marginTop: "10px",
              }}
              onClick={toggleState}
            >
              <CustomPlay
                checked={isOn}
                color="default"
                inputProps={{ "aria-label": "toggle" }}
              />
            </Box>
          </Box>
        </Stack>
      </>
    );
  };

const RightPanel = ({
  data,
}) => {
  return (
    <div className="st-container">
      <div className="st-title">Statistics</div>
      <div className="st-separator"></div>

        <div className="st-horizontal-lines">

        <div className="st-vertical-rows">
        <div className="st-row">
            <div className="st-text-align-prop">
              <div className="st-text-prop">Design Score:</div>
            </div>
            <div className="st-text-align-dist">
              <div className="st-text-dist">{data.DesignScore}</div>
            </div>
          </div>
          <div className="st-row">
            <div className="st-text-align-prop">
              <div className="st-text-prop">Gross Floor Area:</div>
            </div>
            <div className="st-text-align-dist">
              <div className="st-text-dist">{data.GrossFloorArea}</div>
            </div>
          </div>
          <div className="st-row">
            <div className="st-text-align-prop">
              <div className="st-text-prop">Site Coverage:</div>
            </div>
            <div className="st-text-align-dist">
              <div className="st-text-dist">{data.SiteCoverage}</div>
            </div>
          </div>
          <div className="st-row">
            <div className="st-text-align-prop">
              <div className="st-text-prop">Height:</div>
            </div>
            <div className="st-text-align-dist">
              <div className="st-text-dist">{data.Height}</div>
            </div>
          </div>
          <div className="st-row">
            <div className="st-text-align-prop">
              <div className="st-text-prop">Units:</div>
            </div>
            <div className="st-text-align-dist">
              <div className="st-text-dist">{data.Units}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnimateBuilding = (source, buildings, setStatData) => {
  
  map.getSource(source).setData(buildings[currentIndex]);
  setStatData({
    DesignScore: buildings[currentIndex].data.DesignScore,
    GrossFloorArea: buildings[currentIndex].data.GrossFloorArea,
    SiteCoverage: buildings[currentIndex].data.SiteCoverage,
    Height: buildings[currentIndex].data.Height,
    Units: buildings[currentIndex].data.Units,
  });
  currentIndex = (currentIndex + 1) % buildings.length;
};

const rotateCameraAround = () => {
  const duration = 120000;
  const speed = 2.0;
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

export function renderToDOM(container, setStatData) {
  map = new mapboxgl.Map({
    style: "mapbox://styles/digital-blue-foam/clmkep6bq01rb01pj1f7phtt0",
    container,
    attributionControl: false,
    center: [-0.1233747, 51.5142924],
    zoom: 16.8,
    pitch: 71,
    minZoom: 15, // Set the minimum zoom level
    maxZoom: 18, // Set the maximum zoom level
    maxBounds: [
      [-0.128784, 51.510215],
      [-0.1184279, 51.5188687],
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

  map.on("click", (e) => {
    clearInterval(animationInterval);
    stopCameraRotation();
  });

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
        "fill-extrusion-opacity": 0.4,
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
        "fill-opacity": 0.6,
      },
    });

    map.addSource("my_test", {
      type: "geojson",
      data: sol,
    });

    // map.addLayer({
    //   id: "extrusion",
    //   type: "fill-extrusion",
    //   source: "my_test",
    //   paint: {
    //     "fill-extrusion-color": ["get", "color"],
    //     "fill-extrusion-ambient-occlusion-intensity": 1,
    //     "fill-extrusion-height": ["get", "height"],
    //     "fill-extrusion-base": ["get", "base_height"],
    //     "fill-extrusion-opacity": 1,
    //   },
    // });

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

    // map.addLayer({
    //   id: "extrusion2",
    //   type: "fill-extrusion",
    //   source: "my_test2",
    //   paint: {
    //     "fill-extrusion-color": ["get", "color"],
    //     "fill-extrusion-ambient-occlusion-intensity": 1,
    //     "fill-extrusion-height": ["get", "height"],
    //     "fill-extrusion-base": ["get", "base_height"],
    //     "fill-extrusion-opacity": 1,
    //   },
    // });

    map.addSource("street", {
      type: "geojson",
      data: build,
    });

    // map.addSource("add-buildings", {
    //   type: "json",
    //   // data: build,
    // });

    map.addLayer({
      id: "lines",
      type: "line",
      source: "street",
      paint: {
        "line-color": ["get", "color"],
        "line-emissive-strength": 2,
        "line-width": 6,
      },
    });
    map.moveLayer("park");
    map.moveLayer("baseM");

    map.moveLayer("lines");
    map.moveLayer("extrusion");
    map.moveLayer("extrusion1");
    map.moveLayer("extrusion2");

    map.moveLayer("add-3d-buildings");

    animationInterval = setInterval(() => {
      AnimateBuilding("my_test1", communityBuild, setStatData);
    }, 150);
    setTimeout(() => {
      rotateCameraAround();
    }, 200);

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

export const Mainpg = () => {
    const [selectedButton, setSelectedButton] = useState(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [data, setData] = useState({
    propertyName: "",
    address: "",
    Bus: "",
    Bdistance: "",
    Metro: "",
    Mdistance: "",
  });

  const [statdata, setStatData] = useState({
    DesignScore: "",
    GrossFloorArea: "",
    SiteCoverage: "",
    Height: "",
    Units: "",
  });

  const [showText, setShowText] = useState(
    <h1 style={{ fontSize: "1rem" }}>
      Generate development scenarios for future-proof urban transformation
    </h1>
  );
  const [showAnotherComponent, setShowAnotherComponent] = useState(false);

  useEffect(() => {
    renderToDOM(document.getElementById("map"), setStatData);
  }, []);

  const handleButtonClick = (buttonId) => {
    if (selectedButton === buttonId) {
      setSelectedButton(null);
      setShowText(null);
      setShowAnotherComponent(false);
    } else {
      setSelectedButton(buttonId);
      switch (buttonId) {
        case "park":
          setShowText(
            <h1 style={{ fontSize: "1rem" }}>
              Compute Urban Green Space Index to assess recreational
              opportunities and urban resilience
            </h1>
          );
          break;
        case "co2":
          setShowText(
            <h1 style={{ fontSize: "1rem" }}>
              Reduce carbon emissions for your neighborhood
            </h1>
          );
          break;
        case "flood":
          setShowText(
            <h1 style={{ fontSize: "1rem" }}>
              Perform urban risk assessment to pinpoint strategic development
              opportunities
            </h1>
          );
          break;
        case "other":
          setShowText(
            <h1 style={{ fontSize: "1rem" }}>
              Generate development scenarios for future-proof urban
              transformation
            </h1>
          );
          break;
        default:
          setShowText(null);
      }

      setShowAnotherComponent(true);
    }
  };

  const renderSelectedComponent = () => {
    switch (selectedButton) {
      case "park":
        return <IsoApp />;
      case "co2":
        return <Co2App />;
      case "flood":
        return <Floods />;
      case "other":
        return <StreetNew />;
      default:
        return null;
    }
  };

  return (
    <>
      <div style={{ width: "100vw", height: "80vh" }}>
        <div
          id="map"
          style={{
            width: "100%",
            height: "100%",
          }}
        ></div>
        <div>
          <h1 style={{ fontSize: "2rem" }}>{showText}</h1>
        </div>

        <div className="iso-buttons-container">
          <button
            className={`iso-map-button ${
              selectedButton === "other" || selectedButton === null
                ? "iso-selected"
                : ""
            }`}
            onClick={() => handleButtonClick("other")}
          >
            <img src={otherIcon} alt="Icon" className="iso-png-icon" />
          </button>
          <button
            className={`iso-map-button ${
              selectedButton === "park" ? "iso-selected" : ""
            }`}
            onClick={() => handleButtonClick("park")}
          >
            <img src={treeIcon} alt="Icon" className="iso-png-icon" />
          </button>
          <button
            className={`iso-map-button ${
              selectedButton === "co2" ? "iso-selected" : ""
            }`}
            onClick={() => handleButtonClick("co2")}
          >
            <img src={co2Icon} alt="Icon" className="iso-co2-icon" />
          </button>
          <button
            className={`iso-map-button ${
              selectedButton === "flood" ? "iso-selected" : ""
            }`}
            onClick={() => handleButtonClick("flood")}
          >
            <img src={houseIcon} alt="Icon" className="iso-png-icon" />
          </button>
        </div>
      </div>
      {/* <StreetPanel setShowRightPanel={setShowRightPanel} setData={setData} /> */}
      <div className={`app-container ${showAnotherComponent ? "hide" : ""}`}>
        <TogglePanel sdata={setStatData} />
        <RightPanel data={statdata} />
      </div>
      {renderSelectedComponent()}
    </>
  );
};
export default Mainpg;
ReactDOM.render(<Mainpg />, document.getElementById("app"));

