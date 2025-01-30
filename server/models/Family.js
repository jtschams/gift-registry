const { memberSchema } = require('./schemas')
const { Schema, model } = require('mongoose');

const familySchema = new Schema ({
  familyName: {
    type: String,
    required: true
  },
  members: [ memberSchema ],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  lastQuestionAdded: { type: Date, default: Date.now }
});

const Family = model('Family', familySchema);

module.exports = Family;