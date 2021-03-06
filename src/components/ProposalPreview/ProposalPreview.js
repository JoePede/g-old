import { FormattedRelative } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ProposalPreview.css';
import PollState from '../PollState';
import history from '../../history';

import { getLastActivePoll } from '../../core/helpers';
// import { DOMParser } from 'xmldom';

class ProposalPreview extends React.Component {
  static propTypes = {
    proposal: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      publishedAt: PropTypes.string,
      pollOne: PropTypes.object,
      pollTwo: PropTypes.object,
      tags: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { fullText: false };
  }

  render() {
    const poll = getLastActivePoll(this.props.proposal.state, this.props.proposal);

    const body = (
      <div>
        <div dangerouslySetInnerHTML={{ __html: this.props.proposal.body }} />
        <div className={s.overlay} />
      </div>
    );
    // null;
    // Disabled bc Nodejs Domparser (xmldom) has dep problems
    /*  if (this.state.fullText) {
      body = this.props.proposal.body;
    } else {
      body = `${new DOMParser()
        .parseFromString(this.props.proposal.body, 'text/html')
        .documentElement.textContent.substring(0, 100)}( ... )`;
        // `${this.props.proposal.body.substring(0, 100)} (...)`;

    } */
    /* eslint-disable jsx-a11y/interactive-supports-focus */
    return (
      <div className={s.root}>
        <div
          role="link"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            history.push(`/proposal/${this.props.proposal.id}/${poll.id}`);
          }}
          className={s.container}
        >
          <div className={s.date}>
            <FormattedRelative value={this.props.proposal.publishedAt} />
          </div>
          <h2 className={s.header}>
            {this.props.proposal.title}
          </h2>

          <div className={s.body}>
            {body}
          </div>
          <div className={s.pollState}>
            <PollState
              compact
              pollId={poll.id}
              allVoters={poll.allVoters}
              upvotes={poll.upvotes}
              downvotes={poll.downvotes}
              thresholdRef={poll.mode.thresholdRef}
              threshold={poll.threshold}
              unipolar={poll.mode.unipolar}
            />
          </div>
          <div className={s.tags}>
            {this.props.proposal.tags &&
              this.props.proposal.tags.map(tag =>
                <span key={tag.id} className={s.tag}>{`${tag.text}`}</span>,
              )}
          </div>
        </div>
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}

export default withStyles(s)(ProposalPreview);
