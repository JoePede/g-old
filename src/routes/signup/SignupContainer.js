import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import SignUp from '../../components/SignUp';
// import ImageUpload from '../../components/ImageUpload';
// import AccountSettings from '../../components/AccountSettings';
import { createUser } from '../../actions/user';
import { uploadAvatar } from '../../actions/file';
import { getAccountUpdates, getLocale } from '../../reducers';
import Button from '../../components/Button';
import history from '../../history';
import Headline from '../../components/Headline';
import Help from '../../components/Help';

const messages = defineMessages({
  welcome: {
    id: 'signup.welcome-title',
    defaultMessage: 'Welcome on board!',
    description: 'Welcome message header',
  },
  next: {
    id: 'signup.next',
    defaultMessage: 'Next step',
    description: 'Next',
  },
});

class SignupContainer extends React.Component {
  static propTypes = {
    createUser: PropTypes.func.isRequired,
    // uploadAvatar: PropTypes.func.isRequired,
    updates: PropTypes.shape({}).isRequired,
    locale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      serverCalled: false,
      showUpload: false,
    };
    this.onCreateUser = this.onCreateUser.bind(this);
  }

  componentWillReceiveProps({ updates, user }) {
    if (updates) {
      const success =
        Object.keys(updates).find(key => !updates[key].success) == null;
      const error = Object.keys(updates).some(key => updates[key].error);
      const pending = Object.keys(updates).some(
        key => updates[key].pending === true,
      );
      if (error !== this.state.error) {
        this.setState({ error });
      }
      if (pending !== this.state.pending) {
        this.setState({ pending });
      }
      if (success && this.state.serverCalled) {
        this.setState({ step: 1 });
      }
      if (this.state.step === 0 && user) {
        this.setState({ step: 1 });
      }
    }
  }
  onCreateUser(data) {
    // dispatch
    this.props.createUser(data);
    this.setState({ serverCalled: true });
  }

  render() {
    const { updates } = this.props;
    let emailError = false;
    if (updates.email && updates.email.error) {
      emailError = updates.email.error.unique === false;
    }
    switch (this.state.step) {
      case 0:
        return (
          <SignUp
            pending={this.state.pending}
            notUniqueEmail={emailError}
            error={this.state.error}
            onCreateUser={this.onCreateUser}
          />
        );
      case 1:
        return (
          <div>
            <Headline medium>
              <FormattedMessage {...messages.welcome} />
            </Headline>
            <Help locale={this.props.locale} firstSteps />
            <Button
              primary
              onClick={() => history.push('/account')}
              label={<FormattedMessage {...messages.next} />}
            />
          </div>
        );

      default:
        return <div />;
    }
  }
}
const mapStateToProps = state => ({
  updates: getAccountUpdates(state, '0000'),
  intl: getLocale(state), // fix for forceUpdate
});
const mapDispatch = {
  createUser,
  uploadAvatar,
};
export default connect(mapStateToProps, mapDispatch)(SignupContainer);
