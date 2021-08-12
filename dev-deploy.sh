#! /bin/bash

export NODE_ENV=dev
npm install
npm run dev

# 上传代码
ossutil cp ./dist/js/ oss://winrobot-pub-a/static/console/dev/js/ --include "*" -r -u
ossutil cp ./dist/img/ oss://winrobot-pub-a/static/console/dev/img/ --include "*" -r -u
ossutil cp ./dist/ oss://winrobot-pub-a/static/console/dev/ --include "*" -r -u
ossutil cp ./dist/favicon.ico oss://winrobot-pub-a/static/console/favicon.ico -u
ossutil cp ./dist/index.html oss://winrobot-pub-a/static/console/index-dev.html -u