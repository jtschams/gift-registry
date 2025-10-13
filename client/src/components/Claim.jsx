import React from 'react';
import { useMutation } from '@apollo/client';

import { UNCLAIM_ANSWER } from '../utils/mutations';

export default function Claim({claim}) {

  const [unclaimAnswer] = useMutation(UNCLAIM_ANSWER);

  const handleUnclaim = async (event) => {
    event.preventDefault();
    const claimEl = document.getElementById("claim-" + claim.answer._id);
    const {data} = await unclaimAnswer({variables: {
      answerId: claim.answer._id,
    }});
    claimEl.remove();
    alert("Claim removed.");
  }

  return (
    <article id={"claim-" + claim.answer._id} className="single-claim">
      <article className="single-answer">
        <div className="answer-details">  
          <p>{claim.answer.answerText}</p>
          {claim.answer.answerLink ? (<a href={claim.answer.answerLink} target="_blank" className="answer-link">(Link)</a>) : null}
        </div>
      </article>
      <button className="unclaim-button" onClick={handleUnclaim}>Unclaim Answer</button>
      <div className="claim-details">
        <small>{claim.question?.question || "Wishlist Item"}</small>
        <small>For User: {claim.nickname || claim.user.name}</small>
      </div>
    </article>
  )
}