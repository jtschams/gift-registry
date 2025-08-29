import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_USER } from '../utils/mutations'
import Auth from '../utils/auth';

export default function Signup({familyId}) {
  const [ signupState, setSignupState ] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthday: ''
  });

  const [addUser] = useMutation(ADD_USER);

  const handleSignup = async (event) => {
    event.preventDefault();
    const {data} = await addUser({
      variables: { ...signupState, birthday: signupState.birthday.split('\\').join('/') }
    });
    const token = data.addUser.token;
    Auth.login(token, familyId);
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;

    setSignupState({
      ...signupState,
      [name]: value
    });
  };

  function toggleSignupPassword() {
    const toggleEl = document.getElementById("toggle-signup-password");
    const pwEl = document.getElementById("signup-password");
    if (pwEl.type === "password") {
      toggleEl.textContent = "Hide Password";
      pwEl.type = "text";
    } else if (pwEl.type === "text") {
      toggleEl.textContent = "Show Password";
      pwEl.type = "password";
    }
  };

  return (
    <article>
      <h1>Signup</h1>
      <form id="signup-form" onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="signup-first-name">First Name</label>
          <input
            id="signup-first-name"
            className="login-input"
            placeholder="Enter Your Name"
            name="firstName"
            type="text"
            value={signupState.firstName}
            onChange={handleSignupChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-last-name">Last Name</label>
          <input
            id="signup-last-name"
            className="login-input"
            placeholder="Enter Your Name"
            name="lastName"
            type="text"
            value={signupState.lastName}
            onChange={handleSignupChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            className="login-input"
            placeholder="Email"
            name="email"
            type="text"
            value={signupState.email}
            onChange={handleSignupChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-birthday">Birthday</label>
          <input
            id="signup-birthday"
            className="login-input"
            placeholder="Birthday"
            name="birthday"
            type="text"
            value={signupState.birthday}
            onChange={handleSignupChange}
          />
        </div>
        <div className="form-group password-container">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            className="login-input"
            placeholder="Password"
            name="password"
            type="password"
            value={signupState.password}
            onChange={handleSignupChange}
          />
          <small id="toggle-signup-password" onClick={toggleSignupPassword}>Show Password</small>
        </div>
        <button type='submit'>Sign Up</button>
      </form>
    </article>
  )
}