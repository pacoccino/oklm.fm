var defaultConfig = require('../config.json');

var Config = {
    radioId: defaultConfig.radioId,
    apiUrl: defaultConfig.apiUrl,
    messages: defaultConfig.messages,
    crawlInterval:defaultConfig.crawlInterval,
    publicFolder: process.env.PUBLIC_FOLDER || defaultConfig.publicFolder,
    workerUrl: process.env.WORKER_URL || defaultConfig.workerUrl,
    workerPort: process.env.WORKER_PORT || defaultConfig.workerPort,
    webHost: process.env.WEB_HOST || defaultConfig.webHost,
    webPort: process.env.WEB_PORT || defaultConfig.webPort,
    logDir: process.env.LOG_DIR || defaultConfig.logDir
};

module.exports = Config;