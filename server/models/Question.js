const { Schema, model } =  require('mongoose');

const questionSchema = new Schema ({
  question: {
    type: String,
    required: true
  },
  //  Categories are Interests/Sizes/Gifts
  category: String,
  claimable: Boolean
});

const Question = model('Question', questionSchema);

module.exports = Question;