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
  query UserAnswers($userId: ID!) {
    userAnswers(userId: $userId) {
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
    relatedUsers {
      user {
        _id
        name
      }
      relations {
        familyName
        nickname
      }
    }
  }
`

export const FAMILY = gql`
  query Family($familyId: ID!) {
    family(familyId: $familyId) {
      familyName
      questions {
        _id
        question
        category
        claimable
      }
      members {
        nickname
        user {
          _id
          name
        }
      }
      admins {
        _id
      }
    }
  }
`

export const RELATED_USERS = gql`
  query RelatedUsers {
    relatedUsers {
      user {
        name
        _id
      }
      relations {
        familyName
        nickname
      }
    }
  }
`

export const MY_CLAIMS = gql`
  query MyClaims {
    myClaims {
      answer {
        _id
        answerText
        answerLink
      }
      nickname
      question {
        _id
        question
        }
      user {
        _id
        name
      }
    }
  }
`