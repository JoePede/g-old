import React from 'react';
import Layout from '../../components/Layout';
import { loadProposal } from '../../actions/proposal';
import ProposalContainer from './ProposalContainer';
import { getSessionUser } from '../../reducers';

const title = 'Proposal';

async function action({ store, path }, { id, pollId }) {
  const state = await store.getState();
  const user = getSessionUser(state);
  let proposalId = id;
  if (!user) {
    return { redirect: `/?redirect=${path}` };
  } else if (user.role.type === 'guest') {
    return { redirect: '/' };
  }

  if (proposalId === 'xxx') {
    const proposals = state.entities.proposals.byId;
    proposalId = Object.keys(proposals).find(
      pId => proposals[pId].pollOne === pollId || proposals[pId].pollTwo === pollId,
    );

    if (proposalId) {
      return { redirect: `/proposal/${proposalId}/${pollId}` };
    }
    // Proposal not in store -load by pollId;
  }

  if (!process.env.BROWSER) {
    await store.dispatch(loadProposal({ id: proposalId, pollId }));
  } else {
    if (!proposalId) {
      proposalId = await store.dispatch(loadProposal({ pollId }));
      return { redirect: `/proposal/${proposalId}/${pollId}` };
    }
    store.dispatch(loadProposal({ id: proposalId, pollId }));
  }

  return {
    title,
    chunks: ['proposal'],
    component: (
      <Layout>
        <ProposalContainer proposalId={proposalId} pollId={pollId} user={user} />
      </Layout>
    ),
  };
}
export default action;
