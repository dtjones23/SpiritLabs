import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircleIcon from '@mui/icons-material/Circle';
import { Box, Container } from '@mui/material';


const DrinkVisualizer = ({ props, colors, cookState }) => {

    const [ingredients, setIngredients] = useState([]);
    const [ingredientHeights, setIngredientHeights] = useState([]);
    const [cooking, setCooking] = useState([cookState])

    //Populate ingredients/heights arrays
    useEffect(() => {
        console.log(props)
        props.alcohol.map((el) => {
            const ingredient = parseInt(el.amount.match(/\d+/g));
            const height = ingredient * 15
            setIngredients(ingredients => [...ingredients, ingredient]);
            setIngredientHeights(ingredientHeights => [...ingredientHeights, height]);
        })

        props.liquid.map((el) => {
            const ingredient = parseInt(el.amount.match(/\d+/g));
            const height = ingredient * 15
            setIngredients(ingredients => [...ingredients, ingredient]);
            setIngredientHeights(ingredientHeights => [...ingredientHeights, height]);
        })
    }, [cooking]);

    // console.log(ingredients);
    // console.log(ingredientHeights);
    // console.log(colors);
    // console.log(cookState)

    // Calculate y-coordinates for each ingredient rectangle
    const ingredientY = ingredientHeights.map((height, index) => {
        const sumOfPreviousHeights = ingredientHeights.slice(0, index).reduce((acc, curr) => acc + curr, 0);
        return 190 - sumOfPreviousHeights - height;
      });

    const rectangleMap = ingredients.map((el, index) => {
        return (
            <rect key={`rectangle-${index}`} x="10" y={ingredientY[index]} width="130" height={ingredientHeights[index]} fill={colors[index]} />
    )})

    // SVG styles
    const beakerStyle = {
        stroke: '#ffffff',
        strokeWidth: '2px',
        fill: 'none'
      };

  return (
    <>
        {/* BEAKER UI */}
        <svg width="150" height="200">
            {/* BEAKER */}
            <rect x="0" y="0" width="150" height="200" style={beakerStyle} />
            {/* Ingredients */}
            { rectangleMap }
        </svg>
    </>
  );
}

export default DrinkVisualizer;