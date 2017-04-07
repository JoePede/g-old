/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';
import LanguageSwitcher from '../LanguageSwitcher';
import UserStatus from '../UserStatus';

const messages = defineMessages({
  brand: {
    id: 'header.brand',
    defaultMessage: 'M5',
    description: 'Brand name displayed in header',
  },
  bannerTitle: {
    id: 'header.banner.title',
    defaultMessage: 'G O L D',
    description: 'Title in page header',
  },
  bannerDesc: {
    id: 'header.banner.desc',
    defaultMessage: 'Online democracy',
    description: 'Description in header',
  },
});

class Header extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation className={s.nav} />
          <LanguageSwitcher />
          <UserStatus />
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>
              <FormattedMessage {...messages.bannerTitle} />
            </h1>
            <FormattedMessage tagName="p" {...messages.bannerDesc} />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
