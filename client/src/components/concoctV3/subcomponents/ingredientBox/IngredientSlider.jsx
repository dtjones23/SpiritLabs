import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    MenuItem,
    FormControl,
    Select
} from "@mui/material";
import ReactSlider from "react-slider";
import './ingredientSlider.css';
import { useGlobalContext } from "../../../../globalProvider.jsx";

const IngredientSlider = ( {sliderIndex, drinkData, type, setDrinkData} ) => {

    const [data, setData] = useState(drinkData)
    const [sliderValue, setSliderValue] = useState(drinkData[sliderIndex].sliderValue);
    const [quantity, setQuantity] = useState('');
    const [unitOfMeasure, setUnitOfMeasure] = useState(drinkData[sliderIndex].unit);
    const [altUnit, setAltUnit] = useState(drinkData[sliderIndex].altUnit);
    const {updateIngredientCategory} = useGlobalContext()

    // Sets initial states
    useEffect(() => {
        if (!drinkData) {
            return;
        } else {
            // const newValue = drinkData[sliderIndex].sliderValue;
            // const newUnit = drinkData[sliderIndex].unit;
            // const newAltUnit = drinkData[sliderIndex].altUnit;
    
            // setSliderValue(newValue);
            // setUnitOfMeasure(newUnit);
            // setAltUnit(newAltUnit);
    
        handleQuantity(sliderValue);
        }
    }, [])

    //Updates quanitity displays and parent state on slider change
    useEffect(() => {
        //console.log("This is the sliderValue",sliderValue

        //for SOME cursed reason, the slider value was getting changed? Even though it wasn't? So I put this 
        //Little IF statement in. Now the sliderValue ACTUALLY has to be different than the input data coming in
        //To cause a change to the global state.
        
        if (sliderValue !== drinkData[sliderIndex].sliderValue) {
            console.log("YOU ARE HITTING A SLIDER VALUE, GLOBAL UPDATE EMMINENT")
            handleQuantity(sliderValue);
            updateParent(sliderValue);
        }
    }, [sliderValue, unitOfMeasure])

    //Updates parent state with current slider values & unit
    function updateParent () {
        
        const updatedArr = [...data];
        console.log("Updating Parent", updatedArr)
        //console.log(updatedArr)

        //Again for some reason the objects do not come in as extensible. So I have
        //to add this condition to check that they are and make a shallow copy if not.
        
        if (!Object.isExtensible(updatedArr[sliderIndex])){
            updatedArr[sliderIndex] = {...updatedArr[sliderIndex]}
        }

        updatedArr[sliderIndex].sliderValue = sliderValue;
        updatedArr[sliderIndex].unit = unitOfMeasure;

        // if (quantity != 0) {
        //     updatedArr[sliderIndex].value = quantity;
        //     console.log("This is the NEW quantity",quantity,sliderIndex)
        // }

        updatedArr[sliderIndex].value = quantity;
        console.log("This is the NEW quantity",quantity,sliderIndex)


        updatedArr[sliderIndex].amount = `${updatedArr[sliderIndex].value} ${updatedArr[sliderIndex].unit}`


        console.log("This is the updatedArr", updatedArr)
        updateIngredientCategory(updatedArr, type)
        setDrinkData(updatedArr);
    };

    //Updates selected measurement unit
    const handleUnitChange = (event) => {
        setUnitOfMeasure(event.target.value);
    };

    //Updates quantity display based on unit
    const handleQuantity = (value) => {
        if (unitOfMeasure == 'oz') {
            //console.log(value)
            setQuantity(value*0.5);
        } else if (unitOfMeasure == 'ml') {
            setQuantity((value*30)*0.5);
        } else if (!value && value != 0) {
            setQuantity(1);
        } else {
            setQuantity(value);
        }
    };

    return (
    <>
    <Box className="sliderCard">
        <Box>
        </Box>
        <Box className="sliderContainer">
            <ReactSlider
            className="customSlider"
            thumbClassName="customSliderThumb"
            trackClassName="customSliderTrack"
            // markClassName="customSliderMark"
            marks={1}
            min={0}
            max={24}
            defaultValue={0}
            value={sliderValue}
            onChange={(value) => {
                const max = 10;
                if (value < max) {
                    setSliderValue(value);
                    handleQuantity(value);
                }
            }}
            />
        </Box>

        <Box className="valueContainer">
            <Typography className="sliderValue">{quantity}</Typography>
        </Box>
        {!unitOfMeasure == '' ? (
            <Box className='unitBox'>
                <FormControl size="small">
                <Select
                    value={unitOfMeasure}
                    onChange={handleUnitChange}
                >
                    <MenuItem value={'oz'}>oz</MenuItem>
                    <MenuItem value={'ml'}>ml</MenuItem>
                </Select>
                </FormControl>
            </Box>
        ):(
            <Box className='unitBox'>
                <Typography>{altUnit}</Typography>
            </Box> 
        )}
    </Box>
    </>

    );
};

export default IngredientSlider;