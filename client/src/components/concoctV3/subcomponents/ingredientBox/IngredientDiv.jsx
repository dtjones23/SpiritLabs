import { useState, useEffect, useContext, useMemo} from 'react';

import { useGlobalContext } from "../../../../globalProvider.jsx";

// import IngredientBox from './IngredientBox'
// import IngredientList from './IngredientList';


import {Collapse, Button, List} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';

import { Container, Box, ButtonGroup, IconButton, getFormControlLabelUtilityClasses } from '@mui/material';
// import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import IngredientSlider from './IngredientSlider'
import IngredientPopUp from '../ingredientPopUp/IngredientPopUp.jsx';



const IngredientDiv = ({ingredients, type, index, searchList }) => {
    
    const [open, setOpen] = useState(false);
    const [popUpState, setPopUpState] = useState({toggle : false})
    const [ingredientState, setIngredientState] = useState([])
    const {updateIngredientCategory} = useGlobalContext()

    useEffect (() => {
        if (ingredients.length !== 0) {
            setIngredientState(ingredients)
        }
    }, [])

    function handleAddition(type) {
        setPopUpState({
            toggle:true,
            option: "Add",
            parameters: {
                type: type,
                state: ingredientState
            }
        })
    }

    function handleEdit(type,ingredient, index) {
        setPopUpState({
            toggle:true,
            option: "Edit",
            parameters: {
                type: type,
                ingredient: ingredient,
                index: index,
                state: ingredientState
            }
        })
    }

    function handleDeletion (matrixindex) {

        const stringArray = matrixindex.split(" ")
        console.log(stringArray)
        const matrix = stringArray[0];
        const indexNum = parseInt(stringArray[1]) 
        const newArray = [...ingredientState];
        const deletedElement = newArray.splice(indexNum,1);
        console.log("This is the Deleted Ingredient", deletedElement)
        setIngredientState(newArray)
        //buildDrinkData(newArray)
        updateIngredientCategory (newArray, matrix)
    }

    const listRender = useMemo(() => {
        //console.log(ingredientState.length > 0);
        if (ingredientState.length > 0){
            return ingredientState.map((ingredient, index) => {
                console.log(ingredient)
                return (
                    <Box key={index}>
                        <Box className="ingredientHeader">
                            <Box className="ingredientTitle">
                                <Typography>{`${ingredient.name[0].toUpperCase() + ingredient.name.slice(1)}`}</Typography>
                            </Box>
                            <ButtonGroup variant="contained" className="titleButtons">
                                <Button id = {`${type} ${index}`} onClick={() => handleEdit(`${type}`,`${ingredient.name[0].toUpperCase() + ingredient.name.slice(1)}`, index)}><EditIcon fontSize="small" /></Button>
                                <Button id = {`${type} ${index}`} onClick={() => handleDeletion(`${type} ${index}`)}><DeleteIcon fontSize="small" /></Button>
                            </ButtonGroup>
                        </Box>
                        
                        <Box className="ingredientContainer">
                            <IngredientSlider
                                sliderIndex={index}
                                type = {type}
                                drinkData= {ingredientState}
                                setDrinkData={setIngredientState}
                            />
                        </Box>
                    </Box>
                );
            });
        } else {
            return null
        }

    }, [ingredientState]);

    const toggleCollapse = (newOpen) => {
        setOpen(newOpen);
        //console.log(newOpen)
      };

    function icon () {
        if (open === true) {
            return <KeyboardDoubleArrowUpIcon />
        } else {
            return <KeyboardDoubleArrowDownIcon />
            }
        }

    return (
        <>
            <Button  onClick={() => toggleCollapse(!open)} endIcon={icon()} >{type}</Button>
            <Collapse in = {open} key = {type} index = {index}>
                {ingredientState.length > 0 ? listRender : (<></>)}
                {popUpState.toggle ? 
                    <IngredientPopUp 
                        option = {popUpState.option}
                        parameters = {popUpState.parameters}
                        setPopUpState = {setPopUpState}
                        setIngredientState = {setIngredientState}
                        updateIngredientCategory = {updateIngredientCategory}
                        searchList = {searchList}
                    /> 
                :   
                    <></>
                }
                <Button size="small" onClick={() => handleAddition(type)} endIcon = {<AddIcon />}></Button>
            </Collapse>
        </> 
        
    )
}

export default IngredientDiv;