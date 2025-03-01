const cheerio = require('cheerio');

async function scrapeLoop (maxPage, collectionpage) {
    const hrefHolder = [];
    for (let i = 1; i <= maxPage; i++) { 
        let page = i;
        let hrefs = await scrape(collectionpage, page);  
        hrefs.forEach((url) => hrefHolder.push(url))
    }
    console.log(hrefHolder);
    return hrefHolder
}

async function scrape (collectionpage, page) {
    try {
      const response = await fetch(`${collectionpage}?page=${page}`)
    if (!response.ok) {
      throw new Error('Network response was not ok', response);
    }
    const htmlResponse = await response.text();
    const htmlBody = cheerio.load(htmlResponse);
    const hrefs = [];
    htmlBody('a').each((index, element) => {
      const link = htmlBody(element).attr('href');
      if (link) {
        hrefs.push(link);
      }
    });
    let uniquehrefs = hrefs.filter((value, index, self) => self.indexOf(value) === index);
    let producthrefs = uniquehrefs.filter((value) => {
        const target = value.split('/')
        return target[1] === 'products' //returns true if the URL has the product string
    })
    //console.log(producthrefs);
    return producthrefs
    } catch (err) {
      console.error('There was a problem with the fetch operation:', err);
      return []
    };
}

const getPageMax = async (collectionpage) => {
    const response = await fetch(`${collectionpage}/`) 
    if (!response.ok) {
          throw new Error('Network response was not ok', response);
    }
    const htmlResponse = await response.text();
    const htmlBody = cheerio.load(htmlResponse);
    const hrefs = [];
    htmlBody('a').each((index, element) => {
        const link = htmlBody(element).attr('href');
        if (link) {
        hrefs.push(link);
        }
    });
    let uniquehrefs = hrefs.filter((value, index, self) => self.indexOf(value) === index);
    let pagehrefs = uniquehrefs.filter((value) => {
        const target = value.split('page=');
        return /\d+/.test(target[1]); //returns true when the target has both 'page=' AND a number
    })
    
    const pageNumbers = [];
    pagehrefs.forEach((value)=>{
        let numberString = value.match(/\d+/) //test the strings for numbers and get the numbers!
        if (numberString !== null ){
            pageNumbers.push(parseInt(numberString[0]));
        }
    });
    return Math.max(...pageNumbers); //We spread function the array of page Numbers to enter all values as arguments
}   

async function urlData(collectionpage) {
    const maxPage = await getPageMax(collectionpage);
    console.log(maxPage);
    const hrefLibrary = await scrapeLoop(maxPage, collectionpage);
    return hrefLibrary.filter((value, index, self) => self.indexOf(value) === index);
}



module.exports = urlData;


