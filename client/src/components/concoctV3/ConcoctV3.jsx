import { useState, useContext, useEffect, useMemo, useDebugValue } from "react";
import { useQuery } from "@apollo/client";
import { ButtonGroup, Divider, Drawer} from "@mui/material";

import IngredientDiv from "./subcomponents/ingredientBox/IngredientDiv";
import DrinkSVG from "./subcomponents/drinkSVG/DrinkSVG.jsx";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CircleIcon from '@mui/icons-material/Circle';
import { Box, Container } from '@mui/material';


import './drinkRenderer.css';
import { useGlobalContext } from "../../globalProvider.jsx";
import { GET_ALL_INGREDIENTS, GET_ALL_GLASSES  } from "../../utils/queries.js"

const ConcoctV3 = () => {

    const { globalState, setGlobalState } = useGlobalContext();
    const [localState, setLocalState] = useState({});

    const {loading: formulaLoading, data: formulaData, error} = useQuery(GET_ALL_INGREDIENTS);
    const {loading: glassLoading, data: glassData} = useQuery(GET_ALL_GLASSES);

    //const data = queryFormula.data || queryGlass.data;
    // queryLoading = queryFormula.queryLoading || queryGlass.queryLoading;
  
    useEffect (() => {
      if (!glassLoading && glassData) {
        console.log("Glasses are loaded", glassData);
      }
    }, [glassLoading, glassData]);

    useEffect (() => {
        console.log("Setting Local State", localState)
    }, [localState]);

    useEffect (() => {
        console.log("YOU UPDATED THE GLOBAL STATE", globalState);
    }, [globalState])

    useEffect (()=>{

        async function tuneGlobalState () {

            if (!formulaLoading && !glassLoading && formulaData && glassData) {

                //This sets the local state baseond on the global state for the fist time.
                if (Object.keys(localState).length < 1) {
    
                    //this calls all the known ingredients from the database ONE time.
                    const assembleSearchList = () => {
                        const ingredients = [];
                        //console.log(data)
                        const formulas = formulaData.formulas;
                        formulas.forEach((el) => {
                            const receipeVar = [el.alcohol, el.liquid, el.garnish];
                            receipeVar.forEach((ingredientMat)=>{
                                ingredientMat.forEach((ingredient) => {
                                    ingredients.push(ingredient)
                                })
                            })
                        })
                        //This removes duplicates while preserving the objects (we will probably need these later as objects)
                        const ingredientMap = new Map();
                        ingredients.forEach((ingredient) => {
                            if (!ingredientMap.has(ingredient.name)) {
                                ingredientMap.set(ingredient.name, ingredient);
                            }
                        });
                        const uniqueIngredients = Array.from(ingredientMap.values());
                        const newLocalState = {...localState}
            
                        newLocalState.searchList = uniqueIngredients;
                        //console.log(uniqueIngredients)
                        return newLocalState
                    }
    
                    const assembleFormula = async () => {
                        console.log("Creating a Deep Copy of the Global State")
                        const formulaObject = JSON.parse(JSON.stringify(globalState))
                        //console.log(Object.isExtensible(formulaObject),formulaObject)
    
                        formulaObject.alcohol.forEach(e => {
                            buildDrinkData(e);
                        });
                        formulaObject.liquid.forEach(e => {
                            buildDrinkData(e);
                        });
                        formulaObject.garnish.forEach(e => {
                            buildDrinkData(e);
                        });
                        //console.log(formulaObject)
                        return formulaObject
                    };
    
                    const buildDrinkData = (data) => {
    
                        //for some reason data is not registering as extinsible on the first pass
                        // So I am going to make a DEEP copy of it and return that.
    
    
                        // console.log("Extensible?", Object.isExtensible(data))
    
                        // if (!Object.isExtensible(data)){
                        //     data = {...data}
                        // }
    
                        const newUnit = data.amount.match(/[a-zA-Z]+/);
                        const newQty = Number(data.amount.match(/[0-9_.-]+/));
    
                        //console.log(data, Object.isExtensible(data), newQty)
    
                        let sliderValue = 0;
                        let value = 0;
                        let unit = '';
                        let altUnit = '';
                        
                        // Set unitOfMeasure + sliderValue
                        if (newUnit == 'oz') {
                            unit = 'oz';
                            sliderValue = newQty*2;
                            value = newQty;
                        } else if (newUnit == 'ml') {
                            unit = 'ml';
                            sliderValue = (newQty/30)*2;
                            value = newQty;
                        } else if (newUnit == null) {
                            unit = '';
                            sliderValue = newQty;
                            value = newQty;
                        } else {
                            unit = ''
                            altUnit = `${newUnit}`;
                        }
            
                        if (newQty == 0) {
                            sliderValue = 1;
                            value = 1;
                        }
                
                        data.sliderValue = sliderValue;
                        data.value =value;
                        data.unit = unit;
                        data.altUnit = altUnit;
    
                        //console.log("This is the new data", data)
                        return data
                    };

                    const newFormula = await assembleFormula();

                    setLocalState ({
                        formula: newFormula,
                        searchList: assembleSearchList(),
                        glasses:glassData,
                        ready:true
                    })
                };
            }  
        }

        tuneGlobalState()
    }, [formulaLoading, glassLoading, formulaData, glassData]);


    const ingredientRender = useMemo(() => {
        if (localState.ready === true){
            const renderObject = {...localState.formula};

            const receipeVar = {
                matrix:[renderObject.alcohol, renderObject.liquid, renderObject.garnish],
                keys:["alcohol","liquid","garnish"]
            }

            console.log("Rendering Ingredients")
            console.log ("This is the formula we are looking at", receipeVar)

            return receipeVar.matrix.map((ingredientMatrix,index) => {
                //console.log("BlockRender")
                    return (
                            // {/* <IngredientDiv ingredients={ingredientMatrix} type={receipeVar.keys[index]} index = {index} localState = {localState} setLocalState = {setLocalState}/> */}
                            <IngredientDiv key = {`${receipeVar.keys[index]}-${index}`} ingredients={ingredientMatrix} type={receipeVar.keys[index]} index = {index} searchList = {localState.searchList}/>
            
                    )
            })
        } else {
            return (console.log("Loading ingredients"))
        }
    },[localState.formula]) 

    function titleRender () {
        if (localState.ready === true) {
            const renderObject = { ...localState.formula };
            console.log("Rendering the Title - ", renderObject.name);

            return (
                <Typography variant="h5" component="div" gutterBottom sx={{ borderBottom: "solid 2px #2c2c2c", p: "8px" }}>
                    <strong>{renderObject.name}</strong>
                </Typography>
            );
        } else {
            console.log("Loading Title");
            return null;
        }
    }
    
    return (

        <>
            {
                localState.ready === true? 
                <>
                    <Card variant="outlined" sx={{mb: "24px"}}>
                        <CardContent> {titleRender()}</CardContent>
                        {ingredientRender}
                    </Card>
                        <DrinkSVG drinkData={globalState} glassData = {localState.glasses}/>
                </> : <></>
            }
        </>
       
    )
}

export default ConcoctV3;