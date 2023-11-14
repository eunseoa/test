const { configure } = require('quasar/wrappers');
const path = require('path');

module.exports = configure(function (/* ctx */) {
  return {

    boot: [
      'i18n',
      'axios',
    ],

        css: [
      'app.css'
    ],

        extras: [
            'fontawesome-v6',

      'roboto-font',
      'material-icons',
    ],

        build: {
      target: {
        browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
        node: 'node16'
      },

      vueRouterMode: 'history',

      vitePlugins: [
        ['@intlify/vite-plugin-vue-i18n', {
                    include: path.resolve(__dirname, './src/i18n/**')
        }]
      ]
    },

    devServer: {
      proxy: {
        '/api': {
          target: 'http://192.168.10.48:7070',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    },

    framework: {
      config: {},

            plugins: [
        'AppFullscreen',
        'LocalStorage',
        'Notify',
        'Dialog',
        'date'
      ]
    },

        animations: [],

        ssr: {

      pwa: false,

      prodPort: 3000,

      middlewares: [
        'render'
      ]
    },

        pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
          },

        cordova: {
          },

        capacitor: {
      hideSplashscreen: true
    },

        electron: {

      inspectPort: 5858,

      bundler: 'packager',

      packager: {

      },

      builder: {

        appId: 'quasar-admin2'
      }
    },

    bex: {
      contentScripts: [
        'my-content-script'
      ],

    }
}
});
