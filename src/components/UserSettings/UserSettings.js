import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import Box from '../Box';
import Button from '../Button';
import FormField from '../FormField';
import Notification from '../Notification';
import Select from '../Select';
import {
  createValidator,
  passwordValidation,
  passwordAgainValidation,
  emailValidation,
} from '../../core/validation';

const fieldNames = ['passwordOld', 'password', 'passwordAgain'];

const messages = defineMessages({
  currentPassword: {
    id: 'userSettings.oldPW',
    defaultMessage: 'Enter your current password ',
    description: 'Current account password for form label',
  },
  password: {
    id: 'signup.password',
    defaultMessage: 'Create a password',
    description: 'Password',
  },
  passwordAgain: {
    id: 'signup.passwordAgain',
    defaultMessage: 'Confirm your password',
    description: 'PasswordAgain',
  },
  empty: {
    id: 'form.error-empty',
    defaultMessage: "You can't leave this empty",
    description: 'Help for empty fields',
  },
  shortPassword: {
    id: 'form.error-shortPassword',
    defaultMessage:
      'Short passwords are easy to guess. Try one with at least 6 characters ',
    description: 'Help for short passwords',
  },
  passwordMismatch: {
    id: 'form.error-passwordMismatch',
    defaultMessage: "These passwords don't match. Try again?",
    description: 'Help for mismatching passwords',
  },
  invalidEmail: {
    id: 'form.error-invalidEmail',
    defaultMessage: 'Your email address seems to be invalid',
    description: 'Help for email',
  },
  emailTaken: {
    id: 'form.error-emailTaken',
    defaultMessage: 'Email address already in use',
    description: 'Help for not unique email',
  },
  change: {
    id: 'commands.change',
    defaultMessage: 'Change',
    description: 'Short command to change a setting',
  },
  cancel: {
    id: 'commands.cancel',
    defaultMessage: 'Cancel',
    description: 'Short command to cancel a operation',
  },
  email: {
    id: 'settings.email',
    defaultMessage: 'Your current email address',
    description: 'Email label in settings',
  },
  emailNew: {
    id: 'settings.emailNew',
    defaultMessage: 'New email address',
    description: 'Email label in settings for new address',
  },
  wrongPassword: {
    id: 'settings.error.passwordOld',
    defaultMessage: 'Wrong password',
    description: 'Wrong password entered',
  },
  success: {
    id: 'action.success',
    defaultMessage: 'Success!',
    description: 'Short success notification ',
  },
  error: {
    id: 'action.error',
    defaultMessage: 'Action failed. Please retry!',
    description: 'Short failure notification ',
  },
  verified: {
    id: 'settings.email.verified',
    defaultMessage: 'Email verified!',
    description: 'Email got verified ',
  },
  notVerified: {
    id: 'settings.email.notVerified',
    defaultMessage: 'Email not verified',
    description: 'Email not yet verified ',
  },
  resend: {
    id: 'settings.email.resend',
    defaultMessage: 'Resend verification email',
    description: 'Resend verification email ',
  },
});

const initState = {
  passwordSuccess: false,
  password: '',
  passwordOld: '',
  passwordAgain: '',
  email: '',
  errors: {
    password: { touched: false },
    passwordAgain: { touched: false },
    passwordOld: { touched: false },
    email: { touched: false },
  },
  showEmailInput: false,
};

class UserSettings extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      workTeams: PropTypes.arrayOf(PropTypes.shape({})),
      email: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
    updateUser: PropTypes.func.isRequired,
    resendEmail: PropTypes.func.isRequired,
    updates: PropTypes.shape({}).isRequired,
    workTeams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onJoinWorkTeam: PropTypes.func.isRequired,
    onLeaveWorkTeam: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...initState,
      invalidEmails: [this.props.user.email],
    };
    this.onEditEmail = this.onEditEmail.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.visibleErrors = this.visibleErrors.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleEmailUpdate = this.handleEmailUpdate.bind(this);
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    const testValues = {
      passwordOld: { fn: 'password' },
      password: { fn: 'password' },
      passwordAgain: { fn: 'passwordAgain' },
      email: { fn: 'email' },
    };
    this.Validator = createValidator(
      testValues,
      {
        password: passwordValidation,
        passwordAgain: passwordAgainValidation,
        email: emailValidation,
      },
      this,
      obj => obj.state,
      {
        minPasswordLength: 6,
      },
    );
  }

  componentWillReceiveProps({ updates }) {
    if (updates) {
      if (updates.email && updates.email.error) {
        if (updates.email.error.email) {
          this.setState({
            invalidEmails: [
              ...this.state.invalidEmails,
              this.state.email.trim().toLowerCase(),
            ],
            errors: {
              ...this.state.errors,
              email: { touched: true, errorName: 'emailTaken' },
            },
          });
        } else {
          this.setState({ emailError: true, showEmailInput: false });
        }
      }
      if (updates.passwordOld && updates.passwordOld.error) {
        if (updates.passwordOld.error.passwordOld) {
          this.setState({
            passwordOld: '',
            errors: {
              ...this.state.errors,
              passwordOld: { touched: true, errorName: 'wrongPassword' },
            },
          });
        } else {
          this.setState({ passwordError: true });
        }
      }
      if (updates.password && updates.password.success) {
        this.setState({
          passwordSuccess: true,
          passwordError: false,
          passwordAgain: '',
          password: '',
          passwordOld: '',
        });
      }
    }
  }
  onEditEmail() {
    this.setState({
      showEmailInput: !this.state.showEmailInput,
      email: '', // this.props.user.email,
      errors: { ...this.state.errors, email: { touched: false } },
    });
  }

  handleValueChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    if (this.state.errors[field].touched) {
      this.setState({
        errors: {
          ...this.state.errors,
          [field]: { ...this.state.errors[field], touched: false },
        },
      });
    }
    this.setState({ [field]: value });
  }

  handleValidation(fields) {
    const validated = this.Validator(fields);
    this.setState({ errors: { ...this.state.errors, ...validated.errors } });
    return validated.failed === 0;
  }

  handleBlur(e) {
    const fields = [];
    const currentField = e.target.name;
    fields.push(e.target.name);
    if (currentField) {
      if (currentField === 'password' && this.state.passwordAgain.length > 0) {
        fields.push('passwordAgain');
      }
      this.handleValidation(fields);
    }
  }
  visibleErrors(errorNames) {
    return errorNames.reduce((acc, curr) => {
      const err = `${curr}Error`;
      if (this.state.errors[curr].touched) {
        acc[err] = (
          <FormattedMessage {...messages[this.state.errors[curr].errorName]} />
        );
      }
      return acc;
    }, {});
  }
  handlePasswordUpdate() {
    if (this.handleValidation(fieldNames)) {
      this.props.updateUser({
        id: this.props.user.id,
        passwordOld: this.state.passwordOld.trim(),
        password: this.state.password.trim(),
      });
    }
  }
  handleEmailUpdate() {
    if (this.handleValidation(['email'])) {
      const newEmail = this.state.email.trim().toLowerCase();
      if (newEmail !== this.props.user.email.trim().toLowerCase()) {
        this.props.updateUser({ id: this.props.user.id, email: newEmail });
      }
    }
  }
  render() {
    const { showEmailInput } = this.state;
    const { updates, user, resendEmail } = this.props;
    const emailPending = updates && updates.email && updates.email.pending;
    const emailSuccess = updates && updates.email && updates.email.success;
    const passwordPending =
      updates && updates.password && updates.password.pending;
    const passwordSuccess =
      updates && updates.password && updates.password.success;
    // const verifyError = updates && updates.verifyEmail && updates.verifyEmail.error;
    const verifyPending =
      updates && updates.verifyEmail && updates.verifyEmail.pending;
    const verifySuccess =
      updates && updates.verifyEmail && updates.verifyEmail.success;
    const updateEmailBtn = this.state.showEmailInput
      ? <Button
          disabled={emailPending}
          onClick={this.handleEmailUpdate}
          label={<FormattedMessage {...messages.change} />}
        />
      : null;
    const buttonLabel = this.state.showEmailInput ? 'cancel' : 'change';

    const {
      passwordOldError,
      passwordError,
      passwordAgainError,
      emailError,
    } = this.visibleErrors([...fieldNames, 'email']);

    let emailStatus = null;
    if (!showEmailInput) {
      if (user.emailVerified === true) {
        emailStatus = <FormattedMessage {...messages.verified} />;
      } else {
        emailStatus = <FormattedMessage {...messages.notVerified} />;
      }
    }

    const showResendBtn =
      !user.emailVerified && !emailPending && !showEmailInput;

    return (
      <Box column pad>
        <FormField label="Workteams">
          <Select
            options={this.props.workTeams.map(wt => ({
              value: wt.id,
              label: wt.name,
            }))}
            value={
              this.props.user.workTeams &&
              this.props.user.workTeams.map(wt => ({
                value: wt.id,
                label: wt.name,
              }))
            }
            onChange={e => {
              if (
                this.props.user.workTeams &&
                this.props.user.workTeams.find(wt => wt.id === e.value.value)
              ) {
                this.props.onLeaveWorkTeam({
                  id: e.value.value,
                  memberId: this.props.user.id,
                });
              } else {
                this.props.onJoinWorkTeam({
                  id: e.value.value,
                  /* e.value[0].value,*/ memberId: this.props.user.id,
                });
              }
            }}
          />
        </FormField>
        <fieldset>
          {this.state.emailError &&
            <div style={{ backgroundColor: 'rgba(255, 50, 77, 0.3)' }}>
              <FormattedMessage {...messages.error} />
            </div>}
          <FormField
            label={<FormattedMessage {...messages.email} />}
            error={emailError}
            help={emailStatus}
          >
            <input
              type="text"
              onChange={this.handleValueChange}
              value={showEmailInput ? this.state.email : this.props.user.email}
              name="email"
              readOnly={showEmailInput === false}
            />
          </FormField>
        </fieldset>
        <Box wrap>
          {!emailSuccess && !emailPending && updateEmailBtn}
          {!emailSuccess &&
            <Button
              disabled={emailPending}
              onClick={this.onEditEmail}
              label={<FormattedMessage {...messages[buttonLabel]} />}
            />}
          {showResendBtn &&
            <Button
              disabled={verifyPending}
              onClick={resendEmail}
              label={<FormattedMessage {...messages.resend} />}
            />}
        </Box>
        {(verifySuccess || emailSuccess) &&
          !user.emailVerified &&
          <Notification
            type="alert"
            message={
              'Look in your mail account. Soon something should be there'
            }
          />}
        <fieldset>
          {this.state.passwordError &&
            <div style={{ backgroundColor: 'rgba(255, 50, 77, 0.3)' }}>
              <FormattedMessage {...messages.error} />
            </div>}
          <FormField
            label={<FormattedMessage {...messages.currentPassword} />}
            error={passwordOldError}
          >
            <input
              name="passwordOld"
              type="password"
              onChange={this.handleValueChange}
              value={this.state.passwordOld}
            />
          </FormField>
          <FormField
            label={<FormattedMessage {...messages.password} />}
            error={passwordError}
          >
            <input
              name="password"
              type="password"
              onChange={this.handleValueChange}
              value={this.state.password}
            />
          </FormField>
          <FormField
            label={<FormattedMessage {...messages.passwordAgain} />}
            error={passwordAgainError}
          >
            <input
              name="passwordAgain"
              type="password"
              onChange={this.handleValueChange}
              value={this.state.passwordAgain}
            />
          </FormField>
          {this.state.passwordSuccess &&
            <div style={{ backgroundColor: 'rgba(140, 200, 0, 0.3)' }}>
              <FormattedMessage {...messages.success} />
            </div>}
        </fieldset>
        <Box>
          {!passwordSuccess &&
            <Button
              disabled={passwordPending}
              onClick={this.handlePasswordUpdate}
              label={<FormattedMessage {...messages.change} />}
            />}
        </Box>
      </Box>
    );
  }
}

export default UserSettings;
