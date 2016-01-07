var defaultConfig = require('../config.json');

var Config = {
    port: process.env.PORT || defaultConfig.port,
    radioId: defaultConfig.radioId,
    apiUrl: defaultConfig.apiUrl,
    messages: defaultConfig.messages,
    crawlInterval:defaultConfig.crawlInterval,
    publicFolder: process.env.PUBLIC_FOLDER || defaultConfig.publicFolder,
    workerUrl: process.env.WORKER_URL || defaultConfig.workerUrl,
    workerPort: process.env.WORKER_PORT || defaultConfig.workerPort
};

module.exports = Config;