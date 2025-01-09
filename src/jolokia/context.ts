import { createContext } from 'react';
import { BrokerConnectionData } from './customHooks';

export type jolokiaLoginSource = 'api' | 'session';

export type JolokiaLogin = {
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  token: string;
  source: jolokiaLoginSource;
  podOrdinal: number;
};

export const AuthContext = createContext<BrokerConnectionData>({
  brokerName: '',
  hostname: '',
  port: '',
  scheme: '',
  targetEndpoint: '',
});
