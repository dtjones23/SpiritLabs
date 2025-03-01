import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_FORMULAS } from "../utils/queries";
import { useGlobalContext } from "../globalProvider";
import CircularProgress from "@mui/material/CircularProgress";
import Grid2 from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddToFavoritesButton from "../components/addFavorites/AddToFavoritesButton";
import Auth from "../utils/auth";
import "../components/Search/FormulaResults/ResultsList.css";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedAlcoholTypes, selectedLiquidTypes, selectedGlassTypes } = location.state || {};
  const { loading, data } = useQuery(GET_ALL_FORMULAS);
  const { globalState, setGlobalState } = useGlobalContext();
  const [matchingFormulas, setMatchingFormulas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const userId = Auth.loggedIn() ? Auth.getProfile().data._id : null;

  // Filter formulas based on selected ingredients
  useEffect(() => {
    if (!loading && data) {
      const formulas = data.formulas.map((formula) => {
        const alcoholMatchCount = selectedAlcoholTypes.filter((alcohol) =>
          formula.alcohol.some((item) => item.name === alcohol)
        ).length;
        const liquidMatchCount = selectedLiquidTypes.filter((liquid) =>
          formula.liquid.some((item) => item.name === liquid)
        ).length;
        const glassMatchCount = selectedGlassTypes.filter(
          (glass) => formula.glass === glass
        ).length;

        return {
          ...formula,
          alcoholMatchCount,
          liquidMatchCount,
          glassMatchCount,
        };
      });

      const filteredFormulas = formulas.filter(
        (formula) =>
          formula.alcoholMatchCount +
            formula.liquidMatchCount +
            formula.glassMatchCount >
          0
      );

      const sortedFormulas = filteredFormulas.sort((a, b) => {
        const aTotalMatch =
          a.alcoholMatchCount + a.liquidMatchCount + a.glassMatchCount;
        const bTotalMatch =
          b.alcoholMatchCount + b.liquidMatchCount + b.glassMatchCount;
        return bTotalMatch - aTotalMatch;
      });

      setMatchingFormulas(sortedFormulas);
    }
  }, [
    loading,
    data,
    selectedAlcoholTypes,
    selectedLiquidTypes,
    selectedGlassTypes,
  ]);

  if (loading) return <CircularProgress />;

  const handleFormulaClick = (formula) => {
    setGlobalState((prevState) => ({
      ...prevState,
      formula: formula,
    }));
    navigate(`/description/${formula._id}`, { state: { formula } });
  };

  const handleMatchButtonClick = (formula, event) => {
    event.stopPropagation();
    setSelectedFormula(formula);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFormula(null);
  };

  const getBackgroundColor = (formula) => {
    const selectedTypes = [
      ...selectedAlcoholTypes,
      ...selectedLiquidTypes,
      ...selectedGlassTypes,
    ];
    const ingredientNames = [
      ...formula.alcohol.map((a) => a.name),
      ...formula.liquid.map((l) => l.name),
      formula.glass,
    ];

    const matches = selectedTypes.filter((type) =>
      ingredientNames.includes(type)
    ).length;

    if (matches === 1) return "#607D8B";
    if (matches === 2) return "#bd8e00";
    if (matches === 3) return "#4CAF50";
    if (matches === 4) return "#9C27B0";
    if (matches === 5) return "#FF5722";
    if (matches === 6) return "#8BC34A ";
    if (matches === 7) return "#FFC107";
    if (matches === 8) return "#F37021";
    if (matches === 9) return "#00A0D9";
    if (matches === 10) return "#00BBF7";

    return "default";
  };

  const getMatchingIngredients = (formula) => {
    if (!formula) return [];

    const matchingAlcohol = formula.alcohol.filter((ingredient) =>
      selectedAlcoholTypes.includes(ingredient.name)
    );

    const matchingLiquid = formula.liquid.filter((ingredient) =>
      selectedLiquidTypes.includes(ingredient.name)
    );

    const matchingGlass = selectedGlassTypes.includes(formula.glass)
      ? [formula.glass]
      : [];

    return [...matchingAlcohol, ...matchingLiquid, ...matchingGlass];
  };

  return (
    <Box className="results-container">
      <Box className="header">
        <IconButton
          onClick={() =>
            navigate("/search", {
              state: {
                selectedAlcoholTypes,
                selectedLiquidTypes,
                selectedGlassTypes,
              },
            })
          }
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Matching Formulas
        </Typography>
      </Box>
      <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {matchingFormulas.length > 0 ? (
          matchingFormulas.map((formula, index) => (
            <Grid2 item="true" key={index} size={4} sm={6} md={4}>
              <Card
                onClick={() => handleFormulaClick(formula)}
                className="formula-card"
                sx={{
                  backgroundColor: getBackgroundColor(formula),
                  transition: '0.3s ease',
                  borderRadius: '20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box className="drinkCard">
                  <Box
                    className="drinkCardImage"
                    sx={{
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '20px',
                      backgroundImage: `
                        url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.jpeg'),
                        url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.webp'),
                        url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.png')
                      `,
                      height: '200px',
                    }}
                  />
                  <CardContent className="cardContent">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h5">{formula.name}</Typography>
                      </Box>
                      {userId && (
                        <AddToFavoritesButton
                          drinkName={formula.name}
                          userId={userId}
                          isFavorite={globalState.favorites?.includes(formula.name)}
                          onSuccess={(updatedFavorites) =>
                            setGlobalState({
                              ...globalState,
                              favorites: updatedFavorites,
                            })
                          }
                        />
                      )}
                    </Box>
                    <Box className="drinkCardReviews">
                      <Button
                        variant="contained"
                        className="cardHeaderItem"
                        sx={{ backgroundColor: "#ffffff" }}
                        onClick={(event) => handleMatchButtonClick(formula, event)}
                      >
                        {formula.alcoholMatchCount +
                          formula.liquidMatchCount +
                          formula.glassMatchCount}{" "}
                        match
                      </Button>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Grid2>
          ))
        ) : (
          <Box className="no-results">
            <Typography variant="h6">No Formulas match your selection</Typography>
          </Box>
        )}
      </Grid2>

      {/* MODAL */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Matching Ingredients</DialogTitle>
        <DialogContent>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {selectedFormula &&
              getMatchingIngredients(selectedFormula).map((ingredient, index) => (
                <Chip key={index} label={ingredient.name || ingredient} />
              ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Results;
