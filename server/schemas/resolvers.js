const { User, Family, Question, Answer } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError, InvalidDataError, InvalidActionError, IncompleteDataError } = require('../utils/errors')

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
    
    family: async (parent, { familyId }) => {
      return await Family.findById(familyId)
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
    
    myQuestions: async (parent, args, context) => {
      const user = await User.findById(context.user._id)
        .populate({ path: 'groups', populate: 'questions'});
      const standard = await Family.findById("def000000000000000000000").populate('questions');
      const questions = [];

      for (const group of user.groups) {
        for (const question of group.questions) {
          if (!questions.some((element) => element === question)) {
            questions.push(question);
          }
        }
      }
      questions.unshift(...standard.questions);

      return questions;
    },
    
    myAnswers: async (parent, args, context) => {
      const user = await User.findById(context.user._id)
        .populate({ path: 'answers', populate: ['question', 'answers'] });
      return user.answers;
    },
    
    userAnswers: async (parent, { userId }) => {
      const user = await User.findById(userId)
        .populate({ path: 'answers', populate: ['question', { path: 'answers', populate: 'claims' }] });
      
      return user.answers;
    },
    
    myClaims: async (parent, args, context) => {
      const user = await User.findById(context.user._id)
        .populate({ path: 'claims', populate: [ 'user', 'question', 'answer'] });

      return user.claims;
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
    
    joinFamily: async (parent, { familyId, nickname }, context) => {
      if (context.user) {
        const family = await Family.findById(familyId)
          .populate({ path: 'members', populate: 'user' });
        const user = await User.findById(context.user._id).populate('groups');
        nickname = nickname ? nickname : context.user.name;
        
        // Verifies existence of user and family
        if (!user) {
          throw InvalidDataError('user', user);
        }
        if (!family) {
          throw InvalidDataError('family', `ID: ${familyId}`);
        }
        
        // Tracks changes and prevents duplicates
        const changes = { user: false, family: false};
        if (!user.groups.some((fam) => fam._id === familyId)) {
          user.groups.push(family);
          await user.save();
          changes.user = true;
        }
        if (!family.members.some((mem) => mem.user.name === user.name)) {
          family.members.push({ user, nickname });
          await family.save();
          changes.family = true;
        } else {
          // TODO: Handle duplicate names

        }

        return user;
      }
      throw AuthenticationError;
    },
    
    addQuestion: async (parent, { question, category, claimable, familyId, questionId }, context) => {
      const family = await Family.findById(familyId).populate(['admins', 'questions']);
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {
        if (questionId) {
          const newQuestion = await Question.findById(questionId);
          family.questions.push(newQuestion);
          await family.save();
          return newQuestion;
        } else if (question) {
          const newQuestion = await Question.create({ question, category, claimable });
          family.questions.push(newQuestion);
          await family.save();
          return newQuestion;
        } else {
          throw IncompleteDataError('question')
        }
      }
      throw AuthenticationError;
    },
    
    answerQuestion: async (parent, { questionId, answerText, answerLink, amount }, context) => {
      if (context.user) {
        const question = await Question.findById(questionId);
        const answer = await Answer.create({ answerText, answerLink, amount });
        let answerSet = { question, answers: [ answer ] };

        const user = await User.findById(context.user._id).populate({ path: 'answers', populate: [ 'question', 'answers' ] });
        const questIndex = user.answers.findIndex((quest) => quest.question._id == questionId);

        if (questIndex === -1) {
          user.answers.push(answerSet);
        } else {
          user.answers[questIndex].answers.push(answer);
          answerSet = user.answers[questIndex];
        }
        await user.save();
    
        return answerSet;
      }
      throw AuthenticationError;
    },

    claimAnswer: async (parent, { userId, questionId, answerId, nickname }, context) => {
      if (context.user) {
        const me = await User.findById(context.user._id)
          .populate({ path: 'claims', populate: ['user', 'question', 'answer'] });
        const user = await User.findById(userId);
        const question = await Question.findById(questionId);
        const answer = await Answer.findById(answerId);

        if (!user) {throw InvalidDataError('user', userId)}
        else if (!question) {throw InvalidDataError('question', questionId)}
        else if (!answer) {throw InvalidDataError('answer', answerId)}
        else if (!nickname) {throw IncompleteDataError('nickname')}

        const claimable = await answer.claimable(context.user._id);
        if (!claimable.claimable) {throw InvalidActionError('Claim',  claimable.message)};

        const claim = { user, nickname, question, answer };
        me.claims.push(claim);
        answer.claims.push(me);

        await answer.save();
        await me.save();

        return claim;
      }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;