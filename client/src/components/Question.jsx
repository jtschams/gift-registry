import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ANSWER_QUESTION, EDIT_ANSWER, REMOVE_ANSWER } from '../utils/mutations'
import { getErrorMessage } from '../utils/popup';
import { useQuestionContext } from '../pages/Questionnaire';
import AnswerSet from '../components/AnswerSet';
import { usePopupContext } from '../App';

export default function Question({ answerSet }) {
  const question = answerSet.question;

  const { openPopup, closePopup } = usePopupContext();
  const [ questionState, setQuestionState ] = useQuestionContext();
  const [ answerState, setAnswerState ] = useState({
    answerId: '',
    answerText: '',
    answerLink: '',
    amount: question.claimable ? 1 : 0
  });

  const [answerQuestion] = useMutation(ANSWER_QUESTION);
  const [editAnswer] = useMutation(EDIT_ANSWER);
  const [removeAnswer] = useMutation(REMOVE_ANSWER);
  
  const options = [{
    text: "Return to Page",
    onClick: closePopup
  }];

  const handleSaveAnswer = async (event) => {
    event.preventDefault();
    if (answerState.answerId == '') await handleAnswerQuestion()
    else await handleEditAnswer();
  }

  const handleAnswerQuestion = async () => {
    try {
      const {data} = await answerQuestion({
        variables: { ...answerState, questionId: questionState }
      });
        
      openPopup("Question Answered", "The answer has been added to you account", options);
  
      answerSet.answers = data.answerQuestion.answers;
      setAnswerState({answerText: '', answerLink: '', amount: question.claimable ? 1 : 0 });
      setQuestionState(null);
  
      document.getElementById(question._id).querySelector(".question-form").classList.add("invisible");
      document.getElementById(question._id).querySelector(".single-answer.editing").classList.remove("editing");
    } catch (err) {
      const options = [{
        text: "Return to Page",
        onClick: closePopup
      }];
      const [title, message] = getErrorMessage(err.message)

      openPopup(title, message, options);
      return;
    }
  }

  const handleEditAnswer = async () => {
    try {
      const {data} = await editAnswer({
        variables: { ...answerState, questionId: questionState }
      });
  
      openPopup("Answer Updated", "The answer has been updated.", options);
      
      let answerList = [...answerSet.answers];
      const answerIndex = answerList.findIndex(a => a._id == answerState.answerId);
      answerList.splice(answerIndex, 1, data.editAnswer)
      
      answerSet.answers = answerList;
      setAnswerState({ answerId: '', answerText: '', answerLink: '', amount: question.claimable ? 1 : 0 });
      setQuestionState(null);
          
      document.getElementById(question._id).querySelector(".question-form").classList.add("invisible");
      document.getElementById(question._id).querySelector(".single-answer.editing").classList.remove("editing");
    } catch (err) {
      const options = [{
        text: "Return to Page",
        onClick: closePopup
      }];
      const [title, message] = getErrorMessage(err.message)

      openPopup(title, message, options);
      return;
    }
  }

  const handleRemoveAnswer = async (event) => {
    event.preventDefault();
    try {
      const data = await removeAnswer({
        variables: { questionId: question._id, answerId: answerState.answerId }
      })
  
      openPopup("Answer Removed", "The answer has been removed from you account.", options);
      
      let answerList = [...answerSet.answers];
      const answerIndex = answerList.findIndex(a => a._id == answerState.answerId);
      answerList.splice(answerIndex, 1)
      
      answerSet.answers = answerList;
      setAnswerState({ answerId: '', answerText: '', answerLink: '', amount: question.claimable ? 1 : 0 });
      setQuestionState(null);
  
      document.getElementById(question._id).querySelector(".question-form").classList.add("invisible");
    } catch (err) {
      const options = [{
        text: "Return to Page",
        onClick: closePopup
      }];
      const [title, message] = getErrorMessage(err.message)

      openPopup(title, message, options);
      return;
    }
  }

  const handleAnswerChange = (event) => {
    let { name, value } = event.target;
    value = name === "amount" ? parseInt(value) : value;
    setAnswerState({
      ...answerState,
      [name]: value
    });
  };

  const handleLoadAnswer = (answerId) => {
    const answer = answerSet?.answers?.find(a => a._id == answerId);
    if (answer) setAnswerState({ answerId: answer._id, answerText: answer.answerText, answerLink: answer.answerLink, amount: answer.amount });
    else setAnswerState({ answerId: '', answerText: '', answerLink: '', amount: question.claimable ? 1 : 0 });
  }

  const activateQuestion = async (event) => {
    const previous = document.getElementById(questionState);
    const active = document.getElementById(question._id);
    const close = !!event.target.closest(".miniburger")?.closest(".editing")
    // Hide question form and question form buttons.  Show all answer cards as normal
    previous?.querySelector(".question-form").classList.add("invisible");
    previous?.querySelector(".editing")?.classList.remove("editing");
    document.querySelectorAll(".answer-button").forEach((button) => button.classList.add("invisible"));
    // Unselect if clicking close button
    if (close) {
      setQuestionState(null);
      setAnswerState({ answerId: '', answerText: '', answerLink: '', amount: question.claimable ? 1 : 0 });
      return;
    }
    // Set active question and load answer
    setQuestionState(question._id);
    handleLoadAnswer(event.target.closest(".single-answer").id);
    // Show form and hide answer card
    active.querySelector(".question-form").classList.remove("invisible");
    event.target.closest(".single-answer").classList.add("editing");
    // Show correct buttons
    if (event.target.closest(".single-answer").id) active.querySelectorAll(".edit-answer").forEach((btn) => btn.classList.remove("invisible"));
    else active.querySelector("button.add-answer").classList.remove("invisible");
  }

  return (
    <section id={question._id} className="question-component">
      {!answerSet.answers ?
        <article className="answer-set"><h4>{question.question}</h4></article> :
        <AnswerSet answerSet={answerSet} relations={null} activateQuestion={activateQuestion} />
      }
      <article className="inactive-question">
        <article className="single-answer add-answer" onClick={activateQuestion}><div className="answer-details"><h4>+ Add Answer</h4></div></article>
        <article className="question-form invisible">
          <form onSubmit={handleSaveAnswer}>
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
            <button className="answer-button edit-answer add-answer invisible" type="submit">Save Answer</button>
            <button className="answer-button edit-answer invisible" type="button" onClick={handleRemoveAnswer}>Remove Answer</button>
          </form>
        </article>
      </article>
    </section>
  )
}