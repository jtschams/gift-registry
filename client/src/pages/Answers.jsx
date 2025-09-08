import React from 'react';
import { useState, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { MY_ANSWERS, USER_ANSWERS } from '../utils/queries';
import AnswerSet from '../components/AnswerSet';

const AnswerContext = createContext();
export const useAnswerContext = () => useContext(AnswerContext);

export default function MyAnswers() {
  const [ answerState, setAnswerState ] = useState('');
  const { userId } = useParams();
  const answerQuery = userId ? USER_ANSWERS : MY_ANSWERS;
  const queryName = userId ? "userAnswers" : "myAnswers";
  
  const { loading, data } = useQuery(answerQuery, { variables: { userId } });
  const sortedAnswers = {
    "Likes": [],
    "Sizes Etc": [],
    "Dislikes": [],
    "Miscellaneous": [],
    "Final": []
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
    <AnswerContext.Provider value={[ answerState, setAnswerState ]}>
      {!userId ? <h2>My Tastes & Preferences</h2> : loading ? <h1>Loading...</h1> : <>
        <h1 id="answers-user">{user.user.name}</h1>
        {user.relations.map((relation) => <div key={relation.familyName} className="nickname">
          <small>{relation.nickname}</small><small>({relation.familyName})</small>
        </div>)}
        <h2>Tastes & Preferences</h2>
      </>}
      {loading ? <h3 className="loading">Loading...</h3> : (Object.keys(sortedAnswers).map((category) => (
        <section key={category}>
          {sortedAnswers[category].map((answerSet) => (
            <AnswerSet key={answerSet.question._id} answerSet={answerSet} relations={relations}/>
          ))}
        </section>
      )))}
    </AnswerContext.Provider>
  )
}