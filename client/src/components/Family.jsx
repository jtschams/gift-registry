import React from 'react';
import { useLocation } from 'react-router-dom';
import Nickname from './Nickname';

export default function Family({ family }) {
  const location = useLocation().pathname.slice(1);

  const findAdmin = (family) => {
    if (!family.admins) { return false }
    return family.members?.find((member) => member.user._id === family.admins[0]._id)
  }

  const member = findAdmin(family);
  const chooseFamily = (event) => {
    window.location.assign(`/family/${family._id}`)
  }

  return (
    <li className="family-component" onClick={chooseFamily}>
      <h4>{family.familyName}</h4>
      {member ? <Nickname member /> : null}
    </li>
  )
}