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
  let relations = null;
  if (!loading) {
    for (const answerSet of data[queryName]) sortedAnswers[answerSet.question.category].push(answerSet);
    if (data.relatedUser) {
      relations = data.relatedUser.find((member) => member.user._id = userId).relations;
      relations.push({ familyName: 'default', nickname: data.relatedUser.find((member) => member.user._id = userId).user.name });
    }
  };

  return (
    <>
      {loading ? "Loading..." : (Object.keys(sortedAnswers).map((category) => (<>
        <h2 className="category-header">{category}</h2>
        <section key={category}>
          {sortedAnswers[category].map((answerSet) => (
            <AnswerSet key={answerSet.question._id} answerSet={answerSet} relations={relations}/>
          ))}
        </section>
      </>)))}
    </>
  )
}