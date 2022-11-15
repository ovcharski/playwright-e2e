import test, { expect } from "@playwright/test"

test('can POST a REST API and check response using assertion style (using page)', async ({ page }) => {
    const response = await page.request.post('https://my-json-server.typicode.com/webdriverjsdemo/webdriverjsdemo.github.io/posts', { data: { title: 'Post 4' } })
    expect(response.status()).toBe(201)
    const body = JSON.parse(await response.text())
    expect(body.id).toBe(4)
    expect(body.title).toBe('Post 4')
})

test('can GET a REST API and check response using assertion style', async ({ request }) => {
    const response = await request.get('https://my-json-server.typicode.com/webdriverjsdemo/webdriverjsdemo.github.io/posts')
    expect(response.status()).toBe(200)
    const body = JSON.parse(await response.text())
    expect(body.length).toBe(3)
    expect(body[0].id).toBe(1)
    expect(body[0].title).toBe('Post 1')
    expect(body[1].id).toBe(2)
    expect(body[1].title).toBe('Post 2')
    expect(body[2].id).toBe(3)
    expect(body[2].title).toBe('Post 3')
})