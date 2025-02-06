import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { MY_ANSWERS, USER_ANSWERS } from '../utils/queries';
import AnswerSet from '../components/AnswerSet';


export default function MyAnswers() {
  const { userId } = useParams();
  const answerQuery = userId ? USER_ANSWERS : MY_ANSWERS;
  const queryName = userId ? "userAnswers" : "myAnswers";
  
  const { loading, data } = useQuery(answerQuery, { variables: { userId } });
  const sortedAnswers = {
    "General Questions": [],
    "Sizes and Qualities": [],
    "Specific Gifts": [],
    "Dislikes": []
  };
  if (!loading) for (const answerSet of data[queryName]) {
    sortedAnswers[answerSet.question.category].push(answerSet)
  };

  return (
    <>
      {loading ? "Loading..." : (Object.keys(sortedAnswers).map((category) => (
        <section key={category}>
          <h2 className="question-category">{category}</h2>
          {sortedAnswers[category].map((answerSet) => (
            <AnswerSet key={answerSet.question._id} answerSet={answerSet}/>
          ))}
        </section>
      )))}
    </>
  )
}