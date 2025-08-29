import React from 'react';
import { useState, createContext, useContext } from 'react';
import { useQuery } from "@apollo/client";

import { MY_QUESTIONS } from '../utils/queries';
import Question from '../components/Question';

const QuestionContext = createContext();
export const useQuestionContext = () => useContext(QuestionContext);

export default function Questionnaire() {
  const [ questionState, setQuestionState ] = useState();

  const { loading, data } = useQuery(MY_QUESTIONS);
  const sortedQuestions = {
    "General Questions": [],
    "Sizes and Qualities": [],
    "Specific Gifts": [],
    "Dislikes": []
  };
  if (!loading) {
    const questions = data?.myQuestions;
    for (const question of questions) { sortedQuestions[question.category].push(question) };
  }

  return (
    <QuestionContext.Provider value={[ questionState, setQuestionState ]}>
      {loading ? <h3 className="loading">Loading...</h3> : (Object.keys(sortedQuestions).map((category) => (
        <section key={category}>
          {sortedQuestions[category].map((question) => (
            <Question question={question} key={question._id}/>
          ))}
        </section>
      )))}
    </QuestionContext.Provider>
  )
}