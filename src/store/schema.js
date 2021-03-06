import { schema } from 'normalizr';

export const role = new schema.Entity('roles');
export const user = new schema.Entity('users');
export const workTeam = new schema.Entity('workTeams', {
  coordinator: user,
  members: [user],
});
user.define({
  role,
  followees: [user],
  workTeams: [workTeam],
});
export const pollingMode = new schema.Entity('pollingModes');
export const vote = new schema.Entity('votes', {
  voter: user,
});
export const statementLike = new schema.Entity('statementLikes');

export const statement = new schema.Entity('statements', {
  author: user,
  vote,
});
export const flaggedStatement = new schema.Entity('flaggedStatements', {
  flagger: user,
  flaggedUser: user,
  solver: user,
  statement,
});
export const poll = new schema.Entity('polls', {
  author: user,
  statements: [statement],
  mode: pollingMode,
  votes: [vote],
  ownVote: vote,
  ownStatement: statement,
  followees: [vote],
  likedStatements: [statementLike],
});
export const tag = new schema.Entity('tags');
export const proposal = new schema.Entity('proposals', {
  author: user,
  pollOne: poll,
  pollTwo: poll,
  tags: [tag],
});
export const notification = new schema.Entity('notifications', {
  sender: user,
});
export const unionSchema = new schema.Union(
  {
    ProposalDL: proposal,
    VoteDL: vote,
    StatementDL: statement,
    Notification: notification,
  },
  '__typename',
);
export const activity = new schema.Entity('activities', {
  actor: user,
  object: unionSchema,
});

export const proposalList = [proposal];
export const voteList = [vote];
export const userList = [user];
export const flaggedStatementArray = [flaggedStatement];
export const activityArray = [activity];
export const tagArray = [tag];
export const statementArray = [statement];
export const workTeamList = [workTeam];
