import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Family(family) {
  const location = useLocation().pathname.slice(1);

  const findAdmin = (family) => {
    if (!family.admins) { return false }
    const { name, _id } =  family.admins[0];
    const { nickname } = family.members?.find((member) => member._id === _id) || { nickname: name }
    return { name, nickname }
  }

  const familyAdmin = findAdmin(family);

  return (
    <li key={family._id} className="family-component" onClick={window.location.assign(`/family/${family._id}`)}>
      <h3>{family.familyName}</h3>
      {familyAdmin ? <div><p>{familyAdmin.name}</p><p>{familyAdmin.nickname}</p></div> : null}
    </li>
  )
}