import React from 'react';
import PropTypes from 'prop-types';
import { WizardContext } from '../Wizard/wizard-context';
import Button from '../Button';
import Box from '../Box';

const Navigation = ({ onNext }) => (
  <WizardContext.Consumer>
    {({ next, previous, step, steps }) => {
      const onNextClick = () => {
        const res = onNext();
        if (res) {
          next();
        }
      };
      return (
        <Box>
          {steps.indexOf(step) < steps.length - 1 && (
            <Button label="Next" onClick={onNextClick} />
          )}
          {steps.indexOf(step) === steps.length - 1 && (
            <Button label="Submit" onClick={onNextClick} />
          )}
          {steps.indexOf(step) > 0 && (
            <Button label="Back" onClick={previous} />
          )}
        </Box>
      );
    }}
  </WizardContext.Consumer>
);

Navigation.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Navigation;
