import React from 'react';
import { useMutation } from '@apollo/client';

import { REMOVE_MEMBER } from '../utils/mutations'

export default function FamilyMember({member, family, isAdmin}) {

  const [removeMember] = useMutation(REMOVE_MEMBER)

  const handleSelectAnswers = () => {
    window.location.assign(`/user-answers/${member.user._id}`)
  }

  const handleSelectWishlist = () => {
    window.location.assign(`/wishlist/${member.user._id}`)
  }

  const handleRemoveMember = async (event) => {
    event.preventDefault();
    if (!confirm(`Remove ${member.nickname} (${member.user.name}) from group?`)) return;
    const {data} = await removeMember({ variables: {
      familyId: family._id,
      userId: member.user._id
    }});
    //  TODO: change alert to dialog
    alert("Member Removed.");
    family = data.removeMember.family;
  }

  return (
    <article className="single-friend">
      <h4>{member.nickname}</h4>
      {/*  // TODO: Maybe Include full name? */}
      <div className="member-buttons">
        <button className="select-user" onClick={handleSelectAnswers}>View Preferences</button>
        <button className="select-user" onClick={handleSelectWishlist}>View Wishlist</button>
      </div>
      {isAdmin ? (<><div className="admin-buttons invisible"><button className="select-user" onClick={handleRemoveMember}>Remove Member</button>
      </div></>) : null}
    </article>
  )
}