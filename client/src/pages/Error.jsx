import React from 'react';
import Navbar from '../components/Navbar';

export default function Error() {
  
  return (
    <main id="error">
      <h2>Page Not Found</h2>
      <p>It looks like there was a problem with your connection or the link that brought you here.</p>
      <p>The links below will take you back to the site:</p>
      <Navbar />
    </main>
  )
}