import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './assets/index.css';
import iconTheme from './utils/favicon.js'

import App from './App.jsx';
import Error from './pages/Error.jsx';
import MyProfile from './pages/MyProfile.jsx';
import Questions from './pages/Questions.jsx';
import Answers from './pages/Answers.jsx';
import MyClaims from './pages/MyClaims.jsx';
import CreateGroup from './pages/CreateGroup.jsx';
import Family from './pages/Family.jsx';
import MyFriends from './pages/MyFriends.jsx';
import LoginSignup from './pages/LoginSignup.jsx';
import JoinFamily from './pages/JoinFamily.jsx';
import ChangeTheme from './pages/ChangeTheme.jsx'

const activeTheme = localStorage.getItem('color-theme');
const isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches
import(`./assets/${activeTheme ? activeTheme : isDarkTheme ? "dark" : "light"}-theme.css`);
iconTheme(activeTheme ? activeTheme : isDarkTheme ? "dark" : "light");

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <MyProfile />
      },
      {
        path: '/questions',
        element: <Questions />
      },
      {
        path: '/my-answers',
        element: <Answers />
      },
      {
        path: '/my-claims',
        element: <MyClaims />
      },
      {
        path: '/create-group',
        element: <CreateGroup />
      },
      {
        path: '/family/:familyId',
        element: <Family />
      },
      {
        path: '/my-friends',
        element: <MyFriends />
      },
      {
        path: '/user-answers/:userId',
        element: <Answers />
      },
      {
        path: '/login-signup/:familyId?',
        element: <LoginSignup />
      },
      {
        path: '/join-family/:familyId',
        element: <JoinFamily />
      },
      {
        path: '/change-theme',
        element: <ChangeTheme />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
