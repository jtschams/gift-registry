// Calls "joinFamily" Mutation resolver {MyProfile on submit}
import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { FAMILY } from '../utils/queries';
import { JOIN_FAMILY } from '../utils/mutations';
import Nickname from '../components/Nickname';

export default function JoinFamily() {
  const [ nicknameState, setNicknameState ] = useState();
  const {familyId} = useParams();
  const [ data, loading ] = useQuery(FAMILY, { variables: { familyId } });
  const family = data?.family;
  const [joinFamily] = useMutation(JOIN_FAMILY)

  const findAdmin = (family) => {
    if (!family.admins) { return false }
    return family.members?.find((member) => member.user._id === family.admins[0]._id)
  }
  const member = findAdmin(family);

  const handleJoinFamily = async () => {
    const {data} = await joinFamily({ variables: {
      familyId,
      nickname: nicknameState
    }});
    alert("Joined family sucessfully.");
    window.location.assign('/');
  }

  const handleNicknameChange = (event) => {
    const {value} = event.target;

    setNicknameState(value);
  }

  return (
    <>
      <article id="join-container">
        <h1>Do you want to join this group?</h1>
        <div className="form-group">
          <label htmlFor="nickname">Enter your nickname for this group(Optional):</label>
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
      </article>
      <article className="family-info">
        <h3>{family.familyName}</h3>
        {member ? <Nickname member /> : null}
      </article>
    </>
  )
}