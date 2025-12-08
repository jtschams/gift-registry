import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { REMOVE_MEMBER } from '../utils/mutations'
import Nickname from './Nickname';
import { usePopupContext } from '../App';

export default function RelatedUser({friend, family, isAdmin}) {
  const { openPopup, closePopup } = usePopupContext();
  const [removeMember] = useMutation(REMOVE_MEMBER)

  const handleRemoveMember = async (event) => {
    event.preventDefault();
    if (!confirm(`Remove ${friend.nickname} (${friend.user.name}) from group?`)) return;
    const {data} = await removeMember({ variables: {
      familyId: family._id,
      userId: friend.user._id
    }});

    const options = [{
      text: "Return to Page",
      onClick: closePopup
    }];
    openPopup("Member Removed", "The member has been removed from this family.", options);

    family = data.removeMember.family;
  }

  return (
    <article className="single-friend">
      <h4>{(family ? friend.nickname : friend.user.name)}</h4>
      {/*  // TODO: Maybe Include full name for family members? */}
      {!family ? friend.relations.map((relation) => {
        return <Nickname 
          key={friend.user._id + relation.familyName} 
          member={relation}
        />}
      ) : null}
      <div className="member-buttons">
        <Link className="select-user button" to={"/user-answers/" + friend.user._id}>View Preferences</Link>
        <Link className="select-user button" to={"/wishlist/" + friend.user._id}>View Wishlist</Link>
      </div>
      {isAdmin ? (<><div className="admin-buttons invisible"><button className="select-user" onClick={handleRemoveMember}>Remove Member</button>
      </div></>) : null}
    </article>
  )
}