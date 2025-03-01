

function polynomial (func,sum,glass,x,yInt) {

    if (func === "vOut") {
        const termMax = glass.coefficents.length

        //This shoud follow the form of a lagrange polynomial as integrated
    
        //term1(x,i,j) {
        //     return ((COEFFICENT/j) * Math.pow(x, i)) //7
        // },
    
        //(this.term1(x,8,8) + this.term2(x,7,7) + this.term3(x,6,6) + this.term4(x,5,5) + this.term5(x,4,4) + this.term6(x,3,3) + this.term7(x,2,2) + this.term8(x,1,1))
    
        for (let i = 0; i < termMax; i++) {
            const coefficent= glass.coefficents[i];
            //console.log(termMax,coefficent)
            const power = termMax-i;
            const denominator = termMax-i;
            const term = (x) => {
                return (coefficent/denominator)*Math.pow(x,power)
            }
            sum = sum + term(x)
        }
        return sum
    } else {
        const termMax = glass.coefficents.length
            
        //This shoud follow the form of a lagrange polynomial as a regular function (f(x))
        //term1(x,i,j) {
        //     return ((COEFFICENT/j) * Math.pow(x, i)) //7
        // },
        // this.term1(x,7,1) + this.term2(x,6,1) + this.term3(x,5,1) + this.term4(x,4,1) + this.term5(x,3,1) + this.term6(x,2,1)+ this.term7(x,1,1) + this.term8(x,0,1))

        for (let i = 0; i < termMax; i++) {
            const coefficent= glass.coefficents[i];
            const power = termMax-1-i;
            const term = (x) => {
                return (coefficent)*Math.pow(x,power)
            }
            sum = sum + term(x)+yInt
        }
        return sum
    }
    
}


export default polynomial