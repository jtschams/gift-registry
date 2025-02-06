import React from 'react';
import Answer from './Answer';

export default function AnswerSet({ answerSet }, { relations }) {
  return (
    <article className="answer-set">
      <h3>{answerSet.question.question}</h3>
      {answerSet.answers.map((answer) => (
        <Answer key={answer._id} answer={answer} claimInfo={{ relations, questionId: answerSet.question._id }}/>
      ))}
    </article>
  )
}