import { useState, useEffect, useContext} from 'react';
import NeighborContext from '../../../utils/neighborContext';
import GlobalContext from '../../../utils/globalContext';

import IngredientBox from './IngredientBox'
import IngredientDiv from './IngredientDiv'

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Container, Box, ButtonGroup, IconButton, getFormControlLabelUtilityClasses } from '@mui/material';
// import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete'
// import { styled } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';


// This props gets to be the GLOBAL State if Concoct is rendering the element
// OR this props gets to be the NEIGHBOR State if Cook is rendering the element.
// This is a SUPER important Detail.

const IngredientList = ({ props, colors, cookState }) => {
    //console.log("This is the Ingredient Prop", props)

    const { globalState, setGlobalState} = useContext(GlobalContext);
    const receipeVar= {
        matrix:[globalState.alcohol, globalState.liquid, globalState.garnish],
        keys:["alcohol","liquid","garnish"]
    }

    const renderElements = receipeVar.matrix.map((ingredientmMatrix,index) => {
        //console.log("This is the matrix we are looking at", receipeVar.keys[index])
        
        return (
            <IngredientDiv props = {props} ingredientMatrix = {ingredientmMatrix} ingredientType = {receipeVar.keys[index]} index = {index} cookState = {cookState} colors = {colors}/>
        )
    })


  return (
        <>
            <Container sx={{textAlign: "left", mb: "8px"}}>
            {renderElements}
            </Container>
        </>
  );
}

export default IngredientList;