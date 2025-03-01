import { useState, useEffect, useContext} from 'react';
import NeighborContext from '../../../utils/neighborContext';


import { Container, Box, Typography, TextField } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import GlobalContext from '../../../utils/globalContext';


function IngredientBox ({props, element, index ,index2, colors, cookState, ingredientType }) {

    //console.log(props, "This is ingredienttype", ingredientType, "This is Element", element, "This is index", index, "This is index2", index2)

    // const {neighborState, setNeighborState} = useContext(NeighborContext);
    const {globalState, setGlobalState } = useContext(GlobalContext);
    const [localState,setlocalState] = useState(props); 
    const [readytoCook, setReadytoCook] = useState(cookState)

    const [elementName, setElementName] = useState(element.name)
    const [elementAmount, setElementAmount] = useState(element.amount)
    // const [elementAmount, setElementAmount] = useState(handleAmount(props.element.amount))
    // const [elementUnit, setElementUnit] = useState(handleUnit(props.element.amount))
    const [ingredientElement, setIngredientElement] = useState({})

    //console.log("These are your", props)
    //console.log("This is your neighborhood", neighborState)

    function handleAmount (string) {
        const numericPart = parseFloat(string.match(/\d+(\.\d+)?/));
        return isNaN(numericPart) ? '' : numericPart;
    }
    
    function handleUnit(string) {
        const letters = string.match(/[a-zA-Z]+/g);
      // If letters are found, concatenate them into a single string
      if (letters) {
        return letters.join('');
      } else {
        // If no letters found, return an empty string or null, depending on your use case
        return ''; // or return null;
      }
    }

    const handleNameFieldChange = (event) => {
       
        //We have to set the nieghborhood on it's own sweet time to prevent lagging.
        function updateNeighborhoodName (newName) {
            const arraytoChange = ingredientType;
            const indextoChange = index2;
            const newStateObject = {...globalState};
            //console.log("This is Array Changing", arraytoChange, "This is Index Changing", indextoChange, "This is the NEW Object", newStateObject);
            const newArray = [...newStateObject[arraytoChange]];
            
            //This is to avoid the read only error. We completely overwrite the entire object rather than overwrite a single property of it.
            newArray[indextoChange] = { ...newArray[indextoChange], name: newName };
            newStateObject[arraytoChange] = newArray
            return newStateObject
        }
        const newName = event.target.value;
        const updatedObject = updateNeighborhoodName(newName)
        setGlobalState(updatedObject)
        console.log(globalState)
        setElementName(event.target.value);
    }

    function handleAmountFieldChange (event) {

        //We have to set the nieghborhood on it's own sweet time to prevent lagging.
        function updateNeighborhoodAmount (newAmount) {
            const arraytoChange = ingredientType;
            const indextoChange = index2;
            const newStateObject = {...globalState};
            const newArray = [...newStateObject[arraytoChange]];
            //This is to avoid the read only error. We completely overwrite the entire object rather than overwrite a single property of it.
            newArray[indextoChange] = { ...newArray[indextoChange], amount: newAmount };
            newStateObject[arraytoChange] = newArray
    
            setGlobalState(newStateObject)
        }

        const newAmount = event.target.value;
        updateNeighborhoodAmount (newAmount)
        setElementAmount(event.target.value);
    }

    useEffect (() => {
        setlocalState(globalState)
    }, [globalState])

    useEffect (() => {
        //console.log("This is your Ingredient", elementName)

        const ingredient = () => {
            return (
                //Literally wait for all the variables to load in.
                Object.keys(localState).length > 0 ? (
                    <Container
                    //Sets the key to be something like alcohol-1
                    key={`${ingredientType[index]}-${index2}`}
                    
                    maxWidth="lg"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: 'solid 2px #2c2c2c',
                        p: '8px',
                        userSelect: 'auto',
                        pointerEvents: 'auto'
                    }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircleIcon sx={{ mr: '4px', color: colors[index2] }} />
                            
                        {readytoCook ? 
                        (
                            <>
                                <TextField variant="outlined" placeholder='Name' value = {elementName} onChange={handleNameFieldChange} ></TextField>
                                <TextField variant="outlined" placeholder='Amount' value = {elementAmount} onChange={handleAmountFieldChange}></TextField>

                            </>             
                        ) : (
                            <Box>
                                <Typography variant="h7">{element.name}</Typography>
                                <Typography color='accent'>{element.amount}</Typography>
                            </Box>
                            )}
                        </Box>
                    </Container>
                
                ) :(
                        null) 
            )
        }
        setIngredientElement(ingredient)

    },[ elementName, elementAmount, globalState])


    return (
        <>
        {Object.keys(ingredientElement).length > 0 ? (ingredientElement):(null)}
        </>
    )
}

export default IngredientBox