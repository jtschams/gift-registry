const { Schema, model } = require('mongoose');

const questionSchema = new Schema ({
  question: {
    type: String,
    required: true
  },
  //  Categories are general/specific/negative/sizes
  category: {
    type: String,
    default: 'General Questions'
  },
  claimable: {
    type: Boolean,
    default: false
  }
});

const Question = model('Question', questionSchema);

module.exports = Question;