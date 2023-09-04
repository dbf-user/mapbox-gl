import Switch from "@mui/material/Switch";
import styled from "styled-components";
import CarIcon from "./icons/car.png";
import WalkIcon from "./icons/walk.png";

const CustomSwitch = styled(Switch)(({ theme, checked }) => ({
  width: 62,
  height: 28,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    "&.Mui-checked": {
      transform: "translateX(32px)",
      color: "#fff",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url(${CarIcon})`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: checked ? "#C96A6A" : "#44C7FF",
    width: 25,
    height: 25,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url(${WalkIcon})`,
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: checked ? "#FEBEBE" : "#C8E2F3",
    opacity: 1,
  },
}));

export default CustomSwitch;
