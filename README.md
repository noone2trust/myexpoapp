# myexpoapp
my first expo app

## Environments

The EAS build profiles provide separate development, preview, and production
builds. Development builds use a development client, preview builds are
installable internally, and production builds are configured for store
distribution.

### Local development

Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_API_URL` to your
development API URL. Then run:

```sh
npm start
```

Expo defaults to the development app environment when `APP_ENV` is not set.
The local `.env.local` file is ignored by Git.

### EAS builds

Initialize/link the project with `eas init`, then create the `development`,
`preview`, and `production` EAS environments if they do not already exist.
Set `EXPO_PUBLIC_API_URL` separately in each environment. Values prefixed with
`EXPO_PUBLIC_` are included in the client app and must not contain secrets.

Build any profile with the EAS CLI:

```sh
eas build --profile development
eas build --profile preview
eas build --profile production
```

Development builds require launching Metro with `npx expo start --dev-client`.
Before the first store submission, configure the app's unique iOS bundle
identifier and Android package name.
