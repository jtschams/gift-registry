import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { FAMILY } from '../utils/queries';
import { JOIN_FAMILY } from '../utils/mutations';
import { getErrorMessage } from '../utils/popup';
import Nickname from '../components/Nickname';
import { usePopupContext } from '../App';

export default function JoinFamily() {
  // States and Variables
  const { openPopup, closePopup } = usePopupContext();
  const {familyId} = useParams();
  const [ nicknameState, setNicknameState ] = useState("");
  let family = null, members = null;

  // Functions and Mutations
  const [joinFamily] = useMutation(JOIN_FAMILY)
  
  // Query with Error Handling
  const { loading, data } = useQuery(FAMILY, { variables: { familyId } });
  family = data?.family.family;

  members = family?.members.filter((member) => member.user._id === family.admins[0]._id);
  
  const handleJoinFamily = async (event) => {
    event.preventDefault();
    try {
      const {data} = await joinFamily({ variables: {
        familyId,
        nickname: nicknameState
      }});
  
      const options = [{
        text: "Go To Family",
        href: "/family/" + familyId
      },{
        text: "Home",
        href: "/"
      }];

      openPopup("Family Joined", `You have sucessfully joined the "${family.familyName}" group.`, options, false)
    } catch (err) {
      console.log(err)

      const options = [{
        text: "Return to Page",
        onClick: closePopup
      },{
        text: "Home",
        href: "/"
      }];
      const [title, message] = getErrorMessage(err.message)

      openPopup(title, message, options);
      return;
    }
  }

  const handleNicknameChange = (event) => {
    const {value} = event.target;

    setNicknameState(value);
  }

  return (
    <>
      <h2>Do you want to join this group?</h2>
      {loading ? <h3 className="loading">Loading...</h3> :
        <article className="family-info">
          <h1>Group: {family.familyName}</h1>
            <div id="admins">
              <h3>Admins:</h3>
              {!members ? null : members.map((member) => (<Nickname key={member.user._id} member={member} />))}
            </div>
        </article>
      }
      <article id="join-container">
        <form>
          <div className="form-group">
            <label htmlFor="nickname">Enter your nickname in this group:</label>
            <input
              id="nickname"
              placeholder="Nickname(Optional)"
              name="nickname"
              type="text"
              value={nicknameState}
              onChange={handleNicknameChange}
            />
          </div>
          <button id="join-button" onClick={handleJoinFamily}>Join Group</button>
        </form>
      </article>
    </>
  )
}