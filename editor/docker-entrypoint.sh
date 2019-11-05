#!/bin/bash

# login credentials for cartodb user that will be created
DEFAULT_USER=${DEFAULT_USER:-username}
PASSWORD=${PASSWORD:-password}
EMAIL=${EMAIL:-username@example.com}

# host and port on which the app will be exposed
PUBLIC_HOST=${PUBLIC_HOST:-localhost}
PUBLIC_PORT=${PUBLIC_PORT:-80}
PUBLIC_PROTOCOL=${PUBLIC_PROTOCOL:-http}

echo "Writing the configuration files..."
DEFAULT_USER=$DEFAULT_USER \
  PUBLIC_HOST=$PUBLIC_HOST \
  PUBLIC_PORT=$PUBLIC_PORT \
  PUBLIC_PROTOCOL=$PUBLIC_PROTOCOL \
  node docker-entrypoint-util/configure $@

if (( $START_RESQUE_ONLY == 0 )); then
  echo "Initializing the metadata database..."
  bundle exec rake db:create
  bundle exec rake db:migrate

  echo "Creating the default user, who will own the common data..."
  bundle exec  rake cartodb:db:create_user --trace SUBDOMAIN="$DEFAULT_USER" \
    PASSWORD="$PASSWORD" ADMIN_PASSWORD="$PASSWORD" \
    EMAIL="$EMAIL"

  bundle exec script/restore_redis
  bundle exec script/resque > resque.log 2>&1 &
  #script/sync_tables_trigger.sh &

  # Recreate api keys in db and redis, so sql api is authenticated
  # echo 'delete from api_keys' | PGPASSWORD='tea' psql -U postgres -t carto_db_development -h db
  # bundle exec rake carto:api_key:create_default

  # bundle exec rake carto:api_key:create_default
  bundle exec thin start --threaded -p 3000 --threadpool-size 5
else
  echo "Starting Resque..."
  exec bundle exec ./script/resque
fi

