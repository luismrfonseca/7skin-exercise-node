const loggerManager = require('./logger.manager');
require('dotenv').config();

const getConfigurationFromFile = (configuration = {}) => {
  return Promise.resolve(Object.assign(configuration, require('../../config/config.json')));
};

module.exports = {
  getConfiguration: async () => {
    loggerManager.getLogger().debug('[ConfigurationManager] getConfiguration');

    return await getConfigurationFromFile()
      .then(config => {
        if (process.env.NODE_ENV === 'development') {
          // In order to work without https
          config.session = config.session || {};
          config.session.cookie = config.session.cookie || {};
          config.session.cookie.secure = false;
        }

        config.api.url = process.env.BASE_URL_API || config.api.url;
        config.web.url = process.env.BASE_URL_WEB || config.web.url;

        config.mysql.password = process.env.DATABASE_PWD;

        if (process.env.NODE_ENV === 'test') {
          config.mysql = {};
          config.mysql.host = 'localhost';
          config.mysql.port = 3306;
          config.mysql.user = 'root';
          config.mysql.database = 'database002';
        }

        config.authtication = {
          // secrectKey: require('crypto').randomBytes(64).toString('hex'),
          secrectKey: process.env.SECRECTKEY,
        };

        return config;
      });
  },
};
