import React, { PropTypes } from 'react';
import Button from 'components/Button';
import NumberPickerInput from 'components/NumberPickerInput';
import Shared from '../../Shared';
import TextInput from 'components/TextInput';
import tableHandlers from './TableHandlers';
import tableHelpers from './TableHelpers';
import compose from 'recompose/compose';
import cx from 'classnames/dedupe';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { inc, is, merge, partial } from 'ramda';

const systemStyles = { };

const maybeRenderPager = (baseTableProps) => {
  const {
    maxPageIndex, onPageChange, onNextPageClick,
    onPrevPageClick, pageIndex, prevPageIndex, pagination,
  } = baseTableProps;

  const effectivePageIndex = is(Number, pageIndex) ? pageIndex : prevPageIndex;
  const pageNumber = inc(effectivePageIndex);
  const nextDisabled = effectivePageIndex === maxPageIndex;
  const prevDisabled = effectivePageIndex === 0;

  return pagination && (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        className={cx('btn-link', { disabled: prevDisabled })}
        onClick={onPrevPageClick}
        style={{ color: prevDisabled ? '#ccc' : '#2975e9' }}
      >
        <div style={{ display: 'flex', alignItems: 'middle' }}>
          <span className="icon icon-chevron-left" />
          <span title="Previous">Previous</span>
        </div>
      </Button>
      <NumberPickerInput
        max={inc(maxPageIndex)}
        min={1}
        onChange={onPageChange}
        style={{ maxWidth: 100 }}
        value={is(Number, pageIndex) ? pageNumber : pageIndex}
      />
      <Button
        className={cx('btn-link', { disabled: nextDisabled })}
        onClick={onNextPageClick}
        style={{ color: nextDisabled ? '#ccc' : '#2975e9' }}
      >
        <div style={{ display: 'flex', alignItems: 'middle' }}>
          <span title="Next">Next</span>
          <span className="icon icon-chevron-right" />
        </div>
      </Button>
    </div>
  );
};

const maybeRenderSearch = (baseTableProps) => {
  const { onSearchChange, searchable, searchPlaceholder, searchValue } = baseTableProps;

  return searchable && (
    <div className="form-group">
      <div className="search">
        <TextInput
          className="search-input"
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          style={{ maxWidth: 300 }}
          type="search"
          value={searchValue}
        />
      </div>
    </div>
  );
};

const maybeRenderSortIcons = (baseTableProps, { id, isSortable }) => {
  const { sortAscending, sortField } = baseTableProps;
  const isSorted = (sortField === id);
  const className = isSortable && cx('icon', {
    'icon-chevron-down': isSorted && !sortAscending,
    'icon-chevron-up': isSorted && sortAscending,
    'icon-chevrons-vertical': !isSorted,
  });

  return isSortable && <span {...{ className }} />;
};

const renderHeaderCell = (baseTableProps, c, i) => {
  const { onHeaderClick } = baseTableProps;
  const { isSortable } = c;

  return (
    <th
      key={i}
      onClick={() => isSortable && onHeaderClick(c)}
      style={{ cursor: isSortable ? 'pointer' : 'normal' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {c.displayName}
        {maybeRenderSortIcons(baseTableProps, c)}
      </div>
    </th>
  );
};

const renderCell = (data, { component, id }) => {
  const Component = component;
  const cellData = data[id];

  return (
    <td key={id}>
      {Component ? <Component data={cellData} /> : cellData}
    </td>
  );
};

const renderRow = (baseTableProps, data, i) => {
  const { columns, onRowClick, selectedRows, selection, valueField } = baseTableProps;
  const rowId = valueField && data[valueField];

  return (
    <tr
      className={cx({ 'table-active': valueField && selectedRows.has(rowId) })}
      key={valueField ? rowId : i}
      onClick={() => selection && valueField && onRowClick(data)}
    >
      {columns.map(partial(renderCell, [data]))}
    </tr>
  );
};

const TableBase = (props) => {
  const { className, columns, data, style } = props;

  return (
    <div>
      {maybeRenderSearch(props)}
      <table {...{ className, style }}>
        <thead><tr>{columns.map(partial(renderHeaderCell, [props]))}</tr></thead>
        <tbody>
          {data.length ?
            data.map(partial(renderRow, [props])) :
            <tr><td colSpan={columns.length}>No rows to display</td></tr>
          }
        </tbody>
      </table>
      {maybeRenderPager(props)}
    </div>
  );
};

TableBase.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array,
  data: PropTypes.array.isRequired,
  maxPageIndex: PropTypes.number,
  onHeaderClick: PropTypes.func,
  onNextPageClick: PropTypes.func,
  onPageChange: PropTypes.func,
  onPrevPageClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onSearchChange: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  prevPageIndex: PropTypes.number,
  searchable: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(Set)]),
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  selectedRows: PropTypes.instanceOf(Set),
  selection: PropTypes.bool,
  selectMultiple: PropTypes.bool,
  sortable: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(Set)]),
  sortAscending: PropTypes.bool,
  sortField: PropTypes.string,
  style: PropTypes.object,
  valueField: PropTypes.string,
};

const TableContainer = compose(
  withState('pageIndex', 'setPageIndex', 0),
  withState('prevPageIndex', 'setPrevPageIndex', 0),
  withState('searchValue', 'setSearchValue', ''),
  withState('selectedRows', 'setSelectedRows', (props) => new Set(props.selectedRows)),
  withState('sortAscending', 'setSortAscending', (props) => props.sortAscending),
  withState('sortField', 'setSortField', (props) => props.sortField),
  mapProps(({ className, sheet, style, theme, ...rest }) => ({
    className: cx(sheet.classes.table, theme.classes.table, className),
    style: merge(theme.styles.table, style),
    ...rest,
  })),
  mapProps(partial(tableHelpers.normalizedProps, [tableHelpers])),
  withHandlers(tableHandlers(tableHelpers))
)(TableBase);

const StyledTable = Shared.useSheet(TableContainer, systemStyles);

const Table = (props) =>
  <StyledTable {...props}>{props.children}</StyledTable>;

Table.defaultProps = tableHelpers.tableDefaultProps();

Table.displayName = 'Table';

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  columns: PropTypes.array,
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  onSort: PropTypes.func,
  pageSize: PropTypes.number,
  pagination: PropTypes.bool,
  searchable: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  searchPlaceholder: PropTypes.string,
  selectedRows: PropTypes.instanceOf(Set),
  selection: PropTypes.bool,
  selectMultiple: PropTypes.bool,
  sortable: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  sortAscending: PropTypes.bool,
  sortField: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  valueField: PropTypes.string,
};

Shared.registerComponent('Table', Table);

export default Table;
