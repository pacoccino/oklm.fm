'use strict';

const http = require('http');
http.globalAgent.maxSockets = Infinity;
const request = require('request');

const address = 'http://api.oklm.fm';
const nbRequest = 2500;
const nginxBadGatewayPageLength = 568;
const indexHtmlPageLength = 1388;
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
  
  if(!body || body.length !== indexHtmlPageLength || err){

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

    request.get({
      'url': address,
      'headers': {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
      }
    }, (err, res, body) => {

      if (isErr(err, body, i)) {

        console.log(Date.now(), `${err}, body: ${body}`);

      } else {

        logTimeReq(timeStartReq);

        if (i === nbRequest - 1) {

          logEnd();

        }

      }
      
      return true;
      
    });

  }

}

run();
