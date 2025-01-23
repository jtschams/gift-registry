const db = require('../config/connection');
const { Family, Question } = require('../models');
const defaultFamily = require('./defaultFamily.json');
const defaultQuestions = require('./defaultQuestions.json');

db.once('open', async () => {
  let family = await Family.findById("def000000000000000000000").populate('questions');
  if (!family) { family = await Family.create(defaultFamily) };
  let removals = 0;
  
  for (let i = 0; i < family.questions.length; i++) {
    let removeDefault = true;
    for (let j = 0; j < defaultQuestions.length; j++) {
      if (family.questions[i].question === defaultQuestions[j].question) {
        defaultQuestions.splice(j, 1);
        removeDefault = false;
        break;
      }
    }
    if (removeDefault) {
      family.questions.splice(i, 1);
      removals++;
    }
  }
  
  await family.save();
  console.log(`${removals} questions removed from default set.`);

  const qCount = defaultQuestions.length;
  if (qCount === 0) {
    console.log("No new additions.");
    process.exit(0);
  }

  const questionArray = await Question.create(defaultQuestions);
  family.questions.push(...questionArray);
  await family.save();

  console.log(`${qCount} new questions added.`);
  process.exit(0);
});