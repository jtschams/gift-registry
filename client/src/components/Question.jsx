import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ANSWER_QUESTION } from '../utils/mutations'
import { useQuestionContext } from '../pages/Questions';

export default function Question({ question }) {

  const [ questionState, setQuestionState ] = useQuestionContext();
  const [ answerState, setAnswerState ] = useState({
    answerText: '',
    answerLink: '',
    amount: question.claimable ? 1 : 0
  });

  const [answerQuestion] = useMutation(ANSWER_QUESTION);

  const handleAnswerQuestion = async (event) => {
    event.preventDefault();
    const {data} = await answerQuestion({
      variables: { ...answerState, questionId: questionState }
    });
    //  TODO: change alert to dialog
    alert("Answer added to your account.");
    setAnswerState({answerText: '', answerLink: ''});
    setQuestionState(null);
    document.getElementById(question._id).querySelector("form").classList.add("invisible");
  }

  const handleAnswerChange = (event) => {
    let { name, value } = event.target;
    value = name === "amount" ? parseInt(value, 10) : value;
    setAnswerState({
      ...answerState,
      [name]: value
    });
  };

  const activateQuestion = async (event) => {
    document.getElementById(questionState)?.querySelector("form").classList.add("invisible");
    setQuestionState(question._id);
    document.getElementById(question._id).querySelector("form").classList.remove("invisible");
  }

  return (
    <article id={question._id} className="question-component" onClick={activateQuestion}>
      <h4>{question.question}</h4>
      <form className="question-form invisible" onSubmit={handleAnswerQuestion}>
        <div className="form-group">
          <label htmlFor="answer-text">Answer:</label>
          <input
            id="answer-text"
            className="answer-input"
            placeholder="Answer"
            name="answerText"
            type="text"
            value={answerState.answerText}
            onChange={handleAnswerChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer-link">Link to your Answer (Optional):</label>
          <input
            id="answer-link"
            className="answer-input"
            placeholder="Answer Link"
            name="answerLink"
            type="text"
            value={answerState.answerLink}
            onChange={handleAnswerChange}
          />
        </div>
        {!question.claimable ? null : (
        <div className="form-group">
          <label htmlFor="answer-amount">How may of this do you want?</label>
          <select
            id="answer-amount"
            className="answer-input"
            name="amount"
            value={answerState.amount}
            onChange={handleAnswerChange}
          >
            <option value={0} hidden>(General Question)</option>
            <option value={1}>Only One</option>
            <option value={2}>More than one</option>
          </select>
        </div>
        )}
        <button type="submit">Submit Answer</button>
      </form>
    </article>
  )
}