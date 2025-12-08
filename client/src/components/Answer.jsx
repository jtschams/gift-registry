import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { useAnswerContext } from '../pages/Answers';
import { useWishlistContext } from '../pages/Wishlist';
import { CLAIM_ANSWER } from '../utils/mutations';
import Auth from '../utils/auth';
import { usePopupContext } from '../App';

export default function Answer({ answer, claimInfo, activateQuestion, relations }) {
  const { userId } = useParams();
  const { openPopup, closePopup } = usePopupContext();

  const isClaimable = userId && answer.amount - (answer.claims.length > 0);
  const myClaim = userId && (answer.claims.some((user) => user._id == Auth.getProfile().data._id));

  if (!relations) relations = claimInfo?.relations;

  const generateClaimForm = () => {

    if (!relations || answer.amount === 0) return;
    if (myClaim) return (<button className="already-claimed">You have already claimed this item.</button>);
    else if (!isClaimable) return (<button className="already-claimed">Claimed by Someone Else</button>);
    
    const [ answerState, setAnswerState ] = useAnswerContext() ? useAnswerContext() : useWishlistContext();
    //const [ wishlistState, setWishlistState ] = useWishlistContext();
    const [ nicknameState, setNicknameState ] = useState(relations[0].nickname);
  
    const [claimAnswer] = useMutation(CLAIM_ANSWER);

    const handleClaimAnswer = async (event) => {
      event.preventDefault();
      const {data} = await claimAnswer({variables: {
        userId,
        questionId: claimInfo?.questionId || null,
        answerId: answer._id,
        nickname: nicknameState
      }});

      // TODO: Handle after close
      const options = [{
        text: "Return to Page",
        onClick: closePopup
      },{
        text: "Go To Shopping List",
        href: "/shopping-list"
      }];
      openPopup("Answer Claimed", "Answer has been claimed and added to your shopping list.", options);
    }

    const handleNicknameChange = (event) => {
      const { value } = event.target;
      setNicknameState(value);
    }

    const activateClaim = async (event) => {
      const formerClaim = document.getElementById(answerState);
      formerClaim?.classList.remove("invisible");
      formerClaim?.nextElementSibling.classList.add("invisible");
      setAnswerState(`claim-${answer._id}`);
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
          <button className="confirm-claim" type="submit">Save Claim</button>
        </form>
      </>
    )
  }

  return (
    <li id={answer._id} className="single-answer">
      <div className="answer-details">
        {!activateQuestion ? null : <>
          <figure className='burger miniburger' onClick={activateQuestion}>
            <div className='bar1'></div>
            <div className='bar2'></div>
            <div className='bar3'></div>
          </figure>
        </>}
        <h4>{answer.answerText}</h4>
        {answer.answerLink ? (<a href={answer.answerLink} target="_blank" className="answer-link">(Link)</a>) : null}
      </div>
      {generateClaimForm()}
    </li>
  )
}