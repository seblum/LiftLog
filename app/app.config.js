/** @param {{ config: import('expo/config').ExpoConfig }} options */
function configureApp({ config }) {
  if (process.env.LIFTLOG_PERSONAL_BUILD !== '1') return config;

  return {
    ...config,
    name: 'LiftLog Sync',
    slug: 'liftlog-sync',
    scheme: 'liftlog-sync',
    android: {
      ...config.android,
      package: 'com.seblum.liftlog',
      // A personal build cannot verify the official app's website association.
      intentFilters: config.android?.intentFilters?.filter((filter) => !filter.autoVerify),
    },
  };
}

module.exports = configureApp;
