import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cn from 'classnames';
import s from './ActivityLog.css';
import Avatar from '../Avatar';
import Statement from '../Statement';
import { ICONS } from '../../constants';
import Link from '../Link';

class ActivityLog extends React.Component {
  static propTypes = {
    content: PropTypes.shape({
      __typename: PropTypes.string,
      voter: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        surname: PropTypes.string,
      }),
      state: PropTypes.string,
      pollId: PropTypes.string,
      msg: PropTypes.string,
      title: PropTypes.string,
      position: PropTypes.string,
    }),
    date: PropTypes.string.isRequired,
  };
  static defaultProps = {
    content: {},
  };

  render() {
    /* eslint-disable no-underscore-dangle */
    const type = this.props.content && this.props.content.__typename;
    if (!type) {
      return (
        <div>
          {'FAILURE'}
        </div>
      );
    }
    let content = null;
    switch (type) {
      case 'StatementDL': {
        content = (
          <Link to={`/proposal/xxx/${this.props.content.pollId}`}>
            <Statement {...this.props.content} />
          </Link>
        );
        break;
      }

      case 'VoteDL': {
        content = (
          <Link to={`/proposal/xxx/${this.props.content.pollId}`}>
            <div>
              <Avatar user={this.props.content.voter} />
              {`${this.props.content.voter.name} ${this.props.content.voter
                .surname}`}

              {
                <svg
                  viewBox="0 0 24 24"
                  width="60px"
                  height="24px"
                  role="img"
                  aria-label="halt"
                >
                  <path
                    fill="none"
                    stroke={
                      this.props.content.position === 'pro'
                        ? '#8cc800'
                        : '#ff324d'
                    }
                    strokeWidth="1"
                    d={ICONS.thumbUpAlt}
                    transform={
                      this.props.content.position === 'pro'
                        ? ''
                        : 'rotate(180 12 12)'
                    }
                  />
                </svg>
              }
            </div>
          </Link>
        );
        break;
      }
      case 'Notification': {
        content = (
          <div>
            <h3>
              {this.props.content.title}
            </h3>
            {this.props.content.msg}
          </div>
        );
        break;
      }

      default: {
        content = (
          <div>
            {'TYPE NOT RECOGNIZED'}
          </div>
        );
      }
    }

    /* eslint-enable no-underscore-dangle */

    return (
      <div
        className={cn(
          s.container,
          type === 'Notification' ? s.notification : null,
        )}
      >
        <FormattedRelative value={this.props.date} />

        <div>
          {content}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ActivityLog);
