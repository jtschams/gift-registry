import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
// TODO: add useEffect? Activity 20/24

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
      variables: { ...answerState }
    });
    //  TODO: change alert to dialog
    alert("Answer added to your account.");
    setAnswerState({answerText: '', answerLink: ''});
    setQuestionState(null);
    document.getElementById(question._id).classList.toggle("active-question");
  }

  const handleAnswerChange = (event) => {
    const { name, value } = event.target;

    setAnswerState({
      ...answerState,
      [name]: value
    });
  };

  const activateQuestion = async (event) => {
    document.getElementById(questionState)?.classList.toggle("active-question");
    setQuestionState(question._id);
    document.getElementById(question._id).classList.toggle("active-question");
  }

  return (
    <article id={question._id} onClick={activateQuestion}>
      <h3>{question.question}</h3>
      <form className="question-form">
        <div className="form-group">
          <label htmlFor="answer-text">Answer</label>
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
          <label htmlFor="answer-link">Link to your Answer (Optional)</label>
          <input
            id="answer-link"
            className="answer-input"
            placeholder="Answer"
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
            placeholder="Answer"
            name="amount"
            value={answerState.amount}
            onChange={handleAnswerChange}
          >
            {/*// TODO: Confirm select functions properly */}
            <option value="0">(General Question)</option>
            <option value="1">Only One</option>
            <option value="2">More than one</option>
          </select>
        </div>
        )}
      </form>
    </article>
  )
}