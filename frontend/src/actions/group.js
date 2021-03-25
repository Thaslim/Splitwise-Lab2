import axios from 'axios';
import setAlert from './alert';
import { loadUser } from './auth';
import { getAcceptedGroups } from './dashboard';

import {
  CREATE_GROUP,
  CREATE_GROUP_ERROR,
  GET_ALL_USERS,
  GET_ALL_USERS_ERROR,
  GET_GROUP_ACTIVITY,
  GET_GROUP_ACTIVITY_ERROR,
  EDIT_GROUP_INFO,
  EDIT_GROUP_INFO_ERROR,
  CLEAR_GROUP_ACTIVITY,
  GET_ALL_MY_GROUPS,
  GET_ALL_MY_GROUPS_ERROR,
  ACCEPT_INVITATION,
  ACCEPT_INVITATION_ERROR,
  REJECT_INVITATION,
  REJECT_INVITATION_ERROR,
  GET_RECENT_ACTIVITY,
  GET_RECENT_ACTIVITY_ERROR,
} from './types';

// Get registered user list
export const getAllUsers = () => async (dispatch) => {
  try {
    const res = await axios.get('api/new-group');
    dispatch({
      type: GET_ALL_USERS,
      payload: res.data,
    });
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: GET_ALL_USERS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
// Create New Group
// eslint-disable-next-line import/prefer-default-export
export const createNewGroup = (groupData, history) => async (dispatch) => {
  try {
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    const res = await axios.post('api/new-group', groupData, config);
    dispatch({
      type: CREATE_GROUP,
      payload: res.data,
    });
    dispatch(setAlert('Group created', 'success'));
    dispatch(loadUser());
    // dispatch(getAcceptedGroups());
    setTimeout(() => {
      history.push('/dashboard');
    }, 300);
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: CREATE_GROUP_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Get Group Activity
export const getGroupActivity = (groupID) => async (dispatch) => {
  dispatch({ type: CLEAR_GROUP_ACTIVITY });
  try {
    const res = await axios.get(`/api/groups/${groupID}`);
    dispatch({
      type: GET_GROUP_ACTIVITY,
      payload: res.data,
    });
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: GET_GROUP_ACTIVITY_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// edit group info based on id
export const editGroupInfo = (groupID, groupData, history) => async (
  dispatch
) => {
  try {
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    const res = await axios.post(
      `/api/my-groups/update-group/${groupID}`,
      groupData,
      config
    );
    dispatch({
      type: EDIT_GROUP_INFO,
      payload: res.data,
    });
    dispatch(setAlert('GroupInfo updated', 'success'));
    setTimeout(() => {
      history.goBack();
    }, 500);
  } catch (error) {
    dispatch({
      type: EDIT_GROUP_INFO_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Get all my groups including not accepted
export const getAllMyGroups = () => async (dispatch) => {
  try {
    const res = await axios.get('api/my-groups');
    dispatch({
      type: GET_ALL_MY_GROUPS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_MY_GROUPS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Accept group Invitation
export const acceptGroupInvitation = (groupID, history) => async (dispatch) => {
  try {
    const config = {
      headers: { 'content-type': 'application/json' },
    };
    const body = { groupID };
    const res = await axios.post(
      'api/my-groups/accept-invitation',
      body,
      config
    );
    dispatch({
      type: ACCEPT_INVITATION,
      payload: res.data,
    });
    dispatch(setAlert('Invitation Accepted', 'success'));
    dispatch(getAcceptedGroups());
    dispatch(getGroupActivity(`${groupID}`));
    setTimeout(() => {
      history.push(`/api/groups/${groupID}`);
    }, 500);
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: ACCEPT_INVITATION_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Reject group Invitation
export const rejectInvitation = (groupID, history) => async (dispatch) => {
  try {
    const config = {
      headers: { 'content-type': 'application/json' },
    };
    const body = { groupID };
    const res = await axios.post(
      'api/my-groups/reject-invitation',
      body,
      config
    );
    dispatch({
      type: REJECT_INVITATION,
      payload: res.data,
    });

    setTimeout(() => {
      history.goBack();
    }, 500);
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: REJECT_INVITATION_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Get Recent Activity
export const getRecentActivity = () => async (dispatch) => {
  try {
    const res = await axios.get('api/activity');
    dispatch({
      type: GET_RECENT_ACTIVITY,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_RECENT_ACTIVITY_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
