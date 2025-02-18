import React from 'react';
import { useParams } from 'react-router-dom';
import Answer from './Answer';

export default function AnswerSet({ answerSet , relations }) {
  const {userId} = useParams();

  return (
    <article className="answer-set">
      <h4>{answerSet.question.question}</h4>
      <section className={userId ? "card-container" : null}>
        {answerSet.answers.map((answer) => (
          <Answer key={answer._id} answer={answer} claimInfo={{ relations, questionId: answerSet.question._id }}/>
        ))}
      </section>
    </article>
  )
}