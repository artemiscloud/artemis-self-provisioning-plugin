/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ExecResult = {
  request: {
    mbean: string;
    arguments?: Array<string>;
    type: string;
    operation: string;
  };
  value?: any;
  error_type?: string;
  error?: string;
  timestamp?: number;
  status: number;
};
