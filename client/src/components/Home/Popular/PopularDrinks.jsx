import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography, Button } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { useGlobalContext } from "../../../globalProvider";
import { GET_ALL_FORMULAS } from "../../../utils/queries";
import "./PopularDrinks.css";

const PopularDrinks = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_ALL_FORMULAS);
  const { globalState, setGlobalState } = useGlobalContext();
  const [startIndex, setStartIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (globalState.selectedDrinkIndex !== undefined) {
      setStartIndex(globalState.selectedDrinkIndex);
    }
  }, [globalState.selectedDrinkIndex]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const sortedDrinks = (data.formulas || [])
    .slice()
    .sort((a, b) => b.favoritesCount - a.favoritesCount)
    .slice(0, 10);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % sortedDrinks.length);
  };

  const handlePrev = () => {
    setStartIndex(
      (prevIndex) => (prevIndex - 1 + sortedDrinks.length) % sortedDrinks.length
    );
  };

  const handleViewDescription = () => {
    setGlobalState({
      ...globalState,
      formula: sortedDrinks[startIndex],
      selectedDrinkIndex: startIndex,
    });
    navigate(`/description/${sortedDrinks[startIndex]._id}`, { state: { formula: sortedDrinks[startIndex] } });
  };

  const capFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const displayedDrink = sortedDrinks[startIndex];

  return (
    <Box className="popularDrinksContainer">
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        🍹 Most Favorited Drinks
      </Typography>

      <Box className="popularDrinksItems">
        <IconButton onClick={handlePrev} disabled={sortedDrinks.length <= 1}>
          <ArrowBackIosNew sx={{ color: "black" }} />
        </IconButton>

        <Box className="drinkDisplay">
          <Box
            className="drinkImage"
            sx={{
              backgroundImage: imageError ? 'none' : `
                url('/assets/drinkimages/${displayedDrink.name.toLowerCase().replace(/\s+/g, "")}.jpeg'),
                url('/assets/drinkimages/${displayedDrink.name.toLowerCase().replace(/\s+/g, "")}.webp'),
                url('/assets/drinkimages/${displayedDrink.name.toLowerCase().replace(/\s+/g, "")}.png')
              `.replace(/\s+/g, ""),
            }}
          >
            {imageError && (
              <Typography variant="h5" className="imageAltText">
                {displayedDrink.name} - image not available
              </Typography>
            )}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
            {capFirstLetter(displayedDrink.name)}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Ingredients:
          </Typography>
          <Typography
            variant="body2"
            component="ul"
            className="ingredientsList"
          >
            {[
              ...displayedDrink.alcohol.map((ingredient) => capFirstLetter(ingredient.name)),
              ...displayedDrink.liquid.map((ingredient) => capFirstLetter(ingredient.name)),
              ...displayedDrink.garnish.map((ingredient) => capFirstLetter(ingredient.name)),
            ]
              .slice(0, 3)
              .map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, width: "100%" }}
            onClick={handleViewDescription}
            className="viewMoreButtonPopular"
          >
            View More
          </Button>
        </Box>

        <IconButton onClick={handleNext} disabled={sortedDrinks.length <= 1}>
          <ArrowForwardIos sx={{ color: "black" }} />
        </IconButton>
      </Box>

      <Box display="flex" justifyContent="center" mt={2}>
        {sortedDrinks.map((_, index) => (
          <Box
            className={`popularDrinksDots ${startIndex === index ? "active" : ""}`}
            key={index}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PopularDrinks;