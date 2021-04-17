import axios from 'axios';
import setAlert from './alert';
import {
  CREATE_GROUP,
  CREATE_GROUP_ERROR,
  GET_ALL_USERS,
  GET_ALL_USERS_ERROR,
  GET_GROUP_ACTIVITY,
  GET_GROUP_ACTIVITY_ERROR,
  EDIT_GROUP_INFO,
  EDIT_GROUP_INFO_ERROR,
  ACCEPT_INVITATION,
  ACCEPT_INVITATION_ERROR,
  GET_RECENT_ACTIVITY,
  GET_RECENT_ACTIVITY_ERROR,
  LEAVE_GROUP,
  LEAVE_GROUP_ERROR,
  GET_GROUPS,
  GET_GROUPS_ERROR,
  ADD_EXPENSE,
  ADD_EXPENSE_ERROR,
  SETTLE_EXPENSE,
  SETTLE_EXPENSE_ERROR,
  GET_GROUP_BALANCE,
  GET_GROUP_BALANCE_ERROR,
} from './types';

// Get Recent Activity
export const getRecentActivity = () => async (dispatch) => {
  try {
    const res = await axios.get('http://localhost:8000/api/activity');
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

// Get users active groups list
export const getAcceptedGroups = () => async (dispatch) => {
  try {
    const res = await axios.get('http://localhost:8000/api/my-groups/');
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
    const res = await axios.post(
      'http://localhost:8000/api/groups/',
      body,
      config
    );
    dispatch({
      type: ADD_EXPENSE,
      payload: res.data,
    });
    dispatch(setAlert('Expense Added', 'success'));
    dispatch(getAcceptedGroups());
    dispatch(getRecentActivity());
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
export const settleExpense = (settleWithID) => async (dispatch) => {
  try {
    const config = {
      headers: { 'Content-type': 'application/json' },
    };
    const body = JSON.stringify({ settleWithID });
    const res = await axios.post('/api/settle', body, config);
    dispatch({
      type: SETTLE_EXPENSE,
      payload: res.data,
    });
    dispatch(setAlert('Settled balance', 'success'));
    dispatch(getAcceptedGroups());
    dispatch(getRecentActivity());
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
    dispatch(getAcceptedGroups());
    dispatch(getRecentActivity());
    history.push('/dashboard');
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

// Get Group Balances
export const getGroupBalances = (groupID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/groups/group-balance/${groupID}`);
    dispatch({
      type: GET_GROUP_BALANCE,
      payload: res.data,
    });
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: GET_GROUP_BALANCE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// edit group info based on id
export const editGroupInfo = (groupData, history) => async (dispatch) => {
  try {
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    const res = await axios.post(
      '/api/my-groups/update-group',
      groupData,
      config
    );
    dispatch({
      type: EDIT_GROUP_INFO,
      payload: res.data,
    });
    dispatch(setAlert('GroupInfo updated', 'success'));
    dispatch(getAcceptedGroups());
    dispatch(getRecentActivity());
    history.push('/dashboard');
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

// Accept group Invitation
export const acceptGroupInvitation = (groupID, groupName) => async (
  dispatch
) => {
  try {
    const config = {
      headers: { 'content-type': 'application/json' },
    };

    const body = { groupID, groupName };
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
    dispatch(getRecentActivity());
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

export const leaveGroup = (groupID, groupName) => async (dispatch) => {
  try {
    const config = {
      headers: { 'content-type': 'application/json' },
    };
    const body = { groupID, groupName };
    const res = await axios.post('api/my-groups/leave-group', body, config);
    dispatch({
      type: LEAVE_GROUP,
      payload: res.data,
    });
    dispatch(getAcceptedGroups());
    dispatch(getRecentActivity());
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: LEAVE_GROUP_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
