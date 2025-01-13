const { Schema, model } =  require('mongoose');

const questionSchema = new Schema ({
  // TODO: Create Question Schema
});

const Question = model('Question', questionSchema);

module.exports = Question;