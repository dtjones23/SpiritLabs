import Concoct from '../components/concoct/concoct';
import ConcoctV3 from '../components/concoctV3/ConcoctV3';

import { useGlobalContext } from "../globalProvider.jsx";
import LocalContext from '../utils/neighborContext';
import { useContext, useEffect, useState } from 'react'
import {CircularProgress} from '@mui/material'
import NeighborProvider from './neighborProvider';
import { gql } from '@apollo/client';

function TheLab() {

  const { globalState, setGlobalState } = useGlobalContext();
  // const [labState, setLabState] = useState({})

  // useEffect (() => {
  //   setLabState(globalState)
  //   console.log(Object.entries(labState).length);
  // },[])

  // console.log(Object.entries(labState));

  //We wrap the lab in a Neighborhood Provider. This Neighborhood Provider 
  //Acts like a secondary State. We can render and show the user stuff based 
  //on the Neighborhood Provider WITHOUT messing around our Global State. This
  //Still allows us to have the undo button. USE Ref does not make this obsolete. Use REF 
  //Does not inherently pass between components. You have to still wrap the reference
  //in something in order to do that. However, if you cause a change to the Use REF
  //You do not trigger a rerender. This can have advantages or disadvantages.
  //What is also important to know is that changing a CONTEXT also does not trigger 
  //a Rerender. If you change the context value outside of the component tree
  // where it was initially provided, the components receiving that context as props won't automatically rerender.
  // It's only if you change the props from INSIDE the component tree that you get one.
  // Because the Concoct component consumes the global state, any change to the global state
  // from within concoct will cause a re-render. But changing the NEIGHBORstate (a context) will not.

    return (
      <NeighborProvider>
        {/* We have to make sure that the Global Context is Not an Empty Object before trying to render the Lab
        We pass in the GLOBAL STATE as the prop to Concoct. Change Global, you rerender*/}
        {Object.entries(globalState).length !== 0 ? (<ConcoctV3/>):(<CircularProgress/>)}
        {/* <ConcoctV3/> */}
      </NeighborProvider>
    )
  }
  
export default TheLab
