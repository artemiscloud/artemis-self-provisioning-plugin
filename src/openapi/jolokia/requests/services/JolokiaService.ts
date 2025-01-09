/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Acceptor } from '../models/Acceptor';
import type { Address } from '../models/Address';
import type { Broker } from '../models/Broker';
import type { ClusterConnection } from '../models/ClusterConnection';
import type { ComponentAttribute } from '../models/ComponentAttribute';
import type { ComponentDetails } from '../models/ComponentDetails';
import type { ExecResult } from '../models/ExecResult';
import type { OperationRef } from '../models/OperationRef';
import type { Queue } from '../models/Queue';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class JolokiaService {
  /**
   * retrieve the broker mbean
   * **Get the broker mbean**
   * The return value is a one-element array that contains
   * the broker's mbean object name.
   *
   * @param targetEndpoint
   * @param endpointName
   * @returns Broker Success
   * @throws ApiError
   */
  public static getBrokers(
    targetEndpoint: string,
    endpointName?: string,
  ): CancelablePromise<Array<Broker>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokers',
      headers: {
        'endpoint-name': endpointName,
      },
      query: {
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * broker details
   * **Get the broker details**
   * The return value is a json object that contains
   * description of all the operations and attributes of the broker's mbean.
   * It is defined in [ActiveMQServerControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/ActiveMQServerControl.java)
   *
   * @param targetEndpoint
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getBrokerDetails(
    targetEndpoint: string,
  ): CancelablePromise<ComponentDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokerDetails',
      query: {
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * read broker attributes
   * **Read values of broker attributes**
   * The return value is a json array that contains
   * values of requested attributes of the broker's mbean.
   *
   * **Note**: to read multiple attributes, set it to **names** parameter
   * separated by commas, e.g. `Version,Status`.
   *
   * @param targetEndpoint
   * @param names attribute names separated by commas. If not speified read all attributes.
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readBrokerAttributes(
    targetEndpoint: string,
    names?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readBrokerAttributes',
      query: {
        names: names,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * read address attributes
   * **Read values of address attributes**
   * The return value is a json array that contains
   * values of requested attributes of the addresses's mbean.
   *
   * **Note**: to read multiple attributes, set it to **attrs** parameter
   * separated by commas, e.g. `RoutingTypes,Address`.
   *
   * @param name the address name
   * @param targetEndpoint
   * @param attrs attribute names separated by commas. If not speified read all attributes.
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readAddressAttributes(
    name: string,
    targetEndpoint: string,
    attrs?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readAddressAttributes',
      query: {
        name: name,
        attrs: attrs,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * read queue attributes
   * **Read values of queue attributes**
   * The return value is a json array that contains
   * values of requested attributes of the queue's mbean.
   *
   * **Note**: to read multiple attributes, set it to **attrs** parameter
   * separated by commas, e.g. `RoutingTypes,Address`.
   *
   * @param name the queue name
   * @param address the address name
   * @param routingType the routing type
   * @param targetEndpoint
   * @param attrs attribute names separated by commas. If not speified read all attributes.
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readQueueAttributes(
    name: string,
    address: string,
    routingType: string,
    targetEndpoint: string,
    attrs?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readQueueAttributes',
      query: {
        name: name,
        address: address,
        'routing-type': routingType,
        attrs: attrs,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * read acceptor attributes
   * **Read values of acceptor attributes**
   * The return value is a json array that contains
   * values of requested attributes of the acceptor's mbean.
   *
   * **Note**: to read multiple attributes, set it to **attrs** parameter
   * separated by commas, e.g. `RoutingTypes,Address`.
   *
   * @param name the queue name
   * @param targetEndpoint
   * @param attrs attribute names separated by commas. If not speified read all attributes.
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readAcceptorAttributes(
    name: string,
    targetEndpoint: string,
    attrs?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readAcceptorAttributes',
      query: {
        name: name,
        attrs: attrs,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * read cluster connection attributes
   * **Read values of cluster connection attributes**
   * The return value is a json array that contains
   * values of requested attributes of the cluster connection's mbean.
   *
   * **Note**: to read multiple attributes, set it to **attrs** parameter
   * separated by commas, e.g. `NodeID, Topology`.
   *
   * @param name the cluster connection name
   * @param targetEndpoint
   * @param attrs attribute names separated by commas. If not speified read all attributes.
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readClusterConnectionAttributes(
    name: string,
    targetEndpoint: string,
    attrs?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readClusterConnectionAttributes',
      query: {
        name: name,
        attrs: attrs,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * execute a cluster connection operation
   * **Invoke an operation of the cluster connection mbean**
   *
   * It receives a POST request where the body
   * should have the operation signature and its args.
   * The return value is a one element json array that contains
   * return values of invoked operation along with the request info.
   *
   * @param name
   * @param targetEndpoint
   * @param requestBody
   * @returns ExecResult Success
   * @throws ApiError
   */
  public static execClusterConnectionOperation(
    name: string,
    targetEndpoint: string,
    requestBody: OperationRef,
  ): CancelablePromise<Array<ExecResult>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/execClusterConnectionOperation',
      query: {
        name: name,
        targetEndpoint: targetEndpoint,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * execute a broker operation
   * **Invoke an operation of the broker mbean**
   *
   * It receives a POST request where the body
   * should have the operation signature and its args.
   * The return value is a one element json array that contains
   * return values of invoked operation along with the request info.
   *
   * @param targetEndpoint
   * @param requestBody
   * @returns ExecResult Success
   * @throws ApiError
   */
  public static execBrokerOperation(
    targetEndpoint: string,
    requestBody: OperationRef,
  ): CancelablePromise<Array<ExecResult>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/execBrokerOperation',
      query: {
        targetEndpoint: targetEndpoint,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * list all mbeans
   * **List all broker components**
   *
   * It retrieves and returns a list of all mbeans
   * registered directly under the broker managment domain.
   *
   * @param targetEndpoint
   * @returns string Success
   * @throws ApiError
   */
  public static getBrokerComponents(
    targetEndpoint: string,
  ): CancelablePromise<Array<string>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokerComponents',
      query: {
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * retrieve all addresses on broker
   * **Get all addresses in a broker**
   *
   * It retrieves and returns a list of all address mbeans
   *
   * @param targetEndpoint
   * @returns Address Success
   * @throws ApiError
   */
  public static getAddresses(
    targetEndpoint: string,
  ): CancelablePromise<Array<Address>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/addresses',
      query: {
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * list queues
   * **Get all queues in a broker**
   *
   * It retrieves and returns a list of all queue mbeans
   *
   * @param targetEndpoint
   * @param address
   * @returns Queue Success
   * @throws ApiError
   */
  public static getQueues(
    targetEndpoint: string,
    address?: string,
  ): CancelablePromise<Array<Queue>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/queues',
      query: {
        address: address,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * retrieve queue details
   * **Get details of a queue**
   * The return value is a json object that contains
   * description of all the operations and attributes of the `queue` mbean.
   *
   * It is defined in [QueueControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/QueueControl.java)
   *
   * @param name
   * @param routingType
   * @param targetEndpoint
   * @param addressName
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getQueueDetails(
    name: string,
    routingType: string,
    targetEndpoint: string,
    addressName?: string,
  ): CancelablePromise<ComponentDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/queueDetails',
      query: {
        addressName: addressName,
        name: name,
        routingType: routingType,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * retrieve address details
   * **Get details of an address**
   * The return value is a json object that contains
   * description of all the operations and attributes of the address mbean.
   *
   * It is defined in [AddressControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/AddressControl.java)
   *
   * @param name
   * @param targetEndpoint
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getAddressDetails(
    name: string,
    targetEndpoint: string,
  ): CancelablePromise<ComponentDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/addressDetails',
      query: {
        name: name,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * list acceptors
   * **Get all acceptors in a broker**
   *
   * It retrieves and returns a list of all acceptor mbeans
   *
   * @param targetEndpoint
   * @returns Acceptor Success
   * @throws ApiError
   */
  public static getAcceptors(
    targetEndpoint: string,
  ): CancelablePromise<Array<Acceptor>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/acceptors',
      query: {
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * retrieve acceptor details
   * **Get details of an acceptor**
   * The return value is a json object that contains
   * description of all the operations and attributes of an `acceptor` mbean.
   *
   * It is defined in [AcceptorControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/AcceptorControl.java)
   *
   * @param name
   * @param targetEndpoint
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getAcceptorDetails(
    name: string,
    targetEndpoint: string,
  ): CancelablePromise<ComponentDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/acceptorDetails',
      query: {
        name: name,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * list cluster connections
   * **Get all cluster connections in a broker**
   *
   * It retrieves and returns a list of all cluster connection mbeans
   *
   * @param targetEndpoint
   * @returns ClusterConnection Success
   * @throws ApiError
   */
  public static getClusterConnections(
    targetEndpoint: string,
  ): CancelablePromise<Array<ClusterConnection>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/clusterConnections',
      query: {
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * retrieve cluster connection details
   * **Get details of a connection cluster**
   * The return value is a json object that contains
   * description of all the operations and attributes of a `cluster connection` mbean.
   *
   * It is defined in [ClusterConnectionControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/ClusterConnectionControl.java)
   *
   * @param name
   * @param targetEndpoint
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getClusterConnectionDetails(
    name: string,
    targetEndpoint: string,
  ): CancelablePromise<ComponentDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/clusterConnectionDetails',
      query: {
        name: name,
        targetEndpoint: targetEndpoint,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }
}
