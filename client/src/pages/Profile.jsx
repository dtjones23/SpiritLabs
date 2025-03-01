import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_FAVORITE_DRINKS } from "../utils/queries";
import Auth from "../utils/auth";
import { useGlobalContext } from "../globalProvider.jsx";
import { Typography, Box, Avatar, Button } from "@mui/material";
import UserProfile from "../components/UserProfile/UserProfile.jsx";
import AuthModal from "../components/main/AuthModal.jsx"; 

const Profile = () => {
  const { globalState, setGlobalState } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const userId = Auth.loggedIn() ? Auth.getProfile().data._id : null;
  const username = Auth.loggedIn() ? Auth.getProfile().data.userName : null;

  const [uniqueFavoriteDrinks, setUniqueFavoriteDrinks] = useState([]);

  // Fetch user's favorite drinks
  const { data, loading, error, refetch } = useQuery(GET_USER_FAVORITE_DRINKS, {
    variables: { userId: userId || "" },
    skip: !userId,
  });

  useEffect(() => {
    if (data && data.userFavorites) {
      // Remove duplicates based on name
      const uniqueDrinks = removeDuplicates(data.userFavorites, 'name');
      setUniqueFavoriteDrinks(uniqueDrinks);
      setGlobalState({ ...globalState, favorites: uniqueDrinks.map(drink => drink.name) });
      console.log("Unique drinks:", uniqueDrinks);
    }
    refetch();
  }, [data, setGlobalState]);

  // this helper function will ensure to remove duplicates based on a key
  const removeDuplicates = (array, key) => {
    return array.filter((item, index, self) =>
      index === self.findIndex((i) => (
        i[key] === item[key]
      ))
    );
  };

  if (!userId) {
    return (
      <>
        <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <Box className="profile-container">
        <Avatar
          sx={{
            width: '150px',
            height: '150px',
            mb: '20px',
            border: '2px solid #1D1D1D',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        />
        <br />
          <Box className="profile-message-box">
            <Typography variant="h6" className="profile-message-text">
              Either log in or sign up dude..... you got liquor to drink
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
              className="profile-button"
            >
              Log In / Sign Up
            </Button>
          </Box>
        </Box>
      </>
    );
  }

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  if (uniqueFavoriteDrinks.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: "#808080",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Typography>No favorite drinks yet.</Typography>
      </Box>
    );
  }

  return (
    <>
      <UserProfile 
        username={username} 
        favoriteDrinks={uniqueFavoriteDrinks} 
        favorites={globalState.favorites}
      />
    </>
  );
};

export default Profile;
