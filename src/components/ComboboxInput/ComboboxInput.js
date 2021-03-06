import React, { PropTypes } from 'react';
import Shared from '../../Shared';
import RWCombobox from 'react-widgets/lib/Combobox';
import defaultTheme from 'theme/components/ComboboxInput';
import cx from 'classnames/dedupe';
import mapProps from 'recompose/mapProps';
import { merge } from 'ramda';

const systemStyles = { };

const ComboboxInputContainer = mapProps(({ className, sheet, style, theme, ...rest }) => ({
  className: cx(sheet.classes.comboboxInput, theme.classes.comboboxInput, className),
  style: merge(theme.styles.comboboxInput, style),
  ...rest,
}))(RWCombobox);

const StyledComboboxInput = Shared.useSheet(ComboboxInputContainer, systemStyles);

/**
 * Select an item from the list, or input a custom value. The {widgetName} can also make suggestions as you type.
 */
const ComboboxInput = (props) =>
  <StyledComboboxInput {...props}>{props.children}</StyledComboboxInput>;

const classes = defaultTheme.classes;
const options = defaultTheme.options;
const styles = defaultTheme.styles;

ComboboxInput.defaultProps = {
  busy: false,
  caseSensitive: false,
  duration: 250,
  filter: false,
  isRtl: false,
  messages: {
    emptyFilter: 'The filter returned no results',
    emptyList: 'There are no items in this list',
    open: 'Open Combobox',
  },
  minLength: 1,
  suggest: false,
  theme: { classes, options, styles },
};

ComboboxInput.displayName = 'ComboboxInput';

ComboboxInput.propTypes = {
  autoFocus: PropTypes.bool,
  /**
   * Mark whether the widget is in a busy or loading state. If `true` the widget will display a spinner gif, useful when loading data via an ajax call.
   */
  busy: PropTypes.bool,
  /**
   * Use in conjunction with the filter prop. Filter the list without regard for case. This only applies to non function values for `filter`
   */
  caseSensitive: PropTypes.bool,
  children: PropTypes.node,
  /**
   * An array of possible values for the {widgetName}. If an array of `objects` is provided you should use the `valueField` and `textField` props, to specify which object properties comprise the value field (such as an id) and the field used to label the item.
   */
  data: PropTypes.array,
  /**
   * Disable the widget, if an `Array` of values is passed in only those values will be disabled.
   */
  disabled: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  dropUp: PropTypes.bool,
  /**
   * The speed, in milliseconds, of the dropdown animation.
   */
  duration: PropTypes.number,
  /**
   * Specify a filtering method used to reduce the items in the dropdown as you type. It can be used in conjunction with the `suggest` prop or instead of it. There are a few built-in filtering methods that can be specified by passing the `String` name. You can explicitly opt out of filtering by setting filter to `false`
   * To handle custom filtering techniques provide a `function` that returns `true` or `false` for each passed in item (analogous to the [array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) builtin)
   * Acceptable values for filter are: `false` `"startsWith"` `"endsWith"` `"contains"` `function(String item)`
   */
  filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.string]),
  /**
   * This component is used to render each option group, when `groupBy` is specified. By default the `groupBy` value will be used.
   */
  groupComponent: PropTypes.element,
  /**
   * Determines how to group the {widgetName}. Providing a `string` will group the `data` array by that property. You can also provide a function which should return the group value.
   */
  groupBy: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * mark whether the widget should render right-to-left. This property can also be implicitly passed to the widget through a `childContext` prop (`isRtl`) this allows higher level application components to specify the direction.
   */
  isRtl: PropTypes.bool,
  /**
   * This component is used to render each possible item in the ${widgetName}. The default component renders the text of the selected item (specified by `textfield`)
   */
  itemComponent: PropTypes.element,
  listComponent: PropTypes.element,
  /**
   * Object hash containing display text and/or text for screen readers. Use the `messages` object to localize widget text and increase accessibility.
   */
  messages: PropTypes.shape({
    /**
     * text to display when the the current filter does not return any results
     */
    emptyFilter: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * text to display when the `data` prop array is empty
     */
    emptyList: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * {widgetName} button text for screen readers
     */
    open: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  }),
  /**
   * Use in conjunction with the filter prop. Start filtering the list only after the value has reached a minimum length.
   */
  minLength: PropTypes.number,
  name: PropTypes.string,
  /**
   * Called when the value is changed. If the value is one of the `data` members that item will be returned. In the case of a value not being found in the `data` array the string value of the {widgetName} will be returned.
   */
  onChange: PropTypes.func,
  /**
   * This handler fires when an item has been selected from the list. It fires before the `onChange` handler, and fires regardless of whether the value has actually changed.
   */
  onSelect: PropTypes.func,
  /**
   * Called fires when the {widgetName} is about to open or close. `onToggle` should be used when the `open` prop is set otherwise the widget will never open or close.
   */
  onToggle: PropTypes.func,
  /**
   * Whether or not the {widgetName} is open. When unset (`undefined`) the {widgetName} will handle the opening and closing internally. The `defaultOpen` prop can be used to set an initialization value for uncontrolled widgets.
   */
  open: PropTypes.bool,
  placeholder: PropTypes.string,
  /**
   * Place the {widgetName} in a read-only mode, If an `Array` of values is passed in only those values will be read-only.
   */
  readOnly: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  /**
   * When `true` the {widgetName} will suggest, or fill in, values as you type. The suggestions are always "startsWith", meaning it will search from the start of the `textField` property
   */
  suggest: PropTypes.bool,
  /**
   * Specify which data item field to display in the ${widgetName} and selected item. The textField` prop may also also used as to find an item in the list as you type. Providing an accessor function allows for computed text values
   */
  textField: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  theme: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /**
   * The current value of the {widgetName}. This can be an object (such as a member of the `data` array) or a primitive value, hinted to by the `valueField`. The widget value does not need to be in the `data`, widgets can have values that are not in their list.
   */
  value: PropTypes.any,
  /**
   * A dataItem field name for uniquely identifying items in the `data` list. A `valueField` is required when the `value` prop is not itself a dataItem. A `valueField` is useful when specifying the selected item, by its `id` instead of using the model as the value.
   * When a `valueField` is not provided, the {widgetName} will use strict equality checks (`===`) to locate the `value` in the `data` list.
   */
  valueField: PropTypes.string,
};

Shared.registerComponent('ComboboxInput', ComboboxInput);

export default ComboboxInput;
