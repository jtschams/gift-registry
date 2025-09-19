import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { useWishlistContext } from '../pages/ManageWishlist';
import { ranks, amounts } from '../utils/enums';

export default function Wish({ answer }) {

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