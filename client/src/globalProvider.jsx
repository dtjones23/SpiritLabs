import React, { useState, useEffect, createContext, useContext } from 'react';

const globalContext = createContext();

export const useGlobalContext = () => useContext(globalContext)
// The Global Provider is a SAVE state. When you load into the application
// the provider searches out the LOCAL MEMORY and snags what's in there.
// When you touch or update the Global State, you also update the Local Memory.
// This is to protect the user from page refreshes and navigating off site.
// Also, this acts like the ultimate UNDO button. If a user hates what they did
// Then the Global state acts like a hard reset if you summon it.

const GlobalProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({ favorites: [] }); 
  // prior to initializing favorites as an empty array, I kept receiving errors with any operation I would try to use that involving the favorites array. ('Cannot read property 'includes' of undefined')
  // so I initialized it as an empty array because we know that the favorites array will be an array of strings right from the start
  // plus managing favorites in the global state makes it way easier to manage the favorites list across the application since users will be able to `Favorite` drinks from most of the pages

  //Retrieves Global State from Local Memory on a Refresh
  useEffect(() => {
    // Retrieve state from local storage on component mount
    const storedState = localStorage.getItem('globalState');
    if (storedState) {
      try {
        // Parse stored state and update global state
        setGlobalState(JSON.parse(storedState));
      } catch (error) {
        console.error('Error parsing stored state:', error);
      }
    }
  }, []);

  //Sets Global State to Local Memory when you Change Global State
  useEffect(() => {
    // Save state to local storage whenever it changes
    localStorage.setItem('globalState', JSON.stringify(globalState));
  }, [globalState]);

  const updateIngredientCategory = (ingredients, type) => {
    //console.log(type)
    //console.log(`${type} Array Updated`, ingredients)
    const newObject = {...globalState}
    //console.log(newObject)
    newObject[type] = ingredients
    setGlobalState(newObject)
  }

  const updateIngredient = (type,index, update) => {
    //console.log(`${type}-${index} Updated to be ${update}`);

    const newObject = {...globalState};
    const ingredientList = [...newObject[type]]
    ingredientList[index] = update;
    newObject[type] = ingredientList;

    // console.log("This is the new ingredient", updateIngredient)
    // console.log("This is the New Ingedient List", ingredientList)
    // console.log("This is the New Object", newObject)
  
    setGlobalState(newObject)
  }

  return (
    <globalContext.Provider value={{ globalState, setGlobalState, updateIngredientCategory, updateIngredient}}>
      {children}
    </globalContext.Provider>
  );
};

export default GlobalProvider