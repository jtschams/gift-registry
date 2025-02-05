// TODO: Question Component
// Enter from Questions
// Calls "answerQuestion" Mutation resolver {Questions on submit}
//use <details>?
import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ANSWER_QUESTION } from '../utils/mutations'

export default function Question() {
  const [ answerState, setAnswerState ] = useState({
    answerText: '',
    answerLink: '',
    amount: 0
  });

  const [answerQuestion] = useMutation(ANSWER_QUESTION);

  const handleAnswerQuestion = async (event) => {
    event.preventDefault();
    const {data} = await answerQuestion({
      variables: { ...answerState }
    });
    //  TODO: answer submit behavior
  }

  const handleAnswerChange = (event) => {
    const { name, value } = event.target;

    setAnswerState({
      ...answerState,
      [name]: value
    });
  };

  return
}