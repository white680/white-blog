<script setup lang="ts">
import { findMockPost, mockPosts } from '~/data/mock'

const route = useRoute()
const post = findMockPost(String(route.params.slug))
if (!post) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

const postIndex = mockPosts.findIndex(item => item.slug === post.slug)
const previousPost = mockPosts[postIndex - 1]
const nextPost = mockPosts[postIndex + 1]
const relatedPosts = mockPosts.filter(item => item.category === post.category && item.slug !== post.slug).slice(0, 2)
const copyState = ref<{ id: string; status: 'copied' | 'error' } | null>(null)
const imageDialog = ref<HTMLDialogElement | null>(null)

function closeImageOnBackdrop(event: MouseEvent): void {
  if (event.target === imageDialog.value) imageDialog.value?.close()
}

async function copyCode(id: string, code: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(code)
    copyState.value = { id, status: 'copied' }
  } catch {
    copyState.value = { id, status: 'error' }
  }
}

useSeoMeta({
  title: `${post.title} · white-博客`,
  description: post.excerpt,
  ogTitle: `${post.title} · white-博客`,
  ogDescription: post.excerpt,
  ogType: 'article',
  ogImage: post.cover,
})
</script>

<template>
  <article class="article-page">
    <div class="article-page-background" aria-hidden="true" />
    <header class="container article-hero">
      <img :src="post.cover" :alt="post.coverAlt" width="1200" height="760">
      <div class="article-hero-shade" />
      <div class="article-hero-inner">
        <div class="article-hero-actions">
          <NuxtLink class="article-back" to="/posts" aria-label="返回文章列表">←</NuxtLink>
          <button type="button" class="article-image-button" @click="imageDialog?.showModal()">查看封面</button>
        </div>
        <div class="article-hero-copy">
          <span class="article-hero-category">{{ post.category }}</span>
          <h1>{{ post.title }}</h1>
          <p class="article-subtitle">{{ post.subtitle }}</p>
          <div class="article-meta">
            <time :datetime="post.date">{{ post.date.replaceAll('-', '.') }}</time>
            <span>约 {{ post.minutes }} 分钟阅读</span>
            <span>{{ post.views }} 次阅读</span>
          </div>
        </div>
      </div>
    </header>

    <dialog ref="imageDialog" class="image-dialog" aria-label="封面预览" @click="closeImageOnBackdrop">
      <div class="image-dialog-content">
        <button type="button" aria-label="关闭封面预览" @click="imageDialog?.close()">×</button>
        <img :src="post.cover" :alt="post.coverAlt" width="1200" height="760">
        <p>{{ post.coverAlt }}</p>
      </div>
    </dialog>

    <div class="container article-reading">
      <div class="article-body">
        <div class="article-tags" aria-label="文章标签">
          <NuxtLink v-for="tag in post.tags" :key="tag" :to="{ path: '/posts', query: { tag } }">#{{ tag }}</NuxtLink>
        </div>
        <p class="article-intro">{{ post.excerpt }}</p>
        <details v-if="post.sections.length > 2" class="article-toc">
          <summary>目录</summary>
          <nav aria-label="文章目录">
            <a v-for="section in post.sections" :key="section.id" :href="`#${section.id}`">{{ section.title }}</a>
          </nav>
        </details>
        <section v-for="section in post.sections" :id="section.id" :key="section.id" class="article-section">
          <h2>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          <blockquote v-if="section.quote">{{ section.quote }}</blockquote>
          <div v-if="section.code" class="code-block">
            <div class="code-toolbar">
              <span>TypeScript</span>
              <button type="button" @click="copyCode(section.id, section.code!)">
                {{ copyState?.id === section.id ? (copyState.status === 'copied' ? '已复制' : '复制失败') : '复制代码' }}
              </button>
            </div>
            <pre><code>{{ section.code }}</code></pre>
          </div>
        </section>

        <div class="article-engagement" aria-label="文章数据">
          <span>{{ post.comment }} 条评论</span>
          <span>{{ post.praise }} 次点赞</span>
        </div>
      </div>
    </div>

    <div class="container article-after">
      <nav class="article-neighbors" aria-label="前后文章">
        <NuxtLink v-if="previousPost" :to="`/posts/${previousPost.slug}`"><small>上一篇</small><strong>{{ previousPost.title }}</strong></NuxtLink>
        <NuxtLink v-if="nextPost" :to="`/posts/${nextPost.slug}`"><small>下一篇</small><strong>{{ nextPost.title }}</strong></NuxtLink>
      </nav>

      <section v-if="relatedPosts.length" class="related-posts" aria-labelledby="related-title">
        <h2 id="related-title">继续阅读</h2>
        <div class="related-grid">
          <NuxtLink v-for="item in relatedPosts" :key="item.slug" :to="`/posts/${item.slug}`">
            <strong>{{ item.title }}</strong>
            <span>↗</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </article>
</template>
