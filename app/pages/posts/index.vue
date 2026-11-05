<script setup lang="ts">
import { mockCategories, mockPosts } from '~/data/mock'
import '~/assets/styles/posts.css'

const route = useRoute()
const postTags = [...new Set(mockPosts.flatMap(post => post.tags))]
const category = computed(() => {
  const value = route.query.category
  return typeof value === 'string' && mockCategories.some(item => item === value) ? value : '全部'
})
const tag = computed(() => typeof route.query.tag === 'string' ? route.query.tag : '')
const query = computed(() => typeof route.query.q === 'string' ? route.query.q.trim() : '')
const searchInput = ref(query.value)
watch(query, value => { searchInput.value = value })

const filteredPosts = computed(() => mockPosts.filter(post => {
  const matchesCategory = category.value === '全部' || post.category === category.value
  const matchesTag = !tag.value || post.tags.includes(tag.value)
  const needle = query.value.toLocaleLowerCase()
  const matchesSearch = !needle || [post.title, post.excerpt, post.category, ...post.tags]
    .some(value => value.toLocaleLowerCase().includes(needle))
  return matchesCategory && matchesTag && matchesSearch
}))

const pageSize = 6
const pageCount = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))
const page = computed(() => {
  const raw = Number(route.query.page)
  return Number.isInteger(raw) && raw > 0 ? Math.min(raw, pageCount.value) : 1
})
const visiblePosts = computed(() => filteredPosts.value.slice((page.value - 1) * pageSize, page.value * pageSize))

function filterTo(nextCategory: string, nextTag = tag.value, nextPage = 1) {
  return {
    path: '/posts',
    query: {
      category: nextCategory === '全部' ? undefined : nextCategory,
      tag: nextTag || undefined,
      q: query.value || undefined,
      page: nextPage > 1 ? String(nextPage) : undefined,
    },
  }
}

function applySearch(): void {
  navigateTo({
    path: '/posts',
    query: {
      category: category.value === '全部' ? undefined : category.value,
      tag: tag.value || undefined,
      q: searchInput.value.trim() || undefined,
    },
  })
}

useSeoMeta({
  title: '文章 · white-博客',
  description: '技术笔记、设计手记与日常记录。',
  ogTitle: '文章 · white-博客',
  ogDescription: '技术笔记、设计手记与日常记录。',
  ogType: 'website',
})
</script>

<template>
  <div class="posts-journal posts-journal--enter">
    <div class="posts-journal-background" aria-hidden="true" />
    <div class="posts-journal-content">
      <header class="posts-journal-heading">
        <h1>文章</h1>
        <p>按时间浏览所有公开文章。</p>
        <span>{{ filteredPosts.length }} 篇</span>
      </header>

      <div class="posts-journal-tools">
        <nav id="post-categories" class="posts-journal-categories" aria-label="文章分类">
          <NuxtLink v-for="item in mockCategories" :key="item" :to="filterTo(item, '')" :aria-current="category === item ? 'page' : undefined">{{ item }}</NuxtLink>
        </nav>
        <form class="posts-journal-search" role="search" @submit.prevent="applySearch">
          <label class="visually-hidden" for="post-query">搜索文章</label>
          <input id="post-query" v-model="searchInput" type="search" placeholder="搜索文章" autocomplete="off">
          <button type="submit" aria-label="提交搜索">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
          </button>
        </form>
      </div>

      <details id="post-tags" class="posts-journal-tags" :open="Boolean(tag) || route.hash === '#post-tags'">
        <summary>标签 <span>{{ postTags.length }}</span></summary>
        <nav aria-label="文章标签筛选">
          <NuxtLink :to="{ ...filterTo(category, ''), hash: '#post-tags' }" :aria-current="!tag ? 'true' : undefined">全部标签</NuxtLink>
          <NuxtLink v-for="item in postTags" :key="item" :to="{ ...filterTo(category, item), hash: '#post-tags' }" :aria-current="tag === item ? 'true' : undefined">#{{ item }}</NuxtLink>
        </nav>
      </details>

      <div v-if="tag" class="posts-journal-active-tag">#{{ tag }} <NuxtLink :to="filterTo(category, '')">清除</NuxtLink></div>

      <section v-if="visiblePosts.length" class="posts-journal-grid" aria-label="文章列表">
        <article v-for="(post, index) in visiblePosts" :key="post.slug" class="posts-journal-card" :style="{ '--entry-index': index }">
          <img :src="post.cover" :alt="post.coverAlt" width="1200" height="760" loading="lazy">
          <div class="posts-journal-card-copy">
            <span class="posts-journal-card-category">{{ post.category }}</span>
            <h2><NuxtLink :to="`/posts/${post.slug}`">{{ post.title }}</NuxtLink></h2>
            <p>{{ post.excerpt }}</p>
            <time :datetime="post.date">{{ post.date.replaceAll('-', '.') }}</time>
          </div>
          <span class="posts-journal-card-arrow" aria-hidden="true">↗</span>
        </article>
      </section>
      <div v-else class="posts-journal-empty" role="status">
        <h2>没有找到相关文章</h2>
        <p>试试其他关键词或分类。</p>
        <NuxtLink to="/posts">查看全部文章 ↗</NuxtLink>
      </div>

      <nav v-if="pageCount > 1" class="posts-journal-pagination" aria-label="文章分页">
        <NuxtLink v-for="number in pageCount" :key="number" :to="filterTo(category, tag, number)" :aria-current="page === number ? 'page' : undefined">{{ number }}</NuxtLink>
      </nav>
    </div>
  </div>
</template>
