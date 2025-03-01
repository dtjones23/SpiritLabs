import React from "react";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../MyFavorites/FavoriteDisplay.css";
import { useGlobalContext } from "../../../../globalProvider";

const FavoriteDisplay = ({ favoriteDrinks, ingredients }) => {
  const navigate = useNavigate();
  const { setGlobalState } = useGlobalContext();

  // Function to check if any ingredient or name matches
  const checkIngredientMatch = (drink, ingredients) => {
    // If no ingredients are provided, return true to display all drinks
    if (ingredients.length === 0) {
      return true;
    }
    return ingredients.some(ingredient =>
      // Check if ingredient is in the drink's name, glass, alcohol, or liquid
      drink.name.toLowerCase().includes(ingredient.toLowerCase()) ||
      drink.alcohol?.some(ingredientItem =>
        ingredientItem.name?.toLowerCase().includes(ingredient.toLowerCase())
      ) ||
      drink.liquid?.some(ingredientItem =>
        ingredientItem.name?.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  };

  // Filter favorite drinks based on the ingredients array (search query)
  const filteredDrinks = favoriteDrinks.filter(drink =>
    checkIngredientMatch(drink, ingredients)
  );

  // Function to set selected drink and navigate to the description page
  const handleDrinkClick = (drink) => {
    setGlobalState(prevState => ({
      ...prevState,
      selectedDrink: drink
    }));
    navigate(`/description/${drink._id}`, { state: { formula: drink } });
  };

  return (
    <>
      <Typography variant="h4" className="favoriteTitle">
        My Favorites
      </Typography>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {filteredDrinks.length > 0 ? (
          filteredDrinks.map((drink, index) => (
            <Box
              key={index}
              m={2}
              textAlign="center"
              onClick={() => handleDrinkClick(drink)}
              style={{ cursor: "pointer", border: "2px solid #ccc", padding: "20px", backgroundColor: "#6b6b6b", borderRadius: "4px" }}
            >
              <img
                src={`/assets/drinkimages/${drink.name.toLowerCase().replace(/\s+/g, "")}.png`}
                alt={drink.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/assets/drinkimages/${drink.name.toLowerCase().replace(/\s+/g, "")}.webp`;
                }}
              />
              <Typography variant="h5" >{drink.name}</Typography>
              {/* Optionally, you can display ingredients here */}
              {/* <Typography variant="body2">Ingredients: {drink.ingredients.join(", ")}</Typography> */}
            </Box>
          ))
        ) : (
          <Typography>No favorite drinks match your search...</Typography>
        )}
      </Box>
    </>
  );
};

export default FavoriteDisplay;
