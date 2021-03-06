import {
  GraphQLNonNull as NonNull,
  GraphQLEnumType,
  GraphQLID as ID,
  GraphQLInputObjectType,
} from 'graphql';


const VoteInputType = new GraphQLInputObjectType({
  name: 'VoteInput',


  fields: {

    position: {
      type: new NonNull(new GraphQLEnumType({
        name: 'Position',
        values: {
          pro: {
            value: 1,
            description: 'You support the proposal',
          },
          con: {
            value: 0,
            description: 'You are against the proposal',
          },
        },
      })),
    },

    pollId: {
      type: new NonNull(ID),
    },
    id: {
      type: ID,
      description: 'Must be provided for mutations',
    },
  },

});
export default VoteInputType;
