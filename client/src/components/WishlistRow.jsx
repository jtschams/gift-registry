import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { EDIT_ANSWER, REMOVE_ANSWER } from '../utils/mutations'
import { useWishlistContext } from '../pages/ManageWishlist';
import { ranks, amounts } from '../utils/enums';

export default function Wish({ answer }) {

  const [wishState, setWishState] = useState({
    answerId: answer._id,
    answerText: answer.answerText,
    answerLink: answer.answerLink + "",
    rank: answer.rank
  })

  const showButtons = (event) => {
    event.preventDefault();
    const selected = event.target.closest(".wishlist-row:not(.editing)");
    document.querySelectorAll(".wish-actions > .wish-form:not(.invisible)").forEach((el) => el?.classList.add("invisible"));
    document.querySelectorAll(".wishlist-row.editing").forEach((el) => el?.classList.remove("editing"));
    selected?.classList.add("editing");
  }

  const handleOpenEdit = (event) => {
    event.preventDefault();
    document.querySelectorAll(".wish-actions > .wish-form:not(.invisible)").forEach((el) => el?.classList.add("invisible"));
    // TODO: on .editing change from buttons to form with edit and delete buttons maybe hide h4s apart from name
    event.target.closest(".wish-actions").querySelector(".wish-form").classList.remove("invisible");
  }

  const handleEditWish = (event) => {
    event.preventDefault();
  }

  const handleRemoveWish = (event) => {
    event.preventDefault();
  }

  const handleWishState = (event) => {
    let { name, value } = event.target;
    value = name === "amount" || name === "rank" ? parseInt(value) : value;
    setWishState({
      ...wishState,
      [name]: value
    });
  };

  return (
    <article id={answer._id} className="wishlist-row">
      <div className="wishlist-details">
        <h4 className="wishlist-options">
          <figure className='burger miniburger' onClick={showButtons}>
            <div className='bar1'></div>
            <div className='bar2'></div>
            <div className='bar3'></div>
          </figure>
        </h4>
        <h4 className="wishlist-item">
          {answer.answerLink ? (<a href={answer.answerLink} className="answer-link">{answer.answerText}</a>) : <>{answer.answerText}</>}
        </h4>
        <h4 className="wishlist-rank">{ranks[answer.rank]}</h4>
        <h4 className="wishlist-amount">{amounts[answer.amount]}</h4>
      </div>
      <div className="wish-actions">
        <div className="wish-buttons">
          <button className="wide-button" onClick={handleOpenEdit}>Edit Wish</button><button className="wide-button" onClick={handleRemoveWish}>Remove Wish</button>
        </div>
        <form className="wish-form invisible" onSubmit={handleEditWish}>
          <div className="form-wish-details">
            <div className="form-group">
              <label htmlFor="answer-text">Wishlist Item:</label>
              <input
                id="answer-text"
                className="answer-input"
                placeholder="Answer"
                name="answerText"
                type="text"
                value={wishState.answerText}
                onChange={handleWishState}
              />
            </div>
            <div className="form-group">
              <label htmlFor="answer-link">Link to your Wishlist Item (Optional):</label>
              <input
                id="answer-link"
                className="answer-input"
                placeholder="Answer Link"
                name="answerLink"
                type="text"
                value={wishState.answerLink}
                onChange={handleWishState}
              />
            </div>
          </div>
          <div className="form-wish-numbers">
            <div className="form-group">
              <label htmlFor="answer-rank">How much do you want this item?</label>
              <select
                id="answer-rank"
                className="answer-input"
                name="rank"
                value={wishState.rank}
                onChange={handleWishState}
              >
                <option value={0}>Really Want to Have</option>
                <option value={1}>Great to Have</option>
                <option value={2}>Seems Interesting</option>
                <option value={3}>Could Always Use More</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="answer-amount">How may of this do you want?</label>
              <select
                id="answer-amount"
                className="answer-input"
                name="amount"
                value={wishState.amount}
                onChange={handleWishState}
              >
                <option value={1}>Only One</option>
                <option value={2}>More than one</option>
              </select>
            </div>
          </div>
          <button type="submit" className="wide-button">Edit Wish</button>
        </form>
      </div>
    </article>
  )
}