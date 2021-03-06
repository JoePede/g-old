import {
  GraphQLString as String,
  GraphQLInputObjectType,
  GraphQLID as ID,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';

import PollingModeInput from './PollingModeInputType';

const PollInputType = new GraphQLInputObjectType({
  name: 'PollInput',
  fields: {
    secret: {
      type: GraphQLBoolean,
    },
    threshold: {
      type: GraphQLInt,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    mode: {
      type: PollingModeInput,
    },

    id: {
      type: ID,
      description: 'Must be provided for mutations',
    },
  },
});
export default PollInputType;
