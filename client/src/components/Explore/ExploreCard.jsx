import { useEffect, useState } from 'react';

import {
    Box,
    Chip,
    IconButton,
    Stack,
    Typography
} from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ExploreCard = () => {

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect (() => {
        setIsFavorite(formulaData.favorite);
    }, [])

    const formulaData = {
        __typename: 'Formulas',
        name: 'Classic Margarita',
        icon: '043-cuba-libra.png',
        alcohol: [
            {
                __typename: 'Ingredient',
                name: 'silver tequila',
                amount: '45 ml'
            },
            {
                __typename: 'Ingredient',
                name: 'cointreau',
                amount: '1 oz'
            }
        ],
        liquid: [
            {
                __typename: 'Ingredient',
                name: 'lime juice',
                amount: '1.5 oz'
            }
        ],
        garnish: [
            {
                __typename: 'Ingredient',
                name: 'lime wedge',
                amount: '2'
            },
            {
                __typename: 'Ingredient',
                name: 'kosher salt',
                amount: 'rim'
            }
        ],
        assembly: "Rub a wedge of lime around the rim of a chilled margarita glass, and salt the rim. Shake the liquid ingredients vigourously with ice and strain into the prepared glass.",
        rating: "4.2",
        favorite: true,
        author: "Editorial Staff"
    };

    return (
      <>
        <Box
            sx={{
                backgroundImage: "url('./cocktail.jpg')",
                backgroundRepeat: "no-repeat",
            }}
            className='exploreCard'
        >
            {/* HEADER */}
            <div>
                <div className='exploreCardHeader'>
                    <Typography
                    className='cardHeaderItem'>
                        <StarIcon
                        fontSize='small'
                        sx={{ color: 'var(--main-coral)'}}
                        />
                        {formulaData.rating}
                    </Typography>
                    
                    <Stack direction='row' spacing={1} className='exploreCardHeaderChips'>
                        {formulaData.alcohol.slice(0, 2).map((ingredient, index) => {
                            return (
                                <Chip key={index} variant='outlined' size='small' label={ingredient.name} />
                            )
                        })}
                    </Stack>
                </div>
                
            </div>

            {/* FOOTER */}
            <div className='exploreCardFooter'>

                {/* TITLE / AUTHOR */}
                <div>
                    <Typography variant='h6'>{formulaData.name}</Typography>
                    <Typography variant='body2'>Concocted by: {formulaData.author}</Typography>
                </div>

                {/* FAVORITE BUTTON */}
                {!isFavorite ? (
                    <IconButton
                        variant='contained'
                        className='cardFavoriteButton'
                        size='large'
                        sx={{color: 'var(--main-blue)'}}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <FavoriteBorderIcon fontSize='inherit'/>
                    </IconButton>
                ):(
                    <IconButton
                        className='cardFavoriteButton'
                        size='large'
                        sx={{color: 'var(--main-coral)'}}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <FavoriteIcon fontSize='inherit'/>
                    </IconButton>
                )}
            </div>
        </Box>
      </>
    );
};
  
export default ExploreCard;