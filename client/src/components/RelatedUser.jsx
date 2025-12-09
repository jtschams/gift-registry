import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { REMOVE_MEMBER } from '../utils/mutations'
import Nickname from './Nickname';
import { usePopupContext } from '../App';
import { getErrorMessage } from '../utils/popup';

export default function RelatedUser({friend, family, isAdmin}) {
  const { openPopup, closePopup } = usePopupContext();
  const [removeMember] = useMutation(REMOVE_MEMBER)

  function confirmRemoveMember(event) {
    event.preventDefault();
    const options = [{
      text: "Remove",
      onClick: handleRemoveMember
    },{
      text: "Cancel",
      onClick: closePopup
    }]

    openPopup("Remove Member?",  `Remove ${friend.nickname} (${friend.user.name}) from this group?`, options);
  }

  const handleRemoveMember = async () => {
    try {
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
    } catch (err) {
      const options = [{
        text: "Return to Page",
        onClick: closePopup
      }];
      const [title, message] = getErrorMessage(err.message)

      openPopup(title, message, options);
      return;
    }
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
      {isAdmin ? (<><div className="admin-buttons invisible"><button className="select-user" onClick={confirmRemoveMember}>Remove Member</button>
      </div></>) : null}
    </article>
  )
}