import React from 'react';
import { useQuery } from "@apollo/client";

import { MY_QUESTIONS } from '../utils/queries';
import Question from '../components/Question';

export default function Questions() {

  const { loading, data } = useQuery(MY_QUESTIONS);
  const questions = data?.myQuestions;

  return (
    <>
      {loading ? "Loading..." : questions.map((question) => (
        <Question question={question}/>
      ))}
    </>
  )
}