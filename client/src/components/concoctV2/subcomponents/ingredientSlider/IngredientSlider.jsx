import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    MenuItem,
    FormControl,
    Select
} from "@mui/material";

import ReactSlider from "react-slider";
import IngredientHeader from "./subcomponents/IngredientHeader";

import './ingredientSlider.css';

const IngredientSlider = ( { sliderIndex, drinkData, setDrinkData } ) => {

    const [sliderValue, setSliderValue] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [unitOfMeasure, setUnitOfMeasure] = useState('');
    const [altUnit, setAltUnit] = useState('');

    // Sets initial states
    useEffect(() => {
        if (!drinkData) {
            return;
        } else {
            const newValue = drinkData[sliderIndex].sliderValue;
            const newUnit = drinkData[sliderIndex].unit;
            const newAltUnit = drinkData[sliderIndex].altUnit;
    
            setSliderValue(newValue);
            setUnitOfMeasure(newUnit);
            setAltUnit(newAltUnit);
    
            handleQuantity(sliderValue);
        }
    }, [])

    //Updates quanitity displays and parent state on slider change
    useEffect(() => {
        handleQuantity(sliderValue);
        updateParent(sliderValue);
    }, [sliderValue, unitOfMeasure])

    //Updates parent state with current slider values & unit
    const updateParent = () => {
        const updatedArr = [...drinkData];
        updatedArr[sliderIndex].sliderValue = sliderValue;
        updatedArr[sliderIndex].unit = unitOfMeasure;
        if (quantity != 0) {
            updatedArr[sliderIndex].value = quantity;
        }
        setDrinkData(updatedArr);
    };

    //Updates selected measurement unit
    const handleUnitChange = (event) => {
        setUnitOfMeasure(event.target.value);
    };

    //Updates quantity display based on unit
    const handleQuantity = (value) => {
        if (unitOfMeasure == 'oz') {
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
        <IngredientHeader drinkData={drinkData} setDrinkData={setDrinkData} sliderIndex={sliderIndex} />
        <Box className="sliderCard">
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
                    setSliderValue(value);
                    handleQuantity(value);
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