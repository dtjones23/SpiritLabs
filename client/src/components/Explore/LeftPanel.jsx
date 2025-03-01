import React from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_ALL_DRINKS } from '../../utils/queries';

// In the future, this list will consists of all the different drinks that is both from our database and the users' unique drinks

const LeftPanel = ({ onSelectDrink }) => {
  const { loading, error, data } = useQuery(GET_ALL_DRINKS);

  if (loading) return <CircularProgress />; // circular loading bar
  if (error) return <Typography variant="body1">Error: {error.message}</Typography>;

  const drinks = data.allDrinks; // this refers to the data returned from the query

  const handleSelectDrink = (drink) => {
    onSelectDrink(drink);
  };

  return (
    <Paper style={{ maxHeight: 'calc(100vh - 64px)', overflow: 'auto', padding: '16px', border: '1px solid #ccc' }}>
      <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '16px' }}>Explore The Goodness</Typography>
      <Box style={{ maxHeight: 'calc(100vh - 64px)', overflowY: 'auto', textAlign:'center', marginBottom:'40px'}}>
        {drinks.map((drink, index) => (
          <div key={index}>
            {/* this is how the user can select any drink from the list */}
            <Typography variant="body1" style={{ cursor: 'pointer' }} onClick={() => handleSelectDrink(drink)}>
              {drink.name}
            </Typography>
          </div>
        ))}
      </Box>
    </Paper>
  );
};

export default LeftPanel;
