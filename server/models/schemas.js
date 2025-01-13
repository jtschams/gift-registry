const { Schema } = require('mongoose');

const nicknameSchema = new Schema({
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

module.exports = { nicknameSchema, answerSchema, claimedSchema };