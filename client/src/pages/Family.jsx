// Calls "addQuestion" Mutation resolver {refresh on submit}
import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import FamilyMember from '../components/FamilyMember';
import { FAMILY } from '../utils/queries'
import { ADD_QUESTION, EDIT_FAMILY, EDIT_NICKNAME, LEAVE_FAMILY } from '../utils/mutations'
import QuestionRow from '../components/QuestionRow';

let family = {};
let isAdmin = false;
const questions = [];
const members = [];

export default function Family() {
  //#region Variable Handling
  const {familyId} = useParams();
  const [ linkState ] = useState(`${location.origin}/join-family/${familyId}`);
  const [ nicknameState, setNicknameState ] = useState(null);
  const [ familyState, setFamilyState ] = useState(null);
  const [ newQuestionState, setNewQuestionState ] = useState({
    question: '',
    category: 'Likes',
    familyId
  });
  
  const { loading, data } = useQuery(FAMILY, { variables: { familyId } })
  const [addQuestion] = useMutation(ADD_QUESTION);
  const [editFamily] = useMutation(EDIT_FAMILY);
  const [changeNickname] = useMutation(EDIT_NICKNAME);
  const [leaveFamily] = useMutation(LEAVE_FAMILY);

  if (!loading && data?.family) {
    family = data.family.family
    isAdmin = data.family.family.admins.some(a => a._id == data.family.user.user._id)

    questions.length = 0;
    // Sort Questions
    questions.push(
      ...family.questions.filter(q => q.category === "Likes"),
      ...family.questions.filter(q => q.category === "Sizes Etc"),
      ...family.questions.filter(q => q.category === "Dislikes"),
      ...family.questions.filter(q => q.category === "Miscellaneous"),
    );

    members.length = 0;
    members.push(...family.members);

    if (familyState === null) setFamilyState(data.family.family.familyName)
    if (nicknameState === null) setNicknameState(data.family.user.nickname)
  }
  //#endregion
  
  //#region Form Handling
  const generateInvite = (event) => {
    event.preventDefault();
    const show = document.getElementById('invite-div').classList.contains("invisible");
    document.querySelectorAll('.family-form').forEach(el => el.classList.add('invisible'));
    if (show) {
      document.getElementById('invite-div').classList.remove('invisible');
      document.getElementById('invite-link').select();
    }
  }

  const handleEditMembers = (event) => {
    event.preventDefault();
    event.target.classList.toggle("editing");
    document.querySelectorAll(".admin-buttons, .member-buttons").forEach(el => el.classList.toggle("invisible"));
    if (event.target.classList.contains("editing")) {
      event.target.innerHTML = "Stop Editing Members";
    } else {
      event.target.innerHTML = "Edit Members";
    }
  }
  
  const handleQuestionForm = (event) => {
    event.preventDefault();
    const show = document.getElementById('add-question-form').classList.contains("invisible");
    document.querySelectorAll('.family-form').forEach(el => el.classList.add('invisible'));
    if (show) document.getElementById('add-question-form').classList.remove('invisible');
  }

  const handleEditForm = (event) => {
    event.preventDefault();
    const show = document.getElementById('edit-family-form').classList.contains("invisible");
    document.querySelectorAll('.family-form').forEach(el => el.classList.add('invisible'));
    if (show) document.getElementById('edit-family-form').classList.remove('invisible');
  }

  const handleNicknameForm = (event) => {
    event.preventDefault();
    const show = document.getElementById('change-nickname-form').classList.contains("invisible");
    document.querySelectorAll('.family-form').forEach(el => el.classList.add('invisible'));
    if (show) document.getElementById('change-nickname-form').classList.remove('invisible');
  }
  //#endregion

  //#region Mutation Handling
  const handleQuestionAdd = async (event) => {
    event.preventDefault();
    const {data} = await addQuestion({ variables: {
      ...newQuestionState,
      // TODO: Add option to make claimable?
      claimable: false
      // claimable: newQuestionState.category === "Specific Gifts"
    }});
    //  TODO: change alert to dialog
    alert("Question added.");
    setNewQuestionState({
      question: '',
      category: 'Likes',
      familyId
    });

    family = data.addQuestion.family;
    document.querySelectorAll('.family-form').forEach(el => el.classList.add('invisible'));
  }

  const handleEditFamily = async (event) => {
    event.preventDefault();
    const {data} = await editFamily({ variables: {
      familyId,
      familyName: familyState
    }});
    //  TODO: change alert to dialog
    alert("Family Name Changed.");
    family = data.editFamily.family;
    document.querySelectorAll('.family-form').forEach(el => el.classList.add('invisible'));
  }
  
  const handleChangeNickname = async (event) => {
    event.preventDefault();
    const {data} = await changeNickname({ variables: { 
      familyId,
      nickname: nicknameState
    }});
    //  TODO: change alert to dialog
    alert("Nickname Changed.");
    document.querySelectorAll('.family-form').forEach(el => el.classList.add('invisible'));
    setNicknameState(data.editNickname.user.nickname);
  }

  const handleLeaveFamily = async (event) => {
    event.preventDefault();
    if (!confirm(`Do you want to leave "${family.familyName}"?`)) return;
    const {data} = await leaveFamily({ variables: {
      familyId
    }});

    //  TODO: change alert to dialog
    alert(`You have left "${family.familyName}".  You can rejoin if invited by another member.`);
    window.location.assign("/");
  }
  //#endregion

  //#region Form State Handling
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setNewQuestionState({
      ...newQuestionState,
      [name]: value
    })
  }
  const handleFamilyChange = (event) => {
    setFamilyState(event.target.value)
  }
  const handleNicknameChange = (event) => {
    setNicknameState(event.target.value)
  }

  const copyLink = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(linkState);
    event.target.textContent = "Copied!"
  }
  //#endregion

  return (
    <>
      {loading ? (<h1 id="family-header">Loading...</h1>) : (<>
        <h1 id="family-header">{family.familyName}</h1>
        <section id="family-actions">
          <h2>Group Actions</h2>
          <article id="family-action-list">
            <button onClick={generateInvite}>Generate Invite Link</button>
            {isAdmin ? (<><button onClick={handleQuestionForm}>Add New Question</button>
            <button onClick={handleEditMembers}>Edit Members</button>
            <button onClick={handleEditForm}>Edit Family</button></>) : null}
            <button onClick={handleNicknameForm}>Change Nickname</button>
            <button onClick={handleLeaveFamily}>Leave Family</button>
            <div id="invite-div" className="family-form form-group invisible">
              <label htmlFor="invite-link">Invite Link for this Group:</label>
              <button id="copy-button" onClick={copyLink}>Copy Link</button>
              <input id="invite-link" name="invite-link" value={linkState} readOnly/>
            </div>
            {isAdmin ? (<><form id="add-question-form" className="family-form invisible" onSubmit={handleQuestionAdd}>
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
                  <option>Likes</option>
                  <option>Sizes Etc</option>
                  <option>Dislikes</option>
                  <option>Miscellaneous</option>
                </select>
              </div>
              <button type="submit">Save Question</button>
            </form>

            <form id="edit-family-form" className="family-form invisible" onSubmit={handleEditFamily}>
              <div className="form-group">
                <label htmlFor="family-name">Family Name</label>
                <input
                  id="family-name"
                  className="family-input"
                  placeholder="Question"
                  name="family-name"
                  type="text"
                  value={familyState}
                  onChange={handleFamilyChange}    
                />
              </div>
              <button type="submit">Save Family</button>
            </form></>) : null}

            <form id="change-nickname-form" className="family-form invisible" onSubmit={handleChangeNickname}>
              <div className="form-group">
                <label htmlFor="nickname">Nickname</label>
                <input
                  id="nickname"
                  className="nickname-input"
                  placeholder="Nickname"
                  name="nickname"
                  type="text"
                  value={nicknameState}
                  onChange={handleNicknameChange}    
                />
              </div>
              <button type="submit">Save Nickname</button>
            </form>
          </article>
        </section>

        <section id="family-members">
          <h2>Group Members</h2>
          <div className="card-container">
            {members.map((member) => (<FamilyMember key={member.user._id} member={member} family={family} isAdmin={isAdmin} />))}
          </div>
        </section>
            
        <section id="family-questions">
          <h2>Group Questions</h2>
          {questions.map((question) => (<QuestionRow key={question._id} question={question} family={family} isAdmin={isAdmin} />))}
        </section>
      </>)}
    </>
  )
}