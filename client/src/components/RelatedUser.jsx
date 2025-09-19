import React from 'react';

import Nickname from './Nickname';

export default function RelatedUser({user}) {

  const handleSelectAnswers = () => {
    window.location.assign(`/user-answers/${user.user._id}`)
  }

  const handleSelectWishlist = () => {
    window.location.assign(`/wishlist/${user.user._id}`)
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
      <button className="select-user" onClick={handleSelectAnswers}>View Preferences</button>
      <button className="select-user" onClick={handleSelectWishlist}>View Wishlist</button>
    </article>
  )
}