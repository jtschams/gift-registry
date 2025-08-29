import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { LOGIN } from '../utils/mutations'
import Auth from '../utils/auth';

const Login = ({familyId}) => {
  const [ loginState, setLoginState ] = useState({
    email: '',
    password: ''
  });

  const [login] = useMutation(LOGIN);

  const handleLogin = async (event) => {
    event.preventDefault();
    const {data} = await login({
      variables: { ...loginState }
    });
    const token = data.login.token;
    Auth.login(token, familyId);
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginState({
      ...loginState,
      [name]: value
    });
  };

  function toggleLoginPassword() {
    const toggleEl = document.getElementById("toggle-login-password");
    const pwEl = document.getElementById("login-password");
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
      <h1>Login</h1>
      <form id="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="login-input"
            placeholder="Email"
            name="email"
            type="text"
            value={loginState.email}
            onChange={handleLoginChange}
          />
        </div>
        <div className="form-group password-container">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="login-input"
            placeholder="Password"
            name="password"
            type="password"
            value={loginState.password}
            onChange={handleLoginChange}
          />
          <small id="toggle-login-password" onClick={toggleLoginPassword}>Show Password</small>
        </div>
        <button type='submit'>Log In</button>
      </form>
    </article>
  )
}

export default Login;