import test, { expect } from '@playwright/test';

const BASE_URL = 'https://ovcharski.com/shop/wp-json';

test('Get site info', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v2/`);
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    expect(body.namespace).toBe('wp/v2');
    expect(body.routes).toBeDefined();
});

test('Get pages', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v2/pages?_fields=id,link,slug`);
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    expect(Array.isArray(body)).toBeTruthy();
});

test('Get categories', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v2/categories?_fields=id,name,slug`);
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    expect(Array.isArray(body)).toBeTruthy();
    if (body.length > 0) {
        expect(body[0]).toHaveProperty('id');
        expect(body[0]).toHaveProperty('name');
        expect(body[0]).toHaveProperty('slug');
    }
});

test('Get specific post by ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v2/posts/147`);
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    expect(body.id).toBe(147);
    expect(body.slug).toBe('how-to-blog-post');
    expect(body.type).toBe('post');
});

test('Get post comments', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v2/comments?post=1`);
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    expect(Array.isArray(body)).toBeTruthy();
});

test('Get media items', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v2/media?_fields=id,source_url,alt_text`);
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    expect(Array.isArray(body)).toBeTruthy();
    if (body.length > 0) {
        expect(body[0]).toHaveProperty('id');
        expect(body[0]).toHaveProperty('source_url');
        expect(body[0]).toHaveProperty('alt_text');
    }
});

test('Search posts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v2/posts?search=hello&_fields=id,link,slug`);
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    expect(Array.isArray(body)).toBeTruthy();
    if (body.length > 0) {
        const post = body.find((p) => p.slug === 'hello-world');
        if (post) {
            expect(post.id).toBe(1);
            expect(post.link).toBe('https://ovcharski.com/shop/hello-world/');
        }
    }
});

test('Get users', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wp/v2/users?_fields=id,name,slug`);
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    expect(Array.isArray(body)).toBeTruthy();
    if (body.length > 0) {
        expect(body[0]).toHaveProperty('id');
        expect(body[0]).toHaveProperty('name');
        expect(body[0]).toHaveProperty('slug');
    }
});

// test('Get menu locations', async ({request}) => {
//     const response = await request.get(`${BASE_URL}/wp/v2/menu-locations`)
//     expect(response.status()).toBe(200)
//     const body = JSON.parse(await response.text())
//     expect(typeof body).toBe('object')
// })
