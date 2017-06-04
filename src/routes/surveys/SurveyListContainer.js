import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProposalPreview from '../../components/ProposalPreview';
import Navigation from '../../components/ProposalsNavigation';
import { loadProposalsList } from '../../actions/proposal';
import {
  getVisibleProposals,
  getProposalsIsFetching,
  getProposalsErrorMessage,
} from '../../reducers/index';
import FetchError from '../../components/FetchError';

class SurveyListContainer extends React.Component {
  static propTypes = {
    proposals: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      }),
    ).isRequired,
    filter: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    loadProposalsList: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
  };
  isReady() {
    // Probably superflue bc we are awaiting the LOAD_PROPOSAL_xxx flow
    return this.props.proposals != null;
  }

  render() {
    const { filter, proposals, isFetching, errorMessage } = this.props;
    if (isFetching && !proposals.length) {
      return <div> <Navigation filter={filter} /><p> Loading ... </p></div>;
    }

    if (errorMessage && !proposals.length) {
      return (
        <FetchError message={errorMessage} onRetry={() => this.props.loadProposalsList(filter)} />
      );
    }

    return (
      <div>
        {proposals.map(proposal => <ProposalPreview key={proposal.id} proposal={proposal} />)}
      </div>
    );
  }
}
// TODO implement memoiziation with reselect
const mapStateToProps = state => ({
  proposals: getVisibleProposals(state, 'survey'),
  isFetching: getProposalsIsFetching(state, 'survey'),
  errorMessage: getProposalsErrorMessage(state, 'survey'),
});

const mapDispatch = {
  loadProposalsList,
};

export default connect(mapStateToProps, mapDispatch)(SurveyListContainer);
