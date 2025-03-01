const { findByIdAndRemove } = require("../models/Inventory.js");
const urlData = require ("./URL.js");
const boozeInventory = require("./boozeFetch.js");
const fs = require ('fs');

//const basepage = "https://ishopliquor.com/collections/all-acohol"
const basepage = "https://craftshack.com"
const collectionpage = "https://craftshack.com/collections/buy-liquor-online"

const smallfilePath = "C:/Users/fishe/Desktop/boozeInventory.txt";
const largefilePath = "C:/Users/fishe/Desktop/totalInventory.txt";
//const smallfilePath = "C:/Users/Alan/Desktop/boozeInventory.txt"
//const largefilePath =  "C:/Users/Alan/Desktop/totalInventory.txt"

function condenseInfo (urls, boozeInfo, basepage) {

    const finalArray = [];

    function findABV(string){
        const regex = /(\d+(\.\d+)?%)/  ;
        match = string.match(regex)
        if (match) {
            return `${match[1]} ABV`
        } else {
            return "0.0% ABV"
        }
    }

    function createBoozeObject (element,index,basepage) {
        const dataObject = {
            name: element.product.title,
            url: `${basepage}${urls[index]}`,
            type: element.product.product_type,
            price:element.product.variants[0].price,
            handle: element.product.handle,
            tags: element.product.tags,
            proof: findABV(element.product.body_html),
        }
        if (element.product.image && element.product.image.src){
            dataObject.image = element.product.image.src
        } else {
            console.log(index)
        }
        return dataObject
    }

    if (boozeInfo !== null) {
        boozeInfo.forEach((element,index) => {
            if (element !== null) {
                const dataEntry = createBoozeObject(element,index,basepage)
                finalArray.push(dataEntry);
            }
        });
    }

    return finalArray;
}

(async () => {
    try {
        const urls = await urlData(collectionpage);
        const onlineInventory = await boozeInventory(urls,basepage);
        const spiritLabInventory = condenseInfo(urls, onlineInventory, basepage);
        fs.writeFile(smallfilePath, JSON.stringify(spiritLabInventory, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('File has been written successfully.');
        });
        fs.writeFile(largefilePath, JSON.stringify(onlineInventory, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('File has been written successfully.');
        });
    } catch (err) {
        console.error("Error getting the JSON", err)
    }
})();

//things that could be made into smaller objects for ease of use
// URL
//product.title
//product.product_type
//product.handle
//product.variants.option2(Alcohol Proof)
//product.image.src
