const { Schema, model } = require('mongoose');

const questionSchema = new Schema ({
  question: {
    type: String,
    required: true
  },
  //  Categories are [ "Likes", "Sizes Etc", "Dislikes", "Miscellaneous" ]
  category: {
    type: String,
    default: 'Likes'
  },
  claimable: {
    type: Boolean,
    default: false
  }
});

const Question = model('Question', questionSchema);

module.exports = Question;