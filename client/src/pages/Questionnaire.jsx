import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery } from "@apollo/client";

import { MY_QUESTIONS } from '../utils/queries';
import Question from '../components/Question';

const QuestionContext = createContext();
export const useQuestionContext = () => useContext(QuestionContext);

export default function Questionnaire() {
  const [ questionState, setQuestionState ] = useState();
  const [ allAnswerState, setAllAnswerState ] = useState([]);

  let { loading, data } = useQuery(MY_QUESTIONS);

  const allQuestions = [];
  useEffect(() => {
    if (!loading && allAnswerState.length == 0) {
      setAllAnswerState([]);
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

      setAllAnswerState(allQuestions)
    }
  }, [ questionState, loading, setAllAnswerState ])

  return (<>
    <h2>Tastes & Preferences Questionnaire</h2>
    <QuestionContext.Provider value={[ questionState, setQuestionState, allAnswerState, setAllAnswerState ]}>
      {loading ? <h3 className="loading">Loading...</h3> : (allAnswerState.map((answerSet) => (
        <Question answerSet={answerSet} key={answerSet.question._id}/>
      )))}
    </QuestionContext.Provider>
  </>)
}