import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_FORMULAS} from '../utils/queries';
import { useNavigate, useLocation } from 'react-router-dom';
// import { Box, Grid2, Typography, IconButton, CircularProgress, Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import { useGlobalContext } from '../globalProvider.jsx';
import FilterChecklist from '../components/Search/SearchFilters/FilterChecklist.jsx';

function Search33() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setGlobalState } = useGlobalContext();

  const [searchOptions, setSearchOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formulas, setFormulas] = useState([]);
  const [selectedAlcoholTypes, setSelectedAlcoholTypes] = useState(location.state?.selectedAlcoholTypes || []);
  const [selectedLiquidTypes, setSelectedLiquidTypes] = useState(location.state?.selectedLiquidTypes || []);
  const [selectedGlassTypes, setSelectedGlassTypes] = useState(location.state?.selectedGlassTypes || []);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [gimmeDrinksClicked, setGimmeDrinksClicked] = useState(false);

  const { loading: queryLoading, data } = useQuery(GET_ALL_FORMULAS);

  //const queryFormula = useQuery(GET_ALL_FORMULAS);

  // this will populate the searchOptions array with all the ingredients and will remove any duplicates
  useEffect(() => {
    if (!queryLoading && data) {
      const formulaArray = data.formulas;
      // const allGlassTypes = data.formulas.map((formula) => formula.glass);
      const ingredients = formulaArray.flatMap((formula) =>
        [...formula.alcohol, ...formula.liquid].map(
          (element) => element.name
        )
      );
      setSearchOptions([...new Set([ingredients].flat())]);
    }
  }, [queryLoading, data]);

  // this will filter the formulas based on the search term and will display the formulas that match the search term
  // this is what is seen in the search bar when the user types
  useEffect(() => {
    if (searchTerm) {
      const filteredFormulas = data.formulas.filter(
        (formula) =>
          formula.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFormulas(filteredFormulas.slice(0, 6));
    } else {
      setFormulas([]);
    }
  }, [searchTerm, data]);

  // we standby until the user clicks a formula and then we navigate to the description page with the formula as STATE
  const handleSetChoice = (choice) => {
    const formulaMatch = data.formulas.find((formula) => formula.name === choice);
    if (formulaMatch) {
      setGlobalState(prevState => ({
        ...prevState,
        formula: formulaMatch,
      }));
      navigate("/description", { state: { formula: formulaMatch } });
    } else {
      console.error(`Formula '${choice}' not found.`);
    }
  };

  const handleCheckboxChange = (option, type) => {
    if (type === 'alcohol') {
      setSelectedAlcoholTypes((prev) => {
        const newSelection = prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option];
        return newSelection;
      });
    } else if (type === 'liquid') {
      setSelectedLiquidTypes((prev) => {
        const newSelection = prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option];
        return newSelection;
      });
    } else if (type === 'glass') {
      setSelectedGlassTypes((prev) => {
        return prev.includes(option) ? [] : [option];
      });
    }
  };

  // conditionally rendering the results page based on the types for alcohol and liquid (mixers)
  const handleApplySelections = () => {
    if (selectedAlcoholTypes.length === 0 && selectedLiquidTypes.length === 0 && selectedGlassTypes.length === 0) {
      setGimmeDrinksClicked(true);
    } else {
      navigate('/results', { state: { selectedAlcoholTypes, selectedLiquidTypes, selectedGlassTypes } });
    }
  };

  // this simply removes all the chips (little blue tags from user selection) 
  const handleClearSelections = () => {
    setSelectedAlcoholTypes([]);
    setSelectedLiquidTypes([]);
    setSelectedGlassTypes([]);
  };

  // we are clearing the search term and formulas when the user clicks the clear button
  const handleClearFormulas = () => {
    setSearchTerm('');
    setFormulas([]);
  };

  // if a user tries to click gimme drinks and have not input any selections, we show a message for 3 seconds
  // we don't need to keep this, just thought it was something to boost the user experience 
  // Abe will likely cook up some better
  // But for now, this is what we have
  useEffect(() => {
    if (gimmeDrinksClicked) {
      const timer = setTimeout(() => {
        setGimmeDrinksClicked(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gimmeDrinksClicked]);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" sx={{ color: "#ff5722", mb: 2, textAlign: "center" }}>
        🍹 Lets Find You That Drink!  
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={1}
        p={1}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: "80%",
          margin: "0 auto"
        }}
      >
        <TextField
          label="Search for drinks by name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          fullWidth
          sx={{
            backgroundColor: "white",
            borderRadius: "4px",
            color: "black",
            '& .MuiInputLabel-root': {
              color: 'black',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            },
            '& .MuiOutlinedInput-root': {
              color: 'black',
            },
          }}
        />
        {isSearchFocused && (
          <IconButton onClick={handleClearFormulas} sx={{ ml: 1, color: 'red' }}>
            <CloseIcon sx={{ fontSize: 40 }} />
          </IconButton>
        )}
      </Box>

      <Box display="flex" justifyContent="center">
        {queryLoading ? (
          <CircularProgress />
        ) : (
          <div>
            <Grid2 container spacing={1} justifyContent="center">
  {formulas.map((formula, index) => (
    <Grid2 key={index}>
      <Button
        variant="contained"
        onClick={() => handleSetChoice(formula.name)}
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '200px',
          padding: 2,
          backgroundColor: 'primary.main', // Optional: Adjust background color if needed
          boxShadow: 3,
          borderRadius: '20px',
          textTransform: 'none', // Optional: To prevent text from being uppercased
          '&:hover': { backgroundColor: 'primary.dark' }, // Optional: Adjust hover color if needed
        }}
      >
        {/* <Box
          sx={{
            width: '100px',
            height: '100px',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            borderRadius: '20px',
            backgroundImage: `
              url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.jpeg'),
              url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.webp'),
              url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.png')
            `,
          }}
        /> */}
        <Typography variant="button" >
          {formula.name}
        </Typography>
      </Button>
    </Grid2>
  ))}
</Grid2>

            <>
  <Box display="flex" alignItems="center" justifyContent="center">
    <FilterChecklist
      title="Select Alcohol(s)"
      searchLabel={'Search Alcohol'}
      options={searchOptions.filter((option) =>
        data.formulas.some((formula) =>
          formula.alcohol.some((alcohol) => alcohol.name === option)
        )
      )}
      handleCheckboxChange={(option) => handleCheckboxChange(option, 'alcohol')}
      selectedOptions={selectedAlcoholTypes}
      buttonColor="#d60000" 
      drawerDirection='left'
    />
    <FilterChecklist
      title="Select Mixer(s)"
      searchLabel={'Search Mixers'}
      options={searchOptions.filter((option) =>
        data.formulas.some((formula) =>
          formula.liquid.some((liquid) => liquid.name === option)
        )
      )}
      handleCheckboxChange={(option) => handleCheckboxChange(option, 'liquid')}
      selectedOptions={selectedLiquidTypes}
      buttonColor={'#ffe605'}
    />
  </Box>
  
  <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={2} width="100%">
    <Box bgcolor="white" p={2} borderRadius={2} boxShadow={3} width="50%">
      <Typography variant="h6" alignItems="center" gutterBottom sx={{ color: "black", textAlign: "center" }}>
        Selected Filters:
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center" width="100%">
        {selectedAlcoholTypes.map((option, index) => (
          <Chip
            key={index}
            label={option}
            onClick={() => handleCheckboxChange(option, 'alcohol')}
            sx={{
              margin: "5px",
              padding: '10px',
              backgroundColor: '#d60000',
              color: 'white',
              fontSize: "1rem",
              borderRadius: '5px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#6b6b6b' }
            }}
          />
        ))}
        {selectedLiquidTypes.map((option, index) => (
          <Chip
            key={index}
            label={option}
            onClick={() => handleCheckboxChange(option, 'liquid')}
            sx={{
              margin: "5px",
              padding: '10px',
              backgroundColor: '#d6c400',
              color: 'white',
              fontSize: "1rem",
              borderRadius: '5px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#6b6b6b' }
            }}
          />
        ))}
      </Box>
    </Box>
  </Box>
  
  <Box display="flex" justifyContent="center" mt={2} mb={4}>
    <Button
      variant="contained"
      onClick={handleApplySelections}
      sx={{ padding: '25px', backgroundColor: '#0092d6', color: 'black', fontSize: "1.2rem", '&:hover': { backgroundColor: 'primary.dark' } }}
    >
      Gimme Drinks
    </Button>
    <Button
      variant="outlined"
      onClick={handleClearSelections}
      sx={{ ml: 2, padding: '25px', backgroundColor: '#7aff52', color: 'black', fontSize: "1.2rem", '&:hover': { backgroundColor: '#8ccf77' } }}
    >
      Clear Selections
    </Button>
  </Box>
  
  {gimmeDrinksClicked && (
    <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
      <Typography variant="h6">Gotta Select Something First Bruh</Typography>
    </Box>
  )}
</>

          </div>
        )}
      </Box>
    </Box>
  );
}

export default Search33;
