const { User, Family, Question } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      return await User.findById(context.user._id).populate('groups').populate('answers').populate('claims');
    },

    user: async (parent, { userId }) => {
      return await User.findById(userId).populate('answers');
    },

    family: async (parent, { familyName }) => {
      return await Family.findOne({ familyName });
    }
  },

  // TODO: Implement Mutations
  Mutation: {
    addUser: async (parent, { name, birthday, likesSurprises, email, familyName, nickname}) => {

    },

    login: async (parent, { email, password }) => {

    },

    addFamily: async (parent, { familyName }, context) => {

    },

    joinFamily: async (parent, { familyName }, context) => {

    },

    addQuestion: async (parent, { question, category, claimable, familyName}) => {

    },

    answerQuestion: async (parent, { questionId, answer, amount }) => {

    }
  }
};

module.exports = resolvers;