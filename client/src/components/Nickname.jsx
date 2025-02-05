import React from 'react';

export default function Nickname(member, familyName) {

  return (
    <div className="nickname"><p>{member.nickname}</p><p>{familyName || member.user?.name}</p></div>
  )
}