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
    slug: config.slug ?? 'myexpoapp-expo-starter',
    name: `${config.name ?? 'myexpoapp-expo-starter'}${environmentSuffix}`,
    extra: {
      ...config.extra,
      appEnv,
    },
  };
};
