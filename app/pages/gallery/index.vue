<script setup lang="ts">
import { mockGalleries } from '~/data/mock'
import '~/assets/styles/posts.css'

const route = useRoute()
const categories = ['全部', ...new Set(mockGalleries.map(gallery => gallery.category))]
const category = computed(() => {
  const value = route.query.category
  return typeof value === 'string' && categories.includes(value) ? value : '全部'
})
const visibleGalleries = computed(() => mockGalleries.filter(gallery => category.value === '全部' || gallery.category === category.value))

useSeoMeta({
  title: '相册 · white-博客',
  description: '影像、线稿和插画记录。',
  ogTitle: '相册 · white-博客',
  ogDescription: '影像、线稿和插画记录。',
  ogType: 'website',
})
</script>

<template>
  <div class="posts-journal gallery-page posts-journal--enter">
    <div class="posts-journal-background" aria-hidden="true" />
    <div class="posts-journal-content">
      <header class="posts-journal-heading">
        <h1>相册</h1>
        <span>{{ visibleGalleries.length }} 组</span>
      </header>

      <nav class="posts-journal-categories gallery-categories" aria-label="相册分类">
        <NuxtLink
          v-for="item in categories"
          :key="item"
          :to="{ path: '/gallery', query: item === '全部' ? {} : { category: item } }"
          :aria-current="category === item ? 'page' : undefined"
        >{{ item }}</NuxtLink>
      </nav>

      <section class="gallery-grid" aria-label="相册列表">
        <NuxtLink v-for="(gallery, index) in visibleGalleries" :key="gallery.id" class="gallery-card" :style="{ '--entry-index': index }" :to="`/gallery/${gallery.id}`">
          <div class="gallery-card-cover" :class="{ 'gallery-card-cover--stack': gallery.images.length > 1 }">
            <template v-if="gallery.images.length > 1">
              <span
                v-for="(image, layerIndex) in gallery.images.filter(image => image.src !== gallery.cover).slice(0, 2)"
                :key="image.src"
                class="gallery-card-sheet gallery-card-sheet--preview"
                :class="layerIndex === 0 ? 'gallery-card-sheet--back' : 'gallery-card-sheet--front'"
                aria-hidden="true"
              >
                <img :src="image.src" alt="" width="320" height="240" loading="lazy">
              </span>
            </template>
            <template v-else>
              <span class="gallery-card-sheet gallery-card-sheet--back" aria-hidden="true" />
              <span class="gallery-card-sheet gallery-card-sheet--front" aria-hidden="true" />
            </template>
            <div class="gallery-card-photo">
              <img :src="gallery.cover" :alt="gallery.coverAlt" width="1200" height="800" :loading="index === 0 ? 'eager' : 'lazy'">
            </div>
            <span class="gallery-card-count">{{ gallery.images.length }} 张</span>
          </div>
          <div class="gallery-card-copy">
            <span class="gallery-card-meta">{{ gallery.category }} · <time :datetime="gallery.date">{{ gallery.date.replaceAll('-', '.') }}</time></span>
            <h2>{{ gallery.title }}</h2>
            <span class="gallery-card-arrow" aria-hidden="true">↗</span>
          </div>
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<style scoped>
.gallery-categories { margin-bottom: 30px; }
.gallery-grid { display: grid; width: min(100%, 840px); grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 24px; margin: auto; }
.gallery-card { min-width: 0; color: #242424; text-decoration: none; }
.gallery-card:only-child { grid-column: 1 / -1; width: min(100%, 408px); justify-self: center; }
.gallery-card:focus-visible { outline: 3px solid #242424; outline-offset: 8px; border-radius: 8px; }
.gallery-card-cover { position: relative; isolation: isolate; padding: 15px; aspect-ratio: 1.36; }
.gallery-card-sheet { position: absolute; inset: 12px 16px 17px; border: 1px solid rgba(30,30,30,.1); border-radius: 3px; background: #f8f8f7; box-shadow: 0 12px 26px rgba(20,20,20,.1); transition: transform .42s cubic-bezier(.22,1,.36,1), box-shadow .42s ease; }
.gallery-card-sheet--back { transform: translate(8px,-7px) rotate(1.6deg); }
.gallery-card-sheet--front { transform: translate(-5px,4px) rotate(-1.1deg); }
.gallery-card-sheet--preview { overflow: hidden; padding: 7px; background: #fff; }
.gallery-card-sheet--preview img { display: block; width: 100%; height: 100%; object-fit: cover; }
.gallery-card-cover--stack .gallery-card-sheet--back { inset: 5px 24px 21px 18px; transform: translate(-12px,-10px) rotate(-5deg); }
.gallery-card-cover--stack .gallery-card-sheet--front { inset: 0 17px 24px 20px; transform: translate(10px,-8px) rotate(4deg); }
.gallery-card-photo { position: relative; height: 100%; overflow: hidden; padding: 10px; border: 1px solid rgba(30,30,30,.09); border-radius: 3px; background: #fff; box-shadow: 0 16px 34px rgba(15,15,15,.16); transition: transform .42s cubic-bezier(.22,1,.36,1), box-shadow .42s ease; }
.gallery-card-photo img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .55s cubic-bezier(.22,1,.36,1); }
.gallery-card-count { position: absolute; top: 29px; right: 29px; padding: 7px 9px; border-radius: 2px; background: rgba(255,255,255,.88); color: #262626; font-size: 12px; line-height: 1; backdrop-filter: blur(8px); }
.gallery-card-copy { position: relative; padding: 13px 15px 3px; }
.gallery-card-meta { color: #555; font-size: 12px; }
.gallery-card h2 { margin: 6px 40px 0 0; font-family: 'Noto Serif SC','Songti SC','SimSun',serif; font-size: clamp(23px, 2.2vw, 29px); font-weight: 500; line-height: 1.35; }
.gallery-card-arrow { position: absolute; right: 14px; bottom: 4px; font-size: 22px; transition: transform .3s ease; }
.gallery-card:hover .gallery-card-photo, .gallery-card:focus-visible .gallery-card-photo { transform: translateY(-8px) rotate(-.6deg); box-shadow: 0 23px 42px rgba(15,15,15,.2); }
.gallery-card:hover .gallery-card-photo img, .gallery-card:focus-visible .gallery-card-photo img { transform: scale(1.035); }
.gallery-card:hover .gallery-card-sheet--back, .gallery-card:focus-visible .gallery-card-sheet--back { transform: translate(14px,-11px) rotate(3deg); }
.gallery-card:hover .gallery-card-sheet--front, .gallery-card:focus-visible .gallery-card-sheet--front { transform: translate(-10px,7px) rotate(-2.2deg); }
.gallery-card:hover .gallery-card-cover--stack .gallery-card-sheet--back, .gallery-card:focus-visible .gallery-card-cover--stack .gallery-card-sheet--back { transform: translate(-18px,-14px) rotate(-7deg); }
.gallery-card:hover .gallery-card-cover--stack .gallery-card-sheet--front, .gallery-card:focus-visible .gallery-card-cover--stack .gallery-card-sheet--front { transform: translate(15px,-13px) rotate(6deg); }
.gallery-card:hover .gallery-card-arrow, .gallery-card:focus-visible .gallery-card-arrow { transform: translate(3px,-3px); }
@media (max-width: 640px) { .gallery-categories { margin-bottom: 18px; } .gallery-grid { width: min(100%, 340px); grid-template-columns: 1fr; gap: 25px; } .gallery-card:only-child { grid-column: 1; width: 100%; } .gallery-card-cover { aspect-ratio: 1.26; } .gallery-card-copy { padding-top: 8px; } .gallery-card h2 { font-size: 25px; } }
@media (prefers-reduced-motion: reduce) { .gallery-card-sheet, .gallery-card-photo, .gallery-card-photo img, .gallery-card-arrow { transition: none; } .gallery-card:hover .gallery-card-photo, .gallery-card:focus-visible .gallery-card-photo, .gallery-card:hover .gallery-card-photo img, .gallery-card:focus-visible .gallery-card-photo img, .gallery-card:hover .gallery-card-arrow, .gallery-card:focus-visible .gallery-card-arrow { transform: none; } .gallery-card:hover .gallery-card-sheet--back, .gallery-card:focus-visible .gallery-card-sheet--back { transform: translate(8px,-7px) rotate(1.6deg); } .gallery-card:hover .gallery-card-sheet--front, .gallery-card:focus-visible .gallery-card-sheet--front { transform: translate(-5px,4px) rotate(-1.1deg); } .gallery-card:hover .gallery-card-cover--stack .gallery-card-sheet--back, .gallery-card:focus-visible .gallery-card-cover--stack .gallery-card-sheet--back { transform: translate(-12px,-10px) rotate(-5deg); } .gallery-card:hover .gallery-card-cover--stack .gallery-card-sheet--front, .gallery-card:focus-visible .gallery-card-cover--stack .gallery-card-sheet--front { transform: translate(10px,-8px) rotate(4deg); } }
</style>
