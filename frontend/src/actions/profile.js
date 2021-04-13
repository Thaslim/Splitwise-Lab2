import axios from 'axios';
import setAlert from './alert';
import { loadUser } from './auth';
import { getAcceptedGroups } from './group';
import { UPDATE_PROFILE, UPDATE_PROFILE_ERROR } from './types';

// Update Profile
export const updateUserProfile = (profileData, history) => async (dispatch) => {
  try {
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    const res = await axios.post('api/me', profileData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Profile updated', 'success'));
    dispatch(loadUser());
    dispatch(getAcceptedGroups());
    history.push('/dashboard');
  } catch (error) {
    const { errors } = error.response.data;

    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: UPDATE_PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
