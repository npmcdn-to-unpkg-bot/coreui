import React, { PropTypes } from 'react';
import Shared from '../../Shared';
import RWNumberPicker from 'react-widgets/lib/NumberPicker';
import defaultTheme from 'theme/components/NumberPickerInput';
import cx from 'classnames/dedupe';
import mapProps from 'recompose/mapProps';
import { merge } from 'ramda';

const systemStyles = { };

const NumberPickerInputContainer = mapProps(({ className, sheet, style, theme, ...rest }) => ({
  className: cx(sheet.classes.numberPickerInput, theme.classes.numberPickerInput, className),
  style: merge(theme.styles.numberPickerInput, style),
  ...rest,
}))(RWNumberPicker);

const StyledNumberPickerInput = Shared.useSheet(NumberPickerInputContainer, systemStyles);

/**
 * Spinner for selecting numbers. The NumberPicker is a _localized_ widget and so *requires* a localizer to be specified.  You can read more about localizers here: [localization](http://jquense.github.io/react-widgets/docs/#/i18n).
 */
const NumberPickerInput = (props) =>
  <StyledNumberPickerInput {...props}>{props.children}</StyledNumberPickerInput>;

const classes = defaultTheme.classes;
const options = defaultTheme.options;
const styles = defaultTheme.styles;

NumberPickerInput.defaultProps = {
  theme: { classes, options, styles },
};

NumberPickerInput.displayName = 'NumberPickerInput';

NumberPickerInput.propTypes = {
  autoFocus: PropTypes.bool,

  children: PropTypes.node,

  culture: PropTypes.string,

  disabled: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  /**
   * A format string used to display the number value. Localizer dependent, read [localization](i18n) for more info.
   */
  format: PropTypes.string,
  /**
   * mark whether the widget should render right-to-left. This property can also be implicitly passed to the widget through a `childContext` prop (`isRtl`) this allows higher level application components to specify the direction.
   */
  isRtl: PropTypes.bool,
  /**
   * The maximum number that the NumberPickerInput value.
   */
  max: PropTypes.number,
  /**
   * Object hash containing display text and/or text for screen readers. Use the `messages` object to localize widget text and increase accessibility.
   */
  messages: PropTypes.shape({
    /**
     * Number picker spinner up button text for screen readers
     */
    increment: PropTypes.string,
    /**
     * Number picker spinner down button text for screen readers
     */
    decrement: PropTypes.string,
  }),
  /**
   * The minimum number that the NumberPickerInput value.
   */
  min: PropTypes.number,

  name: PropTypes.string,
  /**
   * Change event Handler that is called when the value is changed. The handler is called with the current numeric value or null.
   */
  onChange: PropTypes.func,
  /**
   * Determines how the NumberPickerInput parses a number from the localized string representation. You can also provide a parser `Function` to pair with a custom `format`.
   */
  parse: PropTypes.func,

  placeholder: PropTypes.string,
  /**
   * Specify how precise the `value` should be when typing, incrementing, or decrementing the value. When empty, precision is parsed from the current `format` and culture.
   */
  precision: PropTypes.number,

  readOnly: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  /**
   * Amount to increase or decrease value when using the spinner buttons.
   */
  step: PropTypes.number,

  theme: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /**
   * The current value of the NumberPickerInput.
   */
  value: PropTypes.number,
};

Shared.registerComponent('NumberPickerInput', NumberPickerInput);

export default NumberPickerInput;
