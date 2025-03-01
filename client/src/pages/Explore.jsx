import React, { memo, useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_FORMULAS } from '../utils/queries';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress, Card, CardContent, CardMedia, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import Auth from '../utils/auth';
import { useGlobalContext } from "../globalProvider";
import AddToFavoritesButton from "../components/addFavorites/AddToFavoritesButton";

const Explore = () => {
  const { loading, error, data } = useQuery(GET_ALL_FORMULAS);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLiquor, setSelectedLiquor] = useState('');
  const userId = Auth.loggedIn() ? Auth.getProfile().data._id : null;

  const filteredCocktails = useMemo(
    () =>
      data?.formulas?.filter((formula) =>
        selectedLiquor
          ? formula.alcohol.some((alcohol) =>
              alcohol.name.toLowerCase().includes(selectedLiquor.toLowerCase())
            )
          : true
      ),
    [data, selectedLiquor]
  );

  const liquorOptions = ["Show All", "Whiskey", "Vodka", "Tequila", "Rum", "Gin", "Brandy", "Mezcal"];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (liquor) => {
    setAnchorEl(null);
    setSelectedLiquor(liquor === "Show All" ? '' : liquor);
  };
  
  if (loading || error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: 'background.paper' }}>
        {loading ? <CircularProgress color="secondary" size={60} /> : <Typography color="error">Error loading formulas</Typography>}
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 4, backgroundColor: 'background.default' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h3" gutterBottom>Explore </Typography>
        <Button variant="contained" onClick={handleClick} sx={{ backgroundColor: 'primary.main', boxShadow: 2, padding: 3, fontSize: "1.4rem" }}>
          Select Liquor
        </Button>
      </Box>
      <Box display="flex"  sx={{ my: 2 }}>
      <Typography variant="h5">{`Selected Option: ${selectedLiquor || 'All'}`}</Typography>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose(null)} sx={{width: '100%'}}>
        {liquorOptions.map((liquor) => (
          <MenuItem key={liquor} onClick={() => handleClose(liquor)} sx={{ textTransform: 'capitalize', width: '100%' }}>
            {liquor}
          </MenuItem>
        ))}
      </Menu>
      
      <Grid container spacing={3}>
        {filteredCocktails.map((formula) => (
          <Grid item xs={12} sm={6} md={4} key={formula._id}>
            <FormulaCard formula={formula} navigate={navigate} userId={userId} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const FormulaCard = memo(({ formula, navigate, userId }) => {
  const { globalState } = useGlobalContext();
  const isFavorite = globalState.favorites?.includes(formula?.name);

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': { boxShadow: 8, transform: 'scale(1.05)' },
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
      onClick={() => navigate(`/description/${formula._id}`, { state: { formula } })}
    >
      <CardMedia
        component="img"
        height="300"
        sx={{
          backgroundImage: `
            url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.jpeg'),
            url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.webp'),
            url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.png')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <CardContent sx={{ position: 'relative', padding: 2 }}>
        <Typography variant="h6" color="text.primary">{formula.name}</Typography>
        <Box sx={{ position: 'absolute', top: 0, right: 0, m: 1 }}>
          {userId && (
            <AddToFavoritesButton
              drinkName={formula?.name}
              userId={userId}
              isFavorite={isFavorite}
              onSuccess={() => {}}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

export default Explore;
