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
    # // TODO: Consider making nicknames resolver
    relatedUsers {
      user {
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