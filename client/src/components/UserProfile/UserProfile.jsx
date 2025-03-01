import React, { useState } from "react";
import ImageDisplay from "./subcomponents/UserIcon/ImageDisplay";
import FavoriteDisplay from "./subcomponents/MyFavorites/FavoriteDisplay";
import { TextField, Box, IconButton, Typography, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const UserProfile = ({ username, favoriteDrinks }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to split the search query into an array of ingredients
  const getIngredients = () => {
    return searchQuery.split(',').map(ingredient => ingredient.trim()).filter(Boolean);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Profile Section */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ImageDisplay />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
          @{username}
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper 
          sx={{
            display: 'flex', 
            alignItems: 'center', 
            width: '80%', 
            maxWidth: 500, 
            padding: 1, 
            borderRadius: 2, 
            boxShadow: 3
          }} 
        >
          <IconButton sx={{ color: 'primary.main' }}>
            <SearchIcon />
          </IconButton>
          <TextField 
            sx={{ flexGrow: 1, width: '100%' }}
            label="Search By Name or Ingredients" 
            variant="outlined" 
            value={searchQuery} 
            onChange={handleSearchChange}
            fullWidth
          />
        </Paper>
      </Box>

      {/* Favorite Drinks Display */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FavoriteDisplay 
          favoriteDrinks={favoriteDrinks} 
          searchQuery={searchQuery} 
          ingredients={getIngredients()}  // Pass the ingredients as an array
        />
      </Box>
    </Box>
  );
};

export default UserProfile;
