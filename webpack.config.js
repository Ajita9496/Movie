const path = require('path');

module.exports = {
  // ...other configuration options...

  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify')
    }
  },
  // ...other configuration options...
};
