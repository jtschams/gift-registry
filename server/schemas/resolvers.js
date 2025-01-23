const { User, Family, Question } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const { InvalidDataError } = require('../utils/errors')

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      return await User.findById(context.user._id).populate('groups').populate('answers').populate('claims');
    },

    user: async (parent, { userId }) => {
      return await User.findById(userId).populate('answers');
    },

    family: async (parent, { familyName }) => {
      return await Family.findOne({ familyName }).populate({ path: 'members', populate: { path: 'user', populate: 'groups' } }).populate('questions').populate('admins');
    },

    // TODO: Add queries
    relatedUsers: async(parent, args, context) => {

    },

    myQuestions: async (parent, args, context) => {

    },

    myAnswers: async (parent, args, context) => {

    },
    
    userAnswers: async (parent, { userId }) => {

    },

    myClaims: async (parent, args, context) => {

    }
  },

  // TODO: Implement Mutations
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create({ ...args });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      const passCheck = await user.isCorrectPassword(password);
      if (!passCheck) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    addFamily: async (parent, { familyName, nickname }, context) => {
      if (context.user) {
        const family = await Family.create({ familyName });
        const user = await User.findById(context.user._id)
        nickname = nickname? nickname : user.name;
        
        family.admins = [ user ];
        family.members = [{ user, nickname }];
        await family.save();
        
        user.groups = [ ...user.groups, family ];
        await user.save();
        
        return family;
      }
      throw AuthenticationError;
    },
    
    joinFamily: async (parent, { familyName, nickname }, context) => {
      if (context.user) {
        const family = await Family.findOne({ familyName })
        .populate({ path: 'members', populate: 'user' });
        const user = await User.findById(context.user._id).populate('groups');
        nickname = nickname ? nickname : context.user.name;
        
        // Verifies existence of user and family
        if (!user) {
          throw InvalidDataError('user', user);
        }
        if (!family) {
          throw InvalidDataError('family', familyName);
        }

        // Tracks changes and prevents duplicates
        const changes = { user: false, family: false};
        if (!user.groups.some((fam) => fam.familyName === familyName)) {
          user.groups.push(family);
          await user.save();
          changes.user = true;
        }
        if (!family.members.some((mem) => mem.user.name === user.name)) {
          family.members.push({ user, nickname });
          await family.save();
          changes.family = true;
        }

        return user;
      }
      throw AuthenticationError;
    },

    addQuestion: async (parent, { question, category, claimable, familyName}) => {
      if (context.user) {

      }
      throw AuthenticationError;
    },

    answerQuestion: async (parent, { questionId, answer, amount }) => {
      if (context.user) {

      }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;