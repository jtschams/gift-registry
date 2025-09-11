import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { useWishlistContext } from '../pages/Wishlist';
import { CLAIM_ANSWER } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Wish({ answer, relations }) {
  const { userId } = useParams();
  const isClaimable = userId && answer.amount - (answer.claims > 0) && !(answer.claims.some((user) => user._id == Auth.getProfile().data._id));

  const generateClaimForm = () => {

    if (!relations || answer.amount === 0) return;
    if (!isClaimable) return (<button className="already-claimed">Claimed by Someone Else</button>);
    
    const [ wishlistState, setWishlistState ] = useWishlistContext();
    const [ nicknameState, setNicknameState ] = useState(relations[0].nickname);
  
    const [claimAnswer] = useMutation(CLAIM_ANSWER);

    const handleClaimAnswer = async (event) => {
      event.preventDefault();
      const {data} = await claimAnswer({variables: {
        userId,
        answerId: answer._id,
        nickname: nicknameState
      }});
      alert("Answer Claimed.");
      window.location.replace('/shopping-list');
    }

    const handleNicknameChange = (event) => {
      const { value } = event.target;
      setNicknameState(value);
    }

    const activateClaim = async (event) => {
      const formerClaim = document.getElementById(wishlistState);
      formerClaim?.classList.remove("invisible");
      formerClaim?.nextElementSibling.classList.add("invisible");
      setWishlistState(`claim-${answer._id}`);
      event.target.classList.add("invisible");
      event.target.nextElementSibling.classList.remove("invisible");
    }  
  
    return (
      <>
        <button id={`claim-${answer._id}`} onClick={activateClaim}>Claim Answer</button>
        <form className="claim-answer-form invisible" onSubmit={handleClaimAnswer}>
          <div className="form-group">
            <label htmlFor="claim-nickname">Select Nickname for Claim</label>
            <select
              id="claim-nickname"
              className="claim-input"
              value={nicknameState}
              onChange={handleNicknameChange}
            >
              {relations.map((relation) => (
                <option key={relation.familyName}>{relation.nickname}</option>
              ))}
            </select>
          </div>
          <button className="confirm-claim" type="submit">Confirm Claim</button>
        </form>
      </>
    )
  }

  return (
    <li id={answer._id} className="single-answer">
      <div className="answer-details">  
        <h4>{answer.answerText}</h4>
        {answer.answerLink ? (<a href={answer.answerLink} className="answer-link">(Link)</a>) : null}
      </div>
      {generateClaimForm()}
    </li>
  )
}