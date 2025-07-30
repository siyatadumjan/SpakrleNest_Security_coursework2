const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add polyfills for Node.js core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "process": require.resolve("process/browser"),
        "buffer": require.resolve("buffer")
      };

      // Add plugins for polyfills
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ];

      return webpackConfig;
    },
  },
  devServer: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certificate/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './certificate/server.crt'))
    },
    host: 'localhost',
    port: 3000,
    allowedHosts: 'all'
  }
};
