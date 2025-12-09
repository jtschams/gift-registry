const { claimedSchema } = require('./schemas');
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  likesSurprises: {
    type: Boolean,
    default: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Must match an email address!'],
  },
  password: {
    type: String,
    required: true
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Family'
  }],
  answers: [{
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    answers: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer'
    }]
  }],
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  claims: [claimedSchema],
  lastAnswer: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.name = function() {
  return this.firstName + " " + this.lastName;
};

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;