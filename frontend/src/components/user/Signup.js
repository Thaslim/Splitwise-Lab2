/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import splitwiselogo from '../landingPage/splitwise.svg';

import { signup } from '../../actions/auth';

const Signup = ({ signup, isAuthenticated }) => {
  const [visibility, setvisibility] = useState('hidden');
  const [maxHeight, setmaxHeight] = useState('0');
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
  });
  const { userName, userEmail, userPassword } = formData;
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const secondaryFields = () => {
    setvisibility('visible');
    setmaxHeight('none');
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    signup({ userName, userEmail, userPassword });
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className='container-fluid'>
      <div className='center-form'>
        <div className='img-class'>
          <Link className='brand-image' to='/'>
            <img
              style={{ width: '200px', height: '200px' }}
              src={splitwiselogo}
              alt='logo'
            />
          </Link>
        </div>

        <div className='form-content'>
          <h2>Introduce yourself</h2>

          <form id='new_user' onSubmit={onSubmit}>
            <p style={{ fontSize: '24px' }}>Hi there! My name is</p>
            <input
              className='form-control'
              autoComplete='off'
              style={{
                fontSize: '32px',
                height: '42px',
              }}
              onChange={secondaryFields}
              onKeyUp={secondaryFields}
              type='text'
              value={userName}
              onChange={(e) => onInputChange(e)}
              name='userName'
              id='user_name'
            />

            <div className='secondaryFields' style={{ visibility, maxHeight }}>
              Here’s my <strong>email address</strong>:
              <br />
              <input
                className='form-control'
                type='email'
                name='userEmail'
                value={userEmail}
                onChange={(e) => onInputChange(e)}
                id='user_email'
              />
              And here’s my <strong>password</strong>:
              <br />
              <input
                className='form-control'
                type='password'
                name='userPassword'
                value={userPassword}
                onChange={(e) => onInputChange(e)}
                id='user_password'
              />
            </div>

            <input
              type='submit'
              className='btn btn-lg btn-danger'
              value='Sign Me Up!'
            />
          </form>
        </div>
      </div>
    </div>
  );
};

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

Signup.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { signup })(Signup);
