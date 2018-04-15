import { combineReducers } from 'redux';
import {
  LOAD_SUBSCRIPTIONS_START,
  LOAD_SUBSCRIPTIONS_SUCCESS,
  LOAD_SUBSCRIPTIONS_ERROR,
  CREATE_SUBSCRIPTION_SUCCESS,
  DELETE_SUBSCRIPTION_SUCCESS,
} from '../constants';

const handlePageInfo = (state, action) => {
  if (state.endCursor && !action.savePageInfo) {
    return state;
  }
  return { ...state, ...action.pagination };
};
const createList = filter => {
  const ids = (state = [], action) => {
    switch (action.type) {
      case CREATE_SUBSCRIPTION_SUCCESS:
      case LOAD_SUBSCRIPTIONS_SUCCESS: {
        return filter === action.filter || filter === 'all'
          ? [...new Set([...state, ...action.payload.result])]
          : state;
      }

      case DELETE_SUBSCRIPTION_SUCCESS: {
        return state.filter(uId => uId !== action.payload.result);
      }

      default:
        return state;
    }
  };
  const isFetching = (state = false, action) => {
    if (action.filter !== filter) {
      return state;
    }
    switch (action.type) {
      case LOAD_SUBSCRIPTIONS_START:
        return true;
      case LOAD_SUBSCRIPTIONS_SUCCESS:
      case LOAD_SUBSCRIPTIONS_ERROR:
        return false;
      default:
        return state;
    }
  };

  const errorMessage = (state = null, action) => {
    if (action.filter !== filter) {
      return state;
    }
    switch (action.type) {
      case LOAD_SUBSCRIPTIONS_ERROR:
        return action.message;
      case LOAD_SUBSCRIPTIONS_START:
      case LOAD_SUBSCRIPTIONS_SUCCESS:
        return null;

      default:
        return state;
    }
  };
  const pageInfo = (state = { endCursor: '', hasNextPage: false }, action) => {
    if (action.filter !== filter) {
      return state;
    }
    switch (action.type) {
      case LOAD_SUBSCRIPTIONS_SUCCESS:
        return handlePageInfo(state, action);

      default:
        return state;
    }
  };
  return combineReducers({
    ids,
    isFetching,
    errorMessage,
    pageInfo,
  });
};

export default createList;
export const getIds = state => state.ids;
export const getStatus = state => ({
  ...state.pageInfo,
  pending: state.isFetching,
  error: state.errorMessage,
});