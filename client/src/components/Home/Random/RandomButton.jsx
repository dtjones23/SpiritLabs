import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Box, Typography, Modal, Button, CircularProgress } from "@mui/material";
import { RANDOM_DRINK_QUERY } from "../../../utils/queries";
import { useGlobalContext } from "../../../globalProvider";
import { useNavigate } from "react-router-dom";
import "./RandomButton.css";

const RandomButton = () => {
  const navigate = useNavigate();
  const { globalState, setGlobalState } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [drink, setDrink] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { loading, error, data, refetch } = useQuery(RANDOM_DRINK_QUERY, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data && data.randomDrink) {
      setDrink(data.randomDrink);
    }
  }, [data]);

  const handleOpen = async () => {
    try {
      const result = await refetch();
      setDrink(result.data.randomDrink);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching random drink:", error);
    }
  };

  const handleClose = () => setOpen(false);

  const handleTryAnother = () => {
    handleOpen();
  };

  const handleViewDescription = () => {
    setGlobalState({ ...globalState, formula: drink });
    navigate(`/description/${drink._id}`, { state: { formula: drink, fromModal: true } });
  };

  return (
    <div>
      <Box className="randomButtonContainer" onClick={handleOpen}>
        <Typography variant="h4" className="surpriseText">
          Surprise?
        </Typography>
        <Box className="surpriseIcon"></Box>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box className="randomButtonModalContainer">
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography>Error: {error.message}</Typography>
          ) : (
            drink && (
              <>
                <Typography variant="h4" className="drinkName">
                  {drink.name}
                </Typography>
                <Box
                  className="randomButtonModalImage"
                  sx={{ backgroundImage: imageError ? 'none' : `
                    url('/assets/drinkimages/${drink.name.toLowerCase().replace(/\s+/g, "")}.jpeg'),
                    url('/assets/drinkimages/${drink.name.toLowerCase().replace(/\s+/g, "")}.webp'),
                    url('/assets/drinkimages/${drink.name.toLowerCase().replace(/\s+/g, "")}.png')
                  `.replace(/\s+/g, "") }}
                >
                  {imageError && (
                    <Typography variant="h5" className="imageAltText">
                      {drink.name} - image not available
                    </Typography>
                  )}
                </Box>
                <Typography className="drinkIngredients">
                  Ingredients:{" "}
                  {[
                    ...(drink.alcohol || []),
                    ...(drink.liquid || []),
                    ...(drink.garnish || []),
                  ]
                    .map((ingredient) => ingredient.name)
                    .join(", ")}
                </Typography>

                <Box className="randomButtonModalButtons">
                  <Button
                    onClick={handleTryAnother}
                    variant="contained"
                    className="tryAnotherButton"
                  >
                    Try Another?
                  </Button>
                  <Button
                    onClick={handleViewDescription}
                    variant="contained"
                    className="viewMoreButton"
                  >
                    View More
                  </Button>
                </Box>
              </>
            )
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default RandomButton;