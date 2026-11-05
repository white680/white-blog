import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { findMockPost, mockPosts, mockProjects } from '../app/data/mock.ts'

test('演示内容的文章链接与本地配图保持可用', () => {
  const slugs = mockPosts.map(post => post.slug)
  assert.equal(new Set(slugs).size, slugs.length)

  for (const post of mockPosts) {
    assert.equal(findMockPost(post.slug), post)
    assert.ok(post.sections.length > 0)
    assert.equal(new Set(post.sections.map(section => section.id)).size, post.sections.length)
    assert.ok(existsSync(fileURLToPath(new URL(`../public${post.cover}`, import.meta.url))), post.cover)
  }

  for (const project of mockProjects) {
    assert.ok(existsSync(fileURLToPath(new URL(`../public${project.cover}`, import.meta.url))), project.cover)
  }

  assert.equal(findMockPost('missing-post'), undefined)
})
