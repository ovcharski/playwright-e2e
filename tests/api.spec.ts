import test, { expect } from "@playwright/test"

test('Get WP-JSON', async ({request}) => {
    const response = await request.get('https://ovcharski.com/shop/wp-json/')
    expect(response.status()).toBe(200)
    const body = JSON.parse(await response.text())
    expect(body.name).toBe('Automation Demo Site')
    expect(body.description).toBe('Website for demo purposes.')
})

test('Get Post count', async ({request}) => {
    const response = await request.get('https://ovcharski.com/shop/wp-json/wp/v2/posts')
    expect(response.status()).toBe(200)
    const body = JSON.parse(await response.text())
})

