import { gql } from '@apollo/client';

export const MY_PROFILE = gql`
  query MyProfile {
    me {
      _id
      name
      birthday
      email
      groups {
        _id
        familyName
      }
    }
  }
`

export const MY_QUESTIONS = gql`
  query MyQuestions {
    myQuestions {
      _id
      question
      category
      claimable
    }
  }
`

export const MY_ANSWERS = gql`
  query MyAnswers {
    myAnswers {
      question {
        _id
        question
        category
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

export const USER_ANSWERS = gql`
  query UserAnswers {
    userAnswers {
      question {
        _id
        question
        category
      }
      answers {
        _id
        answerText
        answerLink
        amount
        claims {
          _id
        }
      }
    }
  }
`

// TODO: Client side queries