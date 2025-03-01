import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TO_FAVORITES, REMOVE_FAVORITE_DRINK } from "../../utils/mutations";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useGlobalContext } from "../../globalProvider";

const AddToFavoritesButton = ({ drinkName, userId, onSuccess }) => {
  const [addToFavorites] = useMutation(ADD_TO_FAVORITES);
  const [removeFromFavorites] = useMutation(REMOVE_FAVORITE_DRINK);
  const { globalState, setGlobalState } = useGlobalContext();
  
  const favorites = globalState.favorites ?? [];
  const isFavorite = favorites.includes(drinkName);

    // we use the isFavorite prop to determine which mutation to use which will then update the global state.
  // when the global state updates, then the favorites list updates and will determine the color of the favorite icon
  const handleAddToFavorites = async (event) => {
    event.stopPropagation(); // in place because originally 'click' sent user to the drink's description page rather than adding to favorites

    try {
      let updatedFavorites;
      if (isFavorite) {
        await removeFromFavorites({ variables: { userId, drink: drinkName } });
        updatedFavorites = favorites.filter(fav => fav !== drinkName);
      } else {
        await addToFavorites({ variables: { userId, drink: drinkName } });
        updatedFavorites = [...favorites, drinkName];
      }

      setGlobalState(prevState => ({ ...prevState, favorites: updatedFavorites }));
      if (onSuccess) onSuccess(updatedFavorites);
      console.log("Favorites updated:", updatedFavorites);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <IconButton
      variant="contained"
      size="large"
      onClick={handleAddToFavorites}
      sx={{ color: isFavorite ? 'var(--main-coral)' : 'var(--main-blue)' }}
    >
      {isFavorite ? <FavoriteIcon fontSize="inherit" /> : <FavoriteBorderIcon fontSize="inherit" />}
    </IconButton>
  );
};

export default AddToFavoritesButton;
