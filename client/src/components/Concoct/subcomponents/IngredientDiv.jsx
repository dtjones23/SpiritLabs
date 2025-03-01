import { useState, useEffect, useContext} from 'react';
import NeighborContext from '../../../utils/neighborContext';
import GlobalContext from '../../../utils/globalContext';

import IngredientBox from './IngredientBox'
import IngredientList from './IngredientList';

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Container, Box, ButtonGroup, IconButton, getFormControlLabelUtilityClasses } from '@mui/material';
// import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete'



const IngredientDiv = ({ props, colors, cookState, ingredientMatrix, ingredientType, index  }) => {

    //console.log(props, ingredientMatrix, ingredientType)
    
    const { globalState, setGlobalState} = useContext(GlobalContext);

    function handleDelete ( element, index, index2, matrix) {

        // the array alcohol,liquid,garnish is the 1st index
        // the place in that array is the 2nd index
        
        console.log("Delete this", element, index, index2, matrix);
        const newStateObject = {...globalState};
        const newArray = [...newStateObject[matrix]];
        
        //We have to tell the splice function where to start and how many things to delete
        newArray.splice(index2, 1);
        newStateObject[matrix] = newArray;
        console.log(newArray)
        setGlobalState(newStateObject)
        // setlocalState(newStateObject)
    
        // CHECK THE SLICE FUNCTION. DOES IT KILL EVERYTHING BEYOND THE POINT?
    }
    
    function handleAddition(matrix) {
        const newStateObject = {...globalState};
        const newArray = [...newStateObject[matrix]];
        newArray.push(
            {
                name:"",
                amount:"",
                technique:"",
                _typename: "Ingredient"
            });
        newStateObject[matrix] = newArray;
        console.log("Adding a New Row", newArray)
        console.log("Adding a New Row", newStateObject)
        setGlobalState(newStateObject)
        // setlocalState(newStateObject)
    }

    function setTitle (type) {
        if (type === "liquid") {
            return ("Mixers")
        } else if (type === "alcohol") {
            return ("Alcohols")
        } else
            return ("Garnishes")
    }

    const ingredientBoxes = ingredientMatrix.map((element, index2) => (
        <>
            <IngredientBox props = {props} element = {element} index = {index} index2 = {index2} colors = {colors} cookState = {cookState} ingredientType = {ingredientType}/>
            {cookState ? (
            <IconButton onClick={(event) => handleDelete(element, index, index2, ingredientType)} aria-label="delete">
                <DeleteIcon />
            </IconButton>
            ) : (null)}
        </>
    ))    

    const ingredientTitle = setTitle(ingredientType)

    return (
        <>
        {cookState ? (
            <Container>
                <CardActions>
                    <Button size="small" onClick={() => handleAddition(ingredientType)}>+ Add Mixer</Button>
                </CardActions>
            </Container>
        ) : (null)}

        <Typography variant="h7" color="text.secondary">{ingredientTitle}</Typography>
                <>
                {ingredientBoxes}
                </>
                
            <br/><br/>
        </>
        
    )
}

export default IngredientDiv;