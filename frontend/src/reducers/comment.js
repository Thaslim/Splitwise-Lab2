import {
  CLEAR_COMMENTS,
  DELETE_COMMENT,
  DELETE_COMMENT_ERROR,
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
  POST_COMMENT,
  POST_COMMENT_ERROR,
} from '../actions/types.js';

const initialState = {
  comments: null,
  error: {},
  loading: true,
};

function commentReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_COMMENTS:
    case POST_COMMENT:
    case DELETE_COMMENT:
      return {
        ...state,
        comments: payload,
        loading: false,
      };

    case GET_COMMENTS_ERROR:
    case POST_COMMENT_ERROR:
    case DELETE_COMMENT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_COMMENTS:
      return {
        ...state,
        comments: null,
      };

    default:
      return state;
  }
}

export default commentReducer;
