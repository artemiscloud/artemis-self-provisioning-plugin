#!/bin/bash
oc process -f console-oauth-client.yaml | oc apply -f -
oc get oauthclient console-oauth-client-http -o jsonpath='{.secret}' > console-client-secret
oc apply -f sa-secrets.yaml
oc get secrets -n default --field-selector type=kubernetes.io/service-account-token -o json | \
    jq '.items[0].data."ca.crt"' -r | python -m base64 -d > ca.crt
oc extract cm/kube-apiserver-server-ca -n openshift-kube-apiserver --confirm
chmod o+r ca-bundle.crt
chmod g+r ca-bundle.crt
