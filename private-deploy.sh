#! /bin/bash

# 编译代码
cp -f src/router/index.js src/router/index-online.js
cp -f src/router/index-private.js src/router/index.js

npm run private

cd dist
rm -rf /Users/njwander/code/private/xybot-private-docker/entry-nginx/html/console/*
cp -R * /Users/njwander/code/private/xybot-private-docker/entry-nginx/html/console/
cd ..


cp -f src/router/index-online.js src/router/index.js
rm -f src/router/index-online.js