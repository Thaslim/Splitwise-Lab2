import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import splitwiselogo from '../landingPage/splitwise.svg';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
  });
  const { userEmail, userPassword } = formData;

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    login({ userEmail, userPassword });
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
          <h2>Welcome to splitwise</h2>

          <form id='new_user' onSubmit={onSubmit}>
            Email address
            <br />
            <input
              className='form-control'
              type='email'
              name='userEmail'
              value={userEmail}
              onChange={onInputChange}
              id='user_email'
            />
            Password
            <br />
            <input
              className='form-control'
              type='password'
              name='userPassword'
              value={userPassword}
              onChange={onInputChange}
              id='user_password'
            />
            <input
              type='submit'
              className='btn btn-lg btn-danger'
              value='Log in'
            />
          </form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
Login.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
