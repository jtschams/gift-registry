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
    min: 0,
    max: 2,
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
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  answer: Number
});

module.exports = { memberSchema, answerSchema, claimedSchema };