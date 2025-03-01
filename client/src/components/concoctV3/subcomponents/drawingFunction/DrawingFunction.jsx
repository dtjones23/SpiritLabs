import polynomial from "./polynomial";
import { useState } from "react";

const DrawingFunction = ({glass, heights}) => {

    function vOut (x,glass) {

        let sum = 0;
        //console.log(x,glass)
        if (glass.function === "polynomial") {
            return polynomial("vOut",sum,glass,x)
        } else {
            return (null)
        }
        //console.log(sum)
    }

    function yOut(x,glass,yInt) {
        let sum = 0;
        
        if (glass.function === "polynomial") {
            return polynomial("yOut",sum,glass,x,yInt)
        } else {
            return (null)
        }
    }

    function shapeCoordinates (input,indexUltra, glass) {

        //console.log("We are calling the SHAPE COORD Function")
        //console.log("This is the INPUT height", input)

        if (!input) {
            //console.log("There is NO input slider value")
            input = 0; 
        }
        
        //console.log("this is the INPUT slider #",input)

        // const splitString = input.split(' ');
        // const number = parseFloat(splitString[0]);
        // in this SVG 5400 pixelssquared = 9 oz, so 600px squared is 1 oz

        // scaleFactor[0] is the pixels squared PER 1 oz.

        const number = input/20
        rightVol = rightVol + number;
        const volume = rightVol*glass.scaleFactors[0]

        //console.log(xInitial, volume)
        //console.log(input,volume, indexUltra, colors[indexUltra],xInitial[indexUltra]);
        //console.log("This is the index", indexUltra, "Adding up to Volume", volume)

        //We know the volume of water coming in. We need to transform that into a x coordinate to fit the function
        //We take the intergral function, and rearrange it to make x the solvable rather than area.

        // scaleFactor[1] is the startX, the scaleFactor[2] is startY inside the glass itself

        const xFinal= [];
        const volValues = [];
        const xValues = [];
        const xMidValues = [];
        const yMidValues = [];
        const startX = glass.scaleFactors[1];
        const startY = glass.scaleFactors[2];

        for (let x = 0; x < 100; x += 1) {
            const currentVol = vOut(x, glass)
            volValues.push(currentVol)
            xValues.push(x)
        }

        //console.log(volValues)
        
        //This is how we find the place to STOP X and get a Final Y value
        let currentDiff = 10000;
        for (let i = 0; i < xValues.length; i ++){
            let diff = Math.abs(volume-volValues[i])
            
            if (diff < currentDiff) {
                //console.log("This is the index", xValues[i], "This is the volume", volValues[i], "This is the difference", diff, diff < currentDiff)
                currentDiff = diff; 
                xFinal[0]=xValues[i]; 
                //console.log("The new xFinal", xFinal[0])
            }
        }
        //This sets the stage for the NEXT color. We change the X we start with and BOOM we integrate over a different part of the curve

        //console.log("The GLASS is EXTENSIBLE?",Object.isExtensible(glass))
        //console.log("Is xInitial extensible?", Object.isExtensible(glass.xInitial));
        //console.log(glass.xInitial);
        
        xInitial.push(xFinal[0])
        //console.log(xInitial, xFinal[0])
        //console.log(xInitial[indexUltra], xFinal[0], currentDiff)

        for (let x = xInitial[indexUltra]; x <  xFinal[0]; x += .1) {
        //for (let x = xInitial[indexUltra]; x <  xFinal[0]; x += .1) {
            xMidValues.push(x)
            yMidValues.push(yOut(x,glass,yInitial[0]))
        }

        // Now we MIRROR the x and Y values to complete the shape
        const invertX = xMidValues.map((e) => e)
        const invertY = yMidValues.map((e) => e)

        invertX.reverse()
        invertY.reverse()

        const negY = invertY.map(e => {
            return (e = e*(-1))
        })

        const yFinalValues = xMidValues.concat(invertX);
        const xFinalValues = yMidValues.concat(negY);

        const xFinalShift = xFinalValues.map((e) => (e*glass.scaleFactors[3] + startX))
        const yFinalShift = yFinalValues.map((e) => 100-(e*glass.scaleFactors[4]  + startY))

        //const xFinalShift = xFinalValues.map((e) => (e + startX))
        //const yFinalShift = yFinalValues.map((e) => 100-(e  + startY))

        //console.log(xFinalShift,yFinalShift)

        //const yFinal = shapeFunction.yOut(xFinal)
        //console.log("The FINAL x,y coordinates of the volume is", xFinalShift, yFinalShift)

        const svgShape = (xData, yData) => {
            //console.log(xData,yData)
            if (xData.length !== yData.length) {
                throw new Error('xData and yData must be of the same length');
            }

            if (xData.length === 0) {
                return null
            }
            // Create the path string
            const pathData = xData.map((x, index) => `${index === 0 ? 'M' : 'L'}${x},${yData[index]}`).join(' ') + ' Z';
            //console.log("THIS is the XDATA and YDATA", xData, yData) 
            //We should get an ARRAY of paths (SVG images) as a result of calling this function.
            return (
                <path d={pathData} fill={colors[indexUltra]} stroke="black" />
            );
        }

        return svgShape(xFinalShift, yFinalShift);
    }
    
    let rightVol = 0;
    let xInitial = [...glass.xInitial];
    let yInitial = [...glass.yInitial];
    const colors = [
        '#545E75',
        '#63ADF2',
        '#A7CCED',
        '#304D6D',
        '#82A0BC',
        '#6CCFF6',
        '#33658A',
        '#2CBAF2',
        '#5B96C2',
        '#8CD9F8'
    ];
    
    //console.log ("This is xInitial BB", xInitial)
    //console.log("THIS is the selected GLASS", glass);
    //console.log("These are the HEIGHTS", heights)

    const startpathX = [0,xInitial];
    const startpathY = [0,yInitial];
    const startPath = startpathX.map((x, index) => `${index === 0 ? 'M' : 'L'}${x},${startpathY[index]}`).join(' ') + ' Z';

    const liquidlevels = heights.map((e,index)=> {return (shapeCoordinates(e,index, glass))});
    //console.log(liquidlevels);

    return (
        [liquidlevels]
    )
}

export default DrawingFunction

