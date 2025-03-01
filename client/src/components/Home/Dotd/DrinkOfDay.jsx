import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { RANDOM_DRINK_QUERY } from "../../../utils/queries";
import "./DrinkOfDay.css";

const DrinkOfDay = () => {
  const [drink, setDrink] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(RANDOM_DRINK_QUERY, {
    skip: !!drink
  });

  useEffect(() => {
    const storedDrink = localStorage.getItem('drinkOfDay');
    const storedTimestamp = localStorage.getItem('drinkOfDayTimestamp');
    const currentTime = Date.now();

    if (storedDrink && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10);
      if (currentTime - timestamp < 24 * 60 * 60 * 1000) {
        setDrink(JSON.parse(storedDrink));
        return;
      }
    }

    if (data) {
      const newDrink = data.randomDrink;
      setDrink(newDrink);
      localStorage.setItem('drinkOfDay', JSON.stringify(newDrink));
      localStorage.setItem('drinkOfDayTimestamp', currentTime.toString());
    }
  }, [data]);

  const generateRandomPosition = () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${30 + Math.random() * 40}px`,
    height: `${30 + Math.random() * 40}px`,
    transform: `rotate(${Math.random() * 360}deg)`
  });

  const handleViewMore = () => {
    if (drink) {
      navigate(`/description/${drink._id}`, { state: { formula: drink } });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box className="drinkOfTheDay" sx={{ height: '100%' }}>
      <Typography variant="h3" mb={2} className="drinkTitle">
        Drink of the Day
      </Typography>
      {Array.from({ length: 50 }).map((_, index) => (
        <div key={index} className="clover" style={generateRandomPosition()} />
      ))}
      {drink && (
        <>
          <Box
            className="drinkModal"
            sx={{
              width: '200px',
              height: '240px',
              borderRadius: '10px',
              backgroundSize: "contain",
              backgroundPosition: "center",
              margin: "0 auto 12px auto",
              backgroundImage: imageError ? 'none' : `
                url('/assets/drinkimages/${drink.name.toLowerCase().replace(/\s+/g, "")}.jpeg'),
                url('/assets/drinkimages/${drink.name.toLowerCase().replace(/\s+/g, "")}.webp'),
                url('/assets/drinkimages/${drink.name.toLowerCase().replace(/\s+/g, "")}.png')
              `.replace(/\s+/g, ""),
            }}
          >
            {imageError && (
              <Typography variant="h5">
                {drink.name} - image not available
              </Typography>
            )}
          </Box>
          <Typography variant="h3" mb={2} className="drinkName">
            {drink.name}
          </Typography>
          <Button variant="contained" onClick={handleViewMore} className="viewMoreButton">
            View More
          </Button>
        </>
      )}
    </Box>
  );
};

export default DrinkOfDay;