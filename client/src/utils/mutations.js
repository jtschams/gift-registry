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

export const CLAIM_ANSWER = gql`
  mutation ClaimAnswer($userId: ID!, $questionId: ID!, $answerId: ID!, $nickname: String!) {
    claimAnswer(userId: $userId, questionId: $questionId, answerId: $answerId, nickname: $nickname) {
      user {
       _id
      }
      nickname
      question {
        _id
      }
      answer {
        _id
      }
    }
  }
`

export const CREATE_GROUP = gql`
  mutation CreateGroup($familyName: String!, $nickname: String) {
    addFamily(familyName: $familyName, nickname: $nickname) {
      _id
    }
  }
`

// TODO: Client side mutations