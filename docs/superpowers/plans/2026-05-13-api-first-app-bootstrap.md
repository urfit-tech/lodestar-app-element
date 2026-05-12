# API-First App Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `AppProvider` render from `/api/v3/bootstrap` first, then refresh from authenticated Hasura `GET_APP` when a token is available.

**Architecture:** Add a small React-independent bootstrap API service, then update `AppProvider` source selection so public API data is usable before auth and retained during authenticated Hasura refresh. Hasura remains the preferred source after it succeeds.

**Tech Stack:** React 17, Apollo Client `useQuery`, Axios-based shared HTTP clients, Jest/react-scripts tests.

---

### Task 1: Bootstrap Service

**Files:**
- Create: `src/services/bootstrap/index.ts`
- Test through `src/contexts/AppContext.test.tsx` mocks.

- [ ] **Step 1: Create the service**

```ts
import { AppProps } from '../../types/app'
import { createAppBackendClient } from '../http'

export type AppBootstrapPayload = AppProps

export const fetchAppBootstrap = (appId: string) =>
  createAppBackendClient().get<AppBootstrapPayload>('/api/v3/bootstrap', {
    params: { appId },
  })
```

- [ ] **Step 2: Verify TypeScript imports resolve**

Run: `npm test -- --runTestsByPath src/contexts/AppContext.test.tsx --watchAll=false`

Expected before provider changes: tests may fail only because `AppProvider` does not call the new service yet, not because the new service has syntax errors.

### Task 2: AppProvider API-First State

**Files:**
- Modify: `src/contexts/AppContext.tsx`
- Modify: `src/contexts/AppContext.test.tsx`

- [ ] **Step 1: Add tests**

Add tests that mock `fetchAppBootstrap`, `useQuery`, and `useAuth` so they prove:

```ts
expect(mockUseQuery.mock.calls[0][1]).toMatchObject({ skip: true })
expect(mockFetchAppBootstrap).toHaveBeenCalledWith('demo-app')
expect(latestSnapshot).toMatchObject({ id: 'demo-app', loading: false })
```

Then simulate authenticated Hasura loading:

```ts
mockAuthToken = 'auth-token'
mockUseQuery.mockReturnValue({ data: undefined, loading: true, refetch: mockRefetch })
```

Expected snapshot keeps API data:

```ts
expect(latestSnapshot).toMatchObject({ id: 'demo-app', loading: false })
```

Then simulate Hasura success:

```ts
mockUseQuery.mockReturnValue({ data: hasuraAppData, loading: false, refetch: mockRefetch })
expect(latestSnapshot.settings.title).toBe('Hasura title')
```

- [ ] **Step 2: Run failing tests**

Run: `npm test -- --runTestsByPath src/contexts/AppContext.test.tsx --watchAll=false`

Expected: fail because `fetchAppBootstrap` is not wired into `AppProvider` and `GET_APP` is not skipped before auth.

- [ ] **Step 3: Implement provider behavior**

In `AppContext.tsx`:

```ts
const { authToken, refreshToken } = useAuth()
const [bootstrapApp, setBootstrapApp] = useState<AppContextProps | null>(null)
const [bootstrapLoading, setBootstrapLoading] = useState(true)
const [bootstrapError, setBootstrapError] = useState<Error | undefined>()
```

Fetch API data in an effect:

```ts
useEffect(() => {
  let cancelled = false
  setBootstrapLoading(true)
  setBootstrapError(undefined)
  fetchAppBootstrap(appId)
    .then(app => {
      if (cancelled) return
      setBootstrapApp({ ...app, loading: false })
    })
    .catch(error => {
      if (cancelled) return
      setBootstrapError(error instanceof Error ? error : new Error(String(error)))
    })
    .finally(() => {
      if (!cancelled) setBootstrapLoading(false)
    })
  return () => {
    cancelled = true
  }
}, [appId])
```

Skip anonymous Hasura:

```ts
{
  variables: { appId },
  context: { important: true },
  skip: !authToken,
}
```

Choose context data in this order:

```ts
const usableApp = hasuraApp.id ? hasuraApp : bootstrapApp || defaultAppContextProps
const appContextValue =
  !hasuraApp.id && loading && lastLoadedAppRef.current?.id === appId
    ? { ...lastLoadedAppRef.current, loading: false, error, refetch }
    : usableApp.id
    ? { ...usableApp, loading: false, error: error || bootstrapError, refetch }
    : { ...defaultAppContextProps, loading: bootstrapLoading || loading, error: error || bootstrapError, refetch }
```

- [ ] **Step 4: Run focused tests**

Run: `npm test -- --runTestsByPath src/contexts/AppContext.test.tsx --watchAll=false`

Expected: pass.

### Task 3: Verification And Commit

**Files:**
- Verify: `src/contexts/AppContext.tsx`
- Verify: `src/services/bootstrap/index.ts`
- Verify: `src/contexts/AppContext.test.tsx`

- [ ] **Step 1: Search for forbidden query fields**

Run: `rg -n "app_secrets|skip: !authToken|/api/v3/bootstrap" src/contexts/AppContext.tsx src/services/bootstrap/index.ts`

Expected:

```text
src/contexts/AppContext.tsx:... skip: !authToken
src/services/bootstrap/index.ts:... /api/v3/bootstrap
```

No `app_secrets` match in `src/contexts/AppContext.tsx`.

- [ ] **Step 2: Check git diff**

Run: `git diff -- src/contexts/AppContext.tsx src/contexts/AppContext.test.tsx src/services/bootstrap/index.ts`

Expected: changes match this plan and do not touch unrelated files.

- [ ] **Step 3: Commit**

```bash
git add src/contexts/AppContext.tsx src/contexts/AppContext.test.tsx src/services/bootstrap/index.ts docs/superpowers/plans/2026-05-13-api-first-app-bootstrap.md
git commit -m "feat: load app bootstrap from cached API"
```
