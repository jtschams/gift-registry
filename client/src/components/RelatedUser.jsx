// TODO: RelatedUser Component
// Enter from MyFriends or JoinFamily
//// Calls nothing
// Links to UserAnswers[MyFriends]
// Contains component Nickname via Input Information
import React from 'react';

import Nickname from './Nickname';

export default function RelatedUser({user}) {

  const handleSelectUser = () => {
    window.location.assign(`/user-answers/${user.user._id}`)
  }

  return (
    <article className="single-friend">
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