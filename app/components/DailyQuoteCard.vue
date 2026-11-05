<script setup lang="ts">
const quotes = [
  '把日子过慢一点，让每一个微小的瞬间都有回声。',
  '沿着自己的节奏走，平凡的日常也会长出光。',
  '把今天的好奇留下，明天再向前走一小步。',
  '风有风的方向，你也有自己的远方。',
  '留一点空白，给尚未发生的美好。',
  '认真感受此刻，生活的答案常藏在细节里。',
  '不必急着抵达，路上的风景也值得记录。',
]

function getDailyQuote() {
  const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date())
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000)
  return { date, text: quotes[day % quotes.length]! }
}

// 同一天保持同一句；Nuxt 状态确保服务端与浏览器首次渲染一致。
const quote = useState('home-daily-quote', getDailyQuote)
const characters = computed(() => Array.from(quote.value.text))
const card = ref<HTMLElement | null>(null)
const isPending = ref(false)
const isPlaying = ref(false)
const replay = ref(0)
let observer: IntersectionObserver | undefined

function play() {
  isPending.value = false
  isPlaying.value = true
  replay.value += 1
}

onMounted(() => {
  quote.value = getDailyQuote()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!('IntersectionObserver' in window)) {
    play()
    return
  }
  isPending.value = true
  observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return
    play()
    observer?.disconnect()
  }, { threshold: 0.25 })
  if (card.value) observer.observe(card.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section
    ref="card"
    class="daily-quote"
    :class="{ 'daily-quote--pending': isPending, 'daily-quote--playing': isPlaying }"
    aria-labelledby="daily-quote-heading"
  >
    <img class="daily-quote-background" src="/images/daily-quote-blossoms.png" alt="" loading="lazy" aria-hidden="true">
    <h2 id="daily-quote-heading">每日文案</h2>
    <p class="daily-quote-text">
      <span class="daily-quote-accessible">{{ quote.text }}</span>
      <span aria-hidden="true"><span
        v-for="(character, index) in characters"
        :key="`${replay}-${index}`"
        class="daily-quote-character"
        :style="{ '--character-index': index }"
      >{{ character }}</span></span>
    </p>
    <div class="daily-quote-footer">
      <time :datetime="quote.date">{{ quote.date.replaceAll('-', '.') }}</time>
      <button type="button" aria-label="重新播放文案" title="重新播放文案" @click="play">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 10a8 8 0 1 0-2 8M20 4v6h-6" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.daily-quote { --quote-character-duration: 220ms; position: relative; isolation: isolate; min-width: 0; overflow: hidden; padding: 18px 20px 14px; border: 1px solid var(--home-line); border-radius: 14px; background: #253345; color: #fff; }
.daily-quote-background { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 48% 45%; pointer-events: none; }
/* 仅用衬底保障白字对比，照片不做灰度或色相处理。 */
.daily-quote::before { position: absolute; z-index: -1; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, .6), rgba(0, 0, 0, .5) 62%, rgba(0, 0, 0, .16)); content: ""; pointer-events: none; }
.daily-quote h2 { margin: 0; font-size: 20px; font-weight: 600; }
.daily-quote-text { min-height: 4em; margin: 14px 0 8px; font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif; font-size: 18px; letter-spacing: .035em; line-height: 1.85; }
.daily-quote-character { display: inline-block; transform-origin: 50% 65%; }
.daily-quote--pending .daily-quote-character { opacity: 0; }
/* 每个字的延迟等于前面所有字的总时长，确保旋转逐个完成。 */
.daily-quote--playing .daily-quote-character { animation: quote-spin-in var(--quote-character-duration) cubic-bezier(.22, .61, .36, 1) both; animation-delay: calc(var(--character-index) * var(--quote-character-duration)); }
.daily-quote-accessible { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.daily-quote-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #fff; }
.daily-quote-footer time { font-size: 12px; font-variant-numeric: tabular-nums; }
.daily-quote-footer button { display: grid; width: 44px; height: 44px; place-items: center; padding: 0; border: 1px solid rgba(255, 255, 255, .5); border-radius: 50%; background: rgba(0, 0, 0, .5); color: #fff; cursor: pointer; transition: background .2s ease, color .2s ease; }
.daily-quote-footer button:hover { background: #fff; color: var(--home-ink); }
.daily-quote-footer button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
@keyframes quote-spin-in { from { opacity: 0; transform: translateY(6px) rotate(-120deg) scale(.65); } to { opacity: 1; transform: translateY(0) rotate(0) scale(1); } }
@media (max-width: 800px) { .daily-quote { grid-column: 1 / -1; } }
@media (prefers-reduced-motion: reduce) {
  .daily-quote--pending .daily-quote-character { opacity: 1; }
  .daily-quote--playing .daily-quote-character { animation: none; }
  .daily-quote-footer button { transition: none; }
}
</style>
