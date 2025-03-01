import { useState, useEffect, useContext, useMemo } from 'react';
import { Collapse, Button, List, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Autocomplete, TextField } from '@mui/material';
import { Container, Box, ButtonGroup, IconButton, getFormControlLabelUtilityClasses } from '@mui/material';
import { GET_ALL_INGREDIENTS } from "../../../../utils/queries.js";
import { useQuery } from "@apollo/client";

function IngredientPopUp ({option, parameters, setPopUpState, setIngredientState, updateIngredientCategory, searchList}) {

    //const {loading, data, error} = useQuery(GET_ALL_INGREDIENTS);

    // useEffect(() => {

    //     if (!loading && data) {
    //         const ingredients = [];
    //         console.log(data)
    //         const formulas = data.formulas;
    //         formulas.forEach((el) => {
    //             const receipeVar = [el.alcohol, el.liquid, el.garnish];
    //             receipeVar.forEach((ingredientMat)=>{
    //                 ingredientMat.forEach((ingredient) => {
    //                     ingredients.push(ingredient)
    //                 })
    //             })
    //         })
    //         //This removes duplicates while preserving the objects (we will probably need these later as objects)
    //         const ingredientMap = new Map();
    //         ingredients.forEach((ingredient) => {
    //             if (!ingredientMap.has(ingredient.name)) {
    //                 ingredientMap.set(ingredient.name, ingredient);
    //             }
    //         });
    //         const uniqueIngredients = Array.from(ingredientMap.values());
    //         const newLocalState = {...localState}

    //         newLocalState.ingredients = uniqueIngredients;
    //         console.log(uniqueIngredients)
    //         setLocalState(newLocalState)
    //     }
    // }, [loading, data])


    // return (
    //     <>
    //         { 
    //             (option === "Add") ? (
    //                 <IngredientAdd 
    //                     parameters = {parameters} 
    //                     setPopUpState = {setPopUpState}
    //                     setIngredientState = {setIngredientState}
    //                     updateIngredientCategory = {updateIngredientCategory}
    //                     searchList = {searchList}
    //                 />
    //             ) : (
    //                 <IngredientEdit
    //                     parameters = {parameters} 
    //                     setPopUpState = {setPopUpState}
    //                     setIngredientState = {setIngredientState}
    //                     updateIngredientCategory = {updateIngredientCategory}
    //                     searchList = {searchList} 
    //                 />
    //             )
    //         }
    //     </>
        
    // )

    const [open, setOpen] = useState(true);
    const [localState, setLocalState] = useState({});

    console.log(searchList.searchList)

    const handleClose = () => {
    setOpen(false);
    setPopUpState(false);
    };

    function handleAddition(name) {
        
        const newArray = [...parameters.state];
        newArray.push(
            {
                _typename: "Ingredient",
                name:name,
                amount:"0.5 oz",
                technique:"",
                sliderValue : 1,
                value : 0.5,
                unit :"oz",
                altUnit : ""
            });

        console.log("This is the New Array", newArray)
        setIngredientState(newArray)
        //buildDrinkData(newArray)
        updateIngredientCategory (newArray, parameters.type)
    }

    function handleEdit (name) {
        const newArray = [...parameters.state];
        const oldIndex = `${newArray[parameters.index]}`
        const oldValues = {
            amount:newArray[parameters.index].amount,
            sliderValue: newArray[parameters.index].sliderValue, 
            value:newArray[parameters.index].value,
            unit:newArray[parameters.index].unit
        };
        console.log("These are the old values", oldValues)
        newArray[parameters.index] = {
            _typename: "Ingredient",
            name:name,
            amount:oldValues.amount,
            technique:"",
            sliderValue : oldValues.sliderValue,
            value : oldValues.value,
            unit :oldValues.unit,
            altUnit : ""
        }
        console.log("This is the New Array", newArray)
        setIngredientState(newArray)
        //buildDrinkData(newArray)
        updateIngredientCategory (newArray, parameters.type)
    }

    const searchTerms = searchList.searchList.map((e) => {
        return e.name
    })

    // console.log(searchList)
    // console.log(searchTerms)

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                if (option === "Add") {
                    handleAddition(localState);
                }
                else {
                    handleEdit(localState)
                }
                handleClose();
              },
            }}>
    
            <DialogTitle>Choose a New Ingredient</DialogTitle>
            <DialogContent>
    
                <DialogContentText>
                
                </DialogContentText>
                {
                    (option === "Add") ? (
                        <Autocomplete
                        disablePortal
                        id="combo-box"
                        options={searchTerms}
                        sx={{ width: "330px" }}
                        onChange={(event, value) => setLocalState(value)}
                        renderInput={(params) => (
                            <TextField {...params} />
                        )}
                        />
                    ) : (
                        <Autocomplete
                        disablePortal
                        id="combo-box"
                        options={searchTerms}
                        sx={{ width: "330px" }}
                        defaultValue={parameters.ingredient}
                        onChange={(event, value) => setLocalState(value)}
                        renderInput={(params) => (
                            <TextField {...params} />
                        )}
                        />
                    )
                }

                <DialogActions>
                    
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Confirm</Button>
                </DialogActions>
    
            </DialogContent>
    
        </Dialog>
    )

}



export default IngredientPopUp ;
