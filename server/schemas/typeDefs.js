const typeDefs = `
type Member {
  user: User
  nickname: String
}

type Answer {
  _id: Int!
  answerText: String
  amount: Int
  claimed: Boolean
}

type Claimed {
  user: User
  question: Question
  answer: Int
}

type User {
  _id: ID
  name: String
  birthday: String
  likesSurprises: Boolean
  email: String
  groups: [Family]!
  # // TODO: Answers?
  answers: 
  claims: [Claimed]!
}

type Question {
  question: String
  category: String
  claimable: Boolean
}

type Family {
  familyName: String!
  members: [Member]!
  questions: [Question]!
  lastQuestionAdded: String
}
`; // TODO: Confirm typeDefs

module.exports = typeDefs;