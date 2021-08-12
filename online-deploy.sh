#! /bin/bash

# 编译代码
export NODE_ENV=production
npm install
npm run online

# 上传代码
ossutil cp ./dist/css/ oss://winrobot-pub-a/static/console/css/ --include "*" -r -u
ossutil cp ./dist/fonts/ oss://winrobot-pub-a/static/console/fonts/ --include "*" -r -u
ossutil cp ./dist/img/ oss://winrobot-pub-a/static/console/img/ --include "*" -r -u
ossutil cp ./dist/js/ oss://winrobot-pub-a/static/console/js/ --include "*" -r -u
ossutil cp ./dist/ oss://winrobot-pub-a/static/console/ --include "*" -r -u
ossutil cp ./dist/favicon.ico oss://winrobot-pub-a/static/console/favicon.ico -u
ossutil cp ./dist/index.html oss://winrobot-pub-a/static/console/index.html -u