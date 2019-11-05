FROM buildpack-deps:18.04

# Install NodeJS
RUN curl https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-x64.tar.xz |tar -Jxf - --strip-components=1 -C /usr && \
  npm install -g grunt-cli && \
  npm install -g npm@6 && \
  rm -r /tmp/npm-* /root/.npm

# CartoDB/CartoDB-SQL-API version
ENV CARTODB_SQL_API_VERSION=4.0.0

RUN mkdir /CartoDB-SQL-API \
  && curl -L https://github.com/CartoDB/CartoDB-SQL-API/archive/${CARTODB_SQL_API_VERSION}.tar.gz \
    | tar -zx --strip-components=1 -C CartoDB-SQL-API \
  && cd /CartoDB-SQL-API \
  && npm install

# Copy resources.
COPY config/*.js /CartoDB-SQL-API/config/environments/
COPY docker-entrypoint.sh /usr/local/bin/

WORKDIR /CartoDB-SQL-API

EXPOSE 80

# We configure the application using just the base config here. Additional configuration files can
# be merged with the base by supplying their filenames as the CMD.
ENTRYPOINT [ "docker-entrypoint.sh", "base.config.js" ]

# We use the development example config by default. Alternatives:
# - production.js.example
# - staging.js.example
# - test.js.example
# OR extend this image by COPYing a custom config file into /CartoDB-SQL-API/config/environments/
# and passing its name as the CMD.
CMD [ "development.js.example" ]
