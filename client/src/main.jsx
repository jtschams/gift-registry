import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './assets/index.css';

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
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
