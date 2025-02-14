import React from 'react';

import Answer from '../components/Answer'

export default function Claim({claim}) {

  const handleUnclaim = (event) => {
    event.preventDefault();
    // TODO: Write function once resolver present
  }

  return (
    <article className="single-claim">
      <Answer answer={claim.answer}/>
      <button className="unclaim-button" onClick={handleUnclaim}>Unclaim Answer</button>
      <div className="claim-details">
        <small>{claim.question.question}</small>
        <small>For User: {claim.nickname || claim.user.name}</small>
      </div>
    </article>
  )
}