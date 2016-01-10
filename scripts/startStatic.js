'use strict';

const mkdirp = require('mkdirp');
const path = require('path');
const forever = require('forever');

const staticWorkers = [
  {
    'port': 5100
  },
  {
    'port': 5101
  }
];


const staticEntryPoint = path.resolve( __dirname, '../server/services/static.js');

staticWorkers.forEach( (staticWorker) => {
  
  const nowString = new Date().toISOString().slice(0, 19);
  const foreverUUID = Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 );
  const logDir = path.resolve( __dirname, `../log/Static/${nowString}/${foreverUUID}`);

  mkdirp(logDir, (err) => {
    
    console.info(`Log directory created at ${logDir}`);

    if (err) throw Error(err);

     forever.startDaemon(staticEntryPoint, {
      'logFile': `${logDir}/forever.log`,   // Path to log output from forever process (when daemonized)
      'outFile': `${logDir}/out.log`,       // Path to log output from child stdout
      'errFile': `${logDir}/err.log`,       // Path to log output from child stderr
      'minUptime': 1000,                    // Minimum time a child process has to be up. Forever will 'exit' otherwise.
      'spinSleepTime': 2000,                // Interval between restarts if a child is spinning (i.e. alive < minUptime).
      'env': {                              // Environement variable send to child process
        'NODE_ENV': 'production',
        'LOG_DIR': logDir,
        'STATIC_PORT': staticWorker.port,
        'PUBLIC_FOLDER': path.resolve( __dirname, '../app')
      },
      'uid': foreverUUID                    // Forever UUID
    });
    
    return console.info(`Static daemon running foreverUUID: ${foreverUUID}`);

  });

});
