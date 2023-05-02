import { FC, useState, useEffect } from 'react';
import _ from 'lodash';
import { CardBrokerMemoryUsageMetrics } from './CardBrokerMemoryUsageMetrics';
import {
  usePrometheusPoll,
  PrometheusEndpoint,
  PrometheusResponse,
} from '@openshift-console/dynamic-plugin-sdk';
import { parsePrometheusDuration } from '../../../../utils';
import { getMaxSamplesForSpan, memoryUsageQuery } from '../../utils';

export type CardBrokerMemoryUsageMetricsContainerProps = {
  name: string;
  namespace: string;
  defaultSamples?: number;
  timespan?: number;
  fixedEndTime?: number;
};

type AxisDomain = [number, number];

export const CardBrokerMemoryUsageMetricsContainer: FC<
  CardBrokerMemoryUsageMetricsContainerProps
> = ({ name, namespace, defaultSamples = 300, timespan }) => {
  //states
  const [xDomain] = useState<AxisDomain>();
  // For the default time span, use the first of the suggested span options that is at least as long
  // as defaultTimespan
  const defaultSpanText = '30m';
  const [span, setSpan] = useState(parsePrometheusDuration(defaultSpanText));
  // If we have both `timespan` and `defaultTimespan`, `timespan` takes precedence
  // Limit the number of samples so that the step size doesn't fall below minStep
  const maxSamplesForSpan = defaultSamples || getMaxSamplesForSpan(span);
  const [samples, setSamples] = useState(maxSamplesForSpan);

  // Define this once for all queries so that they have exactly the same time range and X values
  const now = Date.now();
  const endTime = xDomain?.[1];

  // If provided, `timespan` overrides any existing span setting
  useEffect(() => {
    if (timespan) {
      setSpan(timespan);
      setSamples(defaultSamples || getMaxSamplesForSpan(timespan));
    }
  }, [defaultSamples, timespan]);

  const [result, loaded] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY_RANGE,
    query: memoryUsageQuery(name, namespace, 0),
    namespace,
    endTime: endTime || now,
    timeout: '60s',
    timespan: span,
    samples,
    // delay: 5000
  });

  // const [result2, loaded2] = usePrometheusPoll({
  //   endpoint: PrometheusEndpoint.QUERY_RANGE,
  //   query: `sum(container_memory_working_set_bytes{pod='${name + '-ss-1'
  //     }', namespace='${namespace}', container='',}) BY (pod, namspace)`,
  //   namespace,
  //   endTime: endTime || now,
  //   timeout: '60s',
  //   timespan: span,
  //   samples,
  //   // delay: 5000
  // });

  const metricsData: PrometheusResponse[] = [result];

  return (
    <CardBrokerMemoryUsageMetrics
      isInitialLoading={false}
      backendUnavailable={false}
      allMetricsSeries={metricsData}
      span={span}
      isLoading={!loaded}
      fixedXDomain={xDomain}
      samples={samples}
      formatSeriesTitle={(labels) => labels.pod}
    />
  );
};