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
      <article className="profile-selection"><Link to="/questions"><h3>Answer Questions</h3></Link></article>
      <article className="profile-selection"><Link to="/my-answers"><h3>My Answers</h3></Link></article>
      <article className="profile-selection"><Link to="/my-claims"><h3>My Claims</h3></Link></article>
      <article className="profile-selection"><Link to="/change-theme"><h3>Change Theme</h3></Link></article>
      <article className="profile-selection">
        <h3>My Groups</h3>
        <ul id="family-list">
          {loading? "Loading..." : me.groups?.map((family) => (
            <Family key={family._id} family={family}/>
          ))}
          <li key="add-group" className="family-component"><Link to="/create-group"><h4>+ Create Group</h4></Link></li>
        </ul>
      </article>
    </>
  )
}