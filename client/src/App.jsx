import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Auth from './utils/auth';

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

  const loggedIn = Auth.loggedIn();
  const location = useLocation().pathname.slice(1);

  if (location !== "login-signup" && !loggedIn) {
    console.log(loggedIn)
    window.location.assign('/login-signup')
  }

  return (
    <>
    <ApolloProvider client={client}>
      {location === "login-signup" ? null : <Navbar />}
      <main id={location}>
        <Outlet />
      </main>
    </ApolloProvider>
    </>
  )
}