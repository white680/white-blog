<script setup lang="ts">
import { mockCategories, mockMoments, mockPosts, mockProfile, mockProjects } from '~/data/mock'
import '~/assets/styles/home.css'

/** Codex 修改：按 Lunaris MIT 首页结构改造，数据仍来自本站的演示视图模型。 */
const spotlight = mockPosts[0]!
const latestPosts = mockPosts.slice(1, 5)
const visibleProjects = mockProjects.slice(0, 2)
const visibleMoments = mockMoments.slice(0, 2)
const categories = mockCategories
  .filter(category => category !== '全部')
  .map(category => ({ name: category, count: mockPosts.filter(post => post.category === category).length }))
const allTags = [...new Set(mockPosts.flatMap(post => post.tags))]
const tags = allTags.slice(0, 8)
// Codex 添加：统计来自当前演示内容，不复制参考图中的数字。
const siteStats = [
  { label: '文章', count: mockPosts.length, to: '/posts', icon: 'M3 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H3V4Zm18 0h-6a3 3 0 0 0-3 3m0 14a4 4 0 0 1 4-3h5V4M6 8h2m-2 4h2m8-4h2m-2 4h2' },
  { label: '分类', count: categories.length, to: '/posts#post-categories', icon: 'M3 6h6l2 3h10v11H3V6Zm0 0V3h7l2 3' },
  { label: '标签', count: allTags.length, to: '/posts#post-tags', icon: 'M3 3h8l10 10-8 8L3 11V3Zm5 4h.01' },
  { label: '片刻', count: mockMoments.length, to: '/moments', icon: 'M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L3 21l1.3-4.4A9 9 0 1 1 21 11.5ZM8 11h.01M12 11h.01M16 11h.01' },
]

useSeoMeta({
  title: 'White · 个人博客',
  description: '技术文章、个人项目与日常记录。',
  ogTitle: 'White · 个人博客',
  ogDescription: '技术文章、个人项目与日常记录。',
  ogType: 'website',
})
</script>

<template>
  <div class="lunaris-home">
    <LineArtHero />

    <section id="home-content" class="lunaris-home-content" aria-label="首页内容">
      <nav class="home-topic-strip" aria-label="主题导航">
        <NuxtLink class="topic-home" to="/" aria-label="首页">⌂</NuxtLink>
        <NuxtLink v-for="category in categories" :key="category.name" :to="{ path: '/posts', query: { category: category.name } }">
          {{ category.name }} <small>{{ category.count }}</small>
        </NuxtLink>
        <NuxtLink class="topic-more" to="/posts">全部文章 <span aria-hidden="true">↗</span></NuxtLink>
      </nav>

      <div class="home-layout-grid">
        <aside class="home-profile-card" aria-label="作者介绍">
          <div class="profile-portrait-wrap">
            <img class="profile-portrait" src="/images/lunaris-home.jpg" alt="" width="1920" height="1076" loading="lazy">
          </div>
          <div class="profile-copy">
            <h2>White</h2>
            <p>{{ mockProfile.lead }}</p>
          </div>
          <ul class="profile-skills" aria-label="关注方向">
            <li v-for="tool in mockProfile.tools.slice(0, 4)" :key="tool">{{ tool }}</li>
          </ul>
          <NuxtLink class="profile-about" to="/about">关于我 <span aria-hidden="true">↗</span></NuxtLink>
        </aside>

        <div class="home-feed">
          <article class="home-spotlight-card">
            <NuxtLink class="spotlight-image" :to="`/posts/${spotlight.slug}`" :aria-label="`阅读 ${spotlight.title}`">
              <img :src="spotlight.cover" :alt="spotlight.coverAlt" width="1200" height="760">
            </NuxtLink>
            <div class="spotlight-overlay">
              <h2><NuxtLink :to="`/posts/${spotlight.slug}`">{{ spotlight.title }}</NuxtLink></h2>
              <p>{{ spotlight.excerpt }}</p>
              <time :datetime="spotlight.date">{{ spotlight.date.replaceAll('-', '.') }}</time>
            </div>
          </article>

          <header class="home-section-heading">
            <h2>最近书写</h2>
            <NuxtLink to="/posts">全部文章 <span aria-hidden="true">→</span></NuxtLink>
          </header>
          <div class="home-post-list">
            <article v-for="post in latestPosts" :key="post.slug" class="home-post-card">
              <div class="home-post-cover">
                <img :src="post.cover" :alt="post.coverAlt" width="1200" height="760" loading="lazy">
              </div>
              <div class="home-post-body">
                <div class="home-post-topline"><span>{{ post.category }}</span><time :datetime="post.date">{{ post.date.replaceAll('-', '.') }}</time></div>
                <h3><NuxtLink class="home-post-title-link" :to="`/posts/${post.slug}`">{{ post.title }}</NuxtLink></h3>
                <p>{{ post.excerpt }}</p>
                <div class="home-post-tags">
                  <NuxtLink v-for="tag in post.tags.slice(0, 2)" :key="tag" :to="{ path: '/posts', query: { tag } }">#{{ tag }}</NuxtLink>
                </div>
              </div>
              <span class="home-post-arrow" aria-hidden="true">↗</span>
            </article>
          </div>
        </div>

        <aside class="home-sidebar" aria-label="内容索引">
          <section class="home-panel sidebar-stats" aria-labelledby="sidebar-stats-title">
            <h2 id="sidebar-stats-title">站点统计</h2>
            <!-- Codex 修改：统计行是实际导航，分类和标签定位到文章筛选区。 -->
            <nav class="sidebar-stat-list" aria-label="站点统计入口">
              <NuxtLink v-for="stat in siteStats" :key="stat.label" :to="stat.to" class="sidebar-stat-row">
                <span class="sidebar-stat-label"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="stat.icon" /></svg>{{ stat.label }}</span>
                <strong>{{ stat.count }}</strong>
                <span class="sidebar-stat-arrow" aria-hidden="true">↗</span>
              </NuxtLink>
            </nav>
          </section>
          <section class="home-panel taxonomy-card">
            <h2>主题漫游</h2>
            <div class="sidebar-category-list">
              <NuxtLink v-for="category in categories" :key="category.name" :to="{ path: '/posts', query: { category: category.name } }">
                <span>{{ category.name }}</span><strong>{{ category.count }}</strong>
              </NuxtLink>
            </div>
            <div class="sidebar-tag-cloud">
              <NuxtLink v-for="tag in tags" :key="tag" :to="{ path: '/posts', query: { tag } }">#{{ tag }}</NuxtLink>
            </div>
          </section>
          <DailyQuoteCard />
          <nav class="sidebar-quick-links" aria-label="继续浏览">
            <NuxtLink to="/projects">练习 <span aria-hidden="true">↗</span></NuxtLink>
            <NuxtLink to="/archive">文章归档 <span aria-hidden="true">↗</span></NuxtLink>
          </nav>
        </aside>
      </div>
    </section>

    <section class="home-discovery-band" aria-label="更多内容">
      <div class="container home-discovery-grid">
        <section class="discovery-section" aria-labelledby="discovery-projects">
          <header class="home-section-heading"><h2 id="discovery-projects">正在构建</h2><NuxtLink to="/projects">查看练习 <span aria-hidden="true">→</span></NuxtLink></header>
          <!-- Codex 修改：每个项目都是独立入口，跳到作品页中对应的项目。 -->
          <NuxtLink v-for="project in visibleProjects" :key="project.number" class="discovery-entry discovery-link discovery-entry--project" :to="{ path: '/projects', hash: `#project-${project.number}` }">
            <img class="discovery-project-cover" :src="project.cover" :alt="project.coverAlt" width="120" height="90" loading="lazy">
            <span class="discovery-entry-copy"><strong>{{ project.title }}</strong><span>{{ project.summary }}</span></span>
            <span aria-hidden="true">↗</span>
          </NuxtLink>
        </section>
        <section class="discovery-section discovery-section--moments" aria-labelledby="discovery-moments">
          <header class="home-section-heading"><h2 id="discovery-moments">片刻记录</h2><NuxtLink to="/moments">查看全部 <span aria-hidden="true">→</span></NuxtLink></header>
          <!-- Codex 修改：片刻与作品共用卡片交互，并跳到对应记录。 -->
          <NuxtLink v-for="moment in visibleMoments" :key="moment.date" class="discovery-entry discovery-link discovery-entry--moment" :to="{ path: '/moments', hash: `#moment-${moment.date}` }">
            <span class="discovery-entry-copy"><time :datetime="moment.date">{{ moment.date.replaceAll('-', '.') }}</time><span>{{ moment.text }}</span></span>
            <span aria-hidden="true">↗</span>
          </NuxtLink>
        </section>
      </div>
    </section>
  </div>
</template>
