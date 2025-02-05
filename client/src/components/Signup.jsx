import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_USER } from '../utils/mutations'
import Auth from '../utils/auth';

export default function Signup(familyId) {
  const [ signupState, setSignupState ] = useState({
    name: '',
    email: '',
    password: '',
    birthday: ''
  });

  const [addUser] = useMutation(ADD_USER);

  const handleSignup = async (event) => {
    event.preventDefault();
    const {data} = await addUser({
      variables: { ...signupState }
    });
    const token = data.addUser.token;
    Auth.login(token, familyId);
  }

  const handleSignupChange = (event) => {
    const { name, value } = event.target;

    setSignupState({
      ...signupState,
      [name]: value
    });
  };

  return (
    <form id="signup-form" onSubmit={handleSignup}>
      <h1>Signup</h1>
      <div className="form-group">
        <label htmlFor="signup-name">Name</label>
        <small>A separate nickname can be entered each time you join a family or group.</small>
        <input
          id="signup-name"
          className="login-input"
          placeholder="Enter Your Name"
          name="name"
          type="text"
          value={signupState.name}
          onChange={handleSignupChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="signup-email"></label>
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
        <label htmlFor="signup-birthday"></label>
        <input
          id="signup-birthday"
          className="login-input"
          placeholder="birthday"
          name="birthday"
          type="text"
          value={signupState.birthday}
          onChange={handleSignupChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="signup-password"></label>
        <input
          id="signup-password"
          className="login-input"
          placeholder="Password"
          name="password"
          type="password"
          value={signupState.password}
          onChange={handleSignupChange}
        />
      </div>
      <button type='submit'>Sign Up</button>
    </form>
  )
}