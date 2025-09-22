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
    
    myWishlist: async (parent, args, context) => {
      const user = await User.findById(context.user._id)
        .populate({ path: 'wishlist', populate: 'claims' });
      return user.wishlist;
    },
    
    userWishlist: async (parent, { userId }) => {
      const user = await User.findById(userId)
        .populate({ path: 'wishlist', populate: 'claims' });
      
      return user.wishlist;
    },
    
    myClaims: async (parent, args, context) => {
      const user = await User.findById(context.user._id)
        .populate({ path: 'claims', populate: [ 'user', 'question', 'answer'] });

      return user.claims;
    }
  },

  Mutation: {
    /* =-=-=-=-=-=-=-=-=-=-=-=- Create Mutations -=-=-=-=-=-=-=-=-=-=-=-= */
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

    makeWish: async (parent, { rank, answerText, answerLink, amount }, context) => {
      if (context.user) {
        const answer = await Answer.create({ rank, answerText, answerLink, amount });

        const user = await User.findById(context.user._id).populate('wishlist');

        user.wishlist.push(answer)
        await user.save();
    
        return answer;
      }
      throw AuthenticationError;
    },

    claimAnswer: async (parent, { userId, questionId, answerId, nickname }, context) => {
      if (context.user) {
        const me = await User.findById(context.user._id)
          .populate({ path: 'claims', populate: ['user', 'question', 'answer'] });
        const user = await User.findById(userId);
        const question = questionId ? await Question.findById(questionId) : { _id: null };
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
    },

    /* =-=-=-=-=-=-=-=-=-=-=-=- Edit Mutations -=-=-=-=-=-=-=-=-=-=-=-= */
    editUser: async (parent, { firstName, lastName, birthday, likesSurprises, email }, context) => {

    },

    editAnswer: async (parent, { questionId, answerId, answerText, answerLink, rank, amount }, context) => {

    },

    editQuestion: async (parent, { familyId, questionId, category, claimable }, context) => {

    },

    editFamily: async (parent, { familyId, familyName }, context) => {

    },

    editNickname: async (parent, { familyId, nickname }, context) => {

    },

    leaveFamily: async (parent, { familyId }, context) => {

    },

    /* =-=-=-=-=-=-=-=-=-=-=-=- Remove Mutations -=-=-=-=-=-=-=-=-=-=-=-= */
    removeAnswer: async (parent, { questionId, answerId }, context) => {
      if (context.user) {
        const me = await User.findById(context.user._id)
          .populate({ path: 'answers', populate: ['question', { path: 'answers', populate: 'claims' }] });

        const answerSet = me.answers.find(as => as.question._id == questionId);
        if (answerSet) {
          const index = answerSet.answers.findIndex(a => a._id == answerId);
          if (index != -1) answerSet.answers.splice(index, 1);
        }
        if (answerSet.answers.length == 0) {
          const index = me.answers.findIndex(as => as.question._id == questionId);
          if (index != -1) me.answers.splice(index, 1);
        }

        await me.save();

        return me;
      }
    },

    removeQuestion: async (parent, { familyId, questionId }, context) => {
      const family = await Family.findById(familyId)
        .populate(["questions", "admins"]);
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {
        const index = family.questions.findIndex(q => q._id == questionId);
        if (index != -1) family.questions.splice(index, 1);
      }

      await family.save();

      return family;
    },

    removeFamilyMember: async (parent, { familyId, userId }, context) => {
      const family = Family.findById(familyId)
        .populate(["admins", { path: "members", populate: "user" }]);
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {
        const index = family.members.findIndex(m => m.user._id == userId);
        if (index != -1) family.members.splice(index, 1);
      }

      await family.save();

      return family;
    },

    unclaimAnswer: async (parent, { answerId }, context) => {
      if (context.user) {
        const me = await User.findById(context.user._id)
          .populate({ path: "claims", populate: "answer" });
        const answer = await Answer.findById(answerId)
          .populate("claims");

        const answerIndex = me.claims.findIndex(a => a.answer._id == answerId);
        if (answerIndex != -1) me.claims.splice(index, 1);

        const userIndex = answer.claims.findIndex(u => u._id == context.user._id);
        if (userIndex != -1) answer.claims.splice(index, 1);

        await Promise.all([ me.save(), answer.save() ]);

        return me;
      }
    },

    /* =-=-=-=-=-=-=-=-=-=-=-=- Delete Mutations -=-=-=-=-=-=-=-=-=-=-=-= */
    deleteUser: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findByIdAndDelete(context.user._id)
          .populate([
            "groups",
            { path: "answers", populate: { path: "answers", populate: "claims" } },
            { path: "wishlist", populate: "claims" }
          ]);
        // POPULATE DEEPER FOR NEXT STEP
        // create arrays for family, answer claims, wishlist claims, and claimed answers
        // Promise.all for all of those
        // const saveArray = [];
        // foreach edit all documents and saveArray.push(document.save());
        // await Promise.all(saveArray);
        // return user;
      }
    },

    deleteFamily: async (parent, { familyId }, context) => {
      let family = await Family.findById(familyId);
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {
        family = await Family.findByIdAndDelete(familyId)
          .populate({ path: "members", populate: "user" });
        // POPULATE DEEPER FOR NEXT STEP
        // create arrays for members
        // Promise.all for all of those
        // const saveArray = [];
        // foreach edit all documents and saveArray.push(document.save());
        // await Promise.all(saveArray);
        // return family;
      }
    }
  }
};

module.exports = resolvers;