import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Family from '../components/Family'
import { MY_PROFILE } from '../utils/queries';

export default function MyProfile() {

  const { loading, data } = useQuery(MY_PROFILE); 
  const me = data?.me;

  return (
    <>
      <h2>My Account</h2>
      <article className="profile-selection"><Link to="/questionnaire"><h3>Tastes & Preferences Questionnaire</h3></Link></article>
      <article className="profile-selection"><Link to="/manage-wishlist"><h3>Manage My Wishlist</h3></Link></article>
      <article className="profile-selection"><Link to="/my-friends"><h3>My Friends</h3></Link></article>
      <article className="profile-selection"><Link to="/shopping-list"><h3>Gifts I Have Selected for Others</h3></Link></article>
      <article className="profile-selection"><Link to="/change-theme"><h3>Change Theme</h3></Link></article>
      <article className="profile-selection">
        <h3>My Groups</h3>
        <ul id="family-list">
          {loading? <h3 className="loading">Loading...</h3> : me.groups?.map((family) => (
            <Family key={family._id} family={family}/>
          ))}
          <li key="add-group" className="family-component"><Link to="/create-group"><h4>+ Create Group</h4></Link></li>
        </ul>
      </article>
    </>
  )
}