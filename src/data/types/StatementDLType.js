import {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLID as ID,
} from 'graphql';
import VoteType from './VoteDLType';
import User from '../models/User';
import Vote from '../models/Vote';
import UserType from './UserType';


const StatementType = new ObjectType({
  name: 'StatementDL',
  description: 'Statement on proposal',
  sqlTable: 'statements', // the SQL table for this object type is called "accounts"
  uniqueKey: 'id',
  fields: {
    id: {
      type: new NonNull(ID),
    },
    author: {
      type: UserType,
      resolve: (data, { id }, { viewer, loaders }) => User.gen(viewer, data.author_id, loaders),
    },
    vote: {
      type: VoteType,
      resolve: (data, { id }, { viewer, loaders }) => Vote.gen(viewer, data.vote_id, loaders),

    },
    text: {
      type: GraphQLString,
      sqlColumn: 'body',
    },
    title: {
      type: GraphQLString,
    },
    likes: {
      type: GraphQLInt,
    },
    createdAt: {
      type: GraphQLString,
      sqlColumn: 'created_at',
    },
  },

});
export default StatementType;