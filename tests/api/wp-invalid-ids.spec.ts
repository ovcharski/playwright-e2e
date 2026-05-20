import test, { expect } from '@playwright/test';

const BASE_URL = 'https://ovcharski.com/shop/wp-json/wp/v2';

// WP's REST router treats non-numeric IDs as a route mismatch (not a
// validation error), so the response is always rest_no_route / 404.
// Parameterized to prove this holds uniformly across endpoints.
const endpoints = [
  { name: 'pages', path: 'pages' },
  { name: 'categories', path: 'categories' },
  { name: 'media', path: 'media' },
  { name: 'tags', path: 'tags' },
];

test.describe('WP — invalid resource IDs return 404 rest_no_route', () => {
  endpoints.forEach(({ name, path }) => {
    test(`GET /${name}/invalid_id → 404`, async ({ request }) => {
      const response = await request.get(`${BASE_URL}/${path}/invalid_id`);
      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.code).toBe('rest_no_route');
      expect(body.data.status).toBe(404);
    });
  });
});
