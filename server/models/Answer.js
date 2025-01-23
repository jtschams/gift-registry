const { Schema, model } = require('mongoose');

const answerSchema = new Schema({
  answerText: {
    type: String,
    required: true,
    trim: true
  },
  answerLink: String,
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

const Answer = model("Answer", answerSchema);

module.exports = Answer;