import axios from 'axios';
import setToken from '../utils/setToken';
import setAlert from './alert';
import { getAcceptedGroups } from './group';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_GROUPS,
  CLEAR_GROUP_ACTIVITY,
  CLEAR_GROUP_BALANCE,
  CLEAR_RECENT_ACTIVITY,
  CLEAR_COMMENTS,
} from './types';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setToken(localStorage.token);
  }
  try {
    const res = await axios.get('http://localhost:8000/api/login');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
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
    dispatch(getAcceptedGroups());
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
export const login = ({ userEmail, userPassword }) => async (dispatch) => {
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
    dispatch(getAcceptedGroups());
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
  dispatch({ type: CLEAR_GROUP_ACTIVITY });
  dispatch({ type: CLEAR_COMMENTS });
  dispatch({ type: CLEAR_RECENT_ACTIVITY });
  dispatch({ type: CLEAR_GROUP_BALANCE });
  dispatch({ type: CLEAR_GROUPS });
  dispatch({ type: LOGOUT });
};
