import React, {useEffect, useState} from 'react';

import st            from 'ryscott-st';
import {ax, auth, helpers} from 'util';

const Login = function() {
  const [signUp, setSignUp] = useState(false);

  var handleSubmit = function(e) {
    e.preventDefault();

    var form = e.target;

    if (signUp) {
      var user = {
        username: form.username.value,
        email: form.email.value,
        password: form.pass.value
      };

      auth.signUp(user);
    } else {
      auth.signIn(form.email.value, form.pass.value);
    }
  };

  var renderForm = function() {
    return (
      <form id='loginForm' className='loginForm v' onSubmit={handleSubmit} autoComplete='off'>
        <div className='formHead v'>
          <h2>
            Welcome to communitii!
          </h2>
        </div>

        <div className='formBody v'>
          <div className='loginInputs v'>
            {signUp && <input className='formInput' name='username' autoComplete='off' type='text' placeholder='Username?'/>}

            <input className='formInput' name='email' autoComplete='off' type='text'     placeholder='Email address!'/>
            <input className='formInput' name='pass'  autoComplete='off' type='password' placeholder='Password!'/>
            <input className='formSubmit' type='submit' value={!signUp ? 'sign in' : 'sign up'}/>
          </div>

          <div className='signUpText' onClick={()=>{setSignUp(!signUp)}}>
            {!signUp && 'Create an account?'}
            {signUp  && 'Sign in?'}
          </div>
        </div>

        <div className='backButton' onClick={()=>{st.setView('find')}}>
          back
        </div>
      </form>
    )
  };

  return (
    <div className='auth v'>
      {renderForm()}
    </div>
  )
};

export default Login;

