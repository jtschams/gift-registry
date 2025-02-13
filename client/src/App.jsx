import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet, useLocation, useParams } from 'react-router-dom';

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
  const location = useLocation().pathname.split('/')[1];
  let {familyId} = useParams();

  if (location !== "login-signup" && !loggedIn) {
    window.location.assign(`/login-signup/${location === "join-family" ? familyId : ""}`);
  }

  return (
    <>
    <ApolloProvider client={client}>
      {location === "login-signup" ? null : <Navbar />}
      <main id={location || "my-profile"}>
        <Outlet />
      </main>
    </ApolloProvider>
    </>
  )
}