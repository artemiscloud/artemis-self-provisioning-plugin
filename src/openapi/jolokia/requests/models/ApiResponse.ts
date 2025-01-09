/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ApiResponse = {
  message?: {
    security?: {
      enabled?: boolean;
    };
    info?: {
      name?: string;
      description?: string;
      version?: string;
    };
    paths?: {
      post?: Array<string>;
      get?: Array<string>;
    };
  };
  status?: ApiResponse.status;
};

export namespace ApiResponse {
  export enum status {
    SUCCESSFUL = 'successful',
  }
}
