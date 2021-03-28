// import api from '../utils/api';
import axios from 'axios';
import setToken from '../utils/setToken';
import setAlert from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_GROUPS,
  CLEAR_DASHBOARD,
} from './types';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setToken(localStorage.token);
  }
  try {
    const res = await axios.get('api/login');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const signup = ({ userName, userEmail, userPassword }) => async (
  dispatch
) => {
  const config = {
    headers: { 'Content-type': 'application/json' },
  };
  const body = JSON.stringify({ userName, userEmail, userPassword });
  try {
    const res = await axios.post('api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = ({ userEmail, userPassword, history }) => async (
  dispatch
) => {
  const config = {
    headers: { 'content-type': 'application/json' },
  };
  const body = JSON.stringify({ userEmail, userPassword });
  try {
    const res = await axios.post('api/login', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    setTimeout(() => {
      history.push('/dashboard');
    }, 1000);
  } catch (err) {
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_GROUPS });
  dispatch({ type: CLEAR_DASHBOARD });
  dispatch({ type: LOGOUT });
};
