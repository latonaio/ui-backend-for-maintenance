# base image
FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    git \
    gnupg \
    tzdata \
    wget \
    build-essential \
    python

ENV NODE_VERSION=8.x
RUN set -xe; \
    # Node.js repo
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -; \
    echo "deb https://deb.nodesource.com/node_${NODE_VERSION} jessie main" | tee /etc/apt/sources.list.d/nodesource.list; \
    echo "deb-src https://deb.nodesource.com/node_${NODE_VERSION} jessie main" | tee -a /etc/apt/sources.list.d/nodesource.list; \
    # yarn repo
    curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -; \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list; \
    apt-get update && \
    apt-get -y --no-install-recommends install \
        nodejs \
        yarn \
    ;\
    apt-get -y install vim curl &&\
    apt-get clean; rm -rf /var/lib/apt/lists/*;

# Definition of a Service
ENV SERVICE=ui-backend-for-maintenance \
    POSITION=UI \
    AION_HOME="/var/lib/aion" \
    APP_DIR="${AION_HOME}/${POSITION}/${SERVICE}" \
    NODE_ENV=production

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
EXPOSE 8080

ADD . .
RUN yarn

# start app
CMD ["node", "index.js"]
