import React from 'react';
import { Link } from 'react-router-dom';

const handleLogout = () => {
  localStorage.removeItem('id_token');
  window.location.href = '/login-signup';
};

export default function Navbar() {
  return (
    <nav id="site-nav">
      <ul>
        <li key="my-profile"><Link to="/">My Profile</Link></li>
        <li key="my-friends"><Link to="/my-friends">My Friends</Link></li>
        <li key="logout"><a href="/login-signup" onClick={handleLogout}>Logout</a></li>
      </ul>
    </nav>
  )
}