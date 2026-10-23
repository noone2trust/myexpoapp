import { ExpoConfig, ConfigContext } from 'expo/config';

const appEnvironments = ['development', 'preview', 'production'] as const;

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV ?? 'development';

  if (!appEnvironments.some((environment) => environment === appEnv)) {
    throw new Error(
      `Invalid APP_ENV "${appEnv}". Expected development, preview, or production.`,
    );
  }

  const environmentSuffix =
    appEnv === 'development'
      ? ' (Development)'
      : appEnv === 'preview'
        ? ' (Preview)'
        : '';

  return {
    ...config,
    icon: './assets/images/logo.png',
    slug: config.slug ?? 'myexpoapp-expo-starter',
    name: `${config.name ?? 'myexpoapp-expo-starter'}${environmentSuffix}`,
    android: {
      ...config.android,
      package: config.android?.package ?? 'com.brillprime',
    },
    ios: {
      ...config.ios,
      bundleIdentifier: config.ios?.bundleIdentifier ?? 'com.brillprime',
    },
    plugins: [
      ...(config.plugins ?? []),
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/logo.png',
          imageWidth: 120,
          resizeMode: 'contain',
          backgroundColor: '#f8fafc',
        },
      ],
    ],
    extra: {
      ...config.extra,
      appEnv,
    },
  };
};
