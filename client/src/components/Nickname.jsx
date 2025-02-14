import React from 'react';

export default function Nickname({ member }) {

  return (
    <div className="nickname"><p>{member.nickname}</p><p>({member.familyName ? "in " + member.familyName : member.user?.name})</p></div>
  )
}