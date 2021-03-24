/* eslint-disable indent */
import {
  GET_GROUPS,
  GET_GROUPS_ERROR,
  CLEAR_GROUPS,
  ADD_EXPENSE_ERROR,
  ADD_EXPENSE,
  CLEAR_DASHBOARD,
  GET_DASHBOARD,
  DASHBOARD_ERROR,
  SETTLE_EXPENSE,
  SETTLE_EXPENSE_ERROR,
} from '../actions/types';

const initialState = {
  acceptedGroups: null,
  summary: null,
  error: {},
  loading: true,
  summaryLoading: true,
  expenseAdded: false,
  expenseSettled: false,
};

function dashboardReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_GROUPS:
      return {
        ...state,
        acceptedGroups: payload,
        loading: false,
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
        acceptedGroups: null,
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
        expenseAdded: false,
      };
    case GET_DASHBOARD:
      return {
        ...state,
        summary: payload,
        summaryLoading: false,
      };

    case DASHBOARD_ERROR:
      return {
        ...state,
        error: payload,
        summaryLoading: false,
      };
    case CLEAR_DASHBOARD:
      return {
        ...state,
        summary: null,
        summaryLoading: false,
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
    default:
      return state;
  }
}

export default dashboardReducer;
