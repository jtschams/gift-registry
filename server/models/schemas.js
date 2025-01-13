const { Schema } = require('mongoose');

const memberSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  nickname: {
    type: String,
    required: true,
    trim: true
    // TODO: Set default as name?
  }
});

const answerSchema = new Schema({
  answerId: Number,
  answerText: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    //  TODO: Range is 0(general), 1(single claimable), 2(multiple claimable)
    default: 0
  },
  claimed: {
    type: Boolean,
    default: false
  }
});

const claimedSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  Question: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  answer: Number
});

module.exports = { memberSchema, answerSchema, claimedSchema };