import React, { useState, useEffect } from 'react';
import NeighborContext from '../utils/neighborContext';

const NeighborProvider = ({ children }) => {
  const [neighborState, setNeighborState] = useState({});

  return (
    <NeighborContext.Provider value={{ neighborState, setNeighborState }}>
      {children}
    </NeighborContext.Provider>
  );
};

export default NeighborProvider;