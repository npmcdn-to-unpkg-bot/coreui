import React, { Children, PropTypes } from 'react';
import Shared from '../../Shared';
import AriaTabPanel from 'react-aria-tabpanel';
import defaultTheme from 'theme/components/Tabs';
import cx from 'classnames/dedupe';
import mapProps from 'recompose/mapProps';
import uncontrollable from 'uncontrollable';
import { partial } from 'ramda';

const systemStyles = { };

const renderTabPanel = (activeTabId, sheet, theme, { props: { children, tabKey } }) => {
  const active = tabKey === activeTabId;

  return (
    <AriaTabPanel.TabPanel
      active={active}
      className={cx(sheet.classes.tabPane, theme.classes.tabPane, { active })}
      style={theme.styles.tabPane}
      tabId={tabKey}
    >
      {children}
    </AriaTabPanel.TabPanel>
  );
};

const renderTab = (activeTabId, sheet, theme, { props: { tabKey, text } }) => (
  <li className="nav-item">
    <AriaTabPanel.Tab
      className={cx(sheet.classes.tab, theme.classes.tab, { active: tabKey === activeTabId })}
      id={tabKey}
      style={theme.styles.tab}
      tag="span"
    >
      {text}
    </AriaTabPanel.Tab>
  </li>
);

const TabsWrapper = (props) => {
  const {
    activeTabId, children: wrapperChildren, externalContent,
    className, onChange, sheet, style, theme,
  } = props;
  const systemClasses = sheet.classes;

  return (
    <AriaTabPanel.Wrapper {...{ activeTabId, className, onChange, style }}>
      <AriaTabPanel.TabList>
        <ul
          className={cx(systemClasses.tabList, theme.classes.tabList)}
          style={theme.styles.tabList}
        >
          {Children.map(wrapperChildren, partial(renderTab, [activeTabId, sheet, theme]))}
        </ul>
      </AriaTabPanel.TabList>
      {!externalContent && (
        <div
          className={cx(systemClasses.tabContent, theme.classes.tabContent)}
          style={theme.styles.tabContent}
        >
          {Children.map(wrapperChildren, partial(renderTabPanel, [activeTabId, sheet, theme]))}
        </div>
      )}
    </AriaTabPanel.Wrapper>
  );
};

TabsWrapper.defaultProps = { externalContent: false };

TabsWrapper.propTypes = {
  activeTabId: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  externalContent: PropTypes.bool,
  onChange: PropTypes.func,
  sheet: PropTypes.object,
  style: PropTypes.object,
  theme: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

const UncontrolledTabsWrapper = uncontrollable(TabsWrapper, { activeTabId: 'onChange' });

const TabPane = () => null;

const TabsContainer = mapProps((props) => {
  const { activeTabKey, onChange, ...rest } = props;
  const isControlled = activeTabKey && onChange;
  const defaultActiveTabIdKVP = activeTabKey ? { defaultActiveTabId: activeTabKey } : {};
  const controllableProps = isControlled ?
    { activeTabId: activeTabKey, onChange } :
    defaultActiveTabIdKVP;

  return { ...rest, ...controllableProps };
})(UncontrolledTabsWrapper);

const StyledTabs = Shared.useSheet(TabsContainer, systemStyles);

const Tabs = (props) =>
  <StyledTabs {...props}>{props.children}</StyledTabs>;

const classes = defaultTheme.classes;
const options = defaultTheme.options;
const styles = defaultTheme.styles;

Tabs.defaultProps = { theme: { classes, options, styles } };

Tabs.displayName = 'Tabs';

Tabs.propTypes = {
  activeTabKey: PropTypes.string,

  children: PropTypes.node,

  externalContent: PropTypes.bool,

  onChange: PropTypes.func,

  theme: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

Tabs.TabPane = TabPane;

export { TabPane };

Shared.registerComponent('Tabs', Tabs);

export default Tabs;
