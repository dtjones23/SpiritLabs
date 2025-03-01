import { useState, useEffect } from "react";

import {
    Box,
    Button,
    Divider,
    IconButton,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import '../../../concoct.css';

const IngredientHeader = ( { sliderIndex, drinkData, setDrinkData } ) => {

    const [editName, setEditName] = useState(false);
    const [nameValue, setNameValue] = useState('');

    // Sets initial ingredient name
    useEffect(() => {
        if (!drinkData[sliderIndex]) {
            setNameValue('Error: No Value')
            return;
        } else {
            setNameValue(drinkData[sliderIndex].name.toUpperCase())
        }
    }, [drinkData])

    const handleNameEdit = () => {
        setEditName(!editName);
    }

    const handleNameSave = (name) => {
        const updatedArr = [...drinkData];
        updatedArr[sliderIndex].name = nameValue;
        setDrinkData(updatedArr);

        setEditName(!editName);
    }

    const handleDelete = () => {
        const drinkArr = [...drinkData];
        const newArr = [];
        
        for (let i = 0; i < drinkArr.length; i++) {
            if (i !== sliderIndex) {
                newArr.push(drinkArr[i]);
            }
        }
        console.log(newArr);
        setDrinkData(newArr);
        
    }

    return (
    <>
        <Paper 
            className="ingredientHeader"
            elevation={2}
            sx={{
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '0px',
            }}
        >

            {editName ? (
                <TextField
                    variant="standard"
                    size="small"
                    color="primary"
                    fullWidth
                    sx={{
                        pl: '4pt'
                    }}
                    defaultValue={
                        `${nameValue}`
                    }
                    onChange={(e) => {
                        setNameValue(e.target.value);
                      }}
                    onSubmit={handleNameSave}
                />
            ):(
                <Typography variant='h6' className="ingredientTitle">
                    {nameValue}
                </Typography>
            )}
            <Box className='buttonBox'>
                {!editName ? (
                    <IconButton
                        variant="contained"
                        sx={{
                            color: 'white',
                            backgroundColor: 'var(--main-grey-dark)',
                            ml: '4pt'
                        }}
                        onClick={handleNameEdit}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                ):(
                    <IconButton
                        variant="contained"
                        sx={{
                            color: 'white',
                            backgroundColor: 'var(--main-color-darker)',
                            ml: '4pt'
                        }}
                        onClick={handleNameSave}
                    >
                        <SaveIcon fontSize="small" />
                    </IconButton>
                )}
                
                <IconButton
                    variant="contained"
                    sx={{
                        color: '#e53935',
                        backgroundColor: 'var(--main-grey-dark)',
                        ml: '4pt',
                        mr: '4pt'
                    }}
                    onClick={handleDelete}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </Paper>
    </>
    );
};

export default IngredientHeader;