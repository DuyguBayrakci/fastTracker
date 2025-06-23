const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Web için resolver ayarları
config.resolver.alias = {
  'react-native': 'react-native-web',
};

// Web için platformlar ekle
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

module.exports = config;
