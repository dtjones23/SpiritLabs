import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Auth from "../utils/auth";
import RandomButton from "../components/Home/Random/RandomButton";
import PopularDrinks from "../components/Home/Popular/PopularDrinks";
import DrinkOfDay from "../components/Home/Dotd/DrinkOfDay";

function Home() {
  const username = Auth.loggedIn() ? Auth.getProfile().data.userName : null;

  return (
    <Box className="container">
      <Typography variant="h4" sx={{textAlign: "center"}}>
        {username ? `Welcome back, ${username}!` : "Welcome to Spirit Labs!"}
      </Typography>
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Welcome Section */}
          <Box className="welcome-section">
            <Typography variant="h6" className="welcome-text">
            Welcome to Spirit Labs, your ultimate destination for discovering the finest drinks! Feeling adventurous? Check out our <b>Drink Of The Day🍸</b>, spin the wheel with our <b>Random Cocktail Generator</b>, or see what's hot with our <b>Popular Drinks</b>! Don't forget to explore the tabs at the bottom for more exciting options. Cheers to new adventures! 🥂
            </Typography>
          </Box>

          {/* Popular Drinks Box */}
          <Box className="box">
            <PopularDrinks />
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          {/* Random Drink */}
          <Box className="box">
            <RandomButton />
          </Box>

          {/* Drink of The Day */}
          <Box className="box" sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <DrinkOfDay />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;