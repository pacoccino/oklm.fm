#!/usr/bin/env bash
now=$(date +%Y'-'%m'-'%d'-'%H':'%M':'%S)
mkdir -p log/Worker/$now && 
NODE_ENV=production forever -o log/Worker/${now}/out.log -e log/Worker/${now}/err.log  --minUptime 500 --spinSleepTime 500 start server/worker.js
