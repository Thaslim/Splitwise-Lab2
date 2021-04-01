/* eslint-disable object-curly-newline */
import axios from 'axios';
import setAlert from './alert';

import {
  GET_GROUPS,
  GET_GROUPS_ERROR,
  ADD_EXPENSE,
  ADD_EXPENSE_ERROR,
  SETTLE_EXPENSE,
  SETTLE_EXPENSE_ERROR,
} from './types';

// Get users active groups list
export const getAcceptedGroups = () => async (dispatch) => {
  try {
    const res = await axios.get('api/my-groups/');
    dispatch({
      type: GET_GROUPS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_GROUPS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Add expense
export const addExpense = ({ groupID, description, amount, date }) => async (
  dispatch
) => {
  try {
    const config = {
      headers: { 'Content-type': 'application/json' },
    };
    const body = JSON.stringify({ groupID, description, amount, date });
    const res = await axios.post('api/groups/', body, config);
    dispatch({
      type: ADD_EXPENSE,
      payload: res.data,
    });
    dispatch(setAlert('Expense Added', 'success'));
    dispatch(getAcceptedGroups());
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: ADD_EXPENSE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Settle expense
export const settleExpense = (settleWithEmail) => async (dispatch) => {
  try {
    const config = {
      headers: { 'Content-type': 'application/json' },
    };
    const body = JSON.stringify({ settleWithEmail });
    const res = await axios.post('/api/settle', body, config);
    dispatch({
      type: SETTLE_EXPENSE,
      payload: res.data,
    });
    dispatch(setAlert('Settled balance', 'success'));
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: SETTLE_EXPENSE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
