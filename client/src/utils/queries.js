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

// TODO: Client side queries