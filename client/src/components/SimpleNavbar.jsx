import React from 'react';
import { Link } from 'react-router-dom';

const handleLogout = () => {
  localStorage.removeItem('id_token');
  window.location.href = '/login-signup';
};

const burgerButton = function(event) {
  document.getElementById('burger').classList.toggle('open')
  document.getElementById('site-nav').classList.toggle('open')
};

export default function Navbar() {
  return (<>
    <figure id="burger" className='burger' onClick={burgerButton}>
      <div className='bar1'></div>
      <div className='bar2'></div>
      <div className='bar3'></div>
    </figure>
    <nav id="site-nav">
      <ul>
        <li key="my-profile" onClick={burgerButton}><Link to="/">Return to Account</Link></li>
        <li key="logout" onClick={burgerButton}><a href="/login-signup" onClick={handleLogout}>Logout</a></li>
      </ul>
    </nav>
  </>)
}