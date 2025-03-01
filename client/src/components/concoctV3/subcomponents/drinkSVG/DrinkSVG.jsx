import { useState, useEffect, Fragment  } from "react";

import DrawingFunction from "../drawingFunction/DrawingFunction";

import {
    Box,
    Typography
} from "@mui/material";

import './drinkSVG.css';


const DrinkSVG = ({ drinkData, glassData }) => {

    const receipeVar = {
        matrix:[drinkData.alcohol, drinkData.liquid, drinkData.garnish],
        keys:["alcohol","liquid","garnish"]
    }

    const liqVar = {
        matrix:[drinkData.alcohol, drinkData.liquid],
        keys:["alcohol","liquid"]
    }

    let ingredientHeights = []

    liqVar.matrix.forEach((mat) => {
        mat.map ((e) => {
            //console.log(e.amount)
            const value = () => {
                if (e.sliderValue) {
                    //console.log("This is the sliderValue", e.sliderValue)
                    return (e.sliderValue)
                } else {
                    //console.log("This is the amount", e.amount)
                    const newQty = Number(e.amount.match(/[0-9_.-]+/))
                    const newUnit = e.amount.match(/[a-zA-Z]+/)
                    if (newUnit == 'oz') {
                        return (newQty*2) 
                    } else if (newUnit == 'ml') {
                        return ((newQty/30)*2)
                    } else if (newUnit == null) {
                        return (newQty)
                    }
                }
            }
            //console.log(value())
            const height = value() * 10;
            ingredientHeights.push(height);
        })
    })

    const chosenGlass = () => {

        const drinkGlass = drinkData.glass;
        const allGlass = glassData;

        if (!allGlass || !allGlass.glasses) {
            console.error("allGlass or allGlass.glasses is undefined");
            return undefined; // Return early if undefined
        }

        //console.log("THESE are the GLASSES", allGlass.glasses)

        const matchGlass = allGlass.glasses.filter((glass) => glass.name === drinkGlass);
        if (matchGlass.length > 0) {
            //console.log("There IS a glass match", matchGlass)
            return {...matchGlass[0]}; //We make a copy of the glass that IS extensible
        } else {
            //console.log("There is NOT a glass match", allGlass.glasses[0])
            return {...allGlass.glasses[0]}; //Just return the first glass in the list if there is no matching glass. Make it a Copy and EXTENSIBLE
        }
    };

    const selectedGlass = chosenGlass()
    
    const svgPaths = selectedGlass.svg.map((e,index)=> {
        console.log(selectedGlass.svg[index])
        return (<path d={e}/>)
    })
    

    //Color Array
    // const colors = [
    //     '#545E75',
    //     '#63ADF2',
    //     '#A7CCED',
    //     '#304D6D',
    //     '#82A0BC',
    //     '#6CCFF6',
    //     '#33658A',
    //     '#2CBAF2',
    //     '#5B96C2',
    //     '#8CD9F8'
    // ]

    // Calculate y-coordinates for each svg 
    
    // const ingredientY = ingredientHeights.map((height, index) => {
    //     const sumOfPreviousHeights = ingredientHeights.slice(0, index).reduce((acc, curr) => acc + curr, 0);
    //     return 190 - sumOfPreviousHeights - height;
    //   });

    // Maps SVG rectangles to get rendered inside beaker 

    // console.log("Setting Drink Heights", ingredientHeights)
    // console.log("These are the y coordinates of ingredients", ingredientY)
    // console.log("These are the colors of ingredients", colors)

    // const xInitial=[0];
    // let rightVol = 0;

    // const drawShape = (input,indexUltra, drinkGlass, allGlass) => {
            
    //     console.log("Match the drinkGlass", drinkGlass, allGlass);

    //         if (!input) {
    //             //console.log("There is NO input slider value")
    //             input = 0; 
    //         }

    //         //console.log("this is the INPUT slider #",input)

    //         // const splitString = input.split(' ');
    //         // const number = parseFloat(splitString[0]);
    //         // in this SVG 5400 pixelssquared = 9 oz, so 600px squared is 1 oz

    //         const number = input/20
    //         rightVol = rightVol + number;
    //         const volume = rightVol*550

    //         //console.log(xInitial)
            
    //         //console.log(input,volume, indexUltra, colors[indexUltra],xInitial[indexUltra]);
    //         //console.log("This is the index", indexUltra, "Adding up to Volume", volume)

    //         //We know the volume of water coming in. We need to transform that into a x coordinate to fit the function
    //         //We take the intergral function, and rearrange it to make x the solvable rather than area.

    //         const xFinal= [];
    //         const volValues = [];
    //         const xValues = [];
    //         const xMidValues = [];
    //         const yMidValues = [];
    //         const startX = 50;
    //         const startY = 50;
    
    
    //         const shapeFunction = {

    //             term1(x,i,j) {
    //                 return ((-0.000000000451771359401714/j) * Math.pow(x, i)) //7
    //             },
    //             term2(x,i,j){
    //                 return ((0.000000130964251533793/j) * Math.pow(x, i))//6
    //             },
    //             term3(x,i,j) {
    //                 return ((-0.0000141662742818248/j) * Math.pow(x, i))//5
    //             },
    //             term4(x,i,j) {
    //                 return ((0.000678242616998961/j) * Math.pow(x, i))//4
    //             },
    //             term5(x,i,j) {
    //                 return ((-0.0118504403980162/j) * Math.pow(x, i))//3
    //             },
    //             term6(x,i,j) {
    //                 return ((-0.0581443507015448/j) * Math.pow(x, i))//2
    //             },
    //             term7(x,i,j) {
    //                 return ((3.77840982130481/j) * Math.pow(x,i))//1
    //             },
    //             term8(x,i,j) {
    //                 return((3.96246146914869/j) *Math.pow(x,i))//0
    //             },
    
    //             volOut(x) {
                    
    //                 return (this.term1(x,8,8) + this.term2(x,7,7) + this.term3(x,6,6) + this.term4(x,5,5) + this.term5(x,4,4) + this.term6(x,3,3) + this.term7(x,2,2) + this.term8(x,1,1))
    //             },
    
    //             yOut(x) {
    //                 return (this.term1(x,7,1) + this.term2(x,6,1) + this.term3(x,5,1) + this.term4(x,4,1) + this.term5(x,3,1) + this.term6(x,2,1)+ this.term7(x,1,1) + this.term8(x,0,1))
    //             }
    //         }
    
    //         for (let x = 0; x < 100; x += 1) {
    //             const currentVol = shapeFunction.volOut(x)
    //             volValues.push(currentVol)
    //             xValues.push(x)
    //         }
    //         //console.log(volValues)
    //         //This is how we find the place to STOP X and get a Final Y value
    //         let currentDiff = 10000
    //         for (let i = 0; i < xValues.length; i ++) {
    //             let diff = Math.abs(volume-volValues[i])
                
    //             if (diff < currentDiff) {
    //                 //console.log("This is the index", xValues[i], "This is the volume", volValues[i], "This is the difference", diff, diff < currentDiff)
    //                 currentDiff = diff; 
    //                 xFinal[0]=xValues[i]; 
    //                 //console.log("The new xFinal", xFinal[0])
    //             }
    //         }
    //         //This sets the stage for the NEXT color. We change the X we start with and BOOM we integrate over a different part of the curve

    //         xInitial.push(xFinal[0])
    //         //console.log(xInitial[indexUltra], xFinal[0], currentDiff)

    //         for (let x = xInitial[indexUltra]; x <  xFinal[0]; x += .1) {
    //             xMidValues.push(x)
    //             yMidValues.push(shapeFunction.yOut(x))
    //         }
    
    //         // Now we MIRROR the x and Y values to complete the shape
    //         const invertX = xMidValues.map((e) => e)
    //         const invertY = yMidValues.map((e) => e)
    
    //         invertX.reverse()
    //         invertY.reverse()
    
    //         const negY = invertY.map(e => {
    //             return (e = e*(-1))
    //         })
    
    //         const yFinalValues = xMidValues.concat(invertX);
    //         const xFinalValues = yMidValues.concat(negY);
    
    //         const xFinalShift = xFinalValues.map((e) => (e*0.58 + startX))
    //         const yFinalShift = yFinalValues.map((e) => 100-(e*1*.55  + startY))
    
    //         //const yFinal = shapeFunction.yOut(xFinal)
    //         //console.log("The FINAL x,y coordinates of the volume is", xFinalShift, yFinalShift)
    
    //         const svgShape = (xData, yData) => {
    //             //console.log(xData,yData)
    //             if (xData.length !== yData.length) {
    //                 throw new Error('xData and yData must be of the same length');
    //             }

    //             if (xData.length === 0) {
    //                 return null
    //             }
    //             // Create the path string
    //             const pathData = xData.map((x, index) => `${index === 0 ? 'M' : 'L'}${x},${yData[index]}`).join(' ') + ' Z';
                
    //             return (
    //                 <path d={pathData} fill={colors[indexUltra]} stroke="black" />
    //             );
    //         }
            
    //         return svgShape(xFinalShift, yFinalShift)
         
    // };

    //setxInt([...selectedGlass.xInitial])

    // //console.log("This is the chosen glass", selectedGlass)
    // const testDrawing = ingredientHeights.map((e,index) => {return (drawShape(e,index, drinkData.glass, glassData))})
    // const testDrawing = ingredientHeights.map((e, index) => (
    //     <Fragment key={index}>
    //         {drawShape(e, index)}
    //     </Fragment>
    // ));

    // console.log(testDrawing)

    // const rectangleMap = 
    // //receipeVar.matrix.flatMap((mat) => {
    // //return ()
    //         ingredientY.map((ingredient, index) => {
    //             //console.log("This is the box",ingredientY[index], ingredientHeights[index], colors[index])
    //             return (
    //             <rect key={`rectangle-${index}`} x="10" y={ingredientY[index]} width="130" height={ingredientHeights[index]} fill={colors[index]} />
    //         )})
    
    // // SVG styles
    // const beakerStyle = {
    //     stroke: '#ffffff',
    //     strokeWidth: '2px',
    //     fill: 'none'
    //     };

 
   


    return (
        <>
            {drinkData ? (
                <>
                        <Box className="resultsContainer" sx={{
                            }}>
                                <Box className="resultsBox">
                                    {receipeVar.matrix.map((mat, matIndex) => 
                                        <div key = {matIndex}>
                                            {mat.map((ingredient, index) => (
                                                <Typography key={`${matIndex}-${index}`}>
                                                    {ingredient.name}: {ingredient.amount}
                                                </Typography>)
                                                )
                                            }
                                        </div>
                                        )
                                    }
                                </Box>

                                <Box className="resultsBox">
                                    <svg  viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" width="100%" fill = "black" stroke = "white">
                                        <DrawingFunction glass={selectedGlass} heights={ingredientHeights}/>     
                                        {svgPaths}
                                    </svg>
                                </Box>

                                {/* <Box className="resultsBox">
                                    <svg  viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" width="100%" fill = "white" stroke = "white">
                                   
                                    {testDrawing}
                                        
                                    </svg>
                                </Box> */}

                                {/* <Box className="resultsBox">
                                    <svg width="150" height="200">
                                        
                                        <rect x="0" y="0" width="150" height="200" style={beakerStyle} />
                                        
                                        { rectangleMap }
                                    </svg>
                                </Box> */}

                                
                            </Box>
                </>
            
            ):(
                <Typography>Error: No Data</Typography>
            )}
        </>
    )
}

export default DrinkSVG;