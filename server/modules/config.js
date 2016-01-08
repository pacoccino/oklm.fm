var defaultConfig = require('../config.json');

var Config = {
    radioId: defaultConfig.radioId,
    apiUrl: defaultConfig.apiUrl,
    messages: defaultConfig.messages,
    crawlInterval:defaultConfig.crawlInterval,
    publicFolder: process.env.PUBLIC_FOLDER || defaultConfig.publicFolder,
    workerUrl: process.env.WORKER_URL || defaultConfig.workerUrl,
    workerPort: process.env.WORKER_PORT || defaultConfig.workerPort,
    webUrl: process.env.WEB_URL || defaultConfig.webUrl,
    webPort: process.env.WEB_PORT || defaultConfig.webPort
};

module.exports = Config;