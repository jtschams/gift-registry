import React from 'react';

export default function Nickname({ member, small }) {

  function selectSize() {
    if (small) return (<><small>{member.nickname}</small><small>({getFamilyName()})</small></>);
    else return (<><p>{member.nickname}</p><p>({getFamilyName()})</p></>);
  }

  function getFamilyName() {
    if  (!member.familyName) return member.user?.name;
    else if (!member.familyId) return "in " + member.familyName;
    else return (<>in <a href={"/family/" + member.familyId}>{member.familyName}</a></>)
  }

  return (
    <div className="nickname">{selectSize()}</div>
  )
}