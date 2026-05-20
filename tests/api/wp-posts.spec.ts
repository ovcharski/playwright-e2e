import test, { expect } from '@playwright/test';

const BASE_URL = 'https://ovcharski.com/shop/wp-json';
const POSTS = `${BASE_URL}/wp/v2/posts`;

test.describe('WP /posts — pagination boundaries', () => {
  const invalidPerPage = [
    { label: 'above max (999)', value: 999 },
    { label: 'negative (-1)', value: -1 },
    { label: 'zero (0)', value: 0 },
  ];

  invalidPerPage.forEach(({ label, value }) => {
    test(`per_page ${label} → 400 rest_invalid_param`, async ({ request }) => {
      const response = await request.get(POSTS, { params: { per_page: value } });
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.code).toBe('rest_invalid_param');
      expect(body.data.status).toBe(400);
      expect(body.data.params).toHaveProperty('per_page');
    });
  });

  test('page=0 → 400 rest_invalid_param', async ({ request }) => {
    const response = await request.get(POSTS, { params: { page: 0 } });
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.code).toBe('rest_invalid_param');
    expect(body.data.params).toHaveProperty('page');
  });

  test('page far beyond available → 400 rest_post_invalid_page_number', async ({ request }) => {
    const response = await request.get(POSTS, { params: { page: 99999 } });
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.code).toBe('rest_post_invalid_page_number');
  });
});

test.describe('WP /posts — invalid query params', () => {
  test('orderby with unknown value → 400 rest_invalid_param', async ({ request }) => {
    const response = await request.get(POSTS, { params: { orderby: 'bogus' } });
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.code).toBe('rest_invalid_param');
    expect(body.data.params).toHaveProperty('orderby');
    // The error message enumerates the allowed values — useful for catching
    // server-side enum changes.
    expect(body.data.params.orderby).toMatch(/orderby is not one of/);
  });
});

test.describe('WP /posts — search edge cases', () => {
  const searchInputs = [
    { label: 'empty', value: '' },
    { label: 'special chars (<script>)', value: '<script>alert(1)</script>' },
    { label: 'sql-ish', value: "' OR 1=1 --" },
    { label: 'very long (500 chars)', value: 'a'.repeat(500) },
  ];

  searchInputs.forEach(({ label, value }) => {
    test(`search "${label}" returns 200 without server error`, async ({ request }) => {
      const response = await request.get(POSTS, {
        params: { search: value, _fields: 'id,title' },
      });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toBeInstanceOf(Array);
    });
  });

  test('search with <script> payload is not echoed unsanitized in titles', async ({ request }) => {
    const payload = '<script>alert(1)</script>';
    const response = await request.get(POSTS, {
      params: { search: payload, _fields: 'id,title' },
    });
    expect(response.status()).toBe(200);

    const posts: Array<{ id: number; title: { rendered: string } }> = await response.json();
    // No rendered title should contain the raw, unsanitized payload.
    posts.forEach((post) => {
      expect(post.title.rendered).not.toContain('<script>');
    });
  });
});

test.describe('WP /posts — _fields filter behavior', () => {
  test('_fields with nonexistent field returns empty objects (no error)', async ({ request }) => {
    const response = await request.get(POSTS, { params: { _fields: 'does_not_exist' } });
    expect(response.status()).toBe(200);

    const body: Array<Record<string, unknown>> = await response.json();
    expect(body).toBeInstanceOf(Array);
    // Each item is an object stripped of all known fields.
    body.forEach((item) => {
      expect(item).not.toHaveProperty('id');
      expect(item).not.toHaveProperty('title');
    });
  });
});

test.describe('WP /posts — unsupported namespace', () => {
  test('GET /wp/v99/posts → 404 rest_no_route', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v99/posts`);
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.code).toBe('rest_no_route');
    expect(body.data.status).toBe(404);
  });
});
