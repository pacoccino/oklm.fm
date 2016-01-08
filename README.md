OKLM.FM
===================

Web app pour écouter la radio pirate OKLM

----------


Requirements
-------------
* grunt
* node v5.x.x+

Install
-------------

```sh
$ npm install
$ grunt build
```


Config
-------------

Configuration (ports, etc) takes place in server/config.json

Running
-------------
For all-in-one server, run:
```sh
$ node server/server.js
```

For separated worker and web servers, run :
```sh
$ node server/worker.js
$ node server/web.js
```
In distributed mode, only one worker can (and need) to be run. For launching multiple web server you must specify the listening port in environment variable WEB_PORT