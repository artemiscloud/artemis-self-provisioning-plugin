import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { OperationRef } from '../requests/models/OperationRef';
import { JolokiaService } from '../requests/services/JolokiaService';
import { DevelopmentService } from '../requests/services/DevelopmentService';
export const useJolokiaServiceGetBrokersKey = 'JolokiaServiceGetBrokers';
export const useJolokiaServiceGetBrokers = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    targetEndpoint,
    endpointName,
  }: {
    targetEndpoint: string;
    endpointName?: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getBrokers>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getBrokers>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetBrokersKey,
      ...(queryKey ?? [{ targetEndpoint, endpointName }]),
    ],
    () => JolokiaService.getBrokers(targetEndpoint, endpointName),
    options,
  );
export const useJolokiaServiceGetBrokerDetailsKey =
  'JolokiaServiceGetBrokerDetails';
export const useJolokiaServiceGetBrokerDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    targetEndpoint,
  }: {
    targetEndpoint: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getBrokerDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getBrokerDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetBrokerDetailsKey,
      ...(queryKey ?? [{ targetEndpoint }]),
    ],
    () => JolokiaService.getBrokerDetails(targetEndpoint),
    options,
  );
export const useJolokiaServiceReadBrokerAttributesKey =
  'JolokiaServiceReadBrokerAttributes';
export const useJolokiaServiceReadBrokerAttributes = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    targetEndpoint,
    names,
  }: {
    targetEndpoint: string;
    names?: Array<string>;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.readBrokerAttributes>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.readBrokerAttributes>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceReadBrokerAttributesKey,
      ...(queryKey ?? [{ targetEndpoint, names }]),
    ],
    () => JolokiaService.readBrokerAttributes(targetEndpoint, names),
    options,
  );
export const useJolokiaServiceReadAddressAttributesKey =
  'JolokiaServiceReadAddressAttributes';
export const useJolokiaServiceReadAddressAttributes = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    targetEndpoint,
    attrs,
  }: {
    name: string;
    targetEndpoint: string;
    attrs?: Array<string>;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.readAddressAttributes>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.readAddressAttributes>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceReadAddressAttributesKey,
      ...(queryKey ?? [{ name, targetEndpoint, attrs }]),
    ],
    () => JolokiaService.readAddressAttributes(name, targetEndpoint, attrs),
    options,
  );
export const useJolokiaServiceReadQueueAttributesKey =
  'JolokiaServiceReadQueueAttributes';
export const useJolokiaServiceReadQueueAttributes = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    address,
    routingType,
    targetEndpoint,
    attrs,
  }: {
    name: string;
    address: string;
    routingType: string;
    targetEndpoint: string;
    attrs?: Array<string>;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.readQueueAttributes>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.readQueueAttributes>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceReadQueueAttributesKey,
      ...(queryKey ?? [{ name, address, routingType, targetEndpoint, attrs }]),
    ],
    () =>
      JolokiaService.readQueueAttributes(
        name,
        address,
        routingType,
        targetEndpoint,
        attrs,
      ),
    options,
  );
export const useJolokiaServiceReadAcceptorAttributesKey =
  'JolokiaServiceReadAcceptorAttributes';
export const useJolokiaServiceReadAcceptorAttributes = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    targetEndpoint,
    attrs,
  }: {
    name: string;
    targetEndpoint: string;
    attrs?: Array<string>;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.readAcceptorAttributes>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.readAcceptorAttributes>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceReadAcceptorAttributesKey,
      ...(queryKey ?? [{ name, targetEndpoint, attrs }]),
    ],
    () => JolokiaService.readAcceptorAttributes(name, targetEndpoint, attrs),
    options,
  );
export const useJolokiaServiceReadClusterConnectionAttributesKey =
  'JolokiaServiceReadClusterConnectionAttributes';
export const useJolokiaServiceReadClusterConnectionAttributes = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    targetEndpoint,
    attrs,
  }: {
    name: string;
    targetEndpoint: string;
    attrs?: Array<string>;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<
        ReturnType<typeof JolokiaService.readClusterConnectionAttributes>
      >,
      unknown,
      Awaited<
        ReturnType<typeof JolokiaService.readClusterConnectionAttributes>
      >,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceReadClusterConnectionAttributesKey,
      ...(queryKey ?? [{ name, targetEndpoint, attrs }]),
    ],
    () =>
      JolokiaService.readClusterConnectionAttributes(
        name,
        targetEndpoint,
        attrs,
      ),
    options,
  );
export const useJolokiaServiceExecClusterConnectionOperation = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof JolokiaService.execClusterConnectionOperation>>,
      unknown,
      {
        name: string;
        targetEndpoint: string;
        requestBody: OperationRef;
      },
      unknown
    >,
    'mutationFn'
  >,
) =>
  useMutation(
    ({ name, targetEndpoint, requestBody }) =>
      JolokiaService.execClusterConnectionOperation(
        name,
        targetEndpoint,
        requestBody,
      ),
    options,
  );
export const useJolokiaServiceExecBrokerOperation = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof JolokiaService.execBrokerOperation>>,
      unknown,
      {
        targetEndpoint: string;
        requestBody: OperationRef;
      },
      unknown
    >,
    'mutationFn'
  >,
) =>
  useMutation(
    ({ targetEndpoint, requestBody }) =>
      JolokiaService.execBrokerOperation(targetEndpoint, requestBody),
    options,
  );
export const useJolokiaServiceGetBrokerComponentsKey =
  'JolokiaServiceGetBrokerComponents';
export const useJolokiaServiceGetBrokerComponents = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    targetEndpoint,
  }: {
    targetEndpoint: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getBrokerComponents>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getBrokerComponents>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetBrokerComponentsKey,
      ...(queryKey ?? [{ targetEndpoint }]),
    ],
    () => JolokiaService.getBrokerComponents(targetEndpoint),
    options,
  );
export const useJolokiaServiceGetAddressesKey = 'JolokiaServiceGetAddresses';
export const useJolokiaServiceGetAddresses = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    targetEndpoint,
  }: {
    targetEndpoint: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getAddresses>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getAddresses>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [useJolokiaServiceGetAddressesKey, ...(queryKey ?? [{ targetEndpoint }])],
    () => JolokiaService.getAddresses(targetEndpoint),
    options,
  );
export const useJolokiaServiceGetQueuesKey = 'JolokiaServiceGetQueues';
export const useJolokiaServiceGetQueues = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    targetEndpoint,
    address,
  }: {
    targetEndpoint: string;
    address?: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getQueues>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getQueues>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetQueuesKey,
      ...(queryKey ?? [{ targetEndpoint, address }]),
    ],
    () => JolokiaService.getQueues(targetEndpoint, address),
    options,
  );
export const useJolokiaServiceGetQueueDetailsKey =
  'JolokiaServiceGetQueueDetails';
export const useJolokiaServiceGetQueueDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    routingType,
    targetEndpoint,
    addressName,
  }: {
    name: string;
    routingType: string;
    targetEndpoint: string;
    addressName?: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getQueueDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getQueueDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetQueueDetailsKey,
      ...(queryKey ?? [{ name, routingType, targetEndpoint, addressName }]),
    ],
    () =>
      JolokiaService.getQueueDetails(
        name,
        routingType,
        targetEndpoint,
        addressName,
      ),
    options,
  );
export const useJolokiaServiceGetAddressDetailsKey =
  'JolokiaServiceGetAddressDetails';
export const useJolokiaServiceGetAddressDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    targetEndpoint,
  }: {
    name: string;
    targetEndpoint: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getAddressDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getAddressDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetAddressDetailsKey,
      ...(queryKey ?? [{ name, targetEndpoint }]),
    ],
    () => JolokiaService.getAddressDetails(name, targetEndpoint),
    options,
  );
export const useJolokiaServiceGetAcceptorsKey = 'JolokiaServiceGetAcceptors';
export const useJolokiaServiceGetAcceptors = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    targetEndpoint,
  }: {
    targetEndpoint: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getAcceptors>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getAcceptors>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [useJolokiaServiceGetAcceptorsKey, ...(queryKey ?? [{ targetEndpoint }])],
    () => JolokiaService.getAcceptors(targetEndpoint),
    options,
  );
export const useJolokiaServiceGetAcceptorDetailsKey =
  'JolokiaServiceGetAcceptorDetails';
export const useJolokiaServiceGetAcceptorDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    targetEndpoint,
  }: {
    name: string;
    targetEndpoint: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getAcceptorDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getAcceptorDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetAcceptorDetailsKey,
      ...(queryKey ?? [{ name, targetEndpoint }]),
    ],
    () => JolokiaService.getAcceptorDetails(name, targetEndpoint),
    options,
  );
export const useJolokiaServiceGetClusterConnectionsKey =
  'JolokiaServiceGetClusterConnections';
export const useJolokiaServiceGetClusterConnections = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    targetEndpoint,
  }: {
    targetEndpoint: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getClusterConnections>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getClusterConnections>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetClusterConnectionsKey,
      ...(queryKey ?? [{ targetEndpoint }]),
    ],
    () => JolokiaService.getClusterConnections(targetEndpoint),
    options,
  );
export const useJolokiaServiceGetClusterConnectionDetailsKey =
  'JolokiaServiceGetClusterConnectionDetails';
export const useJolokiaServiceGetClusterConnectionDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    targetEndpoint,
  }: {
    name: string;
    targetEndpoint: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getClusterConnectionDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getClusterConnectionDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetClusterConnectionDetailsKey,
      ...(queryKey ?? [{ name, targetEndpoint }]),
    ],
    () => JolokiaService.getClusterConnectionDetails(name, targetEndpoint),
    options,
  );
export const useDevelopmentServiceApiInfoKey = 'DevelopmentServiceApiInfo';
export const useDevelopmentServiceApiInfo = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof DevelopmentService.apiInfo>>,
      unknown,
      Awaited<ReturnType<typeof DevelopmentService.apiInfo>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [useDevelopmentServiceApiInfoKey, ...(queryKey ?? [])],
    () => DevelopmentService.apiInfo(),
    options,
  );
