import cx from 'classnames';
import {
  any, chain, dec, is, isNil, keys, merge, partial,
  prop, reverse, splitEvery, sortBy, uniq,
} from 'ramda';

const currentPage = (pagination, pageIndex, pageSize, data) =>
  (!pagination ? data : splitEvery(pageSize, data)[pageIndex] || []);

const isColumnSearchable = (columnId, searchable) =>
  (is(Array, searchable) ? new Set(searchable).has(columnId) : !!searchable);

const isColumnSortable = (columnId, sortable) =>
  (is(Array, sortable) ? new Set(sortable).has(columnId) : !!sortable);

const isKeyColumnValid = (data, valueField) =>
  (!!(valueField && (new Set(data.filter((r) => !isNil(r[valueField]))).size === data.length)));

const isSearchMatchingRow = (columns, searchValue, row) =>
  any((c) => c.isSearchable &&
    (row[c.id] || '').toString().toLowerCase()
      .includes(searchValue.toLowerCase()), columns);

const maxPageIndex = (data, pageSize) => dec(splitEvery(pageSize, data).length);

const normalizedColumns = (baseTableProps, columns) => {
  const { data, helpers, searchable, sortable } = baseTableProps;

  return (columns || uniq(chain(keys, data))).map((c) => {
    const component = c.component;
    const displayName = c.displayName || c;
    const id = c.id || c;
    const isSearchable = helpers.isColumnSearchable(id, searchable);
    const isSortable = helpers.isColumnSortable(id, sortable);

    return { component, displayName, id, isSearchable, isSortable };
  });
};

const normalizedProps = (helpers, props) => {
  const {
    className, pagination, pageIndex, pageSize, prevPageIndex, searchable,
    selection, searchValue, sortable, sortAscending, sortField, valueField,
  } = props;

  const columns = helpers.normalizedColumns(
    { data: props.data, helpers, searchable, sortable },
    props.columns
  );

  const sortedData = helpers.sortedData(
    { columns, searchable, searchValue, sortAscending, sortField },
    helpers,
    props.data
  );

  const data = helpers.currentPage(
    pagination,
    isNil(pageIndex) ? prevPageIndex : pageIndex,
    pageSize,
    sortedData
  );

  return merge(props, {
    className: cx(helpers.tableDefaultProps().className, className),
    columns,
    data,
    maxPageIndex: helpers.maxPageIndex(sortedData, pageSize),
    searchable: !!searchable,
    selection: !!(selection && helpers.isKeyColumnValid(data, valueField)),
    sortable: !!sortable,
  });
};

const sortedData = (baseTableProps, helpers, data) => {
  const { columns, searchable, searchValue, sortAscending, sortField } = baseTableProps;
  const filteredData = searchable ?
    data.filter(partial(helpers.isSearchMatchingRow, [columns, searchValue])) :
    data;
  const xs = !sortField ? filteredData : sortBy(prop(sortField), filteredData);

  return sortField && sortAscending ? xs : reverse(xs);
};

const tableDefaultProps = () => ({
  className: 'table',
  columns: null,
  data: [],
  pageSize: 10,
  pagination: false,
  searchable: false,
  searchPlaceholder: 'Search items...',
  selectMultiple: true,
  selection: true,
  sortable: true,
  sortAscending: true,
});

const toggleRow = (selectedRows, rowId) => {
  if (selectedRows.has(rowId)) {
    selectedRows.delete(rowId);
  } else {
    selectedRows.add(rowId);
  }

  return selectedRows;
};

export default {
  currentPage, isColumnSearchable, isColumnSortable, isKeyColumnValid, isSearchMatchingRow,
  maxPageIndex, normalizedColumns, normalizedProps, sortedData, tableDefaultProps, toggleRow,
};