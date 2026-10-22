# myexpoapp
my first expo app

## First launch

The app shows a branded splash screen followed by three swipeable onboarding
screens. Onboarding completion is saved locally, so it is shown only once per
installation. After onboarding, users can create an account or sign in.

## Supabase authentication

The app uses Supabase email/password authentication. In your Supabase project,
enable Email under Authentication providers. Copy `.env.example` to `.env` and
set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from the
project's API settings. These values are bundled into the app and are not
secrets; never put a database password or service-role key in an
`EXPO_PUBLIC_` variable.

Start local development with:

```sh
npm start
```

If email confirmation is enabled in Supabase, new users need to confirm their
email before signing in.

## EAS builds

The EAS build profiles provide separate development, preview, and production
builds. Initialize/link the project with `eas init`, then create the
`development`, `preview`, and `production` EAS environments if needed. Set
`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in each
environment.

```sh
eas build --profile development
eas build --profile preview
eas build --profile production
```

Development builds require launching Metro with
`npx expo start --dev-client`. Before the first store submission, configure the
app's unique iOS bundle identifier and Android package name.
