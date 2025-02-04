import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Auth from '../utils/auth';
import Login from '../components/Login';
import Signup from '../components/Signup';

export default function LoginSignup() {

  if (Auth.loggedIn()) {
    window.location.assign('/');
  };

  const { familyId } = useParams();
  const [ activeState, setActiveState ] = useState('login');

  const switchActive = (event) => {
    setActiveState(event.target.textContent.toLowerCase());
  }

  const displayForm = () => {
    if (window.innerWidth >= 1100) { return <><Login familyId /><Signup familyId /></> }
    else if (activeState === 'login') { return <Login familyId /> }
    else if (activeState === 'signup') { return <Signup familyId /> }
  }

  return (
    <>
      <nav id="login-nav">
        <ul onClick={switchActive}>
          <li>Login</li>
          <li>Signup</li>
        </ul>
      </nav>
      <section id="form-section">
        {displayForm()}
      </section>
    </>
  )
};