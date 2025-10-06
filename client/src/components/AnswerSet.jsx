import React from 'react';
import { useParams } from 'react-router-dom';
import Answer from './Answer';

export default function AnswerSet({ answerSet, relations, activateQuestion }) {
  const {userId} = useParams();

  return (
    <article className="answer-set">
      <h4>{answerSet.question.question}</h4>
      <ul className="card-container">
        {answerSet.answers.map((answer) => (
          <Answer key={answer._id} answer={answer} claimInfo={{ relations, questionId: answerSet.question._id }} activateQuestion={activateQuestion} />
        ))}
      </ul>
    </article>
  )
}