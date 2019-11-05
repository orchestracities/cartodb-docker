FROM ubuntu:18.04
LABEL maintainer="Stefan Verhoeven <s.verhoeven@esciencecenter.nl>"

# Configuring locales
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y -q apt-utils software-properties-common locales && dpkg-reconfigure locales && \
      locale-gen en_US.UTF-8 && \
      update-locale LANG=en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN useradd -m -d /home/cartodb -s /bin/bash cartodb && \
  apt-get install -y -q \
    build-essential \
    autoconf \
    tzdata \
    automake \
    libtool \
    checkinstall \
    unp \
    zip \
    unzip \
    git-core \
    git \
    subversion \
    curl \
    libgeos-c1v5 \
    libgeos-dev \
    libjson-c-dev \
    python-simplejson \
    proj-bin \
    proj-data \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    postgresql-10 \
    postgresql-client-10 \
    liblwgeom-2.4-0 \
    ca-certificates \
    redis-server \
    python2.7-dev \
    python-setuptools \
    imagemagick \
    libmapnik-dev \
    mapnik-utils \
    python-mapnik \
    python-argparse \
    python-gdal \
    python-chardet \
    python-all-dev \
    python-docutils \
    openssl \
    libreadline7 \
    zlib1g \
    zlib1g-dev \
    libssl-dev \
    libyaml-dev \
    libsqlite3-dev \
    sqlite3 \
    libxml2-dev \
    libxslt-dev \
    libc6-dev \
    ncurses-dev \
    bison \
    pkg-config \
    libpq5 \
    libpq-dev \
    libcurl4-gnutls-dev \
    libffi-dev \
    libgdbm-dev \
    gnupg \
    libreadline6-dev \
    libcairo2-dev \
    libjpeg8-dev \
    libpango1.0-dev \
    libgif-dev \
    libgmp-dev \
    libicu-dev \
    wget \
    net-tools \
    ruby2.5-dev \
    xz-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Install NodeJS
RUN curl https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-x64.tar.xz |tar -Jxf - --strip-components=1 -C /usr && \
  npm install -g grunt-cli && \
  npm install -g npm@6

# CartoDB/cartodb version
ENV CARTODB_VERSION=master

# Install CartoDB
RUN git clone --recursive git://github.com/CartoDB/cartodb.git && \
    cd cartodb && \
    git checkout $CARTODB_VERSION

WORKDIR /cartodb

COPY config/grunt_production.json /cartodb/config/grunt_production.json
    
RUN npm install && \
    rm -r /tmp/npm-* /root/.npm && \
    curl https://bootstrap.pypa.io/get-pip.py | python && \
    perl -pi -e 's/gdal==1\.10\.0/gdal==2.2.2/' python_requirements.txt && \
    export CPLUS_INCLUDE_PATH=/usr/include/gdal  && \
    export C_INCLUDE_PATH=/usr/include/gdal && \
    pip install --no-binary :all: -r python_requirements.txt && \
    echo "gem 'tzinfo-data'" >> Gemfile && \
    gem install bundler --version=1.17.3 && gem install compass archive-tar-minitar rack && \
    bundle update thin && \
    /bin/bash -l -c 'bundle install'

RUN cp config/grunt_development.json ./config/grunt_true.json && \
    /bin/bash -l -c 'bundle exec grunt' \
    && npm install \
      js-yaml \
      yargs
    # && \
    #rm -rf .git /root/.cache/pip node_modules

# Compile static assets
RUN rm -rf \
  /root/.cache \
  /root/.bundle \
  /root/.gem \
  /root/.npm \
  && mkdir -p /cartodb/docker-entrypoint-util

EXPOSE 3000

# Copy resources.
COPY config/app_config.yml /cartodb/config/app_config.yml
COPY config/database.yml /cartodb/config/database.yml 
COPY util/* /cartodb/docker-entrypoint-util/
COPY docker-entrypoint.sh /cartodb/

# We configure the application using just the base config files here. Additional configuration files
# can be merged with the base by supplying their filenames as --app_config or --database option
# arguments in the CMD.
ENTRYPOINT [ \
  "./docker-entrypoint.sh" \
]
