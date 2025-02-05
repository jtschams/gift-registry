import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }  
  }
`

export const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!, $password: String!, $birthday: String!) {
    login(name: $name, email: $email, password: $password, birthday: $birthday) {
      token
      user {
        _id
      }
    }  
  }
`

export const ANSWER_QUESTION = gql`
  mutation AnswerQuestion($questionId: ID!, $answerText: String!, $answerLink: String, $amount: Int!) {
    answerQuestion(questionId: $questionId, answerText: $answerText, answerLink: $answerLink, amount: $amount) {
      question {
        _id
      }
      answers {
        _id
        answerText
        answerLink
        amount
      }  
    }
  }
`

// TODO: Client side mutations