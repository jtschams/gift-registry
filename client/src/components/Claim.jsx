import React from 'react';
import { useMutation } from '@apollo/client';

import { usePopupContext } from '../App';
import { UNCLAIM_ANSWER } from '../utils/mutations';

export default function Claim({claim}) {
  const { openPopup, closePopup } = usePopupContext();

  const [unclaimAnswer] = useMutation(UNCLAIM_ANSWER);

  const handleUnclaim = async (event) => {
    event.preventDefault();
    const claimEl = document.getElementById("claim-" + claim.answer._id);
    const {data} = await unclaimAnswer({variables: {
      answerId: claim.answer._id,
    }});
    claimEl.remove();
    const options = [{
      text: "Return to Page",
      onClick: closePopup
    }];
    openPopup("Claim Removed", "Your claim has been removed from this answer.  Answer removed from your shopping list.", options);
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