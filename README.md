# Dopamax

A minimal to-do app for iOS and Android. You add tasks, check them off, and watch a progress bar and completed-task counter fill up, with optional daily and weekly reminder notifications. Tasks are stored on the device in SQLite; there is no account or server.

The repo also contains the app's companion website in `webapp/` (landing, support, and privacy pages), deployed at https://dopamax-admin.vercel.app.

## Features

- Add, edit, complete, and delete tasks, with a confirmation step before deleting.
- Progress bar for completed versus total tasks, plus a running count of completed tasks.
- Hide or show completed tasks.
- Local reminders through `expo-notifications`: a daily 9:00 AM nudge and a Monday 6:00 PM weekly reminder, toggled from the header.
- Offline storage in a local SQLite database (`dopamax.db`).

## Tech stack

- Mobile: Expo SDK 53, React Native 0.79, React 19, TypeScript, `expo-sqlite`, `expo-notifications`
- Website (`webapp/`): Next.js 14, React 18, TypeScript, Vercel Analytics
- Builds: EAS (`eas.json`)

## Getting started

Prerequisites: Node 20 (used in CI) and npm. Running on a simulator or device needs Xcode (iOS) or Android Studio (Android). No environment variables are required for either the app or the website.

Mobile app:

```bash
npm install
npm start          # expo start
npm run ios        # expo run:ios, builds the native iOS project in ios/
npm run android    # expo run:android
```

Note: `app.json` points the `expo-notifications` plugin at `assets/notification-icon.png`, which is not in the repo. Add that file before running a prebuild (for example the first `npm run android`, which generates the `android/` project).

Website:

```bash
cd webapp
npm install
npm run dev        # http://localhost:3000
```

There are no tests. CI (`.github/workflows/ci.yml`) runs `npx tsc --noEmit` at the root and `npm run build` in `webapp/`; run both before opening a PR.

## How it works

- `index.ts` registers `App.tsx`, which contains the whole UI and state in one component: task list, add and edit inputs, delete modal, progress bar, and notification scheduling.
- `database.ts` wraps `expo-sqlite` with a single `tasks` table (`id`, `title`, `score`, `completed`, `createdAt`) and CRUD helpers. `App.tsx` updates React state first and shows a warning if the database write fails.
- `ios/` is the generated native iOS project. `app.json` holds the bundle identifiers and Expo plugin config.
- `generate_icons.js` (uses the `canvas` package) and `create_icon.html` were used to produce the icons in `assets/`.
- `webapp/` is a separate Next.js app with its own `package.json`: `app/page.tsx` (landing), `app/support/page.tsx`, and `app/privacy/page.tsx`. `PRIVACY_POLICY.md` at the root is the same policy in Markdown.

## Project structure

```
App.tsx            app UI and state
database.ts        SQLite access
index.ts           Expo entry point
app.json, eas.json Expo and EAS config
assets/            app icons and splash image
ios/               native iOS project
webapp/            Next.js website (landing, support, privacy)
```

## Contributing

Issues and pull requests are welcome. Before opening a PR, run `npx tsc --noEmit` at the repo root and `npm run build` in `webapp/`.

## License

MIT, see [LICENSE](LICENSE).
