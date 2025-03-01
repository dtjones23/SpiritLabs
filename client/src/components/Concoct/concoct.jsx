import { useState, useEffect, useContext } from 'react';
import GlobalContext from '../../utils/globalContext';
import NeighborContext from '../../utils/neighborContext';

import IngredientList from './subcomponents/IngredientList';
import DrinkVisualizer from './subcomponents/DrinkVisualizer';
import CommercialBox from './subcomponents/CommercialBox';

import Cook from './Cook'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircleIcon from '@mui/icons-material/Circle';
import { Box, Container } from '@mui/material';


//props is the GLOBAL STATE and it's object
const Concoct = ({ props }) => {

    const { globalState, setGlobalState } = useContext(GlobalContext);
    const { neighborState, setNeighborState} = useContext(NeighborContext);

    const [ingredientColors, setIngredientColors] = useState([]);
    const [cooking,setCooking] = useState(false)

// When you load up, set the Neighborhood Context to the Global Context
    useEffect(() => {
      setNeighborState(globalState)
    },[])

    //Generate values for ingredient colors
    useEffect(() => {
        for (let i = 0; i < 7; i++) {
            const hex = randomHex();
            setIngredientColors(ingredientColors => [...ingredientColors, hex]);
        }
    }, [])
    // console.log(ingredientColors);

    const randomHex = () => {
        const char = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += char[Math.floor(Math.random() * 16)];
        }
        return color;
    }

   
    function handleChangeCooking () {
    //Renders the cooking page
    // When you hit the modify button to cook, then you set the
    //neighborhood context to the global context. This should not 
    //cause a rerender inherently (the change in cooking does)
      // setNeighborState(globalState);
      setCooking(!cooking)
    }

    function handleSaveCooking () {
      //Renders the concoct page immobile again. This time you change the 
      //Global Context. This rerenders the entire concoct page because the 
      //neighborhood context and provider gets FED the global context IN the provider.

      // setGlobalState(neighborState);
      setCooking(!cooking)
    }
    

  return (
      <>
      <Card variant="outlined" sx={{mb: "24px"}}>
        {/* DRINK NAME */}
        <CardContent>
            <Typography variant="h5" component="div" gutterBottom sx={{borderBottom: "solid 2px #2c2c2c", p: "8px"}}> <strong>{props.name}</strong> </Typography>
        </CardContent>
        
        {/* Cooking is a Toggle ON OFF Boolean. Ingredient colors is an array that is a STATE variable. It's local
        WHENEVER we change the neighborState, we have to rerender COOK we are feeding that component all the goodies
        From the NeighborHood State. We also have a conditional render. IF we are cooking AND the ingredientColors are ready then proceeed 
        with the COOK Component OR (as long as the ingredients are ready) Render the Card with it's Ingredient List AND Drink Visualizer.
        If the ingredients colors are not ready, hold up and render nothing.
        
        HERE is where we may consider swapping the Neighborhood Context for a USE REF. That way when we change it we don't
        automatically rerender. But we MAY want to rerender IF we have a dynamic component. Maybe this can be done on the interior!
        
        FOR NOW I'm taking that formula prop out. Now we should NOT rerender the COOK component on changing the neighborhoodState :D
        
        Currently EVERY time we see props below, you are calling in the GLOBAL STATE*/}

        {cooking && ingredientColors.length>0 ? (
            <Cook props = {props} formula = {globalState} colors = {ingredientColors} cook = {cooking} onSaveCooking = {handleSaveCooking}/>

            ) : (

              ingredientColors.length>0 ? (

                <CardContent sx={{display: "flex", minHeight: "max-content"}}>
                  {/* INGREDIENT LIST */}
                  <Container maxWidth="xl">

                    {/* Here is another component. It renders the ingredient LIST IF we are not cooking. */}
                      <IngredientList props={props} colors={ingredientColors} cookState = {cooking}/>
                  </Container>

                  {/* BEAKER UI This renders the DRINK visualizer*/}
                  <Container sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around"}}>
                      <DrinkVisualizer key = "cookingDrinks" props={props} colors={ingredientColors} cookState = {cooking}/>
                  </Container>
                </CardContent> 

              ) : (null) 
            )}

            {/*This is just a card that contains the ubiquitous buttons that persist between renders. You click this button
            to alternate between modifying (cook) and a static but SAVED new Global State. */}

          <CardContent>
            {/* ACTIONS UI */}
            <Container sx={{display: "flex", flexDirection: "column", alignItems: "space-between", justifyContent: "space-around"}}>
                <Container sx={{textAlign: "left"}}>
                    <Typography variant='h7' color='text.secondary'>Assembly:</Typography>
                    <br/> <br/>
                    <Typography variant='h7'>{props.assembly}</Typography>
                </Container>

                <Container sx={{borderBottom: "solid 2px #2c2c2c"}}></Container>

                <Stack spacing={2} direction="column">
                    <Button variant="outlined">Favorite</Button>
                    {!cooking ? (                    
                    <Button 
                      variant="outlined"
                      onClick = {handleChangeCooking}
                      >Modify
                    </Button>
                    ) : (
                      <Button 
                      variant="outlined"
                      onClick = {handleSaveCooking}
                      >Save
                      </Button>
                    )}

                    {/* <Button variant="outlined">Find Similar</Button> */}
                </Stack>
            </Container>
        </CardContent>
      </Card>
      
      <Container>
        <CommercialBox />
      </Container>
    </>
    )
}

export default Concoct;