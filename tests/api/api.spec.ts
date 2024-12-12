import test, { expect, request } from "@playwright/test"

test('Get WP-JSON', async ({request}) => {
    const response = await request.get('https://ovcharski.com/shop/wp-json/')
    expect(response.status()).toBe(200)
    const body = JSON.parse(await response.text())
    expect(body.name).toBe('Automation Demo Site')
    expect(body.description).toBe('Website for demo purposes.')
})


test('Get all posts', async ({request}) => {
    const response = await request.get('https://ovcharski.com/shop/wp-json/wp/v2/posts?_fields=id,link,slug')
    expect(response.status()).toBe(200)
    const body = JSON.parse(await response.text())
    expect(body.length).toBe(3)
    expect(body[0].id).toBe(147)
    expect(body[0].slug).toBe('how-to-blog-post')
    expect(body[0].link).toBe('https://ovcharski.com/shop/how-to-blog-post/')
    expect(body[1].id).toBe(144)
    expect(body[1].slug).toBe('welcome-to-the-shop')
    expect(body[1].link).toBe('https://ovcharski.com/shop/welcome-to-the-shop/')
    expect(body[2].id).toBe(1)
    expect(body[2].slug).toBe('hello-world')
    expect(body[2].link).toBe('https://ovcharski.com/shop/hello-world/')
})

