module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      { pattern: '**/__tests__/**/loadTestpage.js', watched: true, included: true, served: true },
      { pattern: '**/__tests__/**/testpage.js', watched: true, included: false, served: true },
      { pattern: '**/__tests__/**/waitsForAndRuns.js', watched: true, included: true, served: true },
      { pattern: '**/__tests__/**/*.test.js', watched: true, included: true, served: true },
      { pattern: 'node_modules/simulate/simulate.js', watched: false, included: true, served: true },
      { pattern: 'dist/**/*', watched: true, included: false, served: true },
      { pattern: '**/__tests__/**/*!(.test)*', watched: true, included: false, served: true }
    ],

    exclude: [],

    preprocessors: {
      '**/__tests__/**/*.test.js': ['webpack']
    },

    webpack: {
      externals: [
        // For extensions we expose a "require" function that extension developers can use to
        // require in utilities that we specifically expose. This require function is custom
        // and provided by DTM. It is not intended to be interpreted by webpack, however webpack
        // doesn't know this and gets hung up on it because it can't find the module being required.
        // It would be great to just be able to tell webpack to ignore these particular references
        // to require but that's apparently not possible. Instead, this code makes it so that
        // each time webpack finds a require call that is:
        // 1. inside src/extensions
        // 2. outside any tests
        // 3. does not contain a period (in other words, doesn't have ./ or ../ like a
        //    normal require
        // it will create a mock module that just returns null instead of throwing an error
        // saying it can't find the referenced module on the file system.
        function(context, request, callback) {
          if (/^(?!.*__tests__$).*\/src\/extensions\/.*$/.test(context) &&
              request.indexOf('.') === -1) {
            callback(null, 'var null');
          } else {
            callback();
          }
        },
        {
          // So that modules can require('window') and then tests can mock it.
          window: 'window',
          document: 'document'
        }
      ],
      devtool: '#inline-source-map'
    },

    webpackServer: {
      stats: true,
      debug: false,
      progress: true,
      quiet: false
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    // Browsers passed in via gulp.
    //browsers: [
      //'Chrome',
      //'Firefox',
      //'Safari',
      //'IE9 - Win7',
      //'IE10 - Win7',
      //'IE11 - Win7'
    //],

    captureTimeout: 60000,

    // Necessary because of https://github.com/webpack/karma-webpack/issues/44
    autoWatchBatchDelay: 1000,

    singleRun: false,

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-safari-launcher'),
      require('karma-webpack'),
      require('karma-ievms')
    ]
  });
};
