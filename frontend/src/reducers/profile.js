import { UPDATE_PROFILE, UPDATE_PROFILE_ERROR } from '../actions/types';

const initialState = { updateStatus: '', error: {} };

function profileReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        updateStatus: payload,
      };

    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        error: payload,
      };

    default:
      return state;
  }
}

export default profileReducer;
