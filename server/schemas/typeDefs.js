const typeDefs = `
type Member {
  user: User
  nickname: String
}

type Answer {
  _id: ID
  rank: Int
  answerText: String
  answerLink: String
  amount: Int
  claims: [User]!
}

type Claimed {
  user: User!
  nickname: String
  question: Question
  answer: Answer!
}

type Question {
  _id: ID
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
  wishlist: [Answer]!
  claims: [Claimed]!
}

type Family {
  _id: ID
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
  myWishlist: [Answer]
  userWishlist(userId: ID!): [Answer]
  myClaims: [Claimed]
}

type Mutation {
  addUser(firstName: String!, lastName: String!, birthday: String!, likesSurprises: Boolean, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  addFamily(familyName: String!, nickname: String): Family
  joinFamily(familyId: ID!, nickname: String): User
  addQuestion(question: String!, category: String, claimable: Boolean, familyId: ID!): Question
  answerQuestion(questionId: ID!, answerText: String!, answerLink: String, amount: Int!): AnswerSet
  makeWish(rank: Int!, answerText: String!, answerLink: String, amount: Int!): Answer
  claimAnswer(userId: ID!, questionId: ID, answerId: ID!, nickname: String!): Claimed

  editUser(firstName: String, lastName: String, birthday: String, likesSurprises: Boolean, email: String): User
  editAnswer(questionId: ID, answerId: ID!, answerText: String, answerLink: String, rank: Int, amount: Int): Answer
  editQuestion(familyId: ID!, questionId: ID!, question: String, category: String, claimable: Boolean): Question
  editFamily(familyId: ID!, familyName: String!): Family
  editNickname(familyId: ID!, nickname: String!): Relation
  leaveFamily(familyId: ID!): User

  removeAnswer(questionId: ID, answerId: ID!): User
  removeQuestion(familyId: ID!, questionId: ID!): Family
  removeFamilyMember(familyId: ID!, userId: ID!): Family
  unclaimAnswer(answerId: ID!): User

  deleteUser(removeAnswers: Boolean): User
  deleteFamily(familyId: ID!): Family
}
`;

module.exports = typeDefs;