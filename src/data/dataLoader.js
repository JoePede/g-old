import DataLoader from 'dataloader';
import knex from './knex';

// TODO parallelize requests with Promise.all()
const getUsersById = userIds =>
  new Promise((resolve) => {
    knex('users').whereIn('id', userIds).select().then(data =>
      resolve(
        userIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

// TODO check if this behaviour can be achieved with SQL
/*
  To comply with DataLoader
  Groups each value from the pair by the key and returns an array with the same
  length and order of the request-array.
*/
function groupFollowers(data, requestedIds) {
  const store = {};
  for (let i = 0, l = data.length; i < l; i += 1) {
    if (!(data[i].follower_id in store)) {
      store[data[i].follower_id] = [data[i].followee_id];
      continue; // eslint-disable-line no-continue
    }
    store[data[i].follower_id].push(data[i].followee_id);
  }
  // eslint-disable-next-line arrow-body-style
  const result = requestedIds.map((ids) => {
    return store[ids] ? store[ids] : [];
  });
  return result;
}

const getFolloweeIds = followerIds =>
  Promise.resolve(
    knex('user_follows')
      .whereIn('follower_id', followerIds)
      .select('followee_id', 'follower_id')
      .then(ids => groupFollowers(ids, followerIds)),
  );

const getRolesById = roleIds =>
  new Promise((resolve) => {
    knex('roles').whereIn('id', roleIds).select().then(data =>
      resolve(
        roleIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

const getProposalsById = proposalIds =>
  new Promise((resolve) => {
    knex('proposals').whereIn('id', proposalIds).select().then(data =>
      resolve(
        proposalIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

const getPollsById = pollIds =>
  new Promise((resolve) => {
    knex('polls').whereIn('id', pollIds).select().then(data =>
      resolve(
        pollIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });
const getVotesById = voteIds =>
  new Promise((resolve) => {
    knex('votes').whereIn('id', voteIds).select().then(data =>
      resolve(
        voteIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

const getStatementsById = statementIds =>
  new Promise((resolve) => {
    knex('statements').whereIn('id', statementIds).select().then(data =>
      resolve(
        statementIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

const getPollingModesById = pollingModeIds =>
  new Promise((resolve) => {
    knex('polling_modes').whereIn('id', pollingModeIds).select().then(data =>
      resolve(
        pollingModeIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

const getTagsById = tagIds =>
  new Promise((resolve) => {
    knex('tags').whereIn('id', tagIds).select().then(data =>
      resolve(
        tagIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

const getStatementLikesById = likeIds =>
  new Promise((resolve) => {
    knex('statement_likes').whereIn('id', likeIds).select().then(data =>
      resolve(
        likeIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

const getActivitiesById = activityIds =>
  new Promise((resolve) => {
    knex('activities').whereIn('id', activityIds).select().then(data =>
      resolve(
        activityIds.map(
          // eslint-disable-next-line eqeqeq
          id => data.find(row => row.id == id) || new Error(`Row not found: ${id}`),
        ),
      ),
    );
  });

function createLoaders() {
  return {
    users: new DataLoader(ids => getUsersById(ids)),
    followees: new DataLoader(ids => getFolloweeIds(ids)),
    roles: new DataLoader(ids => getRolesById(ids)),
    proposals: new DataLoader(ids => getProposalsById(ids)),
    polls: new DataLoader(ids => getPollsById(ids)),
    votes: new DataLoader(ids => getVotesById(ids)),
    statements: new DataLoader(ids => getStatementsById(ids)),
    pollingModes: new DataLoader(ids => getPollingModesById(ids)),
    tags: new DataLoader(ids => getTagsById(ids)),
    statementLikes: new DataLoader(ids => getStatementLikesById(ids)),
    activities: new DataLoader(ids => getActivitiesById(ids)),
  };
}

export default createLoaders;
