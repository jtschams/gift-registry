import React from 'react';

import Nickname from './Nickname';

export default function RelatedUser({user}) {

  const handleSelectUser = () => {
    window.location.assign(`/user-answers/${user.user._id}`)
  }

  return (
    <article className="single-friend">
      <h4>{user.user.name}</h4>
      {user.relations.map((relation) => {
        return <Nickname 
          key={user.user._id + relation.familyName} 
          member={relation}
        />}
      )}
      <button className="select-user" onClick={handleSelectUser}>View User Answers</button>
    </article>
  )
}