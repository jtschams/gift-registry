const { nicknameSchema } = require('./schemas')
const { Schema, model } = require('mongoose');

const familySchema = new Schema ({
  // TODO: Create Family Schema
});

const Family = model('Family', familySchema);

module.exports = Family;