FROM buildpack-deps:18.04

# Install NodeJS
RUN curl https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-x64.tar.xz |tar -Jxf - --strip-components=1 -C /usr && \
  npm install -g grunt-cli && \
  npm install -g npm@6 && \
  npm install -g yarn && \
  rm -r /tmp/npm-* /root/.npm && \
  apt-get update \
  && apt-get -y --no-install-recommends install \
    build-essential \
    git \
    libcairo2-dev \
    libgif-dev \
    libjpeg-dev \
    libpango1.0-dev \
  && rm -rf /var/lib/apt/lists/*

# CartoDB/Windshaft-cartodb version
ENV WINDSHAFT_CARTODB_VERSION=7.2.0

# Install the application.
RUN mkdir /Windshaft-cartodb \
  && curl -L https://github.com/CartoDB/Windshaft-cartodb/archive/${WINDSHAFT_CARTODB_VERSION}.tar.gz \
    | tar -zx --strip-components=1 -C Windshaft-cartodb \
  && cd /Windshaft-cartodb \
  && yarn \
  && mkdir /Windshaft-cartodb/logs

# Copy resources.
COPY config/*.js /Windshaft-cartodb/config/environments/
COPY docker-entrypoint.sh /usr/local/bin/

WORKDIR /Windshaft-cartodb

EXPOSE 80

# We configure the application using just the base config here. Additional configuration files can
# be merged with the base by supplying their filenames as the CMD.
ENTRYPOINT [ "docker-entrypoint.sh", "base.config.js" ]

# We use the development example config by default. Alternatives:
# - production.js.example
# - staging.js.example
# - test.js.example
# OR extend this image by COPYing a custom config file into /Windshaft-cartodb/config/environments/
# and passing its name as the CMD.
CMD [ "development.js.example" ]
