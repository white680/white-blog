<script setup lang="ts">
import { mockPosts } from '~/data/mock'
import { getArchiveWheelAction } from '~/utils/archiveWheel'
import '~/assets/styles/posts.css'

const posts = [...mockPosts].sort((a, b) => b.date.localeCompare(a.date))
const timelineEl = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const scrollProgress = ref(0)
const isDragging = ref(false)
let pointerStartX = 0
let scrollStartX = 0
let pointerDown = false
let moved = false

function syncTimeline() {
  const timeline = timelineEl.value
  if (!timeline) return
  const maxScroll = Math.max(0, timeline.scrollWidth - timeline.clientWidth)
  canScrollLeft.value = timeline.scrollLeft > 2
  canScrollRight.value = timeline.scrollLeft < maxScroll - 2
  scrollProgress.value = maxScroll ? timeline.scrollLeft / maxScroll * 100 : 100
}

function moveTimeline(direction: -1 | 1) {
  const timeline = timelineEl.value
  if (!timeline) return
  const entries = timeline.querySelectorAll<HTMLElement>('.archive-entry')
  const step = entries.length > 1 ? entries[1]!.offsetLeft - entries[0]!.offsetLeft : timeline.clientWidth
  timeline.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}

function onWheel(event: WheelEvent) {
  const timeline = timelineEl.value
  if (!timeline) return
  const action = getArchiveWheelAction(
    event,
    timeline.scrollLeft,
    Math.max(0, timeline.scrollWidth - timeline.clientWidth),
    timeline.clientWidth,
    window.innerHeight,
  )
  if (!action) return
  event.preventDefault()
  if (action.target === 'page') window.scrollBy({ top: action.delta, behavior: 'instant' })
  else timeline.scrollLeft += action.delta
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || event.button !== 0 || !timelineEl.value) return
  pointerDown = true
  moved = false
  pointerStartX = event.clientX
  scrollStartX = timelineEl.value.scrollLeft
}

function onPointerMove(event: PointerEvent) {
  if (!pointerDown || !timelineEl.value) return
  const distance = event.clientX - pointerStartX
  if (!moved && Math.abs(distance) < 5) return
  moved = true
  isDragging.value = true
  timelineEl.value.scrollLeft = scrollStartX - distance
}

function onPointerUp() {
  pointerDown = false
  isDragging.value = false
  if (moved) window.setTimeout(() => { moved = false }, 0)
}

function onClickCapture(event: MouseEvent) {
  if (!moved) return
  event.preventDefault()
  event.stopPropagation()
}

onMounted(() => {
  syncTimeline()
  window.addEventListener('resize', syncTimeline)
})

onUnmounted(() => window.removeEventListener('resize', syncTimeline))

useSeoMeta({
  title: '归档 · white-博客',
  description: '按时间浏览 White 的文章。',
  ogTitle: '归档 · white-博客',
  ogDescription: '按时间浏览 White 的文章。',
  ogType: 'website',
})
</script>

<template>
  <div class="posts-journal archive-journal">
    <div class="posts-journal-background" aria-hidden="true" />
    <div class="posts-journal-content archive-content">
      <header class="archive-heading">
        <div>
          <h1>归档</h1>
          <p>{{ posts.length }} 篇文章<span v-if="posts[0]"> · {{ posts[0].date.slice(0, 4) }}</span></p>
        </div>
        <div class="archive-controls" aria-label="时间线控制">
          <button type="button" aria-label="向左浏览归档" :disabled="!canScrollLeft" @click="moveTimeline(-1)">←</button>
          <button type="button" aria-label="向右浏览归档" :disabled="!canScrollRight" @click="moveTimeline(1)">→</button>
        </div>
      </header>

      <div
        v-if="posts.length"
        ref="timelineEl"
        class="archive-viewport"
        :class="{ 'is-dragging': isDragging }"
        role="region"
        aria-label="文章时间线，可左右滑动"
        tabindex="0"
        @scroll.passive="syncTimeline"
        @wheel="onWheel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointerleave="onPointerUp"
        @click.capture="onClickCapture"
        @dragstart.prevent
      >
        <div class="archive-timeline">
          <article v-for="(post, index) in posts" :key="post.slug" class="archive-entry" :style="{ '--item-index': index }">
            <time class="archive-date" :datetime="post.date">{{ post.date.replaceAll('-', '.') }}</time>
            <span class="archive-marker" aria-hidden="true" />
            <NuxtLink class="archive-story" :to="`/posts/${post.slug}`">
              <span class="archive-category">{{ post.category }}</span>
              <h2>{{ post.title }}</h2>
              <p>{{ post.excerpt }}</p>
              <span class="archive-read">阅读文章 <span aria-hidden="true">↗</span></span>
            </NuxtLink>
          </article>
        </div>
      </div>
      <div v-if="posts.length" class="archive-progress" aria-hidden="true"><span :style="{ width: `${scrollProgress}%` }" /></div>
      <p v-else class="archive-empty">暂无文章。</p>
    </div>
  </div>
</template>

<style scoped>
:global(.site-shell:has(.archive-journal)) { --surface-deep: #202020; }
.archive-journal { min-height: calc(100svh - 94px); background: #f4f4f4; }
.archive-content { padding-top: clamp(20px, 2.5vw, 36px); }
.archive-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; padding-bottom: 18px; }
.archive-heading h1 { margin: 0; color: #252525; font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif; font-size: clamp(38px, 4.6vw, 64px); font-weight: 500; line-height: 1.2; }
.archive-heading p { margin: 12px 0 0; color: #555; font-size: 14px; font-variant-numeric: tabular-nums; }
.archive-controls { display: flex; gap: 10px; }
.archive-controls button { display: grid; width: 48px; height: 48px; place-items: center; border: 1px solid rgba(38,38,38,.24); border-radius: 50%; background: rgba(255,255,255,.68); color: #242424; font-size: 24px; line-height: 1; backdrop-filter: blur(14px); transition: background .2s ease, transform .25s cubic-bezier(.22,1,.36,1); }
.archive-controls button:not(:disabled):hover { background: #252525; color: #fff; transform: translateY(-3px); }
.archive-controls button:disabled { opacity: .35; cursor: default; }
.archive-controls button:focus-visible, .archive-viewport:focus-visible, .archive-story:focus-visible { outline: 2px solid #252525; outline-offset: 4px; }
.archive-viewport { overflow-x: auto; overflow-y: hidden; padding: 10px 2px 32px; scrollbar-width: none; cursor: grab; }
.archive-viewport::-webkit-scrollbar { display: none; }
.archive-viewport.is-dragging { scroll-snap-type: none; cursor: grabbing; }
.archive-timeline { position: relative; display: flex; width: max-content; min-width: 100%; gap: clamp(18px, 2vw, 30px); padding: 0 4px; user-select: none; }
.archive-timeline::before { position: absolute; top: 80px; right: 0; left: 0; height: 4px; border-radius: 99px; background: #606060; content: ''; }
.archive-entry { position: relative; display: grid; width: clamp(280px, 28vw, 340px); flex: none; grid-template-rows: 64px 36px 28px 1fr; scroll-snap-align: start; animation: archive-arrive .65s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--item-index) * 70ms); }
.archive-entry::before { position: absolute; top: 91px; left: calc(50% - 1px); width: 2px; height: 37px; background: #777; content: ''; transition: background .25s ease; }
.archive-date { justify-self: center; align-self: end; padding-bottom: 13px; color: #404040; font-family: Georgia, 'Noto Serif SC', serif; font-size: 22px; font-variant-numeric: tabular-nums; transition: color .25s ease; }
.archive-marker { position: relative; z-index: 1; width: 22px; height: 22px; justify-self: center; align-self: center; border: 3px solid #2d2d2d; border-radius: 50%; background: #f4f4f4; box-shadow: 0 0 0 5px rgba(244,244,244,.9); transition: transform .3s cubic-bezier(.22,1,.36,1), background .3s ease; }
.archive-marker::after { position: absolute; inset: 5px; border-radius: 50%; background: #2d2d2d; content: ''; transition: background .3s ease; }
.archive-entry:hover::before, .archive-entry:focus-within::before { background: #2d2d2d; }
.archive-entry:hover .archive-date, .archive-entry:focus-within .archive-date { color: #111; }
.archive-entry:hover .archive-marker, .archive-entry:focus-within .archive-marker { background: #2d2d2d; transform: scale(1.18); }
.archive-entry:hover .archive-marker::after, .archive-entry:focus-within .archive-marker::after { background: #f4f4f4; }
.archive-story { display: flex; grid-row: 4; min-height: 240px; flex-direction: column; padding: 28px; border: 1px solid rgba(255,255,255,.72); border-radius: 15px; background: rgba(255,255,255,.72); box-shadow: 0 12px 34px rgba(25,25,25,.08); text-decoration: none; backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); transition: transform .35s cubic-bezier(.22,1,.36,1), background .25s ease, box-shadow .35s ease; }
.archive-story:hover, .archive-story:focus-visible { background: rgba(255,255,255,.94); box-shadow: 0 20px 42px rgba(25,25,25,.13); transform: translateY(-4px); }
.archive-category { color: #666; font-size: 13px; }
.archive-story h2 { margin: 24px 0 0; color: #252525; font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif; font-size: clamp(23px, 2vw, 28px); font-weight: 600; line-height: 1.38; }
.archive-story p { margin: 12px 0 24px; color: #575757; font-size: 14px; line-height: 1.7; }
.archive-read { display: flex; align-items: center; justify-content: space-between; margin-top: auto; color: #292929; font-size: 13px; font-weight: 600; }
.archive-read span { font-size: 20px; font-weight: 400; transition: transform .25s ease; }
.archive-story:hover .archive-read span, .archive-story:focus-visible .archive-read span { transform: translate(3px,-3px); }
.archive-progress { height: 3px; margin-top: 14px; border-radius: 99px; background: rgba(38,38,38,.18); }
.archive-progress span { display: block; height: 100%; border-radius: inherit; background: #292929; transition: width .15s ease; }
.archive-empty { padding: 64px 0; color: #555; font-size: 16px; }
@keyframes archive-arrive { from { opacity: 0; translate: 0 22px; } to { opacity: 1; translate: 0 0; } }
@media (hover: none) and (pointer: coarse) {
  .archive-viewport { scroll-snap-type: x proximity; scroll-padding-inline: 4px; }
}
@media (max-width: 640px) {
  .archive-content { width: calc(100% - 32px); padding-top: 20px; }
  .archive-heading { align-items: center; padding-bottom: 20px; }
  .archive-heading h1 { font-size: 38px; }
  .archive-heading p { margin-top: 7px; font-size: 12px; }
  .archive-controls button { width: 44px; height: 44px; }
  .archive-entry { width: min(78vw, 320px); }
  .archive-story { min-height: 250px; padding: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .archive-entry { animation: none; }
  .archive-controls button, .archive-entry::before, .archive-date, .archive-marker, .archive-marker::after, .archive-story, .archive-read span, .archive-progress span { transition: none; }
  .archive-controls button:not(:disabled):hover, .archive-story:hover, .archive-story:focus-visible, .archive-entry:hover .archive-marker, .archive-entry:focus-within .archive-marker { transform: none; }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .archive-story, .archive-controls button { background: rgba(255,255,255,.94); } }
</style>
