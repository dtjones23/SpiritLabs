import { Autocomplete, TextField, ToggleButton, Button, ToggleButtonGroup, ButtonGroup, CircularProgress } from '@mui/material';
import {Card, CardHeader, CardMedia, CardActionArea, CardActions, CardContent, Grid2, Container, Typography, Box}  from '@mui/material';

function CommercialCards ({items}) {
    //console.log(items)
    const inventoryAlcohols = items.map((alcohol) => {
       // console.log(alcohol.name)
        return (
        
            <Grid2 item xs={12} sm={6} md={4} lg={3}>
                <CardActionArea 
                sx = {{height: "100%"}}
                href = {alcohol.url}>
                    <Card sx = {{margin: "1em"}}>
                        <CardHeader
                            title={alcohol.name}
                            subheader={`${alcohol.proof}`}
                            titleTypographyProps={{ variant: 'h6', style: { fontSize: '16px' } }}
                            subheaderTypographyProps={{ variant: 'body2', style: { fontSize: '12px' } }}
                        />
                        <CardMedia
                            component="img"
                            height="194"
                            image={alcohol.image}
                            alt={alcohol.name}
                            sx = {{objectFit:"scale-down"}}
                        />
                        <Typography>Price: ${alcohol.price}</Typography>
                    </Card>
                </CardActionArea>
            </Grid2>
                
            
            
        
        )
    })

    return (
        <Grid2 
            container spacing={1} 
            sx ={{overflow:"auto !important"}}>
            {inventoryAlcohols}
        </Grid2>
    )
        
}

export default CommercialCards;