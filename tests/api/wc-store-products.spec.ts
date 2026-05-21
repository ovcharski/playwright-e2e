import test, { expect } from '@playwright/test';

const STORE_PRODUCTS = 'wp-json/wc/store/v1/products';
const V3_PRODUCTS = 'wp-json/wc/v3/products';

// The Store API (/wc/store/v1) is designed for anonymous frontend access and
// is the right surface for read-only WooCommerce checks. The classic /wc/v3
// API requires consumer key/secret — we deliberately do not test it with
// credentials, only assert that it correctly rejects unauthenticated reads.

test.describe('WC Store API — products (anonymous reads)', () => {
  test('GET /products returns an array of products with expected fields', async ({ request }) => {
    const response = await request.get(STORE_PRODUCTS, { params: { per_page: 5 } });
    expect(response.status()).toBe(200);

    const products = await response.json();
    expect(products).toBeInstanceOf(Array);
    expect(products.length).toBeGreaterThan(0);
    expect(products.length).toBeLessThanOrEqual(5);

    products.forEach((product: { id: number; name: string; slug: string; permalink: string }) => {
      expect(product).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        slug: expect.any(String),
        permalink: expect.stringContaining('https://'),
      });
    });
  });

  test('pagination headers expose total counts', async ({ request }) => {
    const response = await request.get(STORE_PRODUCTS, { params: { per_page: 1 } });
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['x-wp-total']).toBeTruthy();
    expect(headers['x-wp-totalpages']).toBeTruthy();
  });
});

test.describe('WC Store API — negative cases (no credentials needed)', () => {
  test('GET /products/{invalid-id} → 404 woocommerce_rest_product_invalid_id', async ({ request }) => {
    const response = await request.get(`${STORE_PRODUCTS}/9999999`);
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.code).toBe('woocommerce_rest_product_invalid_id');
    expect(body.data.status).toBe(404);
  });

  test('per_page above max → 400 rest_invalid_param', async ({ request }) => {
    const response = await request.get(STORE_PRODUCTS, { params: { per_page: 999 } });
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.code).toBe('rest_invalid_param');
    expect(body.data.params).toHaveProperty('per_page');
  });
});

test.describe('WC v3 API — auth boundary', () => {
  test('GET /wc/v3/products without credentials → 401 woocommerce_rest_cannot_view', async ({ request }) => {
    const response = await request.get(V3_PRODUCTS);
    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.code).toBe('woocommerce_rest_cannot_view');
    expect(body.data.status).toBe(401);
  });
});
