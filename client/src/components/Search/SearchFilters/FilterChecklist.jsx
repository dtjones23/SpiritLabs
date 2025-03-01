import React, { useState } from 'react';
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Drawer,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import './SearchFilters.css';

// This component is used to display the list of alcohol types that the user can select from. Users also have the ability to search for a specific alcohol type and select or deselect an option from the checklist within the drawer.
const FilterChecklist = ({
  options = [],
  handleCheckboxChange,
  selectedOptions = [],
  title = 'Select Filters',
  searchLabel = 'Search...',
  buttonColor = '#ff5500',
  drawerDirection = 'right',
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = [...new Set(options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  ))];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // delete filter chip
  const handleDelete = (option) => {
    handleCheckboxChange(option);
  };
  
  return (
    <Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          onClick={toggleDrawer(true)}
          variant="contained"
          sx={{
            fontSize: '1.2rem',
            padding: 10,
            margin: 2,
            backgroundColor: buttonColor,
            '&:hover': { backgroundColor: '#00bdd6' },
          }}
        >
          {title}
        </Button>
      </Box>
      <Drawer
        anchor={drawerDirection}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 390,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
            borderRadius: drawerDirection === 'right' ? '20px 0 0 20px' : '0 20px 20px 0',
            color: 'white',
            padding: 3,
          },
        }}
      >
        <Box role="presentation">
          <TextField
            fullWidth
            label={searchLabel}
            variant="outlined"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm ? (
                    <IconButton onClick={handleClearSearch}>
                      <ClearIcon sx={{ color: 'white' }} />
                    </IconButton>
                  ) : (
                    <SearchIcon sx={{ color: 'white' }} />
                  )}
                </InputAdornment>
              ),
              sx: {
                color: 'white',
                borderRadius: '10px',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)',
                '& fieldset': { border: 'none' },
              },
            }}
          />
          <Box mt={2}>
            <FormGroup>
              {filteredOptions
                .map(option => option)
                .sort()
                .map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        sx={{
                          color: 'white',
                          '&.Mui-checked': { color: '#0092d6' },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: 'white', fontSize: '1.2rem' }}>{option}</Typography>}
                  />
                ))}
            </FormGroup>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default FilterChecklist;
