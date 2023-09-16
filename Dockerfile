FROM registry.access.redhat.com/ubi8/nodejs-16:latest AS BUILD_IMAGE

### BEGIN REMOTE SOURCE
# Use the COPY instruction only inside the REMOTE SOURCE block
# Use the COPY instruction only to copy files to the container path $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/app
ARG REMOTE_SOURCES_DIR=/tmp/remote_source
RUN mkdir -p $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/app
WORKDIR $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/app
# Copy package.json and yarn.lock to the container
COPY package.json package.json
COPY yarn.lock yarn.lock

## Switch to root as required for some operations
USER root
ENV HUSKY=0

RUN command -v yarn || npm i -g yarn

## Install dependencies
#RUN source $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/cachito.env  && \
#RUN yarn install --frozen-lockfile --network-timeout 1000000
### END REMOTE SOURCE
RUN echo $(ls -l $REMOTE_SOURCES_DIR)

USER root

## Set up the workspace
ADD . /usr/src/app
WORKDIR /usr/src/app

## Install dependenciesß
RUN yarn install --frozen-lockfile --network-timeout 1000000

## Build application
RUN yarn build

## Run time base image
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal

## Use none-root user
USER 1001

WORKDIR /app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/http-server.sh ./http-server.sh

ENTRYPOINT [ "./http-server.sh", "./dist" ]

## Labels
LABEL name="artemiscloud/activemq-artemis-self-provisioning-plugin"
LABEL description="ActiveMQ Artemis Self Provisioning Plugin"
LABEL maintainer="Ajay Pratap <apratap@redhat.com>"
LABEL version="0.0.1"
