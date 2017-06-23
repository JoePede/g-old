import { GraphQLNonNull } from 'graphql';
import ProposalInputType from '../types/ProposalInputType';
import ProposalType from '../types/ProposalDLType';
import Proposal from '../models/Proposal';

const createProposal = {
  type: new GraphQLNonNull(ProposalType),
  args: {
    proposal: {
      type: ProposalInputType,
      description: 'Create a new Proposal',
    },
  },
  resolve: (data, { proposal }, { viewer, loaders }) =>
    Proposal.create(viewer, proposal, loaders)
      .then((res) => {
        Proposal.insertInFeed(viewer, res, 'create');
        return res;
      })
      .then(p => Proposal.pushToUsers(viewer, p)),
};

export default createProposal;
