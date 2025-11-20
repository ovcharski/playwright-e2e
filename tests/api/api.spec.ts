import test, { expect } from '@playwright/test';

const BASE_URL = 'https://ovcharski.com/shop/wp-json';
const API_VERSION = 'wp/v2';

test.describe('WordPress API Tests', () => {
  
  test.describe('Core API Endpoints', () => {
    test('GET /wp/v2 should return API structure', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/${API_VERSION}/`);
      await expect(response).toBeOK();
      const body = await response.json();
      
      expect(body.namespace).toBe(API_VERSION);
      expect(body.routes).toBeInstanceOf(Object);
      expect(Object.values(body.routes as Record<string, { namespace?: string }>).some((route) => route.namespace === API_VERSION)).toBeTruthy();
    });
  });

  test.describe('Content Endpoints', () => {
    test('GET /pages should return pages with required fields', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/${API_VERSION}/pages`, {
        params: { _fields: 'id,link,slug' }
      });
      
      await expect(response).toBeOK();
      const pages = await response.json();
      
      expect(pages).toBeInstanceOf(Array);
      pages.forEach((page: { id: number; link: string; slug: string }) => {
        expect(page).toMatchObject({
          id: expect.any(Number),
          link: expect.stringContaining('https://'),
          slug: expect.any(String)
        });
      });
    });

    test('GET /posts should support pagination', async ({ request }) => {
      const perPage = 3;
      const response = await request.get(`${BASE_URL}/${API_VERSION}/posts`, {
        params: {
          per_page: perPage,
          _fields: 'id'
        }
      });
      
      await expect(response).toBeOK();
      const posts = await response.json();
      
      expect(posts).toHaveLength(perPage);
      expect(response.headers()['x-wp-total']).toBeTruthy();
    });
  });

  test.describe('Taxonomy Endpoints', () => {
    test('GET /categories should return categories with expected structure', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/${API_VERSION}/categories`, {
        params: { _fields: 'id,name,slug' }
      });
      
      await expect(response).toBeOK();
      const categories = await response.json();
      
      expect(categories).toBeInstanceOf(Array);
      categories.forEach((category: { id: number; name: string; slug: string }) => {
        expect(category).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          slug: expect.any(String)
        });
      });
    });
  });

  test.describe('Media Management', () => {
    test('GET /media should return valid media items', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/${API_VERSION}/media`, {
        params: { _fields: 'id,source_url,alt_text' }
      });
      
      await expect(response).toBeOK();
      const mediaItems = await response.json();
      
      expect(mediaItems).toBeInstanceOf(Array);
      mediaItems.forEach((media: { id: number; source_url: string; alt_text: string }) => {
        expect(media).toMatchObject({
          id: expect.any(Number),
          source_url: expect.stringMatching(/^https?:\/\/.+\/.+\.(jpg|png|gif|jpeg|webp)$/i),
          alt_text: expect.any(String)
        });
      });
    });
  });

  test.describe('Error Handling', () => {
    test('GET non-existent endpoint should return 404', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/invalid-endpoint`);
      expect(response.status()).toBe(404);
    });

    test('GET invalid post ID should return 404', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/${API_VERSION}/posts/invalid_id`);
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Search Functionality', () => {
    test('Search for posts should return relevant results', async ({ request }) => {
      const searchTerm = 'hello';
      const response = await request.get(`${BASE_URL}/${API_VERSION}/posts`, {
        params: {
          search: searchTerm,
          _fields: 'id,title,slug'
        }
      });
      
      await expect(response).toBeOK();
      const results = await response.json();
      
      expect(results).toBeInstanceOf(Array);
      results.forEach((post: { title: { rendered: string } }) => {
        expect(post.title.rendered.toLowerCase()).toContain(searchTerm);
      });
    });
  });

  test.describe('User Management', () => {
    test('GET /users should not expose sensitive information', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/${API_VERSION}/users`, {
        params: { _fields: 'id,name,slug' }
      });
      
      await expect(response).toBeOK();
      const users = await response.json();

      users.forEach((user: { id: number; name: string; slug: string }) => {
        expect(user).not.toHaveProperty('email');
        expect(user).not.toHaveProperty('password');
        expect(user).not.toHaveProperty('roles');
      });
    });
  });

  test.describe('Comment System', () => {
    test('GET /comments should return comments for valid post', async ({ request }) => {
      const postsResponse = await request.get(`${BASE_URL}/${API_VERSION}/posts`);
      const posts = await postsResponse.json();
      const postId = posts[0]?.id;
      
      test.skip(!postId, 'No posts available for comment testing');
      
      const response = await request.get(`${BASE_URL}/${API_VERSION}/comments`, {
        params: { post: postId }
      });
      
      await expect(response).toBeOK();
      const comments = await response.json();

      expect(comments).toBeInstanceOf(Array);
      comments.forEach((comment: { post: number }) => {
        expect(comment.post).toBe(postId);
      });
    });
  });
});