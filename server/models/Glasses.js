const mongoose = require ('mongoose');

const { model, Schema } = mongoose;

const glassSchema = new Schema ({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    size: {
        type: Number,
        required: true,
        trim: true,
    },

    function: {
        type: String,
        required: true,
        trim: true,
    },

    coefficents: {
        type: [Number],
        require: true,
        trim: true
    },

    svg: {
        type: [String],
        require: true,
        trim: true,
    },

    xInitial: {
        type: [Number],
        required: true,
        trim: true
    },

    yInitial: {
        type: [Number],
        required: true,
        trim: true
    },

    currentVol: {
        type: Number,
        require: true,
        trim: true,
    },

    scaleFactors: {
        type: [Number],
        require: true,
        trim: true
    }

});

// glassSchema.methods.vOut = function(x) {

//         let sum = 0;

//         if (this.function === "polynomial") {

//             const termMax = this.coefficents.length

//             //This shoud follow the form of a lagrange polynomial as integrated

//             //term1(x,i,j) {
//             //     return ((COEFFICENT/j) * Math.pow(x, i)) //7
//             // },

//             //(this.term1(x,8,8) + this.term2(x,7,7) + this.term3(x,6,6) + this.term4(x,5,5) + this.term5(x,4,4) + this.term6(x,3,3) + this.term7(x,2,2) + this.term8(x,1,1))

//             for (let i = 0; i < termMax; i++) {
//                 const coefficent= this.coefficents[i];
//                 const power = termMax-i;
//                 const denominator = termMax-i;
//                 const term = (x) => {
//                     (coefficent/denominator)*Math.pow(x,power)
//                 }
//                 sum = sum + term(x)
//             }
//         }
        
//         return sum
// },

// glassSchema.methods.yOut = function (x) {

//         let sum = 0;
        
//         if (this.function === "polynomial") {

//             const termMax = this.coefficents.length
            
//             //This shoud follow the form of a lagrange polynomial as a regular function (f(x))
//             //term1(x,i,j) {
//             //     return ((COEFFICENT/j) * Math.pow(x, i)) //7
//             // },
//             // this.term1(x,7,1) + this.term2(x,6,1) + this.term3(x,5,1) + this.term4(x,4,1) + this.term5(x,3,1) + this.term6(x,2,1)+ this.term7(x,1,1) + this.term8(x,0,1))

//             for (let i = 0; i < termMax; i++) {
//                 const coefficent= this.coefficents[i];
//                 const power = termMax-1-i;
//                 const term = (x) => {
//                     (coefficent)*Math.pow(x,power)
//                 }
//                 sum = sum + term(x)
//             }
//         }
//         return sum
// },

// glassSchema.methods.shapeCoordinates = function (input,indexUltra) {
    
//     if (!input) {
//         //console.log("There is NO input slider value")
//         input = 0; 
//     }
    
//     //console.log("this is the INPUT slider #",input)

//     // const splitString = input.split(' ');
//     // const number = parseFloat(splitString[0]);
//     // in this SVG 5400 pixelssquared = 9 oz, so 600px squared is 1 oz

//     // scaleFactor[0] is the pixels squared PER 1 oz.

//     const number = input/20
//     rightVol = rightVol + number;
//     const volume = rightVol*this.scaleFactors[0]

//     //console.log(xInitial)
//     //console.log(input,volume, indexUltra, colors[indexUltra],xInitial[indexUltra]);
//     //console.log("This is the index", indexUltra, "Adding up to Volume", volume)

//     //We know the volume of water coming in. We need to transform that into a x coordinate to fit the function
//     //We take the intergral function, and rearrange it to make x the solvable rather than area.

//     // scaleFactor[1] is the startX, the scaleFactor[2] is startY inside the glass itself

//     const xFinal= [];
//     const volValues = [];
//     const xValues = [];
//     const xMidValues = [];
//     const yMidValues = [];
//     const startX = this.scaleFactors[1];
//     const startY = this.scaleFactors[2];

//     for (let x = 0; x < 100; x += 1) {
//         const currentVol = shapeFunction.volOut(x)
//         volValues.push(currentVol)
//         xValues.push(x)
//     }

//     //console.log(volValues)
    
//     //This is how we find the place to STOP X and get a Final Y value
//     let currentDiff = 10000
//     for (let i = 0; i < xValues.length; i ++) {
//         let diff = Math.abs(volume-volValues[i])
        
//         if (diff < currentDiff) {
//             //console.log("This is the index", xValues[i], "This is the volume", volValues[i], "This is the difference", diff, diff < currentDiff)
//             currentDiff = diff; 
//             xFinal[0]=xValues[i]; 
//             //console.log("The new xFinal", xFinal[0])
//         }
//     }
//     //This sets the stage for the NEXT color. We change the X we start with and BOOM we integrate over a different part of the curve

//     this.xInitial.push(xFinal[0])
//     //console.log(xInitial[indexUltra], xFinal[0], currentDiff)

//     for (let x = this.xInitial[indexUltra]; x <  xFinal[0]; x += .1) {
//         xMidValues.push(x)
//         yMidValues.push(shapeFunction.yOut(x))
//     }

//     // Now we MIRROR the x and Y values to complete the shape
//     const invertX = xMidValues.map((e) => e)
//     const invertY = yMidValues.map((e) => e)

//     invertX.reverse()
//     invertY.reverse()

//     const negY = invertY.map(e => {
//         return (e = e*(-1))
//     })

//     const yFinalValues = xMidValues.concat(invertX);
//     const xFinalValues = yMidValues.concat(negY);

//     const xFinalShift = xFinalValues.map((e) => (e*0.58 + startX))
//     const yFinalShift = yFinalValues.map((e) => 100-(e*1*.55  + startY))

//     //const yFinal = shapeFunction.yOut(xFinal)
//     //console.log("The FINAL x,y coordinates of the volume is", xFinalShift, yFinalShift)

//     const svgShape = (xData, yData) => {
//         //console.log(xData,yData)
//         if (xData.length !== yData.length) {
//             throw new Error('xData and yData must be of the same length');
//         }

//         if (xData.length === 0) {
//             return null
//         }
//         // Create the path string
//         const pathData = xData.map((x, index) => `${index === 0 ? 'M' : 'L'}${x},${yData[index]}`).join(' ') + ' Z';

//         //We should get an ARRAY of paths (SVG images) as a result of calling this function.
//         return (
//             pathData
//         );
//     }

//     return svgShape(xFinalShift, yFinalShift)

// }

const Glasses = model('Glasses', glassSchema); 

module.exports = Glasses;