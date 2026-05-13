import { resolveAppBootstrapBaseUrl } from './index'

describe('app bootstrap service', () => {
  it('uses the app backend origin instead of the /api/v1 base path', () => {
    expect(resolveAppBootstrapBaseUrl('https://course.taotaoxi.net/api/v1', 'https://course.taotaoxi.net')).toBe(
      'https://course.taotaoxi.net',
    )
  })

  it('resolves relative app backend base paths against the current origin', () => {
    expect(resolveAppBootstrapBaseUrl('/api/v1', 'https://course.taotaoxi.net')).toBe('https://course.taotaoxi.net')
  })

  it('falls back to the current origin when the app backend base URL is not configured', () => {
    expect(resolveAppBootstrapBaseUrl(undefined, 'https://course.taotaoxi.net')).toBe('https://course.taotaoxi.net')
  })
})
