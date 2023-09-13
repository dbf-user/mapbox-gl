import { Slider } from "@mui/material";
import { styled } from "@mui/system";


const CustomSlider = styled(Slider)({
    color: 'white',
    
    //height: 100,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 15,
      width: 15,
      backgroundColor: '#D6D6D6',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    
  });

  export default CustomSlider;