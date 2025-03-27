// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add optimizations to reduce file watching load
config.watchFolders = [__dirname]; // Only watch the project directory
config.resolver.nodeModulesPaths = [__dirname + '/node_modules']; // Specify node_modules location
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles']; // Optimize asset handling

// Use Node's fs.watch instead of watchman if available
config.watcher = {
  useWatchman: false, // Try not using watchman
  healthCheck: {
    enabled: false, // Disable health check to reduce overhead
  },
};

// Add support for hermes
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
