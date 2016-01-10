OKLM.FM
===================

Web app pour écouter la radio pirate OKLM

----------


Requirements
-------------

* node v4.2.2+


Install
-------------

```sh
$ npm install
```


Nginx
-------------

Deploy local nginx configuration (site.conf, upstream.conf, nginx.conf):

```sh
$ npm run deploy-nginx-config
```

Resolve oklm.fm to localhost:

Add in end to ```/etc/hosts```:
 
```sh
127.0.0.1       api.oklm.fm
127.0.0.1       www.oklm.fm
```


Config
-------------

Configuration apply with this flow:

- Environnement variable: LOG_DIR, CRAWLER_PORT, PUBLIC_FOLDER, STATIC_PORT
- If environnement var not define, app use configuration files: ```config/config.json```
- Env conf and file conf are merged in app used file: ```server/config/config.js```


Running
-------------


I. Crawler

Polling player api to get music metadata and broadcast on (internal) websocket:

- Entry point: ```server/services/crawler.js```

```sh
$ npm run service-crawler:{{start/stop}}
```

*In distributed mode, only one crawler can (and need) to be run (see ```scripts/startCrawler.js```). 


II. Api

Listen crawler and expose public websocket api ( And in turfu ya forcément du REST ou bien un autre service juste rest)

- Entry point: ```server/services/api.js```

- Launch in distributed(Load balancing):

```sh
$ npm run service-api:{{start/stop}}
```

*By default 2 worker in distributed mode(see ```config/nginx/config.d/api.oklm.fm``` and ```scripts/startApi```). 


III. Static files:

Public http static file server:

- Entry point: ```server/services/static.js```

- Launch in distributed(Load balancing):

```sh
$ npm run service-static:{{start/stop}}
```

*By default 2 worker in distributed mode(see ```config/nginx/config.d/static.oklm.fm``` and ```scripts/startStatic```). 

 
###For start/stop all Services:

```sh
$ npm run services-{{start/stop}}
```


 
LOG
-------------

I. When you run app distributed:


```
                                                                                      |-----/forever.log  -> Main forever process all output
                                                                                      |
                                                                                      |-----/err.log -> Worker process stderr
                                                                                      |
                                                  |--{{Forever uuid worker}}----------|-----/out.log -> Worker porcess stdout
                                                  |                                   |
                                                  |                                   |-----/err-{{pid of worker}}.log -> App error
                                                  |                                   |
                                                  |                                   |-----/log-{{pid of worker}}.log -> App log
                                                  |                                   |
                                                  |                                   |-----/silly-{{pid of worker}}.log -> App silly log
                                                  |
                                                  |
config/log/{{Service  name}}/{{Timestamp process}}|
                                                  |                                
                                                  |                                       
                                                  |                                   |-----/forever.log  -> Main forever process all output
                                                  |                                   |
                                                  |                                   |-----/err.log -> Worker process stderr
                                                  |                                   |
                                                  |--{{Forever uuid worker}}----------|-----/out.log -> Worker porcess stdout
                                                                                      |
                                                                                      |-----/err-{{pid of worker}}.log -> App error
                                                                                      |
                                                                                      |-----/log-{{pid of worker}}.log -> App log
                                                                                      |
                                                                                      |-----/silly-{{pid of worker}}.log -> App silly log
```                                                                                    


II. When you run directly entry point:


```  
           |-----/err-{{pid of process}}.log -> App error
           |
config/Dev/|-----/log-{{pid of process}}.log -> App log
           |
           |-----/silly-{{pid of process}}.log -> App silly log
```  
 
 
III. For clean all logs:

```sh
$ npm run clean:logs
```
