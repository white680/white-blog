<script setup lang="ts">
const route = useRoute()
const desktopNav = ref<HTMLElement | null>(null)
const mobileMenu = ref<HTMLDetailsElement | null>(null)
const header = ref<HTMLElement | null>(null)
const indicator = ref({ x: 0, width: 0 })
const indicatorReady = ref(false)
const isDark = ref(false)
let resizeObserver: ResizeObserver | undefined
let themeMedia: MediaQueryList | undefined
let themeTimer = 0

function savedTheme(): string | null {
  try { return localStorage.getItem('white-theme') } catch { return null }
}

function syncTheme() {
  const saved = savedTheme()
  isDark.value = saved === 'dark' || (saved !== 'light' && !!themeMedia?.matches)
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
}

function onStorage(event: StorageEvent) {
  if (event.key === 'white-theme') syncTheme()
}

function toggleTheme() {
  const root = document.documentElement
  const next = !isDark.value
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('theme-transitioning')
  isDark.value = next
  root.dataset.theme = next ? 'dark' : 'light'
  try { localStorage.setItem('white-theme', root.dataset.theme) } catch { /* 无存储权限时仍可切换当前页面 */ }
  window.clearTimeout(themeTimer)
  themeTimer = window.setTimeout(() => root.classList.remove('theme-transitioning'), 700)
}

// 所有导航入口在此维护，桌面与手机共用。
const links = [
  { to: '/', label: '首页', icon: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1V10Z' },
  { to: '/posts', label: '文章', icon: 'M12 5v15M3 4h5a4 4 0 0 1 4 3 4 4 0 0 1 4-3h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3V4Zm3 4h2m-2 4h2m8-4h2m-2 4h2' },
  { to: '/gallery', label: '相册', icon: 'M3 5h18v14H3V5Zm3 11 4-4 3 3 3-4 3 5M8 9h.01' },
  { to: '/archive', label: '归档', icon: 'M3 4h18v4H3V4Zm2 4v12h14V8M9 12h6' },
  { to: '/moments', label: '片刻', icon: 'M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L3 21l1.3-4.4A9 9 0 1 1 21 11ZM8 11h.01M12 11h.01M16 11h.01' },
  { to: '/projects', label: '练习', icon: 'm12 3 9 5-9 5-9-5 9 5Zm-9 9 9 5 9-5M3 16l9 5 9-5' },
  { to: '/about', label: '关于', icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2' },
] as const

function isActive(path: string): boolean {
  return path === '/' ? route.path === '/' : route.path === path || route.path.startsWith(`${path}/`)
}

function updateIndicator() {
  const activeLink = desktopNav.value?.querySelector<HTMLElement>('[aria-current="page"]')
  if (!activeLink || !activeLink.offsetWidth) return
  indicator.value = { x: activeLink.offsetLeft, width: activeLink.offsetWidth }
  indicatorReady.value = true
}

function closeMenu(restoreFocus = false) {
  if (!mobileMenu.value?.open) return
  mobileMenu.value.open = false
  if (restoreFocus) mobileMenu.value.querySelector('summary')?.focus()
}

function closeOutside(event: PointerEvent) {
  if (event.target instanceof Node && !header.value?.contains(event.target)) closeMenu()
}

watch(() => route.fullPath, () => {
  closeMenu()
  updateIndicator()
}, { flush: 'post' })

onMounted(() => {
  themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  syncTheme()
  themeMedia.addEventListener('change', syncTheme)
  window.addEventListener('storage', onStorage)
  updateIndicator()
  resizeObserver = new ResizeObserver(updateIndicator)
  if (desktopNav.value) resizeObserver.observe(desktopNav.value)
  void document.fonts.ready.then(updateIndicator)
  document.addEventListener('pointerdown', closeOutside)
})

onUnmounted(() => {
  themeMedia?.removeEventListener('change', syncTheme)
  window.removeEventListener('storage', onStorage)
  window.clearTimeout(themeTimer)
  resizeObserver?.disconnect()
  document.removeEventListener('pointerdown', closeOutside)
})
</script>

<template>
  <header ref="header" class="glass-header" :class="{ 'glass-header--home': route.path === '/' }">
    <div class="glass-header-bar">
      <NuxtLink class="glass-brand" to="/" aria-label="White 首页">White</NuxtLink>
      <nav ref="desktopNav" class="glass-nav" :class="{ 'has-indicator': indicatorReady }" aria-label="主导航">
        <span class="glass-nav-indicator" :class="{ 'is-ready': indicatorReady }" :style="{ width: `${indicator.width}px`, transform: `translate3d(${indicator.x}px, 0, 0)` }" aria-hidden="true" />
        <NuxtLink v-for="link in links" :key="link.to" class="glass-link" :to="link.to" :aria-current="isActive(link.to) ? 'page' : undefined">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="link.icon" /></svg>
          <span>{{ link.label }}</span>
        </NuxtLink>
      </nav>
      <div class="glass-header-actions">
        <button class="glass-theme" type="button" :aria-label="isDark ? '切换到浅色模式' : '切换到暗色模式'" :title="isDark ? '切换到浅色模式' : '切换到暗色模式'" @click="toggleTheme">
          <svg class="glass-theme-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.3 15.4A8.5 8.5 0 0 1 8.6 3.7 8.5 8.5 0 1 0 20.3 15.4Z" /></svg>
          <svg class="glass-theme-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
        </button>
        <details ref="mobileMenu" class="glass-mobile" @keydown.esc.stop.prevent="closeMenu(true)">
          <summary aria-label="导航菜单"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></summary>
          <nav aria-label="移动端导航">
            <NuxtLink v-for="link in links" :key="link.to" class="glass-link" :to="link.to" :aria-current="isActive(link.to) ? 'page' : undefined" @click="closeMenu()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="link.icon" /></svg>
              <span>{{ link.label }}</span>
            </NuxtLink>
          </nav>
        </details>
      </div>
    </div>
  </header>
</template>

<style scoped>
.glass-header { position: relative; z-index: 20; height: 94px; }
.glass-header--home { height: 0; }
/* 首页：导航条停留在页面最上方，随页面滚出视口；其他页面维持固定悬浮跟随 */
.glass-header--home .glass-header-bar { position: absolute; }
.glass-header-bar { position: fixed; top: 14px; left: 50%; display: flex; width: min(1280px, calc(100% - 48px)); min-height: 66px; align-items: center; justify-content: space-between; gap: 24px; padding: 9px 14px 9px 24px; border: 1px solid rgba(255, 255, 255, .62); border-radius: 20px; background: linear-gradient(180deg, rgba(255, 255, 255, .72) 0%, rgba(255, 255, 255, .44) 100%); color: #1f2937; box-shadow: 0 10px 30px rgba(15, 23, 42, .12), 0 2px 6px rgba(15, 23, 42, .05), 0 0 0 1px rgba(15, 23, 42, .07), inset 0 1px 0 rgba(255, 255, 255, .92), inset 0 -10px 18px -14px rgba(15, 23, 42, .08); backdrop-filter: blur(26px) saturate(1.5); transform: translateX(-50%); }
.glass-brand { flex: none; padding: 4px 8px 8px 0; color: #1f2937; font-family: "Palatino Linotype", "Book Antiqua", Georgia, serif; font-size: 34px; font-style: italic; font-weight: 600; letter-spacing: -.085em; line-height: 1; text-decoration: none; }
.glass-nav { position: relative; display: flex; margin-left: auto; gap: 4px; align-items: center; padding: 3px; border: 1px solid rgba(15, 23, 42, .08); border-radius: 13px; background: rgba(255, 255, 255, .4); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .8); }
.glass-nav-indicator { position: absolute; top: 3px; bottom: 3px; left: 0; border: 1px solid rgba(15, 23, 42, .28); border-radius: 10px; background: rgba(15, 23, 42, .07); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .55), 0 2px 6px rgba(15, 23, 42, .08); opacity: 0; pointer-events: none; }
.glass-nav-indicator.is-ready { opacity: 1; transition: transform .34s cubic-bezier(.22, 1, .36, 1), width .34s cubic-bezier(.22, 1, .36, 1); }
.glass-link { position: relative; display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 8px; padding: 0 14px; border-radius: 10px; color: #374151; font-size: 14px; line-height: 1.5; white-space: nowrap; text-decoration: none; transition: color .18s ease, background .18s ease; }
.glass-link svg { flex: none; }
.glass-link:hover { background: rgba(15, 23, 42, .06); color: #111827; }
.glass-link[aria-current="page"] { color: #111827; }
.glass-nav:not(.has-indicator) .glass-link[aria-current="page"] { background: rgba(15, 23, 42, .08); }
.glass-header-actions { display: flex; flex: none; align-items: center; gap: 8px; }
.glass-theme, .glass-mobile summary { display: grid; width: 44px; height: 44px; place-items: center; border: 1px solid rgba(15, 23, 42, .14); border-radius: 50%; background: rgba(15, 23, 42, .04); color: #1f2937; cursor: pointer; text-decoration: none; transition: background .18s ease; }
.glass-theme { position: relative; padding: 0; }
.glass-theme:hover, .glass-mobile summary:hover { background: rgba(15, 23, 42, .09); }
.glass-theme svg { grid-area: 1 / 1; transition: opacity .35s ease, transform .5s cubic-bezier(.22, 1, .36, 1); }
.glass-theme-sun { opacity: 0; transform: rotate(-80deg) scale(.55); }
.glass-header :focus-visible { outline: 2px solid #111827; outline-offset: 3px; }
:global(main [id]) { scroll-margin-top: 104px; }
.glass-mobile { position: relative; display: none; }
.glass-mobile summary { list-style: none; }
.glass-mobile summary::-webkit-details-marker { display: none; }
.glass-mobile nav { position: absolute; top: calc(100% + 18px); right: 0; display: grid; width: min(280px, calc(100vw - 48px)); gap: 5px; padding: 10px; border: 1px solid rgba(15, 23, 42, .12); border-radius: 16px; background: rgba(255, 255, 255, .97); box-shadow: 0 12px 30px rgba(15, 23, 42, .16); backdrop-filter: blur(22px); }
.glass-mobile .glass-link { justify-content: flex-start; gap: 12px; }
.glass-mobile .glass-link[aria-current="page"] { background: rgba(15, 23, 42, .08); box-shadow: inset 0 0 0 1px rgba(15, 23, 42, .28); }
@media (max-width: 920px) {
  .glass-header { height: 88px; }
  .glass-header--home { height: 0; }
  .glass-header-bar { top: 12px; width: calc(100% - 28px); min-height: 62px; gap: 16px; padding: 7px 10px 7px 20px; border-radius: 18px; }
  .glass-brand { font-size: 32px; }
  .glass-nav { display: none; }
  .glass-mobile { display: block; }
}
@media (prefers-reduced-motion: reduce) {
  .glass-nav-indicator.is-ready, .glass-link, .glass-theme, .glass-theme svg, .glass-mobile summary { transition: none; }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-header-bar { background: #f7f9fb; }
}
</style>
