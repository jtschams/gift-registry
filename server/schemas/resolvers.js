const { User, Family, Question, Answer } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const { InvalidDataError } = require('../utils/errors')

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      return await User.findById(context.user._id)
        .populate([
          'groups',
          'claims',
          { path: 'answers', populate: ['question', 'answers'] }
        ]);
    },
    
    user: async (parent, { userId }) => {
      return await User.findById(userId)
        .populate({ path: 'answers', populate: ['question', 'answers'] });
    },
    
    family: async (parent, { familyName }) => {
      return await Family.findOne({ familyName })
        .populate([
          'questions',
          'admins',
          { path: 'members', populate: { path: 'user', populate: 'groups' }}
        ]);
    },
    
    relatedUsers: async(parent, args, context) => {
      const user = await User.findById(context.user._id)
        .populate({ path: 'groups',
          populate: { path: 'members',
            populate: { path: 'user',
              populate: { path: 'answers',
                populate: [ 'question', 'answers' ]
        }}}});
      const relatedUsers = [];

      for (const family of user.groups) {
        for (const member of family.members) {
          if (context.user.email === member.user.email) {continue};
          const userIndex = relatedUsers.findIndex((rUser) => rUser.user.email === member.user.email);
          if (userIndex === -1) {
            relatedUsers.push({
              user: member.user,
              relations: [{ familyName: family.familyName, nickname: member.nickname }]
            });
          } else {
            relatedUsers[userIndex].relations.push({ familyName: family.familyName, nickname: member.nickname })
          }
        }
      }

      return relatedUsers;
    },
    
    // TODO: Add queries
    myQuestions: async (parent, args, context) => {
      const user = await User.findById(context.user._id)
      
    },
    
    myAnswers: async (parent, args, context) => {
      const user = await User.findById(context.user._id).populate({ path: 'answers', populate: 'answers' });
      
    },
    
    userAnswers: async (parent, { userId }) => {
      const user = await User.findById(userId).populate({ path: 'answers', populate: 'answers' });
      
    },
    
    myClaims: async (parent, args, context) => {
      const user = await User.findById(context.user._id)
        .populate({ path: 'claims', populate: 'user' })
        .populate({ path: 'claims', populate: 'question' })
        .populate({ path: 'claims', populate: 'answer' });

    }
  },

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
    
    // TODO: Implement addQuestion Mutation
    addQuestion: async (parent, { question, category, claimable, familyName}, context) => {
      if (context.user) {
        
      }
      throw AuthenticationError;
    },
    
    answerQuestion: async (parent, { questionId, answerText, answerLink, amount }, context) => {
      if (context.user) {
        const question = await Question.findById(questionId);
        const answer = await Answer.create({ answerText, answerLink, amount });
        const answerSet = { question, answers: [ answer ] };

        const user = await User.findById(context.user._id).populate({ path: 'answers', populate: 'question' });
        const questIndex = user.answers.findIndex((quest) => quest.question._id == questionId);

        if (questIndex === -1) {
          user.answers.push(answerSet);
        } else {
          user.answers[questIndex].answers.push(answer);
          answerSet = user.answers[questIndex];
        }
        user.save();
    
        return answerSet;
      }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;