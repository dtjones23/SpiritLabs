// RightPanel.js
import React from 'react';
import { Typography, Box } from '@mui/material';
import Auth from "../../utils/auth";
// import AddToFavoritesButton from "../addFavorites/AddToFavoritesButton";

// In future this will include instructions on how to make the drink as well as the ingredients
const RightPanel = ({ selectedDrink }) => {
  // const userId = Auth.loggedIn() ? Auth.getProfile().data._id : null;
  return (
    <div>
      <Typography variant="h5" style={{ display: 'flex', justifyContent: 'center' }} gutterBottom>
        {/* Ingredients: */}
      </Typography>
      <ul>
        {selectedDrink && selectedDrink.ingredients.map((ingredient, index) => (
          <li key={index} style={{fontSize:'20px', listStyle:'none', display:'flex', justifyContent:'center'}}>{ingredient}</li>
        ))}
      </ul>
      {/* <Box>
          {userId && <AddToFavoritesButton drinkName={selectedDrink.name} userId={userId} />}
      </Box> */}
    </div>
  );
};

export default RightPanel;