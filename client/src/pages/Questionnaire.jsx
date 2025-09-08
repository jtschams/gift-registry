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
  const allQuestions = [];
  if (!loading) {
    const questions = data?.myQuestions;
    const answers = data?.myAnswers;
    const sortedQuestions = {
      "Likes": [],
      "Sizes Etc": [],
      "Dislikes": [],
      "Miscellaneous": [],
      "Final": []
    };
    for (const question of questions) { 
      const answerSet = answers.find(a => a.question._id == question._id);
      sortedQuestions[question.category].push({ ...answerSet, question }) ;
    };
    for (const cat in sortedQuestions) {
        allQuestions.push(...sortedQuestions[cat])
    }
  }

  return (<>
    <h2>Tastes & Preferences Questionnaire</h2>
    <QuestionContext.Provider value={[ questionState, setQuestionState ]}>
      {loading ? <h3 className="loading">Loading...</h3> : (allQuestions.map((answerSet) => (
        <Question answerSet={answerSet} key={answerSet.question._id}/>
      )))}
    </QuestionContext.Provider>
  </>)
}