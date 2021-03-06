import React, { PropTypes } from 'react';
import Shared from '../../Shared';
import RWCalendar from 'react-widgets/lib/Calendar';
import defaultTheme from 'theme/components/CalendarInput';
import cx from 'classnames/dedupe';
import mapProps from 'recompose/mapProps';
import { merge } from 'ramda';

const systemStyles = { };

const CalendarInputContainer = mapProps(({ className, sheet, style, theme, ...rest }) => ({
  className: cx(sheet.classes.calendarInput, theme.classes.calendarInput, className),
  style: merge(theme.styles.calendarInput, style),
  ...rest,
}))(RWCalendar);

const StyledCalendarInput = Shared.useSheet(CalendarInputContainer, systemStyles);

/**
 * You must configure a [localizer](http://jquense.github.io/react-widgets/docs/#/i18n) to use this component!
 */
const CalendarInput = (props) =>
  <StyledCalendarInput {...props}>{props.children}</StyledCalendarInput>;

const classes = defaultTheme.classes;
const options = defaultTheme.options;
const styles = defaultTheme.styles;

CalendarInput.defaultProps = {
  finalView: 'century',
  footer: false,
  initialView: 'month',
  isRtl: false,
  messages: { moveBack: 'navigate back', moveForward: 'navigate forward' },
  theme: { classes, options, styles },
};

CalendarInput.displayName = 'CalendarInput';

CalendarInput.propTypes = {
  /**
   * A formatter for century, the default formats the first and last year of the century like: 1900 - 1999.
   */
  centuryFormat: PropTypes.string,

  children: PropTypes.node,

  culture: PropTypes.string,
  /**
   * Default current date at which the calendar opens. If none is provided, opens at today's date or the `value` date (if any).
   */
  currentDate: PropTypes.instanceOf(Date),
  /**
   * A formatter for day of the month
   */
  dateFormat: PropTypes.string,
  /**
   * Provide a custom component to render the days of the month. The Component is provided the following props
   * - `date`: a `Date` object for the day of the month to render
   * - `label`: a formatted `String` of the date to render. To adjust the format of the `label` string use the `dateFormat` prop, listed below.
   */
  dayComponent: PropTypes.element,
  /**
   * A formatter calendar days of the week, the default formats each day as a Narrow name: "Mo", "Tu", etc.
   */
  dayFormat: PropTypes.string,
  /**
   * A formatter for decade, the default formats the first and last year of the decade like: 2000 - 2009.
   */
  decadeFormat: PropTypes.string,

  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  /**
   * The highest level view the calendar can navigate up to. This value should be higher than `initialView`
   * Acceptable values are: `"month"` `"year"` `"decade"` `"century"`
   */
  finalView: PropTypes.string,
  /**
   * Show or hide the Calendar footer.
   */
  footer: PropTypes.bool,
  /**
   * A formatter for the Calendar footer, formats Today's Date as a string.
   */
  footerFormat: PropTypes.string,
  /**
   * A formatter for the header button of the month view
   */
  headerFormat: PropTypes.string,
  /**
   * The starting and lowest level view the calendar can navigate down to.
   */
  initialView: PropTypes.string,
  /**
   * mark whether the widget should render right-to-left. This property can also be implicitly passed to the widget through a `childContext` prop (`isRtl`) this allows higher level application components to specify the direction.
   */
  isRtl: PropTypes.bool,
  /**
   * The maximum date that the Calendar can navigate to.
   */
  max: PropTypes.instanceOf(Date),
  /**
   * Object hash containing display text and/or text for screen readers. Use the `messages` object to localize widget text and increase accessibility.
   */
  messages: PropTypes.shape({
    /**
     * title and screen reader text for the left arrow button
     */
    moveBack: PropTypes.string,
    /**
     * title and screen reader text for the right arrow button
     */
    moveForward: PropTypes.string,
  }),
  /**
   * The minimum date that the Calendar can navigate from.
   */
  min: PropTypes.instanceOf(Date),
  /**
   * A formatter for month name.
   */
  monthFormat: PropTypes.string,
  /**
   * Change event Handler that is called when the value is changed. The handler is called with the Date object
   */
  onChange: PropTypes.func,
  /**
   * Change event Handler that is called when the currentDate is changed. The handler is called with the currentDate object
   */
  onCurrentDateChange: PropTypes.func,
  /**
   * Callback fired when the Calendar navigates between views, or forward and backwards in time.
   */
  onNavigate: PropTypes.func,

  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),

  theme: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /**
   * The current selected date, should be a Date object or null.
   */
  value: PropTypes.instanceOf(Date),
  /**
   * A formatter for the year.
   */
  yearFormat: PropTypes.string,
};

Shared.registerComponent('CalendarInput', CalendarInput);

export default CalendarInput;
