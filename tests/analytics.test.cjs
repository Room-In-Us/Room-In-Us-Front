const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const ts = require('typescript');

const analyticsModule = { exports: {} };
const analyticsSource = readFileSync(require.resolve('../src/shared/utils/analytics.ts'), 'utf8');
const { outputText } = ts.transpileModule(analyticsSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
new Function('exports', outputText)(analyticsModule.exports);

test('analytics sends only sanitized search terms and distinguishes zero results', (context) => {
  const window = { dataLayer: [], location: { pathname: '/search' } };
  globalThis.window = window;
  context.after(() => { delete globalThis.window; });
  const { trackSearch } = analyticsModule.exports;

  trackSearch('   ', 0);
  trackSearch('  mystery tester@example.com 010-1234-5678  ', 0);
  trackSearch('mystery', 2);

  assert.deepEqual(window.dataLayer, [
    { event: 'search_submit', source_page: '/search', search_term: 'mystery [email] [phone]', result_count: 0 },
    { event: 'search_no_result', source_page: '/search', search_term: 'mystery [email] [phone]' },
    { event: 'search_submit', source_page: '/search', search_term: 'mystery', result_count: 2 },
  ]);
});

test('preference analytics preserves counts, shares genre codes and excludes free text', (context) => {
  const window = { dataLayer: [], location: { pathname: '/survey' } };
  globalThis.window = window;
  context.after(() => { delete globalThis.window; });
  const { trackGenreSelection, trackPreferences } = analyticsModule.exports;

  trackGenreSelection('DETECTIVE');
  trackPreferences({
    proficiency: 'SENIOR', preferredGenreList: ['DETECTIVE', 'SENTIMENTAL'], preferredHeadcount: 3,
    preferredElementList: ['STORY'], preferredActivity: 'HIGH', preferredDevice: 'LOCK',
    horrorPos: 'SCARED', preference: 'private free text',
  });

  const [genre, userProperties, submission] = window.dataLayer;
  assert.equal(genre.genre_name, 'mystery');
  assert.deepEqual(userProperties, {
    event: 'set_user_properties', user_level: 'SENIOR', pref_genres: 'mystery,emotional',
    pref_member_count: 3, pref_factors: 'STORY', pref_device_lock: 'LOCK', pref_activity: 'HIGH',
    horror_position: 'SCARED',
  });
  assert.equal(submission.genre_count, 2);
  assert.equal(submission.has_free_text, true);
  assert.doesNotMatch(JSON.stringify(window.dataLayer), /private free text/);
});

test('reservation analytics runs before opening the new tab and sends only the host', (context) => {
  const calls = [];
  const window = {
    dataLayer: { push: (event) => calls.push(event) },
    location: { pathname: '/theme/7', href: 'https://service.example/theme/7' },
    open: (...args) => calls.push(args),
  };
  globalThis.window = window;
  context.after(() => { delete globalThis.window; });
  const { openTrackedReservation } = analyticsModule.exports;

  const url = 'https://booking.example/new?reference=private';
  openTrackedReservation({ themeId: 7, themeName: 'Escape', storeInfo: { storeName: 'Cafe', storeReservationUrl: url } });

  assert.deepEqual(calls, [
    { event: 'click_reserve', source_page: '/theme/7', theme_id: 7, theme_name: 'Escape', cafe_name: 'Cafe', outbound_domain: 'booking.example' },
    [url, '_blank', 'noopener'],
  ]);
});
