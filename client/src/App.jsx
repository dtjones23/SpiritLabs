import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { useLocation, Outlet } from "react-router-dom";
import GlobalProvider from "./globalProvider.jsx";
import { setContext } from "@apollo/client/link/context";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

// Dynamic imports for code splitting
const Navbar = React.lazy(() => import("./components/main/Navbar"));
const Footer = React.lazy(() => import("./components/main/Footer"));

const labTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00aef3",
      light: "#52c7f5",
      dark: "#007cbd",
    },
    secondary: {
      main: "#f34500",
      light: "#ff8359",
      dark: "#c02600",
    },
  },
});

// import Nav from './components/Nav';
// import { StoreProvider } from './utils/GlobalState';

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Apollo was giving a warning stating cache data could be lost when replacing the comments field of a Formula and replacing the replies field of a Comment object. This could cause additional network requests to fetch data that were otherwise cached. So a recommended solution was to use a merge function to merge the incoming data with the existing data( this is done in the ApolloClient constructor)
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Comment: {
        fields: {
          replies: {
            merge(existing = [], incoming = []) {
              const existingRepliesMap = new Map(existing.map(reply => [reply.__ref, reply]));
              incoming.forEach(reply => existingRepliesMap.set(reply.__ref, reply));
              return Array.from(existingRepliesMap.values());
            }
          }
        }
      },
      Formulas: {
        fields: {
          comments: {
            merge(existing = [], incoming = []) {
              const existingCommentsMap = new Map(existing.map(comment => [comment.__ref, comment]));
              incoming.forEach(comment => existingCommentsMap.set(comment.__ref, comment));
              return Array.from(existingCommentsMap.values());
            }
          }
        }
      }
    }
  }),
});

function App() {
  // </StoreProvider> Put this in later to return STATE functionality.
  const location = useLocation(); // Get the current location
  // const showNavbar = location.pathname !== "/search";

  return (
    <ApolloProvider client={client}>
      <GlobalProvider>
        <ThemeProvider theme={labTheme}>
          <CssBaseline />
          <React.Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </React.Suspense>
          <Container maxWidth="xl" sx={{ pt: "24px" }}>
            <Outlet />
          </Container>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </React.Suspense>
        </ThemeProvider>
      </GlobalProvider>
    </ApolloProvider>
  );
}

export default App;
