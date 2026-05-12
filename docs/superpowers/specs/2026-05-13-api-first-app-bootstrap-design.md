# API-First App Bootstrap Design

## Goal

Use the Redis-backed app bootstrap API for the first public AppContext snapshot, then refresh with the authenticated Hasura `GET_APP` query after an auth token is available without returning the app to an empty loading state.

## Scope

This spec covers `/Users/eddy/urfit/lodestar-app-element`.

The frontend will call the existing `lodestar-app-bootstrap` stage/public routes:

- `GET /api/v3/bootstrap?appId={appId}`
- `GET /api/v3/bootstrap/language?appId={appId}&locale={locale}` is owned by `/Users/eddy/urfit/lodestar-app` and is not implemented in this element-only change.

The backend source of truth is `/Users/eddy/urfit/lodestar-app-bootstrap`. Its current registered and deployed public route is `/api/v3/bootstrap`, not `/api/v3/app-bootstrap`.

## Architecture

`AppProvider` should use two sources:

1. Public bootstrap API snapshot for first usable data.
2. Authenticated Hasura `GET_APP` refresh after `authToken` exists.

Data priority is:

`default empty` -> `public API snapshot` -> `authenticated Hasura snapshot`.

The API response already matches the current AppContext output shape, with anonymous-safe `settings`, `navs`, `enabledModules`, and `currencies`. The existing Hasura mapper remains the authoritative mapper for authenticated refresh data.

## Provider Behavior

When `AppProvider` mounts:

- It starts a public API bootstrap request for `appId`.
- It skips `GET_APP` while `authToken` is absent.
- It still calls `refreshToken()` while `authToken` is absent, preserving the existing auth bootstrap flow.
- If API data arrives first, the context exposes that data and `loading: false`.
- If `authToken` later appears, `GET_APP` runs in the background.
- During authenticated Hasura loading, the context keeps the API snapshot or last loaded Hasura snapshot instead of reverting to default empty values.
- If Hasura succeeds, the context switches to Hasura-derived data.
- If Hasura fails after API data exists, the context keeps the API data and exposes the Hasura error without making the app empty.

If API fails before any usable data exists:

- Anonymous users remain in an error/loading state instead of reading Hasura as anonymous.
- Authenticated users may still get data from the authenticated Hasura query once `authToken` exists.

## Components

Create a small bootstrap service module under `src/services/bootstrap/`:

- `fetchAppBootstrap(appId)` calls the shared app backend client with `/api/v3/bootstrap`.
- The service returns the JSON AppContext shape and does not know about React.

Update `src/contexts/AppContext.tsx`:

- Keep the `GET_APP` query and its mapper.
- Add a public API bootstrap state.
- Set `skip: !authToken` on `GET_APP`.
- Merge source selection into one AppContext value.
- Keep the current last-loaded-data behavior and broaden it to include API bootstrap data.

## Testing

Add or update tests for `AppProvider`:

- It skips `GET_APP` before an auth token exists and calls the bootstrap API.
- It exposes API data as the first non-loading context value.
- It runs `GET_APP` after an auth token exists.
- It keeps the API snapshot while authenticated `GET_APP` is loading.
- It switches to Hasura data after authenticated `GET_APP` succeeds.
- It does not request `app_secrets` in `GET_APP`.

Run the element repo focused tests after implementation.

## Non-Goals

- Do not change `lodestar-app-bootstrap` routes.
- Do not implement `LocaleProvider` language API fetch in this repo.
- Do not seed Apollo cache from API data.
- Do not reintroduce `app_secrets` into the frontend `GET_APP` query.
