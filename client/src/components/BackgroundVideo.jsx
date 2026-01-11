import React from 'react';
import { Box } from '@mui/material';

const BackgroundVideo = ({ videoSrc, children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <Box
        component="video"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          zIndex: -1,
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
      
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.2)', // Light overlay for better readability
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BackgroundVideo;