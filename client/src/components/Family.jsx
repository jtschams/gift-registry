import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Nickname from './Nickname';

export default function Family({ family }) {
  
  const findAdmin = (family) => {
    if (!family.admins) { return false }
    return family.members?.find((member) => member.user._id === family.admins[0]._id)
  }

  const member = findAdmin(family);

  return (
    <li className="family-component">
      <Link to={"/family/" + family._id}>
        <h4>{family.familyName}</h4>
        {member ? <Nickname member /> : null}
      </Link>
    </li>
  )
}