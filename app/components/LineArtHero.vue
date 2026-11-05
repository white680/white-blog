<script setup lang="ts">
import { createHeroScrollGesture } from '~/utils/heroScrollGesture'

/**
 * 线稿动态 Hero：
 * - 入场：按「手写体 → 轮廓 → 发丝 → 五官 → 衣领 → 排线」顺序描画，最后整体补全；
 * - 循环：外侧发丝轻摆、人物整体呼吸；
 * - 鼠标视差：整幅画随指针轻微位移。
 * 静态/无 JS/减少动效偏好时自动呈现完整线稿。
 */
const props = withDefaults(defineProps<{
  title?: string
  lead?: string
  ctaText?: string
  ctaTo?: string
}>(), {
  title: '把想法写下，把日子留住。',
  lead: '',
  ctaText: '阅读文章',
  ctaTo: '/posts',
})

const heroEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const scrollGesture = createHeroScrollGesture()
let jumpTimer = 0
let enterFrame = 0

function scrollToContent(fromClick = false) {
  const content = document.getElementById('home-content')
  if (!content) return
  if (fromClick) scrollGesture.startFromClick()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // 用绝对坐标而不是 scrollIntoView：Section 上带着全局 scroll-margin-top（给吸顶导航留白），
  // 在首页导航不吸顶的情况下会把内容停在视口下方 104px，导致"滚到的位置不对"。
  const top = content.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: reduce ? 'instant' : 'smooth' })
  // scrollend 标记到达；超时兜底兼容没有 scrollend 的浏览器。
  window.clearTimeout(jumpTimer)
  jumpTimer = window.setTimeout(() => scrollGesture.arrive(), 1200)
}

function onScrollEnd() {
  const content = document.getElementById('home-content')
  if (content && Math.abs(content.getBoundingClientRect().top) <= 2) scrollGesture.arrive()
  else scrollGesture.reset()
  window.clearTimeout(jumpTimer)
}

function onWheel(event: WheelEvent) {
  if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (document.querySelector('.glass-mobile[open]')) {
    scrollGesture.reset()
    return
  }
  const bounds = heroEl.value?.getBoundingClientRect()
  const canJump = !!bounds && bounds.bottom > 1 && bounds.top < window.innerHeight
  const action = scrollGesture.wheel(event.deltaY, performance.now(), canJump)
  if (action === 'cancel') {
    window.clearTimeout(jumpTimer)
    window.scrollTo({ top: window.scrollY, behavior: 'instant' })
    return
  }
  if (action === 'native') return
  event.preventDefault()
  if (action === 'jump') scrollToContent()
}

onMounted(() => {
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scrollend', onScrollEnd)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  enterFrame = requestAnimationFrame(() => heroEl.value?.classList.add('is-enter'))
})

onUnmounted(() => {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('scrollend', onScrollEnd)
  window.clearTimeout(jumpTimer)
  cancelAnimationFrame(enterFrame)
})

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch' || !heroEl.value || !stageEl.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = heroEl.value.getBoundingClientRect()
  const nx = (event.clientX - rect.left) / rect.width - 0.5
  const ny = (event.clientY - rect.top) / rect.height - 0.5
  stageEl.value.style.setProperty('--la-parallax-x', `${(nx * 10).toFixed(1)}px`)
  stageEl.value.style.setProperty('--la-parallax-y', `${(ny * 8).toFixed(1)}px`)
}

function onPointerLeave() {
  stageEl.value?.style.removeProperty('--la-parallax-x')
  stageEl.value?.style.removeProperty('--la-parallax-y')
}
</script>

<template>
  <section
    ref="heroEl"
    class="lineart-hero"
    aria-labelledby="lineart-title"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <div ref="stageEl" class="lineart-stage" aria-hidden="true">
      <svg v-for="mode in ['light', 'dark']" :key="mode" class="lineart-svg" :class="`lineart-svg--${mode}`" viewBox="0 0 1672 940" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask :id="`la-m-script-${mode}`" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="940">
            <rect x="0" y="0" width="1672" height="940" fill="#000" />
            <polyline class="la-sweep la-s1" pathLength="1" points="550,270 557,280 562,291 565,303 567,324 557,346 545,368 538,390 522,412 505,434 487,456 468,478 465,500 458,522 453,543 450,566 446,588 445,609 461,632 503,653 550,675 567,686 592,697 629,708" />
            <rect class="la-settle" x="0" y="0" width="1672" height="940" />
          </mask>
          <mask :id="`la-m-l1-${mode}`" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="940">
            <rect x="0" y="0" width="1672" height="940" fill="#000" />
            <polyline class="la-sweep la-s2" pathLength="1" points="1321,103 1321,207 803,310 903,414 803,526 803,630 936,733 803,837" />
            <polyline class="la-sweep la-s3" pathLength="1" points="1438,103 1471,207 1639,310 1655,414 1622,526 1571,630 1538,733 1471,837" />
            <polyline class="la-sweep la-s4" pathLength="1" points="1037,141 1050,240 1060,320 1052,423" />
            <polyline class="la-sweep la-s5" pathLength="1" points="1254,138 1270,250 1262,330 1270,424" />
            <polyline class="la-sweep la-s6" pathLength="1" points="1455,140 1470,260 1460,330 1472,424" />
            <polyline class="la-sweep la-s7" pathLength="1" points="1000,326 1310,326" />
            <polyline class="la-sweep la-s10" pathLength="1" points="1040,460 1471,160" />
            <polyline class="la-sweep la-s11" pathLength="1" points="1090,470 1505,180" />
            <polyline class="la-sweep la-s12" pathLength="1" points="1140,480 1540,200" />
            <rect class="la-settle" x="0" y="0" width="1672" height="940" />
          </mask>
          <mask :id="`la-m-l2-${mode}`" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="940">
            <rect x="0" y="0" width="1672" height="940" fill="#000" />
            <polyline class="la-sweep la-s2" pathLength="1" points="1321,103 1321,207 803,310 903,414 803,526 803,630 936,733 803,837" />
            <polyline class="la-sweep la-s3" pathLength="1" points="1438,103 1471,207 1639,310 1655,414 1622,526 1571,630 1538,733 1471,837" />
            <polyline class="la-sweep la-s4" pathLength="1" points="1037,141 1050,240 1060,320 1052,423" />
            <polyline class="la-sweep la-s5" pathLength="1" points="1254,138 1270,250 1262,330 1270,424" />
            <polyline class="la-sweep la-s6" pathLength="1" points="1455,140 1470,260 1460,330 1472,424" />
            <polyline class="la-sweep la-s7" pathLength="1" points="1000,326 1310,326" />
            <polyline class="la-sweep la-s8" pathLength="1" points="1030,430 1130,430" />
            <polyline class="la-sweep la-s9" pathLength="1" points="1237,489 1246,560 1246,640 1255,724" />
            <polyline class="la-sweep la-s10" pathLength="1" points="1040,460 1471,160" />
            <polyline class="la-sweep la-s11" pathLength="1" points="1090,470 1505,180" />
            <polyline class="la-sweep la-s12" pathLength="1" points="1140,480 1540,200" />
            <rect class="la-settle" x="0" y="0" width="1672" height="940" />
          </mask>
          <!-- Codex 修改：只提取远离眉眼与拼接带的外侧发丝用于轻摆。 -->
          <radialGradient :id="`la-wisp-left-${mode}`"><stop offset="0" stop-color="#fff" stop-opacity=".75" /><stop offset="1" stop-color="#000" /></radialGradient>
          <radialGradient :id="`la-wisp-right-${mode}`"><stop offset="0" stop-color="#fff" stop-opacity=".65" /><stop offset="1" stop-color="#000" /></radialGradient>
          <mask :id="`la-m-wisp-left-${mode}`" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="940">
            <ellipse cx="889" cy="139" rx="128" ry="145" :fill="`url(#la-wisp-left-${mode})`" />
          </mask>
          <mask :id="`la-m-wisp-right-${mode}`" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="940">
            <ellipse cx="1560" cy="156" rx="103" ry="130" :fill="`url(#la-wisp-right-${mode})`" />
          </mask>
        </defs>

        <image class="la-art" :href="mode === 'dark' ? '/images/lineart/black.png' : '/images/lineart/script.webp'" x="0" y="0" width="1672" height="940" :mask="`url(#la-m-script-${mode})`" />
        <g class="la-breathe">
          <image :href="mode === 'dark' ? '/images/lineart/black.png' : '/images/lineart/girl-l1.webp'" x="0" y="0" width="1672" height="940" :mask="`url(#la-m-l1-${mode})`" />
          <image :href="mode === 'dark' ? '/images/lineart/black.png' : '/images/lineart/girl-l2.webp'" x="0" y="0" width="1672" height="940" :mask="`url(#la-m-l2-${mode})`" />
          <image class="la-wisp la-wisp--left" :href="mode === 'dark' ? '/images/lineart/black.png' : '/images/lineart/girl-l1.webp'" x="0" y="0" width="1672" height="940" :mask="`url(#la-m-wisp-left-${mode})`" />
          <image class="la-wisp la-wisp--right" :href="mode === 'dark' ? '/images/lineart/black.png' : '/images/lineart/girl-l1.webp'" x="0" y="0" width="1672" height="940" :mask="`url(#la-m-wisp-right-${mode})`" />
        </g>
      </svg>
    </div>

    <div class="lineart-copy">
      <div class="lineart-copy-main">
        <h1 id="lineart-title">{{ props.title }}</h1>
        <p v-if="props.lead">{{ props.lead }}</p>
      </div>
      <NuxtLink class="lineart-cta" :to="props.ctaTo">{{ props.ctaText }} <span aria-hidden="true">↘</span></NuxtLink>
    </div>
    <a class="lineart-scroll" href="#home-content" aria-label="向下浏览首页内容" @click.prevent="scrollToContent(true)">
      <span>SCROLL</span>
      <svg width="20" height="23" viewBox="0 0 20 23" fill="none" aria-hidden="true">
        <path d="m5 6 5 5 5-5M5 12l5 5 5-5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
  </section>
</template>

<style scoped>
.lineart-hero {
  position: relative;
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(22px, 3vh, 38px);
  overflow: hidden;
  padding: 112px var(--page-gutter) 100px;
  background: linear-gradient(180deg, #ffffff 0%, #ffffff calc(100% - 150px), var(--home-paper) 100%);
  color: var(--home-ink);
}
.lineart-hero::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #282828 0%, #282828 calc(100% - 150px), var(--home-paper) 100%);
  content: '';
  opacity: 0;
  pointer-events: none;
  transition: opacity .65s ease;
}
.lineart-stage {
  position: relative;
  width: min(1120px, 100%, calc((100svh - 300px) * 1.7787));
}
.lineart-svg {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
  transform: translate3d(var(--la-parallax-x, 0px), var(--la-parallax-y, 0px), 0);
  transition: opacity .65s ease, transform .55s cubic-bezier(.22, .61, .36, 1);
}
.lineart-svg--light { mix-blend-mode: multiply; }
.lineart-svg--dark { position: absolute; inset: 0; opacity: 0; mix-blend-mode: screen; }

/* —— 入场描画 —— */
.la-sweep { fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
.la-settle { fill: #fff; opacity: 1; }
.la-s1 { stroke-width: 150; }
.la-s2, .la-s3 { stroke-width: 120; }
.la-s4, .la-s5, .la-s6 { stroke-width: 130; }
.la-s7 { stroke-width: 150; }
.la-s8 { stroke-width: 70; }
.la-s9 { stroke-width: 240; }
.la-s10 { stroke-width: 110; }
.la-s11 { stroke-width: 100; }
.la-s12 { stroke-width: 90; }

@keyframes la-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes la-fade { from { opacity: 0; } to { opacity: 1; } }

.is-enter .la-s1 { animation: la-draw 1.25s cubic-bezier(.45, .05, .35, 1) .05s both; }
.is-enter .la-s2 { animation: la-draw .95s cubic-bezier(.45, .05, .35, 1) .5s both; }
.is-enter .la-s3 { animation: la-draw .95s cubic-bezier(.45, .05, .35, 1) .8s both; }
.is-enter .la-s4 { animation: la-draw .85s cubic-bezier(.45, .05, .35, 1) 1.1s both; }
.is-enter .la-s5 { animation: la-draw .85s cubic-bezier(.45, .05, .35, 1) 1.3s both; }
.is-enter .la-s6 { animation: la-draw .85s cubic-bezier(.45, .05, .35, 1) 1.5s both; }
.is-enter .la-s7 { animation: la-draw .7s cubic-bezier(.45, .05, .35, 1) 1.8s both; }
.is-enter .la-s8 { animation: la-draw .6s cubic-bezier(.45, .05, .35, 1) 2.05s both; }
.is-enter .la-s9 { animation: la-draw .75s cubic-bezier(.45, .05, .35, 1) 2.2s both; }
.is-enter .la-s10 { animation: la-draw .75s cubic-bezier(.45, .05, .35, 1) 2.45s both; }
.is-enter .la-s11 { animation: la-draw .75s cubic-bezier(.45, .05, .35, 1) 2.65s both; }
.is-enter .la-s12 { animation: la-draw .75s cubic-bezier(.45, .05, .35, 1) 2.85s both; }
.is-enter .la-settle { animation: la-fade .6s ease 3.45s both; }

/* —— 循环：呼吸 / 外侧发丝轻摆 —— */
.la-breathe { transform-box: view-box; transform-origin: 50% 50%; }
.is-enter .la-breathe { animation: la-breathe 7.5s ease-in-out infinite; }
@keyframes la-breathe {
  0%, 100% { transform: none; }
  25% { transform: translateY(-.28%) rotate(-.12deg); }
  75% { transform: translateY(.28%) rotate(.12deg); }
}
.la-wisp { opacity: 0; transform-box: view-box; }
.la-wisp--left { transform-origin: 938px 284px; }
.la-wisp--right { transform-origin: 1490px 277px; }
.is-enter .la-wisp--left { animation: la-wisp-in .3s ease 3.45s forwards, la-wisp-left 6.6s ease-in-out 3.75s infinite; }
.is-enter .la-wisp--right { animation: la-wisp-in .3s ease 3.45s forwards, la-wisp-right 7.8s ease-in-out 3.75s infinite; }
@keyframes la-wisp-in { to { opacity: .38; } }
@keyframes la-wisp-left {
  0%, 100% { transform: none; }
  35% { transform: translateX(2px) rotate(.16deg); }
  70% { transform: translateX(-1px) rotate(-.1deg); }
}
@keyframes la-wisp-right {
  0%, 100% { transform: none; }
  45% { transform: translateX(-2px) rotate(-.13deg); }
  75% { transform: translateX(1px) rotate(.08deg); }
}

/* —— 文案 —— */
.lineart-copy {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(100%, 1000px);
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}
.lineart-copy-main h1 {
  margin: 0;
  font-family: "Noto Serif SC", "Songti SC", "SimSun", serif;
  font-size: clamp(21px, 2.4vw, 32px);
  font-weight: 400;
  letter-spacing: .04em;
  line-height: 1.5;
}
.lineart-copy-main p {
  margin: 12px 0 0;
  color: var(--home-muted);
  font-size: clamp(14px, 1.4vw, 16px);
  line-height: 1.7;
}
.lineart-cta {
  display: inline-flex;
  min-height: 44px;
  flex: none;
  align-items: center;
  gap: 14px;
  padding: 0 22px;
  border: 1px solid var(--home-line);
  border-radius: 999px;
  color: var(--home-ink);
  font-size: 14px;
  transition: background .25s ease, color .25s ease, border-color .25s ease;
}
.lineart-cta:hover { background: var(--home-ink); border-color: var(--home-ink); color: var(--home-button-on); }
.lineart-cta span { font-size: 18px; }

/* Codex 添加：可点击、可键盘访问的首屏滚动提示。 */
.lineart-scroll {
  position: absolute;
  z-index: 1;
  bottom: 20px;
  left: 50%;
  display: flex;
  min-width: 80px;
  min-height: 58px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 8px;
  color: var(--home-accent-strong);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .14em;
  text-decoration: none;
  transform: translateX(-50%);
  transition: color .2s ease;
}
.lineart-scroll:hover { color: var(--home-accent); }
.lineart-scroll svg { animation: la-scroll 1.8s ease-in-out infinite; }
@keyframes la-scroll { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }

.is-enter .lineart-copy-main { animation: la-rise .8s ease-out .7s both; }
.is-enter .lineart-cta { animation: la-rise .8s ease-out .85s both; }
@keyframes la-rise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 760px) {
  .lineart-hero { padding-top: 96px; gap: 24px; }
  .lineart-stage { width: 100%; }
  .lineart-copy { flex-direction: column; align-items: center; gap: 18px; text-align: center; }
  .lineart-copy-main h1 { font-size: clamp(19px, 4.5vw, 27px); }
}

@media (prefers-reduced-motion: reduce) {
  .is-enter .la-sweep,
  .is-enter .la-settle,
  .is-enter .la-breathe,
  .is-enter .la-wisp,
  .is-enter .lineart-copy-main,
  .is-enter .lineart-cta { animation: none; }
  .lineart-scroll svg { animation: none; }
  .lineart-hero::before, .lineart-svg { transition: none; }
}
</style>
