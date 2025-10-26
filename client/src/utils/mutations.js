import { gql } from '@apollo/client';

//#region Create
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
  mutation AddUser($firstName: String!, $lastName: String!, $email: String!, $password: String!, $birthday: String!) {
    addUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, birthday: $birthday) {
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

export const MAKE_WISH = gql`
  mutation MakeWish($rank: Int!, $answerText: String!, $answerLink: String, $amount: Int!) {
    makeWish(rank: $rank, answerText: $answerText, answerLink: $answerLink, amount: $amount) {
      _id
      rank
      answerText
      answerLink
      amount
    }
  }
`

export const CLAIM_ANSWER = gql`
  mutation ClaimAnswer($userId: ID!, $questionId: ID, $answerId: ID!, $nickname: String!) {
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

export const ADD_QUESTION = gql`
  mutation AddQuestion($familyId: ID!, $question: String!, $category: String, $claimable: Boolean) {
    addQuestion(familyId: $familyId, question: $question, category: $category, claimable: $claimable) {
      family {
        _id
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
      user {
        nickname
        user {
          _id
          name
        }
      }
    }
  }
`

export const JOIN_FAMILY = gql`
  mutation JoinFamily($familyId: ID!, $nickname: String) {
    joinFamily(familyId: $familyId, nickname: $nickname) {
      _id
      name
      groups {
        familyName
      }
    }
  }
`
//#endregion

//#region Edit
export const EDIT_USER = gql`
  mutation EditUser($firstName: String, $lastName: String, $birthday: String, $likesSurprises: Boolean, $email: String) {
    editUser(firstName: $firstName, lastName: $lastName, birthday: $birthday, likesSurprises: $likesSurprises, email: $email) {
      _id
      name
      birthday
      email
      likesSurprises
    }
  }
`

export const EDIT_ANSWER = gql`
  mutation EditAnswer($questionId: ID, $answerId: ID!, $answerText: String, $answerLink: String, $rank: Int, $amount: Int) {
    editAnswer(questionId: $questionId, answerId: $answerId, answerText: $answerText, answerLink: $answerLink, rank: $rank, amount: $amount) {
      _id
      answerText
      answerLink
      amount
      rank
    }
  }
`

export const EDIT_QUESTION = gql`
  mutation EditQuestion($familyId: ID!, $questionId: ID!, $question: String, $category: String, $claimable: Boolean) {
    editQuestion(familyId: $familyId, questionId: $questionId, question: $question, category: $category, claimable: $claimable) {
      family {
        _id
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
      user {
        nickname
        user {
          _id
          name
        }
      }
    }
  }
`

export const EDIT_FAMILY = gql`
  mutation EditFamily($familyId: ID!, $familyName: String!) {
    editFamily(familyId: $familyId, familyName: $familyName) {
      family {
        _id
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
      user {
        nickname
        user {
          _id
          name
        }
      }
    }
  }
`

export const EDIT_NICKNAME = gql`
  mutation EditNickname($familyId: ID!, $nickname: String) {
    editNickname(familyId: $familyId, nickname: $nickname) {
      family {
        _id
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
      user {
        nickname
        user {
          _id
          name
        }
      }
    }
  }
`

export const LEAVE_FAMILY = gql`
  mutation LeaveFamily($familyId: ID!) {
    leaveFamily(familyId: $familyId) {
      _id
      name
      groups {
        familyName
      }
      birthday
      email
    }
  }
`
//#endregion

//#region Remove
export const REMOVE_ANSWER = gql`
  mutation RemoveAnswer($questionId: ID, $answerId: ID!) {
    removeAnswer(questionId: $questionId, answerId: $answerId) {
      _id
      answers {
        answers {
          _id
          answerText
        }
        question {
          _id
          question
        }
      }
      wishlist {
        _id
        answerText
      }
    }
  }
`

export const REMOVE_QUESTION = gql`
  mutation RemoveQuestion($familyId: ID!, $questionId: ID!) {
    removeQuestion(familyId: $familyId, questionId: $questionId) {
      family {
        _id
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
      user {
        nickname
        user {
          _id
          name
        }
      }
    }
  }
`

export const REMOVE_MEMBER = gql`
  mutation RemoveFamilyMember($familyId: ID!, $userId: ID!) {
    removeFamilyMember(familyId: $familyId, userId: $userId) {
      family {
        _id
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
      user {
        nickname
        user {
          _id
          name
        }
      }
    }
  }
`

export const UNCLAIM_ANSWER = gql`
  mutation UnclaimAnswer($answerId: ID!) {
    unclaimAnswer(answerId: $answerId) {
      _id
      name
      claims {
        nickname
        answer {
          _id
          answerText
          answerLink
          amount
          rank
        }
        user {
          _id
          name
        }
      }
    }
  }
`
//#endregion

//#region Delete
//export const DELETE_USER = gql`
//mutation DeleteUser($removeAnswers: Boolean) {
//}
//`
//
//export const DELETE_FAMILY = gql`
//mutation DeleteFamily($familyId: ID!) {
//}
//`
//#endregion