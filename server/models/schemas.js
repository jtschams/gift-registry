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

const claimedSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }
});

module.exports = { memberSchema, claimedSchema };