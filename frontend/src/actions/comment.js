import axios from 'axios';
import { getRecentActivity } from './group.js';

import {
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
  POST_COMMENT,
  POST_COMMENT_ERROR,
  DELETE_COMMENT,
  DELETE_COMMENT_ERROR,
} from './types';

// Get comments
export const getComments = (expenseID) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/expense/${expenseID}`
    );
    dispatch({
      type: GET_COMMENTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_COMMENTS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// post comment
export const postComments = ({ expenseID, message }) => async (dispatch) => {
  try {
    const config = {
      headers: { 'Content-type': 'application/json' },
    };
    const body = JSON.stringify({ expenseID, message });

    const res = await axios.post(
      'http://localhost:8000/api/expense',
      body,
      config
    );
    dispatch({
      type: POST_COMMENT,
      payload: res.data,
    });
    dispatch(getRecentActivity());
  } catch (error) {
    dispatch({
      type: POST_COMMENT_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// post comment
export const deleteComment = ({ expenseID, commentID }) => async (dispatch) => {
  try {
    const data = JSON.stringify({ expenseID, commentID });
    const res = await axios.delete('http://localhost:8000/api/expense', {
      data,
      headers: { 'Content-type': 'application/json' },
    });
    dispatch({
      type: DELETE_COMMENT,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: DELETE_COMMENT_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
