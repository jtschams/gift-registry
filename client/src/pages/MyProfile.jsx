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
      <article><Link to="/questions">Answer Questions</Link></article>
      <article><Link to="/my-answers">My Answers</Link></article>
      <article><Link to="/my-claims">My Claims</Link></article>
      <article>
        <h2>My Groups</h2>
        <ul id="family-list">
          {loading? "Loading..." : me.groups?.map((family) => (
            <Family key={family._id} family={family}/>
          ))}
          <li key="add-group" className="family-component"><Link to="/create-group">+ Create Group</Link></li>
        </ul>
      </article>
    </>
  )
}