import React from "react";
import { Box } from "@mui/material";
import "../UserIcon/ImageDisplay.css";

const ImageDisplay = () => {
  return (
    <Box className="user-profile">
      <Box
        className="floating-icon"
        sx={{
          width: '150px',
          height: '150px',
          mb: '20px',
          backgroundImage: `url(${'/logos/icon-light.svg'})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain"
        }}
      />
    </Box>
  );
};

export default ImageDisplay;
