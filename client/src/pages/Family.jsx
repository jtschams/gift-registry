// Calls "addQuestion" Mutation resolver {refresh on submit}
import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { FAMILY } from '../utils/queries'
import { ADD_QUESTION } from '../utils/mutations'

export default function Family() {
  const {familyId} = useParams();
  const [ linkState ] = useState(`${location.origin}/join-family/${familyId}`);
  const [ newQuestionState, setNewQuestionState ] = useState({
    question: '',
    category: 'General Questions',
    familyId
  });
  
  const { loading, data } = useQuery(FAMILY, { variables: { familyId } })
  const family = data?.family;
  const [addQuestion] = useMutation(ADD_QUESTION);
  
  const generateInvite = (event) => {
    event.preventDefault();
    document.getElementById('invite-div').classList.remove('invisible');
    document.getElementById('add-question-form').classList.add('invisible');
    document.getElementById('invite-link').select();
    
  }
  
  const showAddQuestion = (event) => {
    event.preventDefault();
    document.getElementById('invite-div').classList.add('invisible');
    document.getElementById('add-question-form').classList.remove('invisible');
  }

  const handleQuestionAdd = async (event) => {
    event.preventDefault();
    const {data} = await addQuestion({ variables: {
      ...newQuestionState,
      claimable: newQuestionState.category === "Specific Gifts"
    }});
    alert("Question added.");
    window.location.reload();
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setNewQuestionState({
      ...newQuestionState,
      [name]: value
    })
  }

  const copyLink = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(linkState);
    event.target.textContent = "Copied!"
  }

  return (
    <>
      {loading ? (<h1 id="family-header">Loading...</h1>) : (<>
        <h1 id="family-header">{family.familyName}</h1>
        <section id="family-actions">
          <h2>Group Actions</h2>
          <article id="family-action-list">
            <button onClick={generateInvite}>Generate Invite Link</button>
            <button onClick={showAddQuestion}>Add New Question</button>
            <div id="invite-div" className="form-group invisible">
              <label htmlFor="invite-link">Invite Link for this Group:</label>
              <button id="copy-button" onClick={copyLink}>Copy Link</button>
              <input id="invite-link" name="invite-link" value={linkState} readOnly/>
            </div>
            <form id="add-question-form" className="invisible" onSubmit={handleQuestionAdd}>
              <div className="form-group">
                <label htmlFor="question">Question</label>
                <input
                  id="question"
                  className="question-input"
                  placeholder="Question"
                  name="question"
                  type="text"
                  value={newQuestionState.question}
                  onChange={handleFormChange}    
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  className="question-input"
                  name="category"
                  value={newQuestionState.category}
                  onChange={handleFormChange}
                >
                  <option>General Questions</option>
                  <option>Sizes and Qualities</option>
                  <option>Specific Gifts</option>
                  <option>Dislikes</option>
                </select>
              </div>
              <button type="submit">Add Question</button>
            </form>
          </article>
        </section>
        <section id="family-questions">
          <h2>Group Questions</h2>
          {family.questions.map((question) => (
            <article key={question._id} className="family-question">
              <p>{question.question}</p>
              <div className="details">
                <small>({question.category})</small>
                {question.claimable ? (<small>(Claimable)</small>) : null}
              </div>
            </article>
          ))}
        </section>
      </>)}
    </>
  )
}