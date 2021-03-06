import {
  GraphQLString,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLID as ID,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import TagType from './TagType';
import PollType from './PollDLType';
import User from '../models/User';
import UserType from './UserType';
import Poll from '../models/Poll';
import knex from '../knex';

const ProposalType = new ObjectType({
  name: 'ProposalDL',
  /* args: {
    userID: {
      description: 'The proposals ID number',
      type: GraphQLInt,
    },
  },*/
  fields: {
    id: { type: new NonNull(ID) },
    author: {
      type: UserType,
      resolve: (parent, { id }, { viewer, loaders }) =>
        User.gen(viewer, parent.author_id, loaders),
    },

    body: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    tags: {
      type: new GraphQLList(TagType),
      resolve: (data, { id }, { loaders }) =>
        Promise.resolve(
          knex('proposal_tags')
            .where({ proposal_id: data.id })
            .pluck('tag_id')
            .then(tagIds => tagIds.map(tId => loaders.tags.load(tId))),
        ),
    },
    pollOne: {
      type: PollType,
      resolve: (parent, { id }, { viewer, loaders }) =>
        Poll.gen(viewer, parent.pollOne_id, loaders),
    },
    pollTwo: {
      type: PollType,
      resolve: (parent, { id }, { viewer, loaders }) =>
        Poll.gen(viewer, parent.pollTwo_id, loaders),
    },

    spokesman: {
      type: UserType,
      resolve: (parent, { id }, { viewer, loaders }) =>
        User.gen(viewer, parent.spokesmanId, loaders),
    },

    state: {
      type: GraphQLString,
    },
    votes: {
      type: GraphQLInt,
    },
    starts: {
      type: GraphQLString,
    },
    ends: {
      type: GraphQLString,
    },
    publishedAt: {
      type: GraphQLString,
      resolve: data => data.createdAt,
    },

    subscribed: {
      type: GraphQLBoolean,
      resolve: async (parent, { id }, { viewer }) => {
        const count = await knex('proposal_user_subscriptions')
          .where({
            user_id: viewer.id,
            proposal_id: parent.id,
          })
          .count('id');
        return count[0].count === '1';
      },
    },
  },
});
export default ProposalType;
