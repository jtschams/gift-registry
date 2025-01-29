const typeDefs = `
type Member {
  user: User
  nickname: String
}

type Answer {
  answerText: String
  answerLink: String
  amount: Int
  claimed: Boolean
}

type Claimed {
  user: User!
  relations: [Relation]
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

type Relation {
  familyName: String
  nickname: String
}

type RelatedUser {
  user: User
  relations: [Relation]
}

type Auth {
  token: ID!
  user: User
}

type Query {
  me: User
  user(userId: ID!): User
  family(familyId: ID!): Family
  relatedUsers: [RelatedUser]
  myQuestions: [Question]
  myAnswers: [AnswerSet]
  userAnswers(userId: ID!): [AnswerSet]
  myClaims: [Claimed]
}

type Mutation {
  addUser(name: String!, birthday: String!, likesSurprises: Boolean, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  addFamily(familyName: String!, nickname: String): Family
  joinFamily(familyID: ID!, nickname: String): User
  addQuestion(question: String, category: String, claimable: Boolean, familyID: ID!, questionId: ID): Question
  answerQuestion(questionId: ID!, answerText: String!, answerLink: String, amount: Int!): AnswerSet
  claimAnswer(userId: ID!, questionId: ID!, answerId: ID!, familyName: String!, nickname: String!): Claimed
}
`;

module.exports = typeDefs;