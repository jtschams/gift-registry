import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Auth from '../utils/auth';
import Login from '../components/Login';
import Signup from '../components/Signup';

export default function LoginSignup() {
  const { familyId } = useParams();

  if (Auth.loggedIn()) {
    if (familyId) { window.location.assign(`/join-family/${familyId}`) }
    window.location.assign('/');
  };

  const [ activeState, setActiveState ] = useState('login');

  const switchActive = (event) => {
    setActiveState(event.target.textContent.toLowerCase());
  }

  const displayForm = () => {
    if (window.innerWidth >= 825) { return <><Login familyId={familyId} /><Signup familyId={familyId} /></> }
    else if (activeState === 'login') { return <Login familyId={familyId} /> }
    else if (activeState === 'signup') { return <Signup familyId={familyId} /> }
  }

  return (
    <>
      {window.innerWidth >= 825 ? null :
        <nav id="login-nav">
          <ul id="login-signup-switch" onClick={switchActive}>
            <button>Login</button>
            <button>Signup</button>
          </ul>
        </nav>
      }
      <section id="form-section">
        {displayForm()}
      </section>
    </>
  )
};