import merge from 'lodash.merge';
import {
  LOAD_PROPOSAL_LIST_SUCCESS,
  LOAD_PROPOSAL_SUCCESS,
  LOAD_VOTES_SUCCESS,
  CREATE_STATEMENT_SUCCESS,
  LOAD_USERS_SUCCESS,
  CREATE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPLOAD_AVATAR_SUCCESS,
  RESET_PASSWORD_SUCCESS,
  FIND_USER_SUCCESS,
  FETCH_USER_SUCCESS,
  LOAD_FLAGGEDSTMTS_SUCCESS,
  LOAD_FEED_SUCCESS,
  SESSION_LOGIN_SUCCESS,
  SSE_UPDATE_SUCCESS,
  LOAD_WORKTEAMS_SUCCESS,
  JOIN_WORKTEAM_SUCCESS,
  LEAVE_WORKTEAM_SUCCESS,
} from '../constants';

export default function byId(state = {}, action) {
  switch (action.type) {
    case LOAD_FEED_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case LOAD_PROPOSAL_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case LOAD_PROPOSAL_LIST_SUCCESS: {
      // change
      return merge({}, state, action.payload.entities.users);
    }
    case LOAD_VOTES_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case CREATE_STATEMENT_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case LOAD_USERS_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case CREATE_USER_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case LOAD_WORKTEAMS_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case JOIN_WORKTEAM_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case LEAVE_WORKTEAM_SUCCESS: {
      return {
        ...state,
        [action.payload.result]: {
          ...state[action.payload.result],
          workTeams:
            action.payload.entities.users[action.payload.result].workTeams,
        },
      };
    }
    case SSE_UPDATE_SUCCESS: {
      return action.payload.entities.users
        ? merge({}, state, action.payload.entities.users)
        : state;
    }
    case UPDATE_USER_SUCCESS: {
      // bc of deleted followees
      const users = action.payload.entities.users;
      const newState = Object.keys(users).reduce(
        (acc, curr) => ({ ...acc, [curr]: { ...state[curr], ...users[curr] } }),
        {},
      );
      return {
        ...state,
        ...newState,
        //...action.payload.entities.users,
      };
    }
    case UPLOAD_AVATAR_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case RESET_PASSWORD_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case FIND_USER_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case SESSION_LOGIN_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    case FETCH_USER_SUCCESS: {
      // bc of deleted followees
      return {
        ...state,
        ...action.payload.entities.users,
      };
      // return merge({}, state, action.payload.entities.users);
    }
    case LOAD_FLAGGEDSTMTS_SUCCESS: {
      return merge({}, state, action.payload.entities.users);
    }
    default:
      return state;
  }
}

export const getUser = (state, id) => state[id];
