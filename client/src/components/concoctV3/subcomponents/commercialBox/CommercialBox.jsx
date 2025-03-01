import { useQuery } from '@apollo/client';
import { Autocomplete, TextField, ToggleButton, Button, ToggleButtonGroup, ButtonGroup, CircularProgress, Card, CardActions, Container, CardContent, Typography, Box } from '@mui/material';
import { useState, useEffect, useContext } from 'react';

import GlobalContext from '../../../utils/globalContext.js';
import { GET_INVENTORY } from '../../../utils/queries.js';
import CommercialCards from './CommercialCards.jsx';

function CommercialBox () {

const { globalState, setGlobalState } = useContext(GlobalContext);
//console.log(globalState);
const alcoholNames = globalState.alcohol.map((element) => element.name) 
const { loading, data, error } = useQuery(GET_INVENTORY, {variables: {terms: alcoholNames}})

const alcoholCards = () => {
    if (!loading && data) {
        //console.log("Data on Line 16", data)
        //console.log("Data is an",typeof(data))
        const alcoholTypes = alcoholNames.map((name) => {
            //console.log(name)
            const regex = new RegExp(name, 'i');
            const inventoryAlcohols = data.inventorybyterms.filter((alcohol) => {
                return(regex.test(alcohol.name))
            })
            //The object for the Card we are about to create
            const alcoholContainer = {
                name:name,
                alcohols:inventoryAlcohols
            }

            //console.log("This Box contains", alcoholContainer) 
            //not all ingredients will be contained in the inventory at all times. Gotta pick and choose our fights.
            if (alcoholContainer.alcohols.length > 0) {
                return (
                    <Card variant="outlined">
                        <CardContent sx={{display: "flex", minHeight: "max-content"}}>
                            <Container maxWidth="lg" sx={{display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "solid 2px #2c2c2c", p: "8px"}}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Typography variant="h7"> Purchase {alcoholContainer.name}!</Typography>
                                    <CommercialCards items = {alcoholContainer.alcohols} />
                                </Box>
                            </Container>
                        </CardContent>
                    </Card>
                ) 
            } else {
                return
            }
        });
    return (alcoholTypes)
    } else {
        // Handle loading state or absence of data
        return <CircularProgress />;
    }
}


if (error) {
    console.log(error)
}



return (
    <div>
        {loading ? <CircularProgress />: alcoholCards()} 
    </div>
)

}

export default CommercialBox;