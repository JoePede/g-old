import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import intl, * as fromIntl from './intl';
import entities, * as fromEntity from './entities';
import ui, * as fromUi from './ui';
import consent from './consent';

export default combineReducers({
  user,
  runtime,
  intl,
  entities,
  ui,
  webPushKey: (state = '') => state,
  consent,
});

export const getVisibleProposals = (state, filter) =>
  fromEntity.getVisibleProposals(state.entities, filter);

export const getProposalsIsFetching = (state, filter) =>
  fromEntity.getProposalsIsFetching(state.entities, filter);

export const getProposalsErrorMessage = (state, filter) =>
  fromEntity.getProposalsErrorMessage(state.entities, filter);

export const getProposalsPage = (state, filter) =>
  fromEntity.getProposalsPage(state.entities, filter);

export const getSessionUser = state => fromEntity.getUser(state.entities, state.user);

export const getProposal = (state, id) => fromEntity.getProposal(state.entities, id);

export const getIsProposalFetching = (state, id) => fromUi.getIsProposalFetching(state.ui, id);

export const getProposalSuccess = (state, id) => fromUi.getProposalSuccess(state.ui, id);

export const getProposalErrorMessage = (state, id) => fromUi.getProposalErrorMessage(state.ui, id);

export const getVotingListIsFetching = (state, id) => fromUi.getVotingListIsFetching(state.ui, id);

export const getVotingListErrorMessage = (state, id) =>
  fromUi.getVotingListErrorMessage(state.ui, id);

export const getVoteUpdates = (state, id) => fromUi.getVoteUpdates(state.ui, id);

export const getStatementUpdates = state => fromUi.getStatementUpdates(state.ui);

export const getVisibleUsers = (state, filter) =>
  fromEntity.getVisibleUsers(state.entities, filter);

export const getUsersIsFetching = (state, filter) =>
  fromEntity.getUsersIsFetching(state.entities, filter);

export const getUsersErrorMessage = (state, filter) =>
  fromEntity.getUsersErrorMessage(state.entities, filter);

export const getAccountUpdates = (state, id) => fromUi.getAccountUpdates(state.ui, id);

export const getLocale = state => fromIntl.getLocale(state.intl);

export const getMessages = state => fromIntl.getMessages(state.intl);

export const getUser = (state, id) => fromEntity.getUser(state.entities, id);

export const getVisibleFlags = (state, filter) =>
  fromEntity.getVisibleFlags(state.entities, filter);

export const getFlagsIsFetching = (state, filter) =>
  fromEntity.getFlagsIsFetching(state.entities, filter);

export const getFlagsErrorMessage = (state, filter) =>
  fromEntity.getFlagsErrorMessage(state.entities, filter);

export const getFlagsPage = (state, filter) => fromEntity.getFlagsPage(state.entities, filter);

export const getActivities = (state, filter) => fromEntity.getActivities(state.entities, filter);

export const getFeedIsFetching = (state, filter) =>
  fromEntity.getFeedIsFetching(state.entities, filter);

export const getFeedErrorMessage = (state, filter) =>
  fromEntity.getFeedErrorMessage(state.entities, filter);

export const getTags = state => fromEntity.getTags(state.entities);

export const getFolloweeVotesByPoll = (state, id) =>
  fromEntity.getFolloweeVotesByPoll(state.entities, id);

export const getFollowees = state => fromEntity.getFollowees(state.entities);

export const getAllStatementsByPoll = (state, id) =>
  fromEntity.getAllStatementsByPoll(state.entities, id);

export const getVisibibleStatementsByPoll = (state, id, filter) =>
  fromEntity.getVisibibleStatementsByPoll(state.entities, id, filter);

export const getSubscription = state => fromUi.getSubscription(state.ui);

export const getActivityCounter = state => fromUi.getActivityCounter(state.ui);

export const getWorkTeams = state => fromEntity.getWorkTeams(state.entities);
