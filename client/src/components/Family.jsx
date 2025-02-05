import React from 'react';
import { useLocation } from 'react-router-dom';
import Nickname from './Nickname';

export default function Family(family) {
  const location = useLocation().pathname.slice(1);

  const findAdmin = (family) => {
    if (!family.admins) { return false }
    return family.members?.find((member) => member.user._id === family.admins[0]._id)
  }

  const member = findAdmin(family);

  return (
    <li key={family._id} className="family-component" onClick={window.location.assign(`/family/${family._id}`)}>
      <h3>{family.familyName}</h3>
      {member ? <Nickname member /> : null}
    </li>
  )
}