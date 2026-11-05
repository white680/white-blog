<script setup lang="ts">
import { findMockGallery } from '~/data/mock'
import '~/assets/styles/posts.css'

const route = useRoute()
const foundGallery = findMockGallery(Number(route.params.id))
if (!foundGallery) throw createError({ status: 404, statusText: '相册不存在' })
const gallery = foundGallery

const preview = ref<HTMLDialogElement | null>(null)
const selectedIndex = ref(0)
const activeImage = computed(() => gallery.images[selectedIndex.value])
const hasMultipleImages = gallery.images.length > 1
let touchStart: { x: number; y: number } | null = null
let suppressPreviewClick = false

function changeImage(step: number) {
  if (!hasMultipleImages) return
  selectedIndex.value = (selectedIndex.value + step + gallery.images.length) % gallery.images.length
}

function openPreview() {
  if (suppressPreviewClick) return
  preview.value?.showModal()
}

function onTouchStart(event: TouchEvent) {
  const touch = event.changedTouches[0]
  if (touch) touchStart = { x: touch.clientX, y: touch.clientY }
}

function onTouchEnd(event: TouchEvent) {
  const touch = event.changedTouches[0]
  if (!touch || !touchStart || !hasMultipleImages) return
  const dx = touch.clientX - touchStart.x
  const dy = touch.clientY - touchStart.y
  touchStart = null
  if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.3) return
  changeImage(dx < 0 ? 1 : -1)
  suppressPreviewClick = true
  window.setTimeout(() => { suppressPreviewClick = false }, 350)
}

function closeOnBackdrop(event: MouseEvent) {
  if (event.target === preview.value) preview.value?.close()
}

useSeoMeta({
  title: `${gallery.title} · 相册 · white-博客`,
  description: gallery.summary,
  ogTitle: gallery.title,
  ogDescription: gallery.summary,
  ogType: 'article',
  ogImage: gallery.cover,
})
</script>

<template>
  <article class="posts-journal gallery-detail">
    <div class="posts-journal-background" aria-hidden="true" />
    <div class="posts-journal-content">
      <NuxtLink class="gallery-back" to="/gallery">← 返回相册</NuxtLink>
      <header class="gallery-detail-heading">
        <span>{{ gallery.category }} / <time :datetime="gallery.date">{{ gallery.date.replaceAll('-', '.') }}</time></span>
        <h1>{{ gallery.title }}</h1>
        <p>{{ gallery.summary }}</p>
        <div class="gallery-detail-tags" aria-label="相册标签"><span v-for="tag in gallery.tags" :key="tag">#{{ tag }}</span></div>
      </header>

      <section class="gallery-book" aria-label="相册图片">
        <figure class="gallery-book-page">
          <div class="gallery-book-stage">
            <button
              type="button"
              class="gallery-book-image"
              :aria-label="`放大查看第 ${selectedIndex + 1} 张图片：${activeImage?.alt}`"
              @click="openPreview"
              @keydown.left.prevent="changeImage(-1)"
              @keydown.right.prevent="changeImage(1)"
              @touchstart.passive="onTouchStart"
              @touchend.passive="onTouchEnd"
            >
              <img v-if="activeImage" :key="activeImage.src" :src="activeImage.src" :alt="activeImage.alt" width="1400" height="900">
            </button>
            <div v-if="hasMultipleImages" class="gallery-book-controls">
              <button type="button" aria-label="上一张图片" @click="changeImage(-1)">←</button>
              <button type="button" aria-label="下一张图片" @click="changeImage(1)">→</button>
            </div>
          </div>
          <figcaption><span>{{ String(selectedIndex + 1).padStart(2, '0') }} / {{ String(gallery.images.length).padStart(2, '0') }}</span>{{ activeImage?.alt }}</figcaption>
        </figure>
        <nav v-if="hasMultipleImages" class="gallery-book-thumbs" aria-label="选择相册图片">
          <button
            v-for="(image, index) in gallery.images"
            :key="image.src"
            type="button"
            :aria-label="`查看第 ${index + 1} 张图片：${image.alt}`"
            :aria-current="selectedIndex === index ? 'true' : undefined"
            @click="selectedIndex = index"
          >
            <img :src="image.src" :alt="image.alt" width="240" height="170" loading="lazy">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
          </button>
        </nav>
      </section>

      <div class="gallery-detail-meta" aria-label="相册信息">
        <span>{{ gallery.images.length }} 张图片</span>
        <span>{{ gallery.views }} 次浏览</span>
        <span>{{ gallery.comment }} 条评论</span>
        <span>{{ gallery.praise }} 次点赞</span>
      </div>

      <NuxtLink class="gallery-back gallery-back-bottom" to="/gallery">← 返回相册</NuxtLink>
    </div>

    <dialog ref="preview" class="gallery-preview" aria-label="图片预览" @click="closeOnBackdrop" @keydown.left.prevent="changeImage(-1)" @keydown.right.prevent="changeImage(1)" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <div class="gallery-preview-inner" @click.stop>
        <button type="button" aria-label="关闭图片预览" @click="preview?.close()">×</button>
        <button v-if="hasMultipleImages" type="button" class="gallery-preview-prev" aria-label="上一张图片" @click="changeImage(-1)">←</button>
        <img v-if="activeImage" :src="activeImage.src" :alt="activeImage.alt" width="1600" height="1000">
        <button v-if="hasMultipleImages" type="button" class="gallery-preview-next" aria-label="下一张图片" @click="changeImage(1)">→</button>
        <span class="gallery-preview-count">{{ selectedIndex + 1 }} / {{ gallery.images.length }}</span>
      </div>
    </dialog>
  </article>
</template>

<style scoped>
.gallery-detail { padding-top: 26px; }
.gallery-back { display: inline-flex; min-height: 44px; align-items: center; color: #333; font-size: 14px; text-decoration: none; }
.gallery-back:hover { text-decoration: underline; text-underline-offset: 5px; }
.gallery-detail-heading { max-width: 850px; margin: 20px auto 38px; text-align: center; }
.gallery-detail-heading > span { color: #555; font-size: 13px; }
.gallery-detail-heading h1 { margin: 13px 0 12px; font-family: 'Noto Serif SC','Songti SC','SimSun',serif; font-size: clamp(38px,5.4vw,70px); font-weight: 500; }
.gallery-detail-heading p { margin: 0; color: #4d4d4d; font-size: 16px; line-height: 1.8; }
.gallery-detail-meta { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 20px; margin: 24px auto 0; color: #555; font-size: 12px; }
.gallery-detail-tags { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.gallery-detail-tags span { padding: 7px 11px; border: 1px solid rgba(38,38,38,.16); border-radius: 99px; background: rgba(255,255,255,.55); color: #404040; font-size: 12px; }
.gallery-book { max-width: 1080px; margin: auto; }
.gallery-book-page { margin: 0; padding: clamp(10px,2vw,22px); border: 1px solid rgba(255,255,255,.74); border-radius: 6px; background: rgba(255,255,255,.77); box-shadow: 0 24px 54px rgba(18,18,18,.14), inset 8px 0 11px rgba(20,20,20,.035); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.gallery-book-stage { position: relative; }
.gallery-book-image { display: grid; width: 100%; min-height: min(58vw, 580px); padding: 0; overflow: hidden; place-items: center; border: 0; border-radius: 2px; background: #e8e8e8; cursor: zoom-in; }
.gallery-book-image:focus-visible, .gallery-book-controls button:focus-visible, .gallery-book-thumbs button:focus-visible, .gallery-preview button:focus-visible { outline: 3px solid #252525; outline-offset: 3px; }
.gallery-book-image img { display: block; max-width: 100%; max-height: min(70vh, 650px); width: auto; height: auto; object-fit: contain; animation: gallery-image-in .36s ease both; }
@keyframes gallery-image-in { from { opacity: .55; transform: scale(.985); } to { opacity: 1; transform: scale(1); } }
.gallery-book-controls { position: absolute; right: 16px; bottom: 16px; display: flex; gap: 8px; }
.gallery-book-controls button, .gallery-preview-prev, .gallery-preview-next { display: grid; width: 46px; height: 46px; place-items: center; border: 1px solid rgba(30,30,30,.2); border-radius: 50%; background: rgba(255,255,255,.9); color: #222; font-size: 21px; cursor: pointer; backdrop-filter: blur(8px); transition: transform .2s ease, background .2s ease; }
.gallery-book-controls button:hover, .gallery-preview-prev:hover, .gallery-preview-next:hover { transform: scale(1.07); background: #fff; }
.gallery-book-page figcaption { display: flex; gap: 18px; padding: 16px 3px 2px; color: #505050; font-size: 13px; line-height: 1.5; }
.gallery-book-page figcaption span { flex: none; font-variant-numeric: tabular-nums; }
.gallery-book-thumbs { display: flex; gap: 12px; max-width: 100%; overflow-x: auto; padding: 18px 4px 8px; scroll-snap-type: x proximity; }
.gallery-book-thumbs button { position: relative; display: block; width: 138px; height: 96px; flex: none; padding: 5px; border: 1px solid rgba(30,30,30,.14); border-radius: 3px; background: rgba(255,255,255,.8); box-shadow: 0 5px 14px rgba(18,18,18,.1); cursor: pointer; scroll-snap-align: start; transition: transform .2s ease, border-color .2s ease; }
.gallery-book-thumbs button:hover { transform: translateY(-4px); }
.gallery-book-thumbs button[aria-current='true'] { border-color: #252525; box-shadow: 0 0 0 2px #252525; }
.gallery-book-thumbs img { display: block; width: 100%; height: 100%; object-fit: cover; }
.gallery-book-thumbs button span { position: absolute; right: 6px; bottom: 6px; padding: 2px 4px; background: rgba(255,255,255,.88); color: #222; font-size: 11px; }
.gallery-back-bottom { margin-top: 34px; }
.gallery-preview { width: min(95vw, 1500px); max-width: none; max-height: 96vh; padding: 10px; border: 0; border-radius: 6px; background: #f7f7f7; box-shadow: 0 20px 80px rgba(0,0,0,.3); }
.gallery-preview::backdrop { background: rgba(0,0,0,.82); }
.gallery-preview-inner { position: relative; display: grid; min-height: 140px; place-items: center; }
.gallery-preview-inner > button:first-child { position: absolute; z-index: 2; top: 8px; right: 8px; display: grid; width: 44px; height: 44px; place-items: center; border: 0; border-radius: 50%; background: rgba(255,255,255,.92); color: #111; font-size: 28px; cursor: pointer; }
.gallery-preview-inner img { display: block; max-width: 100%; max-height: calc(96vh - 45px); margin: auto; object-fit: contain; }
.gallery-preview-prev, .gallery-preview-next { position: absolute; z-index: 1; top: 50%; transform: translateY(-50%); }
.gallery-preview-prev { left: 10px; }
.gallery-preview-next { right: 10px; }
.gallery-preview-prev:hover, .gallery-preview-next:hover { transform: translateY(-50%) scale(1.07); }
.gallery-preview-count { position: absolute; bottom: 8px; left: 8px; padding: 5px 7px; border-radius: 3px; background: rgba(255,255,255,.88); color: #222; font-size: 12px; font-variant-numeric: tabular-nums; }
@media (max-width: 640px) { .gallery-detail-heading { margin: 18px auto 28px; } .gallery-book-image { min-height: 66vw; } .gallery-book-image img { max-height: 60vh; } .gallery-book-controls { right: 8px; bottom: 8px; } .gallery-book-thumbs button { width: 108px; height: 80px; } .gallery-preview-prev { left: 4px; } .gallery-preview-next { right: 4px; } }
@media (prefers-reduced-motion: reduce) { .gallery-book-image img { animation: none; } .gallery-book-controls button, .gallery-book-thumbs button, .gallery-preview-prev, .gallery-preview-next { transition: none; } }
</style>
