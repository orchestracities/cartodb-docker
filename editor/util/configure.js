const fs = require('fs');

const yaml = require('js-yaml');
const yargs = require('yargs');

const CONFIG_DIR = '/cartodb/config';
const APP_CONFIG_FILE = CONFIG_DIR + '/app_config.yml';
const DB_CONFIG_FILE = CONFIG_DIR + '/database.yml';

const {
  public_host,
  public_port
} = yargs
  .usage('Usage: $0 [OPTIONS]')
  .describe('h', 'hostname on which the app will be exposed')
  .alias('h', 'public_host')
  .describe('p', 'port on which the app will be exposed')
  .alias('p', 'public_port')
  .argv;

const PUBLIC_HOST = public_host || process.env.PUBLIC_HOST || 'localhost';
const PUBLIC_PORT = public_port || process.env.PUBLIC_PORT || '80';
const PUBLIC_PROTOCOL = process.env.PUBLIC_PROTOCOL || 'http';

// These next two values are used to build URLs for the browser. If we're using the default port,
// 80, we don't want to include it. If we're using a port besides the default, we MUST include it,
// or the URL won't work.
const PUBLIC_URL = (
  PUBLIC_PORT == '80'
  ? PUBLIC_HOST
  : `${PUBLIC_HOST}:${PUBLIC_PORT}`
);
const PORT_IF_NOT_DEFAULT = (
  PUBLIC_PORT == '80'
  ? null
  : PUBLIC_PORT
);

const DEFAULT_USER = process.env.DEFAULT_USER || 'username';

const configEnv = {
  PUBLIC_PROTOCOL,
  PUBLIC_HOST,
  PUBLIC_PORT,
  PUBLIC_URL,
  PORT_IF_NOT_DEFAULT,
  DEFAULT_USER,
};

envsubst(APP_CONFIG_FILE, configEnv);

// Modify specified file in place, substituting variables in the key-value mapping object `env`.
// This works in the manner of shell variable substitution, using the forms $VAR and ${VAR}.
function envsubst(filename, env) {
  const content = fs.readFileSync(filename, 'utf8');
  const output = Object.keys(env).reduce((acc, key) => {
    const regex = new RegExp('(?:\\$\\{' + key + '\\}|\\$' + key + ')', 'g');
    return acc.replace(regex, env[key]);
  }, content);
  fs.writeFileSync(filename, output);
}
