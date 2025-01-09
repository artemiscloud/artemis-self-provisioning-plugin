#### :warning:This project is now part of the ArkMQ initiative. This repository has been archived as all activities are now happening in the [corresponding ArkMQ repository](https://github.com/arkmq-org/activemq-artemis-self-provisioning-plugin). See [here](https://artemiscloud.io/community/transition/) for the ArkMQ transition details.

---

# ActiveMQ Artemis Self Provisioning Plugin

This project is a ActiveMQ Artemis Self Provisioning Plugin to the Administrator perspective in OpenShift console. It requires OpenShift `4.16` to use.

## Local development

To be able to run the local development environment you need to:

- have access to a local or remote OpenShift cluster
- have the operator installed on the cluster
- have the cert-manager operator installed on the cluster
- have the jolokia-api-server running
- have the plugin running
- have the console running

### Setting up an OpenShift cluster

In order to run the project you need to have access to an OpenShift cluster.
If you don't have an access to a remote one you can deploy one on your machine
with `crc`.

#### Local cluster

Follow the documentation:
https://access.redhat.com/documentation/en-us/red_hat_openshift_local/2.34/html-single/getting_started_guide/index#introducing

> [!WARNING]
> If you're encountering an issue where `crc` gets stuck in the step `Waiting
for kube-apiserver availability` or `Waiting until the user's pull secret is
written to the instance disk...` [you might
> need](https://github.com/crc-org/crc/issues/4110) to
> configure the network as local: `crc config set network-mode user`

Once your environment is set up you simply need to `crc start` your cluster.

#### Connecting to the cluster

Depending on the remote or local env:

- `oc login -u kubeadmin
https://api.ci-ln-x671mxk-76ef8.origin-ci-int-aws.dev.rhcloud.com:6443` (to
  adapt depending on your cluster address)
- `oc login -u kubeadmin https://api.crc.testing:6443`

### Installing the operator

The plugin requires having access to the operator to function. You can either
get the operator from the operatorHub or from the upstream repo.

#### From the operatorHub

Navigate to the operatorHub on the console and search for: `Red Hat Integration

- AMQ Broker for RHEL 8 (Multiarch)` After installation the wait for the
  operator container to be up and running.

> [!WARNING]
> If you're running into an issue where the operatorHub is not accessible, try
> to force its redeployment: `oc delete pods --all -n openshift-marketplace`
> see https://github.com/crc-org/crc/issues/4109 for reference.

#### From the upstream repository

Clone the operator repository then run `./deploy/install_opr.sh` to install the
operator onto your cluster.

```
git clone git@github.com:arkmq-org/activemq-artemis-operator.git
cd activemq-artemis-operator
./deploy/install_opr.sh
```

> [!TIP]
> If you need to redeploy the operator, first call `./deploy/undeploy_all.sh`

> [!IMPORTANT]
> The script `install_opr.sh` will try to deploy on OpenShift with the `oc`
> command. If it's not available it will fallback to `kubectl`. Make sure your
> OpenShift cluster is up and running and that `oc` is connected to it before
> running the install.

### Installing the cert-manager operator

The plugin requires having access to the cert-manager operator for certain of
its functionalities.

#### From the operatorHub

Navigate to the operatorHub on the console and search for `Cert-manager`.

### Running the plugin

#### Download the secrets so that the bridge can authenticate the user with the api server backend

1. For HTTP

```
cd bridge-auth-http
./setup.sh
```

2. For HTTPS

```
cd bridge-auth-https
./setup.sh
```

#### start the jolokia api-server

In one terminal start the jolokia-api-server, [follow the
readme](https://github.com/lavocatt/activemq-artemis-jolokia-api-server/blob/main/README.md)
on the project to know what to do.

#### start the webpack server

In one terminal window, run:

1. `yarn install`
2. `yarn start`

Note: `yarn run start` starts the plugin in http mode.
if you want the plugin to run in https mode, run

`yarn run start-tls`

#### start the console

In another terminal window, run:

1. `oc login`
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman](https://podman.io) or another [Open Containers Initiative](https://opencontainers.org/) compatible container runtime)

This will run the OpenShift console in a container connected to the cluster
you've logged into. The plugin HTTP server runs on port 9001 with CORS enabled.
Navigate to <http://localhost:9000> to see the running plugin.

To view our plugin on OpenShift, navigate to the Workloads section. The plugin will be listed as **Brokers**.

If you want the console to run in `https` mode, run:

`yarn run start-console-tls`

This command will run the console in `https` mode on port 9442.
The console url is <https://localhost:9442>

Note: Running console in `https` mode requires the plugin running in `https` mode too.

The console in https mode requires a private key and a server certificate that are generated
with openssl command. They are located under `console-cert` directory. The domain.key is the
private key and domain.crt is the server certificate. Please read the `console-cert/readme`
for instructions on how they are generated.

To run the console in https mode, you need to mount the private key and server cert to the
docker container and pass the locations to the console using BRIDGE_TLS_CERT_FILE and
BRIDGE_TLS_KEY_FILE environment variables respectively. Please see the `start-console-tls.sh`
for details.

## Docker image

1. Build the image:
   ```sh
   docker build -t quay.io/arkmq-org/activemq-artemis-self-provisioning-plugin:latest .
   ```
2. Run the image:
   ```sh
   docker run -it --rm -d -p 9001:80 quay.io/arkmq-org/activemq-artemis-self-provisioning-plugin:latest
   ```
3. Push the image to image registry:
   ```sh
   docker push quay.io/arkmq-org/activemq-artemis-self-provisioning-plugin:latest
   ```

## Deployment on cluster

### deploy the jolokia api-server

[Follow the
readme](https://github.com/lavocatt/activemq-artemis-jolokia-api-server/blob/main/README.md)
on the project to know what to do.

You can deploy the plugin to a cluster by running this following command:

### deploy the plugin

```sh
./deploy-plugin.sh [-i <image> -n]
```

Without any arguments, the plugin will run in https mode on port 9443.

The optional `-i <image>` (or `--image <image>`) argument allows you to pass in the plugin image. If not specified the default
`quay.io/arkmq-org/activemq-artemis-self-provisioning-plugin:latest` is deployed. for example:

```sh
./deploy-plugin.sh -i quay.io/<repo-username>/activemq-artemis-self-provisioning-plugin:1.0.1
```

The optional `-n` (or `--nossl`) argument disables the https and makes the plugin run in http mode on port 9001.
For example:

```sh
./deploy-plugin.sh -n
```

The deploy-plugin.sh uses `oc kustomize` (built-in [kustomize](https://github.com/kubernetes-sigs/kustomize)) command to configure and deploy the plugin using
resources and patches defined under ./deploy directory.

To undeploy the plugin, run

```sh
./undeploy-plugin.sh
```

## Keep in sync the jolokia api-server markdown file

The codegen relies on the jolokia api-server's openapi definition to work. The
project keeps a copy of the version of the api server it is compatible with
under `api-server/openapi.yml`.
This files needs to be kept in sync when upgrades on the api-server are
performed.
