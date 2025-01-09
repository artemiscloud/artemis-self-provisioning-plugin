import { FC, useContext, useState } from 'react';
import { Thead, Tr, Th, Tbody } from '@patternfly/react-table';
import { Table } from '@patternfly/react-table/deprecated';
import {
  Spinner,
  Bullseye,
  Pagination,
  PaginationVariant,
  SearchInput,
  Alert,
  Title,
  ToolbarContent,
  Toolbar,
  ToolbarItem,
} from '@patternfly/react-core';
import { useTranslation } from '@app/i18n/i18n';
import { useJolokiaServiceReadAddressAttributes } from '@app/openapi/jolokia/queries';
import { AddressDetailsRow } from './AddressDetailsRow';
import { AuthContext } from '@app/jolokia/context';

type AddressDetailsTableProps = {
  name: string;
};

const AddressDetails: FC<AddressDetailsTableProps> = ({ name }) => {
  const { t } = useTranslation();

  const columnNames = {
    attributes: t('attributes'),
    values: t('values'),
  };

  const allAddressAttrs = [
    'Address',
    'AddressLimitPercent',
    'AddressSize',
    'AllQueueNames',
    'AutoCreated',
    'BindingNames',
    'CurrentDuplicateIdCacheSize',
    'Internal',
    'MessageCount',
    'NumberOfBytesPerPage',
    'NumberOfMessages',
    'NumberOfPages',
    'Paging',
    'Paused',
    'QueueNames',
    'RemoteQueueNames',
    'RetroactiveResource',
    'Roles',
    'RolesAsJSON',
    'RoutedMessageCount',
    'RoutingTypes',
    'RoutingTypesAsJSON',
    'Temporary',
    'UnRoutedMessageCount',
  ];

  const authContext = useContext(AuthContext);
  const {
    data: readAddressAttrs,
    isSuccess,
    error,
  } = useJolokiaServiceReadAddressAttributes({
    name: name,
    attrs: allAddressAttrs,
    targetEndpoint: authContext.targetEndpoint,
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchvalue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  const filteredData = isSuccess
    ? readAddressAttrs.filter((attr) =>
        attr.request.attribute
          .toLowerCase()
          .includes(searchvalue.toLowerCase()),
      )
    : [];

  const handlePageChange = (
    _event: React.MouseEvent | React.KeyboardEvent,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent,
    newPerPage: number,
    newPage: number,
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const searchInput = (
    <SearchInput
      placeholder={t('Search by attribute name...')}
      value={searchvalue}
      onChange={(_event, value) => handleSearchChange(value)}
      onClear={() => handleSearchChange('')}
    />
  );

  const toolbarPagination = (
    <Pagination
      itemCount={filteredData.length}
      perPage={perPage}
      page={page}
      onSetPage={handlePageChange}
      widgetId="pagination-options-menu-top"
      onPerPageSelect={onPerPageSelect}
      variant={PaginationVariant.top}
    />
  );

  const toolbar = (
    <Toolbar id="search-input-filter-toolbar">
      <ToolbarContent>
        <ToolbarItem variant="search-filter">{searchInput}</ToolbarItem>
        <ToolbarItem variant="pagination">{toolbarPagination}</ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  return (
    <>
      <Title headingLevel="h2" className="pf-u-mt-md pf-u-ml-md pf-u-mb-md">
        {t('Attributes')}
      </Title>
      {isSuccess ? (
        <>
          {toolbar}
          <Table aria-label="Address Details Table" variant="compact">
            <Thead>
              <Tr>
                <Th width={10}>{columnNames.attributes}</Th>
                <Th width={10}>{columnNames.values}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((attr, index) => (
                <AddressDetailsRow key={index} attribute={attr} />
              ))}
            </Tbody>
          </Table>
          <Pagination
            itemCount={filteredData.length}
            perPage={perPage}
            page={page}
            onSetPage={handlePageChange}
            widgetId="pagination-options-menu-top"
            onPerPageSelect={onPerPageSelect}
            variant={PaginationVariant.bottom}
          />
        </>
      ) : error ? (
        <Alert variant="danger" title={t('Error loading address details...')}>
          {(error as Error).message}
        </Alert>
      ) : (
        <Bullseye>
          <Spinner size="lg" />
        </Bullseye>
      )}
    </>
  );
};

export { AddressDetails };
