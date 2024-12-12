import { FC, useContext } from 'react';
import { useTranslation } from '@app/i18n/i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Address } from '../../openapi/jolokia/requests';
import { AddressRow } from './AddressRow';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { useJolokiaServiceGetAddresses } from '@app/openapi/jolokia/queries';
import { AuthContext } from '@app/jolokia/context';
import { CubesIcon, ErrorCircleOIcon } from '@patternfly/react-icons';

type AddressesProps = {
  isBrokerPod: boolean;
};

const Addresses: FC<AddressesProps> = ({ isBrokerPod }) => {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const {
    data: addressData,
    isSuccess,
    isLoading,
    error: loadError,
  } = useJolokiaServiceGetAddresses({
    targetEndpoint: authContext.targetEndpoint,
  });

  const columns: TableColumn<Address>[] = [
    { title: t('Name'), id: 'name' },
    { title: t('Routing Type'), id: 'routing_type' },
  ];

  return (
    <>
      {!isBrokerPod ? (
        <EmptyState>
          <EmptyStateHeader
            titleText={t('This is not a Broker Pod')}
            icon={<EmptyStateIcon icon={CubesIcon} />}
            headingLevel="h4"
          />
          <EmptyStateBody>
            {t(
              'The selected pod is not a broker pod. Please choose a valid broker pod to view the addresses.',
            )}
          </EmptyStateBody>
        </EmptyState>
      ) : loadError ? (
        <EmptyState>
          <EmptyStateHeader
            titleText={t('Error while fetching addresses')}
            icon={<EmptyStateIcon icon={ErrorCircleOIcon} />}
            headingLevel="h4"
          />
          <EmptyStateBody>
            {t('Could not fetch addresses. Please try again later.')}
          </EmptyStateBody>
        </EmptyState>
      ) : isLoading ? (
        <EmptyState>
          <EmptyStateHeader
            titleText={t('Loading')}
            icon={<EmptyStateIcon icon={Spinner} />}
            headingLevel="h4"
          />
        </EmptyState>
      ) : isSuccess && addressData?.length ? (
        <>
          <div className="pf-u-pt-lg pf-u-pl-lg pf-u-pb-lg">
            <Title headingLevel="h1">{t('Addresses')}</Title>
          </div>
          <br />
          <VirtualizedTable<Address>
            data={addressData}
            unfilteredData={addressData}
            loaded={isSuccess}
            loadError={loadError}
            columns={columns}
            Row={({ obj, activeColumnIDs, rowData }) => (
              <AddressRow
                obj={obj}
                rowData={rowData}
                activeColumnIDs={activeColumnIDs}
                columns={columns}
              />
            )}
          />
        </>
      ) : null}
    </>
  );
};

export { Addresses };
