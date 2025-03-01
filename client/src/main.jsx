import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App.jsx'
import Home from './pages/Home';
// import TheLab from './pages/TheLab';
import Profile from './pages/Profile.jsx';
import Search from './pages/Search.jsx';
import Results from './pages/Results.jsx';
import Description from './pages/Description.jsx';
import Explore from './pages/Explore.jsx';

const TheLab = React.lazy(() => import('./pages/TheLab'));
//Temporary for Development
// import ConcoctV2 from './components/concoctV2/ConcoctV2.jsx';
// import ConcoctV3 from './components/concoctV3/ConcoctV3.jsx';

//Universal Styles
import './global.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/search',
        element: <Search />
      },
      {
        path: '/profile',
        element: <Profile />
      }, 
      // {
      //   path: '/lab',
      //   element: <React.Suspense fallback={<div>Loading...</div>}><TheLab /></React.Suspense>,
      // },
      //Temporary for Development
      // {
      //   path: '/concoctV2',
      //   element: <ConcoctV2 />
      // },
      // {
      //   path: '/concoctV2',
      //   element: <ConcoctV2 />
      // },
      // {
      //   path: '/concoctV3',
      //   element: <ConcoctV3 />
      // },
      {
        path: '/results',
        element: <Results />
      },
      {
        path: '/description/:drinkId',
        element: <Description />
      },
      {
        path: '/explore',
        element: <Explore />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)