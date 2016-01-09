#!/usr/bin/env bash

now=$(date +%Y'-'%m'-'%d'-'%H':'%M':'%S)
uuidWeb1=$(cat /proc/sys/kernel/random/uuid)
uuidWeb2=$(cat /proc/sys/kernel/random/uuid)

mkdir -p log/Webs/${now} && 
NODE_ENV=production WEB_PORT=4000 forever -o log/Webs/${now}/out_${uuidWeb1}.log -e log/Webs/${now}/err_${uuidWeb1}.log  --minUptime 500 --spinSleepTime 500 start server/web.js &&
NODE_ENV=production WEB_PORT=5000 forever -o log/Webs/${now}/out_${uuidWeb2}.log -e log/Webs/${now}/err_${uuidWeb2}.log  --minUptime 500 --spinSleepTime 500 start server/web.js
