/* eslint-disable indent */
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
  ACCEPT_INVITATION_ERROR,
  ACCEPT_INVITATION,
  LEAVE_GROUP,
  LEAVE_GROUP_ERROR,
  GET_RECENT_ACTIVITY,
  GET_RECENT_ACTIVITY_ERROR,
  CLEAR_RECENT_ACTIVITY,
  GET_GROUPS,
  GET_GROUPS_ERROR,
  CLEAR_GROUPS,
  ADD_EXPENSE_ERROR,
  ADD_EXPENSE,
  SETTLE_EXPENSE,
  SETTLE_EXPENSE_ERROR,
  GET_GROUP_BALANCE,
  GET_GROUP_BALANCE_ERROR,
  CLEAR_GROUP_BALANCE,
} from '../actions/types';

const initialState = {
  groupCreated: null,
  registeredUsersList: [],
  error: {},
  groupActivity: null,
  groupInfo: '',
  invitation: '',
  recentactivity: null,
  groupBalance: null,
  groups: null,
  loading: true,
  expenseAdded: false,
  expenseSettled: false,
  activity_loading: true,
};

function groupReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_GROUP:
      return {
        ...state,
        groupCreated: payload,
      };

    case CREATE_GROUP_ERROR:
    case GET_ALL_USERS_ERROR:
    case GET_GROUP_ACTIVITY_ERROR:
    case EDIT_GROUP_INFO_ERROR:
    case ACCEPT_INVITATION_ERROR:
    case GET_RECENT_ACTIVITY_ERROR:
    case LEAVE_GROUP_ERROR:
    case GET_GROUP_BALANCE_ERROR:
      return {
        ...state,
        error: payload,
      };
    case GET_ALL_USERS:
      return {
        ...state,
        registeredUsersList: payload,
      };
    case GET_GROUP_ACTIVITY:
      return {
        ...state,
        groupActivity: payload,
      };
    case EDIT_GROUP_INFO:
      return {
        ...state,
        groupInfo: payload,
      };
    case CLEAR_GROUP_ACTIVITY:
      return {
        ...state,
        groupActivity: null,
        groupInfo: '',
      };

    case ACCEPT_INVITATION:
      return {
        ...state,
        invitation: payload,
      };
    case LEAVE_GROUP:
      return {
        ...state,
        invitation: payload,
      };

    case GET_RECENT_ACTIVITY:
      return {
        ...state,
        recentactivity: payload,
        activity_loading: false,
      };

    case CLEAR_RECENT_ACTIVITY:
      return {
        ...state,
        recentactivity: null,
      };

    case GET_GROUPS:
      return {
        ...state,
        groups: payload,
        loading: false,
        groupInfo: '',
      };

    case GET_GROUPS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_GROUPS:
      return {
        ...state,
        groups: null,
        loading: false,
      };
    case ADD_EXPENSE:
      return {
        ...state,
        expenseAdded: true,
      };

    case ADD_EXPENSE_ERROR:
      return {
        ...state,
        error: payload,
      };
    case SETTLE_EXPENSE:
      return {
        ...state,
        expenseSettled: true,
      };

    case SETTLE_EXPENSE_ERROR:
      return {
        ...state,
        error: payload,
        expenseSettled: true,
      };

    case GET_GROUP_BALANCE:
      return {
        ...state,
        groupBalance: payload,
      };

    case CLEAR_GROUP_BALANCE:
      return {
        ...state,
        groupBalance: null,
      };

    default:
      return state;
  }
}

export default groupReducer;
