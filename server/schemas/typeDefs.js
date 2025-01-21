const typeDefs = `
type Member {
  user: User
  nickname: String
}

type Answer {
  answerText: String
  amount: Int
  claimed: Boolean
}

type Claimed {
  user: User!
  question: Question
  answer: Answer!
}

type Question {
  question: String
  category: String
  claimable: Boolean
}

type AnswerSet {
  question: Question!
  answers: [Answer]!
}

type User {
  _id: ID
  name: String
  birthday: String
  likesSurprises: Boolean
  email: String!
  groups: [Family]!
  answers: [AnswerSet]!
  claims: [Claimed]!
}

type Family {
  familyName: String!
  admins: [User]
  members: [Member]!
  questions: [Question]!
  lastQuestionAdded: String
}

type Auth {
  token: ID!
  user: User
}

type Query {
  me: User
  user(userId: ID!): User
  family(familyName: String!): Family
}

type Mutation {
  addUser(name: String!, birthday: String!, likesSurprises: Boolean, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  addFamily(familyName: String!, nickname: String): Family
  joinFamily(familyName: String!, nickname: String): User
  addQuestion(question: String!, category: String!, claimable: Boolean!, familyName: String!): Question
  answerQuestion(questionId: ID!, answer: String!, amount: Int!): AnswerSet
}
`;

module.exports = typeDefs;