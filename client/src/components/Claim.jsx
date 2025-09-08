import React from 'react';

import Answer from '../components/Answer'

export default function Claim({claim}) {

  const handleUnclaim = (event) => {
    event.preventDefault();
    // TODO: Write function once resolver present
  }

  return (
    <article className="single-claim">
      <article className="single-answer">
        <div className="answer-details">  
          <p>{claim.answer.answerText}</p>
          {claim.answer.answerLink ? (<a href={claim.answer.answerLink} className="answer-link">(Link)</a>) : null}
        </div>
      </article>
      <button className="unclaim-button" onClick={handleUnclaim}>Unclaim Answer</button>
      <div className="claim-details">
        <small>{claim.question.question}</small>
        <small>For User: {claim.nickname || claim.user.name}</small>
      </div>
    </article>
  )
}