import Switch from "@mui/material/Switch";
import PlayIcon from "./icons/play.png";
import StopIcon from "./icons/stop.png";
import { styled } from "@mui/material/styles";

const CustomPlay = styled(Switch)(({ theme, checked }) => ({
  width: 56,
  height: 29,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(30px)",
      color: "#fff",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url(${StopIcon})`, // Image for the thumb when checked
      },
      "& + .MuiSwitch-track": {
        //backgroundColor: "#2ECA45",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    backgroundColor: checked ? "#C96A6A" : "#44C7FF", // Background color of the thumb
    width: 25, // Width of the thumb
    height: 25, // Height of the thumb
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url(${PlayIcon})`, // Image for the thumb
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: checked ? "#FEBEBE" : "#C8E2F3", // Background color of the track
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default CustomPlay;
