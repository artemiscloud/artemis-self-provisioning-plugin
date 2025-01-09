#!/usr/bin/env bash

set -euo pipefail

CONSOLE_IMAGE=${CONSOLE_IMAGE:="quay.io/openshift/origin-console:latest"}
CONSOLE_PORT=${CONSOLE_PORT:=9000}
CONSOLE_IMAGE_PLATFORM=${CONSOLE_IMAGE_PLATFORM:="linux/amd64"}

# Plugin metadata is declared in package.json
PLUGIN_NAME=${npm_package_consolePlugin_name}

echo "Starting local OpenShift console..."

BRIDGE_BASE_ADDRESS="http://localhost:${CONSOLE_PORT}"

## disable auth
#BRIDGE_USER_AUTH="disabled"
#BRIDGE_K8S_AUTH_BEARER_TOKEN=$(oc whoami --show-token 2>/dev/null)

# authenticating the console
BRIDGE_USER_AUTH="openshift"
BRIDGE_USER_AUTH_OIDC_CLIENT_ID="console-oauth-client-http"
BRIDGE_USER_AUTH_OIDC_CLIENT_SECRET_FILE="/bridge-auth-http/console-client-secret"
BRIDGE_USER_AUTH_OIDC_CA_FILE="/bridge-auth-http/ca.crt"
BRIDGE_CA_FILE="/bridge-auth-http/ca-bundle.crt"

BRIDGE_K8S_MODE="off-cluster"
BRIDGE_K8S_AUTH="bearer-token"
BRIDGE_K8S_MODE_OFF_CLUSTER_SKIP_VERIFY_TLS=true
BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT=$(oc whoami --show-server)
# The monitoring operator is not always installed (e.g. for local OpenShift). Tolerate missing config maps.
set +e
BRIDGE_K8S_MODE_OFF_CLUSTER_THANOS=$(oc -n openshift-config-managed get configmap monitoring-shared-config -o jsonpath='{.data.thanosPublicURL}' 2>/dev/null)
BRIDGE_K8S_MODE_OFF_CLUSTER_ALERTMANAGER=$(oc -n openshift-config-managed get configmap monitoring-shared-config -o jsonpath='{.data.alertmanagerPublicURL}' 2>/dev/null)
set -e
BRIDGE_USER_SETTINGS_LOCATION="localstorage"
BRIDGE_I18N_NAMESPACES="plugin__${PLUGIN_NAME}"

# Don't fail if the cluster doesn't have gitops.
set +e
GITOPS_HOSTNAME=$(oc -n openshift-gitops get route cluster -o jsonpath='{.spec.host}' 2>/dev/null)
set -e
if [ -n "$GITOPS_HOSTNAME" ]; then
    BRIDGE_K8S_MODE_OFF_CLUSTER_GITOPS="https://$GITOPS_HOSTNAME"
fi

function getBridgePluginProxy {
    local host='localhost'
    local endpoint="https://${host}:9443"
    echo "{\"services\": [{\"consoleAPIPath\": \"/api/proxy/plugin/activemq-artemis-self-provisioning-plugin/api-server-service/\", \"endpoint\":\"${endpoint}\",\"authorize\":true}]}"
}

echo "API Server: $BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT"
echo "Console Image: $CONSOLE_IMAGE"
echo "Console URL: http://localhost:${CONSOLE_PORT}"
echo "Console Platform: $CONSOLE_IMAGE_PLATFORM"

# Prefer podman if installed. Otherwise, fall back to docker.
if [ -x "$(command -v podman)" ]; then
    if [ "$(uname -s)" = "Linux" ]; then
        # Use host networking on Linux since host.containers.internal is unreachable in some environments.
        podman run \
            --pull always \
            --platform $CONSOLE_IMAGE_PLATFORM \
            --rm -v ./bridge-auth-http:/bridge-auth-http:z \
            --rm --network=host \
            --env-file <(set | grep BRIDGE) \
            --env BRIDGE_PLUGINS="${PLUGIN_NAME}=http://localhost:9001" \
            --env BRIDGE_PLUGIN_PROXY="$(getBridgePluginProxy)" \
            $CONSOLE_IMAGE
    else
        podman run \
            --pull always \
            --platform $CONSOLE_IMAGE_PLATFORM \
            --rm -v ./bridge-auth-http:/bridge-auth-http:z \
            --rm -p "$CONSOLE_PORT":9000 \
            --env-file <(set | grep BRIDGE) \
            --env BRIDGE_PLUGINS="${PLUGIN_NAME}=http://host.containers.localhost:9001" \
            --env BRIDGE_PLUGIN_PROXY="$(getBridgePluginProxy)" \
            $CONSOLE_IMAGE
    fi
else
    docker run \
        --pull always \
        --platform $CONSOLE_IMAGE_PLATFORM \
        --rm -v ./bridge-auth-http:/bridge-auth-http:z \
        --rm -p "$CONSOLE_PORT":9000 \
        --env-file <(set | grep BRIDGE) \
        --env BRIDGE_PLUGINS="${PLUGIN_NAME}=http://host.docker.internal:9001" \
        --env BRIDGE_PLUGIN_PROXY="$(getBridgePluginProxy)" \
        $CONSOLE_IMAGE
fi
