'use strict';

const request = require('request');

const nbRequest = 550;
let time = Date.now();
let errReq = 0;
let firstErr = 0;

for(let i = 0; i < nbRequest; i++){

  request.get('http://www.oklm.fm', (err, res, body) => {
    
    if(!body || body.length !== 3587){
      if(errReq === 0){
        firstErr = i;
      }
      errReq ++;
      console.log(Date.now(), err);
      
    }
    
    
    if(i === nbRequest -1){
      
      console.log(`Time: ${Date.now() - time}ms, nbReq err: ${errReq}, first on ${firstErr} req`, 'time');
      
    }
    
  });
  
}
