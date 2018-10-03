import React from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import Button from '../Button';
import Box from '../Box';
import CheckBox from '../CheckBox';
import PollOptionPreview from './PollOptionPreview';
import Navigation from './Navigation';
import FormValidation from '../FormValidation';

const validateOptions = options => {
  const posNumbers = [];
  options.map((option, i) => {
    if (option.pos) {
      if (posNumbers.includes(option.pos)) {
        throw new Error('Pos must be unique');
      }
      return option;
    }
    let newPos = i;
    while (posNumbers.includes(newPos)) {
      posNumbers.push(newPos);
      newPos += 1;
    }
    return { ...option, pos: newPos };
  });
};

class OptionInput extends React.Component {
  static propTypes = {
    onAddOption: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onExit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleSaving = this.handleSaving.bind(this);
  }

  handleNext(values) {
    const { onExit, data } = this.props;
    if (onExit) {
      let newOptions;
      if (values.options) {
        newOptions = validateOptions(values.options);
      }
      newOptions = newOptions || data;
      onExit([{ name: 'options', value: newOptions }]);
    }
  }

  handleAddOption() {
    const { onAddOption } = this.props;
    const { description } = this.state;
    if (description) {
      onAddOption({ description });
      this.setState({ description: '' });
    }
  }

  handleInputChange(e) {
    this.setState({ description: e.target.value });
  }

  handleSaving(newData) {
    const { onExit, data } = this.props;
    // take all, change saved option
    const newOptions = data.map(
      option => (option.pos === newData.pos ? newData : option),
    );
    if (onExit) {
      onExit([{ name: 'options', value: newOptions }]);
    }
  }

  render() {
    const { data } = this.props;
    const { description } = this.state;
    return (
      <FormValidation submit={this.handleNext} validations={{ options: {} }}>
        {({ onSubmit }) => (
          <Box column pad>
            <Box column>
              {data &&
                data.map(o => (
                  <PollOptionPreview
                    pos={o.pos}
                    description={o.description}
                    onSave={this.handleSaving}
                  />
                ))}
            </Box>
            <CheckBox disabled checked label="multiple choice" />
            <Textarea
              placeholder="Enter some text"
              name="option"
              useCacheForDOMMeasurements
              value={description}
              onChange={this.handleInputChange}
              minRows={2}
            />
            <Button onClick={this.handleAddOption} label="Add" />
            <Navigation onNext={onSubmit} />
          </Box>
        )}
      </FormValidation>
    );
  }
}

export default OptionInput;
