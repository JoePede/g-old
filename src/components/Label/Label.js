import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cn from 'classnames';
import s from './Label.css';

class Label extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    margin: PropTypes.bool,
    htmlFor: PropTypes.string,
  };

  static defaultProps = {
    margin: false,
    htmlFor: '',
  };
  render() {
    const { children, margin, htmlFor } = this.props;
    return (
      <label htmlFor={htmlFor} className={cn(s.label, margin ? s.margin : null)}>{children}</label>
    );
  }
}

export default withStyles(s)(Label);
