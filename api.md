# The Jolokia Api Server

(Generated by `yarn build-api-doc`.)

> Version 1.0.0-alpha

This document contains a list of currently avaliable apis that
can be used by the **activemq-artemis-self-provisioning plugin**
to get access to the [management api](https://github.com/apache/activemq-artemis/blob/main/docs/user-manual/management.adoc#the-management-api) of a broker instance via
its [jolokia](https://jolokia.org/) endpoint.

### How to add new apis to the api-server

The api server uses [openapi](https://www.openapis.org/) to define
its apis. All the apis are defined in the file [openapi.yml](api-server/config/openapi.yml).

To add a new api first open the [openapi.yml](api-server/config/openapi.yml)
and add a new api definition, for example:

```yaml
/hello:
  get:
    description: hello api
    tags:
      - greeting
    operationId: hello
    parameters:
      - name: name
        required: false
        in: query
        description: The name of a caller
        schema:
          type: string
  responses:
    200:
      description: Success
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/SimpleResponse'
```

With the above section added, you defined the new api under the path `/hello`
and uses http `GET` method. It takes one optional parameter `name` of string
type. The response contains json value and the structure is defined in
`/components/schemas/SimpleResponse` schema defined in the
same file. The `operationId` represents the method name that implements the api.

Next step is add the implmentation.

Find a place to write your implementation. Your code should be
placed in the `api-server/api/controllers` directory. Either create
a new `.ts` file or use an existing one.

The following code shows a sample implementation:

```typescript
export function hello(req: express.Request, res: express.Response): void {
  const name = req.query.name || 'stranger';
  const message = `Hello, ${name}!`;
  res.json({
    message: message,
    status: 'successful',
  });
}
```

That's it. A new api now is available under path `/api/v1/hello`.

**Tip**: You can consider using the [swagger editor](https://github.com/swagger-api/swagger-editor) to edit the openapi.yml file.

For more information on how to write the api definition, please
see [openapi spec](https://spec.openapis.org/oas/latest.html)

**Note**: If you make changes to the openapi.yml, please run `yarn build-api-doc` to update the doc.

### Update the generated endpoints for the frontend

After any change to the api, run `yarn codegen` to regenerate the endpoints for the frontend.
If necessary update the code that is using the hooks to comply with your changes.

## Path Table

| Method | Path                                                | Description                           |
| ------ | --------------------------------------------------- | ------------------------------------- |
| POST   | [/jolokia/login](#postjolokialogin)                 | The login api                         |
| GET    | [/brokers](#getbrokers)                             | retrieve the broker mbean             |
| GET    | [/brokerDetails](#getbrokerdetails)                 | broker details                        |
| GET    | [/readBrokerAttributes](#getreadbrokerattributes)   | read broker attributes                |
| GET    | [/readAddressAttributes](#getreadaddressattributes) | read address attributes               |
| GET    | [/checkCredentials](#getcheckcredentials)           | Check the validity of the credentials |
| POST   | [/execBrokerOperation](#postexecbrokeroperation)    | execute a broker operation            |
| GET    | [/brokerComponents](#getbrokercomponents)           | list all mbeans                       |
| GET    | [/addresses](#getaddresses)                         | retrieve all addresses on broker      |
| GET    | [/queues](#getqueues)                               | list queues                           |
| GET    | [/queueDetails](#getqueuedetails)                   | retrieve queue details                |
| GET    | [/addressDetails](#getaddressdetails)               | retrieve address details              |
| GET    | [/acceptors](#getacceptors)                         | list acceptors                        |
| GET    | [/acceptorDetails](#getacceptordetails)             | retrieve acceptor details             |
| GET    | [/api-info](#getapi-info)                           | the api info                          |

## Reference Table

| Name            | Path                                                                      | Description |
| --------------- | ------------------------------------------------------------------------- | ----------- |
| OperationRef    | [#/components/schemas/OperationRef](#componentsschemasoperationref)       |             |
| SimpleResponse  | [#/components/schemas/SimpleResponse](#componentsschemassimpleresponse)   |             |
| BrokersResponse | [#/components/schemas/BrokersResponse](#componentsschemasbrokersresponse) |             |

## Path Details

---

### [POST]/jolokia/login

- Summary  
  The login api

- Description  
  This api is used to login to a jolokia endpoint. It tries to get the broker mbean via the joloia url using the parameters passed in.
  If it succeeds, it generates a [jwt token](https://jwt.io/introduction) and returns  
  it back to the client. If it fails it returns a error.
  Once authenticated, the client can access the  
  apis defined in this file. With each request the client must include a valid jwt token in a http header named `jolokia-session-id`. The api-server will validate the token before processing a request is and rejects the request if the token is not valid.

#### RequestBody

- application/json

```ts
{
  // identity of the broker instance, must in form of {cr-name}-{pod-ordinal}:{namespace}. For example ex-aao-0:test1
  brokerName: string;
  // The user name
  userName: string;
  // The password
  password: string;
  // The host name of the broker
  jolokiaHost: string;
  // either *http* or *https*
  scheme: string;
  // port number of jolokia endpoint
  port: string;
}
```

#### Responses

- 200 Success

`application/json`

```ts
{
  message: string
  status: string
  // The jwt token
  jolokia-session-id: string
}
```

---

### [GET]/brokers

- Summary  
  retrieve the broker mbean

- Description  
  **Get the broker mbean**  
   The return value is a one-element array that contains  
   the broker's mbean object name.  
   **Example:**
  **Request url:** https://localhost:9443/api/v1/brokers  
   **Response:**
  ```json
  ["org.apache.activemq.artemis:broker=\"amq-broker\""]
  ```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/brokerDetails

- Summary  
  broker details

- Description  
  **Get the broker details**  
   The return value is a json object that contains  
   description of all the operations and attributes of the broker's mbean.  
   It is defined in [ActiveMQServerControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/ActiveMQServerControl.java)  
   **Example:**
  **Request url:** https://localhost:9443/api/v1/brokerDetails  
   **Response:**
  ```json
  {
    "op": {
      "removeAddressSettings": {
        "args": [
          {
            "name": "addressMatch",
            "type": "java.lang.String",
            "desc": "an address match"
          }
        ],
        "ret": "void",
        "desc": "Remove address settings"
      },
      ...(more)
    },
    "attr": {
      "AddressMemoryUsage": {
        "rw": false,
        "type": "long",
        "desc": "Memory used by all the addresses on broker for in-memory messages"
      },
      ...(more)
    },
    "class": "org.apache.activemq.artemis.core.management.impl.ActiveMQServerControlImpl",
    "desc": "Information on the management interface of the MBean"
  }
  ```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/readBrokerAttributes

- Summary  
  read broker attributes

- Description  
  **Read values of broker attributes**  
   The return value is a json array that contains  
   values of requested attributes of the broker's mbean.
  **Example:**
  **Request url:** https://localhost:9443/api/v1/readBrokerAttributes?names=Clustered  
   (To read the `Clustered` attribute of the broker)
  **Response:**
  ```json
  [
    {
      "request": {
        "mbean": "org.apache.activemq.artemis:broker=\"amq-broker\"",
        "attribute": "Clustered",
        "type": "read"
      },
      "value": true,
      "timestamp": 1713712378,
      "status": 200
    }
  ]
  ```
  **Note**: to read multiple attributes, set it to **names** parameter  
   separated by commas, e.g. `Version,Status`.

#### Parameters(Query)

```ts
names?: string[]
```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/readAddressAttributes

- Summary  
  read address attributes

- Description  
  **Read values of address attributes**  
   The return value is a json array that contains  
   values of requested attributes of the addresses's mbean.
  **Example:**
  **Request url:** https://localhost:9443/api/v1/readAddressAttributes?name=DLQ,attrs=RoutingTypes  
   (To read the `RoutingTypes` attribute of the address DLQ)
  **Response:**
  ```json
  [
    {
      "request": {
        "mbean": "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses",
        "attribute": "RoutingTypes",
        "type": "read"
      },
      "value": ["ANYCAST"],
      "timestamp": 1715864988,
      "status": 200
    }
  ]
  ```
  **Note**: to read multiple attributes, set it to **attrs** parameter  
   separated by commas, e.g. `RoutingTypes,Address`.

#### Parameters(Query)

```ts
name: string;
```

```ts
attrs?: string[]
```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/checkCredentials

- Summary  
  Check the validity of the credentials

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
  message: string
  status: string
  // The jwt token
  jolokia-session-id: string
}
```

---

### [POST]/execBrokerOperation

- Summary  
  execute a broker operation

- Description  
  **Invoke an operation of the broker mbean**
  It receives a POST request where the body  
   should have the operation signature and its args.  
   The return value is a one element json array that contains  
   return values of invoked operation along with the request info.
  **Example:**
  To invoke `listAddresses` operation on the broker:  
   **Request:**
  ```
    POST https://localhost:9443/api/v1/execBrokerOperation
      with body:
      {
        signature: 'listAddresses(java.lang.String)',
        params: [','],
      }
  ```
  **Response:**
  ```json
  [
    {
      "request": {
        "mbean": "org.apache.activemq.artemis:broker=\"amq-broker\"",
        "arguments": [","],
        "type": "exec",
        "operation": "listAddresses(java.lang.String)"
      },
      "value": "$.artemis.internal.sf.my-cluster.caceaae5-ff8c-11ee-a198-0a580ad90011,activemq.notifications,DLQ,ExpiryQueue",
      "timestamp": 1713714174,
      "status": 200
    }
  ]
  ```

#### Headers

```ts
jolokia-session-id: string
```

#### RequestBody

- application/json

```ts
{
  // The method signature
  signature: string
  // The method arguments
  args?: string[]
}
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/brokerComponents

- Summary  
  list all mbeans

- Description  
  **List all broker components**
  It retrieves and returns a list of all mbeans  
   registered directly under the broker managment domain.
  **Example:**
  **Request url:** https://localhost:9443/api/v1/execBrokerOperation  
   **Response:**
  ```json
  [
    "org.apache.activemq.artemis:address=\"ExpiryQueue\",broker=\"amq-broker\",component=addresses,queue=\"ExpiryQueue\",routing-type=\"anycast\",subcomponent=queues",
    "org.apache.activemq.artemis:broker=\"amq-broker\",component=cluster-connections,name=\"my-cluster\"",
    "org.apache.activemq.artemis:address=\"activemq.notifications\",broker=\"amq-broker\",component=addresses",
    "org.apache.activemq.artemis:broker=\"amq-broker\",component=broadcast-groups,name=\"my-broadcast-group\"",
    "org.apache.activemq.artemis:broker=\"amq-broker\",component=acceptors,name=\"scaleDown\"",
    "org.apache.activemq.artemis:broker=\"amq-broker\"",
    "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses",
    "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses,queue=\"DLQ\",routing-type=\"anycast\",subcomponent=queues",
    "org.apache.activemq.artemis:address=\"ExpiryQueue\",broker=\"amq-broker\",component=addresses"
  ]
  ```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/addresses

- Summary  
  retrieve all addresses on broker

- Description  
  **Get all addresses in a broker**
  It retrieves and returns a list of all address mbeans
  **Example:**
  **Request url:** https://localhost:9443/api/v1/addresses  
   **Response:**
  ```json
  [
    "org.apache.activemq.artemis:address=\"activemq.notifications\",broker=\"amq-broker\",component=addresses",
    "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses",
    "org.apache.activemq.artemis:address=\"ExpiryQueue\",broker=\"amq-broker\",component=addresses"
  ]
  ```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/queues

- Summary  
  list queues

- Description  
  **Get all queues in a broker**
  It retrieves and returns a list of all queue mbeans
  **Example:**
  **Request url:** https://localhost:9443/api/v1/queues  
   **Response:**
  ```json
  [
    "org.apache.activemq.artemis:address=\"ExpiryQueue\",broker=\"amq-broker\",component=addresses,queue=\"ExpiryQueue\",routing-type=\"anycast\",subcomponent=queues",
    "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses,queue=\"DLQ\",routing-type=\"anycast\",subcomponent=queues"
  ]
  ```

#### Parameters(Query)

```ts
// If given only list the queues on this address
address?: string
```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/queueDetails

- Summary  
  retrieve queue details

- Description  
  **Get details of a queue**  
   The return value is a json object that contains  
   description of all the operations and attributes of the `queue` mbean.
  It is defined in [QueueControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/QueueControl.java)  
   **Example:**
  **Request url:** https://localhost:9443/api/v1/queueDetails?name=DLQ&addressName=DLQ&routingType=anycast  
   (To get details of queue `DLQ` on address `DLQ` with routingType `anycast`)  
   **Response:**
  ```json
  {
    "op": {
      "listMessages": {
        "args": [
          {
            "name": "filter",
            "type": "java.lang.String",
            "desc": "A message filter (can be empty)"
          }
        ],
        "ret": "[Ljava.util.Map;",
        "desc": "List all the messages in the queue matching the given filter"
      },
      ...(more)
    },
    "attr": {
      "ConfigurationManaged": {
        "rw": false,
        "type": "boolean",
        "desc": "is this queue managed by configuration (broker.xml)"
      },
      ...(more)
    },
    "class": "org.apache.activemq.artemis.core.management.impl.QueueControlImpl",
    "desc": "Information on the management interface of the MBean"
  }
  ```

#### Parameters(Query)

```ts
// the address name of the queue
addressName?: string
```

```ts
// the name of the queue
name: string;
```

```ts
// the routing type of the queue (anycast or multicast)
routingType: string;
```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/addressDetails

- Summary  
  retrieve address details

- Description  
  **Get details of an address**  
   The return value is a json object that contains  
   description of all the operations and attributes of the address mbean.
  It is defined in [AddressControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/AddressControl.java)  
   **Example:**
  **Request url:**  
   **Response:**
  ```json
  {
    "op": {
      "resume": {
        "args": [],
        "ret": "void",
        "desc": "Resumes the queues bound to this address"
      },
      ...(more)
    },
    "attr": {
      "RoutingTypesAsJSON": {
        "rw": false,
        "type": "java.lang.String",
        "desc": "Get the routing types enabled on this address as JSON"
      },
      ...(more)
    },
    "class": "org.apache.activemq.artemis.core.management.impl.AddressControlImpl",
    "desc": "Information on the management interface of the MBean"
  }
  ```

#### Parameters(Query)

```ts
// the address name
name: string;
```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/acceptors

- Summary  
  list acceptors

- Description  
  **Get all acceptors in a broker**
  It retrieves and returns a list of all acceptor mbeans
  **Example:**
  **Request url:** https://localhost:9443/api/v1/acceptors  
   **Response:**
  ```json
  [
    "org.apache.activemq.artemis:broker=\"amq-broker\",component=acceptors,name=\"scaleDown\""
  ]
  ```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/acceptorDetails

- Summary  
  retrieve acceptor details

- Description  
  **Get details of an acceptor**  
   The return value is a json object that contains  
   description of all the operations and attributes of an `acceptor` mbean.
  It is defined in [AcceptorControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/AcceptorControl.java)  
   **Example:**
  **Request url:** https://localhost:9443/api/v1/acceptorDetails?name=scaleDown  
   (To get the details of an acceptor named `scaleDown`)  
   **Response:**
  ```json
  {
    "op": {
      "reload": {
        "args": [],
        "ret": "void",
        "desc": "Re-create the acceptor with the existing configuration values. Useful, for example, for reloading key/trust stores on acceptors which support SSL."
      },
      ...(more)
    },
    "attr": {
      "FactoryClassName": {
        "rw": false,
        "type": "java.lang.String",
        "desc": "class name of the AcceptorFactory implementation used by this acceptor"
      },
      ...(more)
    },
    "class": "org.apache.activemq.artemis.core.management.impl.AcceptorControlImpl",
    "desc": "Information on the management interface of the MBean"
  }
  ```

#### Parameters(Query)

```ts
// the acceptor name
name: string;
```

#### Headers

```ts
jolokia-session-id: string
```

#### Responses

- 200 Success

`application/json`

```ts
{
}
[];
```

---

### [GET]/api-info

- Summary  
  the api info

- Description  
  **Show all exposed paths on the api server**
  The return value is a json object that contains  
   description of all api paths defined in the api server.
  **Example:**
  **Request url:** https://localhost:9443/api/v1/api-info  
   **Response:**
  ```json
  {
    "message": {
      "info": {
        "name": "The Jolokia Api Server\n(Generated by `yarn build-api-doc`.)\n",
        "description": ...(text omitted for brevity)
        "version": "1.0.0-alpha"
      },
      "paths": {
        "post": [
          "/api/v1/jolokia/login",
          "/api/v1/execBrokerOperation"
        ],
        "get": [
          "/api/v1/brokers",
          "/api/v1/brokerDetails",
          "/api/v1/readBrokerAttributes",
          "/api/v1/brokerComponents",
          "/api/v1/addresses",
          "/api/v1/queues",
          "/api/v1/queueDetails",
          "/api/v1/addressDetails",
          "/api/v1/acceptors",
          "/api/v1/acceptorDetails",
          "/api/v1/api-info"
        ]
      }
    },
    "status": "successful"
  }
  ```

#### Responses

- 200 Success

`application/json`

```ts
{
  message: string
  status: string
  // The jwt token
  jolokia-session-id: string
}
```

## References

### #/components/schemas/OperationRef

```ts
{
  // The method signature
  signature: string
  // The method arguments
  args?: string[]
}
```

### #/components/schemas/SimpleResponse

```ts
{
  message: string
  status: string
  // The jwt token
  jolokia-session-id: string
}
```

### #/components/schemas/BrokersResponse

```ts
{
}
[];
```