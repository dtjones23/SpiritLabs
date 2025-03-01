import React from 'react';
import { Typography } from '@mui/material';

const Image = ({ imageUrl, title }) => {
  return (
    <div>
      <Typography variant="h5" style={{ display: 'flex', justifyContent: 'center' }}>{title}</Typography>
      <img
        src={imageUrl}
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '55%'
        }}
        alt="Image"
      />
    </div>
  );
};

export default Image;
