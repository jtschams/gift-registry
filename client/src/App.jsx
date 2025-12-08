import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { createContext, useContext, useState } from 'react';
import { setContext } from '@apollo/client/link/context';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import Navbar from './components/Navbar';
import Popup from './components/Popup';
import Auth from './utils/auth';

const PopupContext = createContext();
export const usePopupContext = () => useContext(PopupContext);

const httpLink = createHttpLink({
  uri: '/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default function App() {
  const [popupState, setPopupState] = useState({
    title: "Popup Error",
    message: "Popup opened in error.  Click button to close popup.",
    options: [{
      text: "Close Popup",
      onClick: closePopup
    }]
  });

  function openPopup(title, message, options, allowClickout = true) {
    setPopupState({ title, message, options })
    const overlay = document.getElementById("popup-background")
    overlay.classList.add("open");
    if (allowClickout) overlay.addEventListener("click", closePopup);
  }

  function closePopup() {
    setPopupState({ title: "", message: "", options: [] })
    const overlay = document.getElementById("popup-background")
    overlay.classList.remove("open");
    overlay.removeEventListener("click", closePopup);
  }

  const loggedIn = Auth.loggedIn();
  const location = useLocation().pathname.split('/')[1];
  let {familyId} = useParams();

  if (location !== "login-signup" && !loggedIn) {
    window.location.assign(`/login-signup/${location === "join-family" ? familyId : ""}`);
  }

  return (
    <>
    <ApolloProvider client={client}>
      <PopupContext.Provider value={({ openPopup, closePopup, popupState })}>
        {location === "login-signup" ? null : <Navbar />}
        <main id={location || "my-profile"}>
          <Outlet />
        </main>
        <Popup />
      </PopupContext.Provider>
    </ApolloProvider>
    </>
  )
}