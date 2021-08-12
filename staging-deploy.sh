#! /bin/bash

# 编译代码
export NODE_ENV=staging
npm install
npm run staging

# 上传代码
ossutil cp ./dist/js/ oss://winrobot-pub-a/static/console/staging/js/ --include "*" -r -u
ossutil cp ./dist/img/ oss://winrobot-pub-a/static/console/staging/img/ --include "*" -r -u
ossutil cp ./dist/ oss://winrobot-pub-a/static/console/staging/ --include "*" -r -u
ossutil cp ./dist/favicon.ico oss://winrobot-pub-a/static/console/favicon.ico -u
ossutil cp ./dist/index.html oss://winrobot-pub-a/static/console/index-staging.html -u