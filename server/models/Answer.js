const { Schema, model } = require('mongoose');

const answerSchema = new Schema({
  rank: Number,
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
  claims: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

answerSchema.methods.claimable = async function(userId) {
  const claimable = { claimable: this.amount - (this.claims > 0), claims: this.claims.length }
  if (!claimable.claimable) {
    if (this.amount = 0) {claimable.message = "This answer is not claimable."}
    else {claimable.message = "This answer has already been claimed." }
  } else {
    if (this.claims.some((user) => user._id == userId)) {
      claimable.message = "You have already claimed this answer.";
      claimable.claimable = false;
    } else {
      claimable.message = "Answer can be claimed";
    }
  }
  return claimable;
}

const Answer = model("Answer", answerSchema);

module.exports = Answer;