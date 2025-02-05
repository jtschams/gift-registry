import React from 'react';
import { useState } from 'react';
import { useQuery } from "@apollo/client";

import { MY_QUESTIONS } from '../utils/queries';
import Question from '../components/Question';

export default function Questions() {
  const [ questionState, setQuestionState ] = useState();

  const { loading, data } = useQuery(MY_QUESTIONS);
  const questions = data?.myQuestions;
  
  const sortedQuestions = {
    "General Questions": [],
    "Sizes and Qualities": [],
    "Specific Gifts": [],
    "Dislikes": []
  };
  for (const question of questions) { sortedQuestions[question.category].add(question) };

  return (
    <>
      {loading ? "Loading..." : (sortedQuestions.keys().map((category) => (
        <section key={category}>
          <h2 className="question-category">{category}</h2>
          {sortedQuestions[category].map((question) => (
            <Question question={question} questionState setQuestionState/>
          ))}
        </section>
      )))}
    </>
  )
}