import {
  GraphQLString as String,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLBoolean,
} from 'graphql';

const CommunicationInputType = new GraphQLInputObjectType({
  name: 'CommunicationInput',
  fields: {
    id: {
      type: GraphQLID,
    },
    parentId: {
      type: GraphQLID,
    },

    textHtml: {
      type: String,
    },

    textRaw: {
      type: String,
    },
    replyable: {
      type: GraphQLBoolean,
    },
  },
});
export default CommunicationInputType;