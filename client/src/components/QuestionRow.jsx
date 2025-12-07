import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { EDIT_QUESTION, REMOVE_QUESTION } from '../utils/mutations'

export default function Question({ question, family, isAdmin }) {

  const [questionState, setQuestionState] = useState({
    questionId: question._id,
    question: question.question,
    category: question.category,
    claimable: question.claimable,
    familyId: family._id
  });

  const [editQuestion] = useMutation(EDIT_QUESTION);
  const [removeQuestion] = useMutation(REMOVE_QUESTION);

  const showButtons = (event) => {
    event.preventDefault();
    const selected = event.target.closest(".question-row:not(.editing)");
    document.querySelectorAll(".row-actions > .question-form:not(.invisible)").forEach((el) => el?.classList.add("invisible"));
    document.querySelectorAll(".question-row.editing").forEach((el) => el?.classList.remove("editing"));
    selected?.classList.add("editing");
  }

  const handleOpenEdit = (event) => {
    event.preventDefault();
    document.querySelectorAll(".row-actions > .question-form:not(.invisible)").forEach((el) => el?.classList.add("invisible"));
    // TODO: on .editing change from buttons to form with edit and delete buttons maybe hide h4s apart from name
    event.target.closest(".row-actions").querySelector(".question-form").classList.remove("invisible");
  }

  const handleEditQuestion = async (event) => {
    event.preventDefault();
    const {data} = await editQuestion({
      variables: { ...questionState }
    });
    // TODO: Create Popup Component
    alert("Wish has been updated.");
    
    //question = questionState;
    family = data.editQuestion.family
        
    event.target.closest(".question-row.editing").classList.remove("editing");
    event.target.classList.add("invisible");
    
  }

  const handleRemoveQuestion = async (event) => {
    event.preventDefault();
    const data = await removeQuestion({
      variables: { 
        questionId: questionState.questionId,
        familyId: family._id
      }
    })

    family = data.removeQuestion.family
  }

  const handleQuestionState = (event) => {
    let { name, value } = event.target;
    setQuestionState({
      ...questionState,
      [name]: value
    });
  };

  return (
    <article id={question._id} className="question-row">
      <div className="row-details">
        {isAdmin ? (<h4 className="row-options">
          <figure className='burger miniburger' onClick={showButtons}>
            <div className='bar1'></div>
            <div className='bar2'></div>
            <div className='bar3'></div>
          </figure>
        </h4>) : null}
        <h4 className="row-content">{question.question}</h4>
        <h4 className="row-info">{question.category}</h4>
        <h4 className="row-info">{(question.claimable ? <>Claimable</> : <>Not Claimable</>)}</h4>
      </div>
      {isAdmin ? (<div className="row-actions">
        <div className="row-buttons">
          <button className="wide-button" onClick={handleOpenEdit}>Edit Question</button>
          <button className="wide-button" onClick={handleRemoveQuestion}>Remove Question</button>
        </div>
        <form className="question-form invisible" onSubmit={handleEditQuestion}>
          <div className="form-group">
            <label htmlFor="question">Question</label>
            <input
              id="question"
              className="question-input"
              placeholder="Question"
              name="question"
              type="text"
              value={questionState.question}
              onChange={handleQuestionState}    
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="question-input"
              name="category"
              value={questionState.category}
              onChange={handleQuestionState}
            >
              <option>Likes</option>
              <option>Sizes Etc</option>
              <option>Dislikes</option>
              <option>Miscellaneous</option>
            </select>
          </div>
          <button type="submit">Save Question</button>
        </form>
      </div>) : null}
    </article>
  )
}