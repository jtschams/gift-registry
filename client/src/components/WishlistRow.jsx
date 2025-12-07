import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { EDIT_ANSWER, REMOVE_ANSWER } from '../utils/mutations'
import { ranks, amounts } from '../utils/enums';

export default function Wish({ answer }) {

  const [wishState, setWishState] = useState({
    answerId: answer._id,
    answerText: answer.answerText,
    answerLink: answer.answerLink + "",
    rank: answer.rank,
    amount: answer.amount
  })

  const [editWish] = useMutation(EDIT_ANSWER, {
    refetchQueries: [
      'MyWishlist'
    ]
  });
  const [removeWish] = useMutation(REMOVE_ANSWER, {
    refetchQueries: [
      'MyWishlist'
    ]
  });

  const showButtons = (event) => {
    event.preventDefault();
    const selected = event.target.closest(".wishlist-row:not(.editing)");
    document.querySelectorAll(".row-actions > .wish-form:not(.invisible)").forEach((el) => el?.classList.add("invisible"));
    document.querySelectorAll(".wishlist-row.editing").forEach((el) => el?.classList.remove("editing"));
    selected?.classList.add("editing");
  }

  const handleOpenEdit = (event) => {
    event.preventDefault();
    document.querySelectorAll(".row-actions > .wish-form:not(.invisible)").forEach((el) => el?.classList.add("invisible"));
    // TODO: on .editing change from buttons to form with edit and delete buttons maybe hide h4s apart from name
    event.target.closest(".row-actions").querySelector(".wish-form").classList.remove("invisible");
  }

  const handleEditWish = async (event) => {
    event.preventDefault();
    const {data} = await editWish({
      variables: { ...wishState }
    });
    // TODO: Create Popup Component
    alert("Wish has been updated.");
    
    answer = wishState;
        
    event.target.closest(".wishlist-row.editing").classList.remove("editing");
    event.target.classList.add("invisible");
  }

  const handleRemoveWish = async (event) => {
    event.preventDefault();
    const data = await removeWish({
      variables: { answerId: wishState.answerId }
    })
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
      <div className="row-details">
        <h4 className="row-options">
          <figure className='burger miniburger' onClick={showButtons}>
            <div className='bar1'></div>
            <div className='bar2'></div>
            <div className='bar3'></div>
          </figure>
        </h4>
        <h4 className="row-content">
          {answer.answerLink ? (<a href={answer.answerLink} target="_blank" className="answer-link">{answer.answerText}</a>) : <>{answer.answerText}</>}
        </h4>
        <h4 className="row-info">{ranks[answer.rank][1]}</h4>
        <h4 className="row-info">{amounts[answer.amount]}</h4>
      </div>
      <div className="row-actions">
        <div className="row-buttons">
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
                {ranks.map(([rank], index) => <option value={index}>{rank}</option> )}
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
          <button type="submit" className="wide-button">Save Wish</button>
        </form>
      </div>
    </article>
  )
}