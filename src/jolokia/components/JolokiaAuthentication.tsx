import { FC } from 'react';
import { OpenAPI as OpenAPIConfig } from '@app/openapi/jolokia/requests/core/OpenAPI';
import {
  useGetApiServerBaseUrl,
  useGetEndpointData as useGetEndpointData,
} from '@app/jolokia/customHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '../context';
import { BrokerCR } from '@app/k8s/types';

type JolokiaPropTypes = {
  brokerCR: BrokerCR;
  podOrdinal: number;
};

const Authentication: FC<JolokiaPropTypes> = ({
  children,
  brokerCR,
  podOrdinal,
}) => {
  const brokerConnectionData = useGetEndpointData(brokerCR, podOrdinal);

  if (!brokerConnectionData.targetEndpoint) {
    return <></>;
  }
  return (
    <AuthContext.Provider value={brokerConnectionData}>
      {children}
    </AuthContext.Provider>
  );
};

export const JolokiaAuthentication: FC<JolokiaPropTypes> = ({
  children,
  brokerCR,
  podOrdinal,
}) => {
  OpenAPIConfig.BASE = useGetApiServerBaseUrl();
  const querClient = new QueryClient();
  return (
    <QueryClientProvider client={querClient}>
      <Authentication brokerCR={brokerCR} podOrdinal={podOrdinal}>
        {children}
      </Authentication>
    </QueryClientProvider>
  );
};
