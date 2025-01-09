import { FC, useEffect, useState } from 'react';
import {
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceCommonWithData } from '@app/k8s/types';
import { useTranslation } from '@app/i18n/i18n';
import { PodsList } from './components/PodList';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { ErrorCircleOIcon, SearchIcon } from '@patternfly/react-icons';
import { useParams } from 'react-router-dom-v5-compat';

export const PodsContainer: FC = () => {
  //states
  const { t } = useTranslation();
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();
  const [brokerPods, setBrokerPods] = useState<K8sResourceCommonWithData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pods, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      version: 'v1',
      kind: 'Pod',
    },
    isList: true,
    namespaced: true,
    namespace: namespace,
  });

  const filterBrokerPods = (pods: K8sResourceCommon[], brokerName: string) => {
    const regex = new RegExp(`^${brokerName}-ss$`);
    return pods.filter((pod) =>
      pod.metadata?.ownerReferences?.some(
        (ref) => regex.test(ref.name) && ref.kind === 'StatefulSet',
      ),
    );
  };

  useEffect(() => {
    if (loaded && !loadError) {
      setLoading(false);
      const filteredPods = filterBrokerPods(pods, name);
      setBrokerPods(filteredPods);
    }
  }, [pods, name, loaded, loadError]);

  return (
    <>
      {loadError && (
        <EmptyState>
          <EmptyStateHeader
            titleText={t('Error while retrieving the pods list.')}
            icon={<EmptyStateIcon icon={ErrorCircleOIcon} />}
            headingLevel="h4"
          />
          <EmptyStateBody>{t('No results match.')}</EmptyStateBody>
        </EmptyState>
      )}
      {loading && !loadError && (
        <EmptyState>
          <EmptyStateHeader
            titleText={t('Loading')}
            icon={<EmptyStateIcon icon={Spinner} />}
            headingLevel="h4"
          />
        </EmptyState>
      )}
      {!loading && !loadError && brokerPods.length === 0 && (
        <EmptyState>
          <EmptyStateHeader
            titleText={t(
              'No results found. Check the status of the deployment.',
            )}
            icon={<EmptyStateIcon icon={SearchIcon} />}
            headingLevel="h4"
          />
          <EmptyStateBody>{t('No results match.')}</EmptyStateBody>
        </EmptyState>
      )}
      {!loading && !loadError && brokerPods.length > 0 && (
        <PodsList
          brokerPods={brokerPods}
          loadError={loadError}
          loaded={!loading}
        />
      )}
    </>
  );
};
