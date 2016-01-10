'use strict';

const http = require('http');
http.globalAgent.maxSockets = Infinity;
var socketioClient = require('socket.io-client');


var connectionConfig = {
  reconnection: true,
  reconnectionAttempts: 10,
  timeout: 10000
};

const address = 'http://oklm.fm';
const nbRequest = 3500;
const globalTime = Date.now();

let errReq = 0;
let firstErr = 0;
let allReqTimes = [];

function logEnd() {

  const totalReqTime = Date.now() - globalTime;

  const sumReqTimes = allReqTimes.reduce( (total, val) => {
    return total + val;
  });

  const avgReqTime = Math.round(sumReqTimes / allReqTimes.length);

  const orderReqTimes = allReqTimes.sort( (a, b) => {
    return a - b;
  });

  const medianReqTimes = orderReqTimes[Math.round((orderReqTimes.length - 1) / 2)];

  setTimeout( () => {
    console.log(`
      Nb Req: ${nbRequest},
      TotalTime: ${totalReqTime}ms,
      AverageReqTime: ${avgReqTime}ms,
      MedianTime: ${medianReqTimes}ms,
      MaxTime: ${orderReqTimes[orderReqTimes.length -1]},
      MinTime: ${orderReqTimes[0]}
    `)
  }, 200);

  if (errReq !== 0) {

    console.log(`err: ${errReq}, first on ${firstErr} req`);

  }
}

function isErr(err, body, i) {

  if(!body || body.length !==  nginxBadGatewayPageLength || err){

    if(errReq === 0){

      firstErr = i;

    }

    errReq ++;
    return true;

  } else {

    return false;

  }

}

function logTimeReq(timeStartReq) {

  let timeResponse = Date.now() - timeStartReq;

  allReqTimes.push(timeResponse);
}


function run() {

  for (let i = 0; i < nbRequest; i++) {

    let timeStartReq = Date.now();
    
    const serverSocket = socketioClient(address, connectionConfig);

    serverSocket.on('connect', () => {

      logTimeReq(timeStartReq);

      if (i === nbRequest - 1) {
        serverSocket.removeAllListeners("disconnect");
        serverSocket.removeAllListeners("connect_error");
        serverSocket.disconnect();
        
        logEnd();
      }
    });
    
    serverSocket.on('disconnect', (err) => {
      if(errReq === 0){

        firstErr = i;

      }

      errReq ++;
      console.log(Date.now(), `Disconnect: ${err}`);
      serverSocket.disconnect();

    });
    
    serverSocket.on('connect_error', (err) => {
      if(errReq === 0){

        firstErr = i;

      }

      errReq ++;
      console.log(Date.now(), `Connection error: ${err}`);
      serverSocket.disconnect();
      
    });

  }

}

run();
