import { useTranslation } from '@app/i18n/i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Client } from './Clients.container';
import { ClientsRow } from './ClientsRow';
import { Title } from '@patternfly/react-core';

export type ClientProps = {
  clientData: Client[];
  isLoaded: boolean;
  loadError: boolean;
};

const Clients: React.FC<ClientProps> = ({
  clientData,
  isLoaded,
  loadError,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<Client>[] = [
    {
      title: t('Name'),
      id: 'name',
    },
    {
      title: t('Connections'),
      id: 'connections',
    },
    {
      title: t('Expires'),
      id: 'expires',
    },
    {
      title: t('Created'),
      id: 'created',
    },
  ];
  return (
    <>
      <div className="pf-u-pt-lg pf-u-pl-lg pf-u-pb-lg">
        <Title headingLevel="h1">{t('Clients')}</Title>
      </div>
      <VirtualizedTable<Client>
        data={clientData}
        unfilteredData={clientData}
        loaded={isLoaded}
        loadError={loadError}
        columns={columns}
        Row={({ obj, activeColumnIDs, rowData }) => (
          <ClientsRow
            obj={obj}
            rowData={rowData}
            activeColumnIDs={activeColumnIDs}
            columns={columns}
          />
        )}
      />
    </>
  );
};

export { Clients };
