import { SESSION_LOGOUT_SUCCESS, CREATE_USER_SUCCESS, RESET_PASSWORD_SUCCESS } from '../constants';

export default function user(state = {}, action) {
  switch (action.type) {
    case SESSION_LOGOUT_SUCCESS: {
      return {};
    }
    case CREATE_USER_SUCCESS:
    case RESET_PASSWORD_SUCCESS: {
      return action.payload.result;
    }
    default:
      return state;
  }
}
