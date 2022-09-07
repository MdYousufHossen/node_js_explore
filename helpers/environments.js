const environments = {};

environments.staging = {
    port: 8000,
    envName: 'staging',
    secretKey: 'fkdjfkdjfkdjfkdjfkdj',
};
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'oeroeiroeiroeiroeirfk',
};

const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport =
    typeof environments[currentEnv] === 'object' ? environments[currentEnv] : environments.staging;

module.exports = environmentToExport;
