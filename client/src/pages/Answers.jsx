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
  let user = null;
  let relations = null;
  if (!loading) {
    for (const answerSet of data[queryName]) sortedAnswers[answerSet.question.category].push(answerSet);
    if (data.relatedUsers) {
      user = data.relatedUsers.find((member) => member.user._id === userId);
      const realName = [{ __typename: 'Relation', familyName: 'default', nickname: user.user.name }];
      relations = realName.concat(user.relations);
    }
  };

  return (
    <>
      {!userId ? null : loading ? <h1>Loading...</h1> : <>
        <h1 id="answers-user">{user.user.name}</h1>
        {user.relations.map((relation) => <div key={relation.familyName} className="user-nickname">
          <small>{relation.nickname}</small><small>({relation.familyName})</small>
        </div>)}
      </>}
      {loading ? <h3 className="loading">Loading...</h3> : (Object.keys(sortedAnswers).map((category) => (
        <section key={category}>
          <h2 className="category-header">{category}</h2>
          {sortedAnswers[category].map((answerSet) => (
            <AnswerSet key={answerSet.question._id} answerSet={answerSet} relations={relations}/>
          ))}
        </section>
      )))}
    </>
  )
}