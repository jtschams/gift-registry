// TODO: Answer component claimAnswer call
// Calls "claimAnswer" Mutation resolver[UserAnswers] {MyClaims on submit}
import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { CLAIM_ANSWER } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Answer({ answer }, { claimInfo }) {
  const { userId } = useParams();
  const isClaimable = userId && answer.amount - (answer.claims > 0) && !(answer.claims.some((user) => user._id == Auth.getProfile().data._id));

  let claimForm = null;

  if (claimInfo && isClaimable) {
    const [ nicknameState, setNicknameState ] = useState(claimInfo.relations[0].nickname);
  
    const [claimAnswer] = useMutation(claimAnswer);

    const handleClaimAnswer = async (event) => {
      event.preventDefault();
      const {data} = await claimAnswer({variables: {
        userId,
        questionId: claimInfo.questionId,
        answerId: answer._id,
        nickname: nicknameState
      }});
      alert("Answer Claimed.");
      document.querySelector(`#${answer._id} > form`).remove();
    }

    const handleNicknameChange = (event) => {
      const { value } = event.target;
      setNicknameState(value);
    }

    const generateClaimForm = () => {
      return (<form className="claim-answer-form" onSubmit={handleClaimAnswer}>
        <button type="submit">Claim Answer</button>
        <div class="form-group">
          <label htmlFor="claim-nickname">Nickname</label>
          <select
            id="claim-nickname"
            className="claim-input"
            value={nicknameState}
            onChange={handleNicknameChange}
          >
            {claimInfo.relations.map((relation) => (
              <option key={relation.familyName}>{relation.nickname}</option>
            ))}
          </select>
        </div>
      </form>
      )
    }

    claimForm = generateClaimForm();
  }

  return (
    <div id={answer._id} className="single-answer">
      <p>{answer.answerText}</p>
      {answer.answerLink ? (<a href={answer.answerLink} className="answer-link">Link</a>) : null}
      {claimForm}
    </div>
  )
}