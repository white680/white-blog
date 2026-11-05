<script setup lang="ts">
import { mockMoments } from '~/data/mock'
import '~/assets/styles/posts.css'

const dialogRef = ref<HTMLDialogElement | null>(null)
const selectedIndex = ref<number | null>(null)
const selectedMoment = computed(() => selectedIndex.value === null ? null : mockMoments[selectedIndex.value])

async function openMoment(index: number) {
  selectedIndex.value = index
  await nextTick()
  if (!dialogRef.value?.open) dialogRef.value?.showModal()
}

useSeoMeta({
  title: '片刻记录 · white-博客',
  description: '一些写作、界面与日常观察。',
  ogTitle: '片刻记录 · white-博客',
  ogDescription: '一些写作、界面与日常观察。',
  ogType: 'website',
})
</script>

<template>
  <div class="posts-journal moments-journal">
    <div class="posts-journal-background" aria-hidden="true" />
    <div class="posts-journal-content">
      <header class="posts-journal-heading">
        <h1>片刻记录</h1>
        <span>{{ mockMoments.length }} 则</span>
      </header>

      <div class="moments-notes">
        <article v-for="(moment, index) in mockMoments" :id="`moment-${moment.date}`" :key="moment.date" class="moments-note" :class="`moment-tone-${index % 6 + 1}`">
          <div class="moments-note-topline">
            <span class="moments-note-number">NOTE {{ String(index + 1).padStart(2, '0') }}</span>
            <time :datetime="moment.date">{{ moment.date.replaceAll('-', '.') }}</time>
          </div>
          <h2>{{ moment.title }}</h2>
          <p class="moments-note-preview">{{ moment.text }}</p>
          <div class="moments-note-footer">
            <span>{{ moment.weather }} · {{ moment.mood }}</span>
            <button type="button" @click="openMoment(index)">只看这条 <span aria-hidden="true">↗</span></button>
          </div>
        </article>
      </div>
    </div>

    <dialog ref="dialogRef" class="moment-dialog" :class="selectedIndex === null ? undefined : `moment-tone-${selectedIndex % 6 + 1}`" aria-labelledby="moment-dialog-title" @close="selectedIndex = null">
      <template v-if="selectedMoment">
        <div class="moment-dialog-topline">
          <span>White / NOTE {{ String((selectedIndex ?? 0) + 1).padStart(2, '0') }}</span>
          <form method="dialog"><button type="submit" class="moment-dialog-close" aria-label="关闭片刻详情">×</button></form>
        </div>
        <time :datetime="selectedMoment.date">{{ selectedMoment.date.replaceAll('-', '.') }}</time>
        <h2 id="moment-dialog-title">{{ selectedMoment.title }}</h2>
        <p class="moment-dialog-text">{{ selectedMoment.text }}</p>
        <div class="moment-dialog-footer"><span>{{ selectedMoment.weather }} · {{ selectedMoment.mood }}</span><span>片刻 {{ String((selectedIndex ?? 0) + 1).padStart(2, '0') }}</span></div>
      </template>
    </dialog>
  </div>
</template>

<style scoped>
:global(html:has(.moment-dialog[open])) { overflow: hidden; scrollbar-gutter: stable; }

.moments-journal {
  overflow: hidden;
}

.moments-journal .posts-journal-content {
  position: relative;
  z-index: 1;
  width: min(1080px, calc(100% - 64px));
}

.moments-journal .posts-journal-heading {
  width: 100%;
  margin-bottom: 52px;
}

.moments-notes {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 56px 10px;
  align-items: start;
  padding: 12px 12px 60px;
}

.moments-note, .moment-dialog {
  --paper: #e7f0f3;
  --tab: #b5ced4;
  --ink: #243039;
}

.moments-note {
  --offset: 0px;
  --delay: 0ms;
  position: relative;
  display: flex;
  flex-direction: column;
  grid-column: span 6;
  min-width: 0;
  min-height: 260px;
  padding: 38px clamp(24px, 3vw, 38px) 26px;
  border-radius: 3px;
  background: var(--paper);
  box-shadow: 0 16px 38px rgba(34, 44, 54, .14);
  color: var(--ink);
  transform: translateY(var(--offset));
  transition: transform .36s cubic-bezier(.22, 1, .36, 1), box-shadow .36s ease;
  animation: note-arrive .7s cubic-bezier(.16, 1, .3, 1) var(--delay) both;
  scroll-margin-top: 116px;
}

.moments-note:nth-child(6n + 1) { grid-column: 1 / span 7; }
.moments-note:nth-child(6n + 2) { grid-column: 9 / span 4; --offset: 42px; }
.moments-note:nth-child(6n + 3) { grid-column: 2 / span 5; }
.moments-note:nth-child(6n + 4) { grid-column: 7 / span 6; --offset: 26px; }
.moments-note:nth-child(6n + 5) { grid-column: 1 / span 5; --offset: 8px; }
.moments-note:nth-child(6n + 6) { grid-column: 7 / span 6; --offset: 38px; }

.moment-tone-2 { --paper: #f2e8ec; --tab: #dec1cc; }
.moment-tone-3 { --paper: #e8edf5; --tab: #b9c9dc; }
.moment-tone-4 { --paper: #f2efe6; --tab: #d9cfb9; }
.moment-tone-5 { --paper: #e7eee8; --tab: #bfd3c3; }
.moment-tone-6 { --paper: #eee9f1; --tab: #d1c4d9; }
.moments-note:nth-child(6n + 2) { --delay: 90ms; }
.moments-note:nth-child(6n + 3) { --delay: 180ms; }
.moments-note:nth-child(6n + 4) { --delay: 270ms; }
.moments-note:nth-child(6n + 5) { --delay: 360ms; }
.moments-note:nth-child(6n + 6) { --delay: 450ms; }

.moments-note::before {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 62px;
  height: 21px;
  transform: translateX(-50%) rotate(-5deg);
  background: rgba(255, 255, 255, .56);
  box-shadow: 0 1px 3px rgba(40, 45, 50, .07);
  content: '';
  pointer-events: none;
}

.moments-note:nth-child(even)::before { left: 58%; transform: translateX(-50%) rotate(5deg); }
.moments-note:target { outline: 3px solid #454b51; outline-offset: 5px; }

.moments-note-topline {
  display: flex;
  min-height: 20px;
  align-items: flex-start;
  justify-content: flex-end;
  color: var(--ink);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.moments-note-number {
  position: absolute;
  top: -12px;
  left: 24px;
  padding: 7px 13px 6px;
  border-radius: 3px 3px 0 0;
  background: var(--tab);
  color: var(--ink);
  font-weight: 600;
  line-height: 1.2;
}

.moments-note h2 {
  margin: 18px 0 12px;
  font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
  font-size: clamp(21px, 2vw, 25px);
  font-weight: 600;
  line-height: 1.45;
}

.moments-note-preview {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  max-width: 56ch;
  margin: 0;
  font-size: 16px;
  line-height: 1.85;
  overflow-wrap: anywhere;
}

.moments-note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 18px;
  color: var(--ink);
  font-size: 12px;
}

.moments-note-footer button {
  min-height: 44px;
  padding: 0 0 0 10px;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
.moments-note-footer button span { display: inline-block; margin-left: 3px; transition: transform .25s ease; }
.moments-note-footer button:hover span { transform: translate(2px, -2px); }
.moments-note-footer button:focus-visible { outline: none; text-decoration: underline; text-underline-offset: 4px; }
.moment-dialog-close:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }

.moment-dialog {
  width: min(640px, calc(100% - 32px));
  max-height: calc(100dvh - 48px);
  overflow: auto;
  margin: auto;
  padding: clamp(28px, 5vw, 46px);
  border: 0;
  border-radius: 6px;
  background: var(--paper);
  box-shadow: 0 28px 80px rgba(15, 24, 30, .28);
  color: var(--ink);
}
.moment-dialog[open] { animation: note-dialog-arrive .3s cubic-bezier(.22, 1, .36, 1) both; }
.moment-dialog::backdrop { background: rgba(25, 31, 38, .54); backdrop-filter: blur(10px); }
.moment-dialog-topline, .moment-dialog-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.moment-dialog-topline { margin-bottom: 26px; font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif; font-size: 16px; font-weight: 700; }
.moment-dialog-close { width: 44px; height: 44px; border: 1px solid currentColor; border-radius: 50%; background: transparent; color: var(--ink); cursor: pointer; font: 25px/1 sans-serif; }
.moment-dialog time, .moment-dialog-footer { font-size: 12px; font-variant-numeric: tabular-nums; }
.moment-dialog h2 { margin: 13px 0 25px; font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif; font-size: clamp(25px, 3vw, 32px); font-weight: 600; }
.moment-dialog-text { margin: 0; font-size: 17px; line-height: 2; overflow-wrap: anywhere; white-space: pre-line; }
.moment-dialog-footer { margin-top: 38px; padding-top: 14px; border-top: 1px solid currentColor; }
@keyframes note-dialog-arrive { from { opacity: 0; transform: translateY(12px) scale(.985); } to { opacity: 1; transform: none; } }

@keyframes note-arrive {
  from { opacity: 0; translate: 0 20px; }
  to { opacity: 1; translate: 0 0; }
}

@media (hover: hover) {
  .moments-note:hover {
    z-index: 2;
    transform: translateY(calc(var(--offset) - 8px));
    box-shadow: 0 25px 48px rgba(34, 44, 54, .2);
  }
}

@media (max-width: 900px) {
  .moments-notes { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 42px 24px; }
  .moments-note:nth-child(n) { grid-column: auto; --offset: 0px; }
  .moments-note:nth-child(even) { --offset: 26px; }
}

@media (max-width: 700px) {
  .moments-notes { grid-template-columns: 1fr; gap: 30px; }
  .moments-note:nth-child(n) { width: 95%; min-height: 0; --offset: 0px; }
  .moments-note:nth-child(even) { margin-left: auto; }
}

@media (max-width: 640px) {
  .moments-journal .posts-journal-content { width: calc(100% - 32px); }
  .moments-journal .posts-journal-heading { margin-bottom: 44px; }
  .moments-notes { gap: 26px; padding: 4px 3px 22px; }
  .moments-note { padding: 33px 22px 22px; }
  .moments-note-number { left: 22px; }
  .moment-dialog { max-height: calc(100dvh - 32px); padding: 27px 24px; }
  .moment-dialog-text { font-size: 16px; line-height: 1.85; }
}

@media (prefers-reduced-motion: reduce) {
  .moments-note { animation: none; transition: none; }
  .moments-note:hover { transform: translateY(var(--offset)); box-shadow: 0 16px 38px rgba(34, 44, 54, .14); }
  .moments-note-footer button span { transition: none; }
  .moment-dialog[open] { animation: none; }
}

</style>
