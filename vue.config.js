const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
// const createThemeColorReplacerPlugin = require('./config/plugin.config')
function resolve (dir) {
  return path.join(__dirname, dir)
}

// check Git
function getGitHash () {
  try {
    return GitRevision.version()
  } catch (e) {}
  return 'unknown'
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// 根据自定义的变量来进行内容设置
let BASE_URL = '/'
switch (process.env.NODE_ENV) {
    case 'production':
        BASE_URL = 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/console/'
        break
    case 'staging':
        BASE_URL = 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/console/staging/'
        break
    case 'dev':
        BASE_URL = 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/console/dev/'
        break
    case 'private':
        BASE_URL = '/console/'
        break
    default:
        BASE_URL = '/'
}
// vue.config.js
const vueConfig = {
  publicPath: BASE_URL,
  outputDir: process.env.outputDir,
  filenameHashing: true,
  runtimeCompiler: true,
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      }),
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5,
        minChunkSize: 100
      })
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
    config.output.filename('[name].[hash].js').end()
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          'primary-color': '#FF525B',
          'link-color': '#FF525B',
          'border-radius-base': '3px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8080
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/oauth': {
    //     target: 'http://dev-api.winrobot360.com:8080/',
    //     ws: false,
    //     changeOrigin: true // 开启代理，是否跨域
    //     // pathRewrite: {
    //     //   '^/oauth': '' // 需要rewrite的
    //     // }
    //   }
    // }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  // vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
