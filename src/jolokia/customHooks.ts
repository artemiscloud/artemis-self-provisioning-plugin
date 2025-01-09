import {
  K8sResourceCommon,
  K8sResourceKind,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { useParams } from 'react-router-dom-v5-compat';

function getJolokiaProtocol(broker: K8sResourceKind): string {
  return broker.spec['console'].sslEnabled ? 'https' : 'http';
}

function getBrokerKey(broker: K8sResourceCommon, ordinal: number): string {
  if (!broker || !broker.metadata) {
    return '';
  }
  return (
    broker?.metadata.name + '-' + ordinal + ':' + broker?.metadata.namespace
  );
}

const getBrokerRoute = (
  routes: K8sResourceKind[],
  broker: K8sResourceKind,
  ordinal: number,
): K8sResourceKind => {
  let target: K8sResourceKind = null;
  if (routes.length > 0) {
    const filteredRoutes = routes.filter((route) =>
      route.metadata.ownerReferences?.some(
        (ref) =>
          ref.name === broker.metadata.name && ref.kind === 'ActiveMQArtemis',
      ),
    );
    filteredRoutes.forEach((r) => {
      if (r.metadata.name.includes('wconsj-' + ordinal)) {
        target = r;
      }
    });
  }
  return target;
};

/**
 * Prepare the parameters to request a new login to the api-server
 */
export const useGetJolokiaLoginParameters = (
  broker: K8sResourceKind,
  brokerRoutes: K8sResourceKind[],
  ordinal: number,
): BrokerConnectionData => {
  const requestBody: BrokerConnectionData = {
    brokerName: '',
    hostname: '',
    port: '',
    scheme: '',
    targetEndpoint: '',
  };

  // Wait for the broker and routes to be ready to consume
  if (!broker?.metadata?.name) {
    return requestBody;
  }
  if (brokerRoutes?.length === 0 && process.env.NODE_ENV !== 'production') {
    return requestBody;
  }
  if (!broker.spec || !broker.spec['console']) {
    return requestBody;
  }

  requestBody.brokerName = getBrokerKey(broker, ordinal);

  requestBody.scheme = getJolokiaProtocol(broker);

  if (process.env.NODE_ENV === 'production') {
    requestBody.hostname =
      broker?.metadata?.name +
      '-wconsj-' +
      ordinal +
      '-svc' +
      '.' +
      broker?.metadata?.namespace;
    requestBody.port = '8161';
  } else {
    requestBody.hostname = getBrokerRoute(
      brokerRoutes,
      broker,
      ordinal,
    )?.spec.host;
    requestBody.port = broker?.spec['console'].sslEnabled ? '443' : '80';
  }

  requestBody.targetEndpoint =
    requestBody.scheme + '://' + requestBody.hostname + ':' + requestBody.port;

  return requestBody;
};

export type BrokerConnectionData = {
  brokerName: string;
  hostname: string;
  port: string;
  scheme: string;
  targetEndpoint: string;
};

export const useGetEndpointData = (
  broker: K8sResourceKind,
  ordinal: number,
): BrokerConnectionData => {
  const { ns: namespace } = useParams<{ ns?: string; name?: string }>();
  const [routes] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'route.openshift.io',
      kind: 'Route',
      version: 'v1',
    },
    namespaced: true,
    namespace: namespace,
  });
  return useGetJolokiaLoginParameters(broker, routes, ordinal);
};

function getProxyUrl(): string {
  return '/api/proxy/plugin/activemq-artemis-self-provisioning-plugin/api-server-service';
}

export const useGetApiServerBaseUrl = (): string => {
  let apiHost = 'localhost';
  let apiPort = process.env.JOLOKIA_NO_TLS ? '9000' : '9442';
  let protocol = process.env.JOLOKIA_NO_TLS ? 'http' : 'https';
  if (process.env.NODE_ENV === 'production') {
    apiHost = location.hostname;
    apiPort = '443';
    protocol = 'https';
  }
  return protocol + '://' + apiHost + ':' + apiPort + getProxyUrl() + '/api/v1';
};
