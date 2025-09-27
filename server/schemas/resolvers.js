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
        } } } });
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
      if (context.user) {
        const me = await User.findById(context.user._id);
        
        me.firstName = firstName || me.firstName;
        me.lastName = lastName || me.lastName;
        me.birthday = birthday || me.birthday;
        me.email = email || me.email;
        me.likesSurprises = likesSurprises;

        await me.save();

        return me;
      }
      throw AuthenticationError;
    },

    editAnswer: async (parent, { questionId, answerId, answerText, answerLink, rank, amount }, context) => {
      if (context.user) {
        const me = await User.findById(context.user._id)
          .populate({ path: "answers", populate: "answers" });

        const answer = me.answers.find(as => as.question._id == questionId).answers.find(a => a._id == answerId);
        if (!answer) throw InvalidActionError("Edit Answer", "Unable to find answer in user answer list.");

        answer.answerText = answerText || answer.answerText;
        answer.amount = amount || answer.amount;
        answer.rank = rank;
        answer.answerLink = answerLink;

        await answer.save();

        return answer;
      }
      throw AuthenticationError;
    },

    editQuestion: async (parent, { familyId, questionId, question, category, claimable }, context) => {
      const family = await Family.findById(familyId)
        .populate(["questions", "admins"]);
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {
        const question = family.questions.find(q => q._id == questionId);
        if (!question) throw InvalidActionError("Edit Question", "Could not locate question in group.");

        question.quesiton = question || question.question;
        question.category = category || question.category;
        question.claimable = claimable;
        
        await question.save();

        return question;
      }
      throw AuthenticationError;
    },

    editFamily: async (parent, { familyId, familyName }, context) => {
      const family = await Family.findById(familyId)
        .populate("admins");
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {

        family.familyName = familyName;

        await family.save();
        
        return family;
      }
      throw AuthenticationError;
    },

    editNickname: async (parent, { familyId, nickname }, context) => {
      if (context.user) {
        const family = await Family.findById(familyId)
          .populate("members");
        const member = family.members.find(m => m.user._id == context.user._id);

        member.nickname = nickname;

        await family.save();

        return { familyName: family.familyName, nickname };
      }
      throw AuthenticationError;
    },

    leaveFamily: async (parent, { familyId }, context) => {
      if (context.user) {
        const family = Family.findById(familyId)
          .populate([ "admins", { path: "members", populate: "user" } ])
        const me = User.findById(context.user._id)
          .populate("groups");
        await Promise.all([family, me]);

        const saveArray = [];
        const familyIndex = me.groups.findIndex(f => f._id == familyId);
        const memberIndex = family.members.findIndex(m => m.user._id == context.user._id);
        const adminIndex = family.admins.findIndex(a => a._id == context.user._id);

        if (familyIndex == -1 && memberIndex == -1) throw InvalidActionError("Leave Family", "User is not a member of this family.");
        
        if (familyIndex != -1) {
          me.groups.splice(familyIndex, 1);
          saveArray.push(me.save());
        }
        
        if (memberIndex != -1) family.members.splice(memberIndex, 1);
        if (adminIndex != -1) family.admins.splice(adminIndex, 1);
        saveArray.push(family.save());

        await Promise.all(saveArray);

        return me;
      }
      throw AuthenticationError;
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
      throw AuthenticationError;
    },

    removeQuestion: async (parent, { familyId, questionId }, context) => {
      const family = await Family.findById(familyId)
        .populate(["questions", "admins"]);
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {
        const index = family.questions.findIndex(q => q._id == questionId);
        if (index != -1) family.questions.splice(index, 1);
        
        await family.save();
  
        return family;
      }
      throw AuthenticationError;
    },

    removeFamilyMember: async (parent, { familyId, userId }, context) => {
      const family = Family.findById(familyId)
        .populate(["admins", { path: "members", populate: { path: "user", populate: "groups" } }]);
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {
        const saveArray = [];
        const memberIndex = family.members.findIndex(m => m.user._id == userId);
        const adminIndex = family.admins.findIndex(a => a._id);
        const familyIndex = family.members[memberIndex]?.user.groups.findIndex(f => f._id == familyId) || -1;

        if (memberIndex == -1) throw InvalidActionError("Remove Group Member", "User is not a member of this group.")
        else family.members.splice(memberIndex, 1);
        if (adminIndex != -1) family.admins.splice(adminIndex, 1);
        saveArray.push(family.save());

        if (familyIndex != -1) {
          const user = family.members[memberIndex].user;
          user.groups.splice(familyIndex, 1);
          saveArray.push(user.save());
        }
        
        await Promise.all(saveArray);
        
        return family;
      }
      throw AuthenticationError;
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
      throw AuthenticationError;
    },

    /* =-=-=-=-=-=-=-=-=-=-=-=- Delete Mutations -=-=-=-=-=-=-=-=-=-=-=-= */
    deleteUser: async (parent, { removeAnswers }, context) => {
      if (context.user) {
        const user = await User.findByIdAndDelete(context.user._id)
          .populate([
            { path: "groups", populate: [
                { path: "members", populate: "user" },
                { path: "admins", populate: "user" }
              ]
            },
            { path: "answers",
              populate: { path: "answers",
                populate: { path: "claims",
                  populate: { path: "claims",
                    populate: "answer"
            } } } },
            { path: "wishlist",
              populate: { path: "claims",
                populate: { path: "claims",
                  populate: "answer"
            } } },
            { path: "claims", populate: { path: "answer", populate: "claims" } }
          ]);
        // Populated necessary paths for next step
        const saveArray = [];

        // Remove users from all family member and admin lists
        user.groups.forEach((family) => {
          // Remove from family member list
          const memIndex = family.members.findIndex(mem => mem.user._id == context.user._id);
          family.members.splice(memIndex, 1);
          // Delete family and end loop if no members left
          if (family.members.length == 0) {
            saveArray.push(Family.findOneAndDelete(family._id));
            return;
          }
          // Remove from family admin list if present
          const adIndex = family.admins.findIndex(adm => adm._id == context.user._id);
          if (adIndex != -1) family.admins.splice(adIndex, 1);
          // Add oldest user into admin group if no admins left
          if (family.admins.length == 0) family.admins.push(family.members[0]);
          saveArray.push(family.save());
        });

        // Remove answers from other user claims if remove answers selected
        if (removeAnswers) {
          const userArray = [];
          // Gather answers and wishes into single array
          [ ...user.answers.answers, ...user.wishlist ].forEach((answer) => {
            // Each claim of each answer
            answer.claims.forEach((u) => {
              // Find or insert user in user array
              let index = userArray.findIndex(ua => ua._id == u._id);
              if (index == -1) {
                index = userArray.length;
                userArray.push(u);
              }
              // Remove answer from user claim list
              const ansIndex = userArray[index].claims.findIndex(ans => ans._id == answer._id);
              userArray[index].claims.splice(ansIndex, 1);
            });
          });

          userArray.forEach(u => {
            saveArray.push(u.save());
          });
        }

        // Unclaim answers
        user.claims.forEach((claim) => {
          const index = claim.claims.findIndex(u => u._id = user._id);
          claim.claims.splice(index, 1);
          saveArray.push(claim.save());
        })

        await Promise.all(saveArray);
        return user;
      }
      throw AuthenticationError;
    },

    deleteFamily: async (parent, { familyId }, context) => {
      let family = await Family.findById(familyId);
      if (family?.admins.some((admin) => admin._id == context.user?._id)) {
        family = await Family.findByIdAndDelete(familyId)
          .populate({ path: "members", populate: { path: "user", populate: "groups" } });
        // Populated necessary paths for next step
        const saveArray = [];
        family.members.forEach((member) => {
          // Remove references to deleted family in member group arrays
          const index = member.user.groups.findIndex(fam => fam._id == familyId);
          member.user.groups.splice(index, 1);
          // Push into array for Promise.all()
          saveArray.push(member.user.save());
        });
        await Promise.all(saveArray);
        return family;
      }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;