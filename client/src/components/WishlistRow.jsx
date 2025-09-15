import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { useWishlistContext } from '../pages/ManageWishlist';

export default function Wish({ answer }) {

  const ranks = [
    "Rank 1",
    "Rank 2",
    "Rank 3",
    "Rank 4",
    "Rank 5"
  ];

  const amounts = [
    "General Request",
    "Only One",
    "More Than One"
  ];

  return (
    <article id={answer._id} className="wishlist-row">
      <div className="wishlist-details">
        <h4 className="wishlist-item">
          {answer.answerLink ? (<a href={answer.answerLink} className="answer-link">{answer.answerText}</a>) : <>{answer.answerText}</>}
        </h4>
        <h4 className="wishlist-rank">{ranks[answer.rank]}</h4>
        <h4 className="wishlist-amount">{amounts[answer.amount]}</h4>
      </div>
    </article>
  )
}