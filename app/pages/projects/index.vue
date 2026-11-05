<script setup lang="ts">
import { mockProjects } from '~/data/mock'
import '~/assets/styles/posts.css'

const query = ref('')
const searchTerm = computed(() => query.value.trim().toLocaleLowerCase())
const visibleProjects = computed(() => mockProjects.filter(project =>
  [project.title, project.category, project.summary, project.details, ...project.stack]
    .some(value => value.toLocaleLowerCase().includes(searchTerm.value)),
))

useSeoMeta({
  title: '练习 · white-博客',
  description: '界面、布局与交互练习的演示记录。',
  ogTitle: '练习 · white-博客',
  ogDescription: '界面、布局与交互练习的演示记录。',
  ogType: 'website',
})
</script>

<template>
  <div class="posts-journal practice-page">
    <div class="posts-journal-background" aria-hidden="true" />
    <div class="practice-content">
      <header class="practice-heading">
        <div>
          <h1>练习</h1>
          <p>界面与交互的小型试验。</p>
        </div>
        <span>{{ mockProjects.length }} 项</span>
      </header>

      <label class="practice-search">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
        <input v-model="query" type="search" autocomplete="off" placeholder="搜索练习名称、描述或技术栈" aria-label="搜索练习">
      </label>
      <p v-if="query.trim()" class="practice-search-feedback" role="status">{{ visibleProjects.length }} 条结果</p>

      <div v-if="visibleProjects.length" class="practice-grid">
        <article v-for="(project, index) in visibleProjects" :id="`project-${project.number}`" :key="project.number" class="practice-card" :style="{ '--entry-index': index }">
          <div class="practice-card-top">
            <span>{{ project.category }}</span>
            <span class="practice-card-icon" aria-hidden="true">&lt;/&gt;</span>
          </div>
          <h2>{{ project.title }}</h2>
          <p class="practice-card-summary">{{ project.summary }}</p>
          <ul aria-label="技术栈">
            <li v-for="item in project.stack" :key="item">{{ item }}</li>
          </ul>
          <details class="practice-card-details">
            <summary>查看说明</summary>
            <p>{{ project.details }}</p>
          </details>
        </article>
      </div>

      <div v-else class="practice-empty" role="status">
        <p>没有找到匹配的练习，试试标题或技术栈。</p>
        <button type="button" @click="query = ''">清空搜索</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.practice-page {
  position: relative;
  isolation: isolate;
  min-height: calc(100svh - 94px);
  overflow: hidden;
  padding: 68px 0 112px;
  color: #252525;
}

.practice-content {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 64px));
  margin: auto;
}

.practice-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  padding: 0 0 22px;
  border-bottom: 1px solid rgba(34, 34, 34, .25);
}

.practice-heading > div { display: flex; align-items: baseline; gap: 32px; }
.practice-heading h1 { margin: 0; font-family: 'Noto Serif SC', 'Songti SC', serif; font-size: clamp(40px, 4vw, 55px); font-weight: 500; line-height: 1.2; }
.practice-heading p { margin: 0; color: #555; font-size: 15px; }
.practice-heading > span { color: #606060; font-size: 13px; white-space: nowrap; }

.practice-search {
  display: flex;
  width: min(680px, 100%);
  height: 52px;
  align-items: center;
  gap: 14px;
  margin: 52px auto 42px;
  padding: 0 19px;
  border: 1px solid rgba(38, 38, 38, .22);
  border-radius: 8px;
  background: rgba(255, 255, 255, .68);
  color: #555;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: background .2s ease, border-color .2s ease, box-shadow .2s ease;
}

.practice-search:focus-within { border-color: #303030; background: rgba(255, 255, 255, .88); box-shadow: 0 0 0 3px rgba(38, 38, 38, .1); }
.practice-search svg { flex: none; }
.practice-search input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: #252525; font: inherit; font-size: 15px; }
.practice-search input::placeholder { color: #777; }
.practice-search-feedback { margin: -28px 0 22px; color: #555; font-size: 12px; text-align: center; }

.practice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.practice-card {
  display: flex;
  min-width: 0;
  min-height: 356px;
  flex-direction: column;
  padding: 28px 30px 24px;
  border: 1px solid rgba(255, 255, 255, .82);
  border-radius: 18px;
  background: rgba(250, 250, 250, .68);
  box-shadow: 0 18px 42px rgba(25, 25, 25, .1), inset 0 1px rgba(255, 255, 255, .8);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  animation: practice-arrive .65s cubic-bezier(.22, 1, .36, 1) both;
  animation-delay: calc(var(--entry-index) * 80ms);
  transition: transform .32s cubic-bezier(.22, 1, .36, 1), box-shadow .32s ease, border-color .32s ease;
  scroll-margin-top: 116px;
}

.practice-card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #555; font-size: 12px; }
.practice-card-icon { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid rgba(38, 38, 38, .2); border-radius: 50%; font-family: Consolas, monospace; font-size: 12px; }
.practice-card h2 { margin: 35px 0 12px; font-family: 'Noto Serif SC', 'Songti SC', serif; font-size: clamp(24px, 2.5vw, 32px); font-weight: 500; line-height: 1.35; overflow-wrap: anywhere; }
.practice-card-summary { max-width: 48ch; margin: 0; color: #414141; font-size: 15px; line-height: 1.75; }
.practice-card ul { display: flex; flex-wrap: wrap; gap: 8px; margin: auto 0 0; padding: 34px 0 0; list-style: none; }
.practice-card li { padding: 6px 11px; border: 1px solid rgba(38, 38, 38, .16); border-radius: 999px; background: rgba(255, 255, 255, .46); color: #424242; font-size: 12px; }
.practice-card-details { margin-top: 24px; border-top: 1px solid rgba(38, 38, 38, .17); }
.practice-card-details summary { display: flex; min-height: 42px; align-items: end; justify-content: space-between; color: #555; cursor: pointer; font-size: 12px; list-style: none; }
.practice-card-details summary::-webkit-details-marker { display: none; }
.practice-card-details summary::after { content: '+'; color: #252525; font-size: 21px; line-height: .8; transition: transform .22s ease; }
.practice-card-details[open] summary::after { transform: rotate(45deg); }
.practice-card-details p { margin: 15px 0 0; color: #4e4e4e; font-size: 13px; line-height: 1.7; animation: detail-arrive .22s ease both; }
.practice-empty { padding: 72px 24px; border: 1px solid rgba(38, 38, 38, .17); border-radius: 18px; background: rgba(255, 255, 255, .72); text-align: center; }
.practice-empty p { margin: 0 0 16px; }
.practice-empty button { min-height: 44px; padding: 0 18px; border: 1px solid #353535; border-radius: 8px; background: #353535; color: #fff; cursor: pointer; }
.practice-empty button:hover { background: #111; }
.practice-page :focus-visible { outline: 2px solid #252525; outline-offset: 3px; }

@keyframes practice-arrive { from { opacity: 0; translate: 0 20px; } to { opacity: 1; translate: 0 0; } }
@keyframes detail-arrive { from { opacity: 0; translate: 0 -5px; } to { opacity: 1; translate: 0 0; } }

@media (hover: hover) {
  .practice-card:hover { transform: translateY(-7px); border-color: rgba(70, 70, 70, .3); box-shadow: 0 27px 54px rgba(25, 25, 25, .16), inset 0 1px rgba(255, 255, 255, .9); }
}

@media (max-width: 700px) {
  .practice-page { padding: 32px 0 72px; }
  .practice-content { width: calc(100% - 32px); }
  .practice-heading > div { display: block; }
  .practice-heading p { margin-top: 10px; }
  .practice-search { height: 50px; margin: 34px auto 28px; }
  .practice-search-feedback { margin: -17px 0 18px; }
  .practice-grid { grid-template-columns: 1fr; gap: 18px; }
  .practice-card { min-height: 320px; padding: 24px; }
  .practice-card h2 { margin-top: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .practice-card, .practice-search, .practice-card-details summary::after { animation: none; transition: none; }
  .practice-card-details p { animation: none; }
  .practice-card:hover { transform: none; }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .practice-card, .practice-search { background: rgba(255, 255, 255, .92); }
}
</style>
