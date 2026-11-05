<script setup lang="ts">
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}
</script>

<template>
  <footer class="unified-footer">
    <div class="footer-panel">
      <div class="footer-identity">
        <NuxtLink class="wordmark footer-brand" to="/" aria-label="White 首页">White</NuxtLink>
        <small>当前内容为前端演示数据</small>
      </div>
      <nav class="footer-nav" aria-label="页脚导航">
        <NuxtLink to="/">首页</NuxtLink>
        <NuxtLink to="/posts">文章</NuxtLink>
        <NuxtLink to="/gallery">相册</NuxtLink>
        <NuxtLink to="/projects">练习</NuxtLink>
        <NuxtLink to="/archive">归档</NuxtLink>
        <NuxtLink to="/moments">片刻</NuxtLink>
        <NuxtLink to="/about">关于</NuxtLink>
      </nav>
      <button class="footer-back-top" type="button" aria-label="回到顶部" title="回到顶部" @click="scrollToTop">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
      </button>
    </div>
  </footer>
</template>

<style scoped>
.unified-footer { padding: 14px 0; background: #e7e9ea; color: #282828; }
.footer-panel { display: flex; width: min(1280px, calc(100% - 48px)); min-height: 72px; align-items: center; gap: 20px; margin: auto; padding: 10px 16px 10px 24px; border: 1px solid rgba(255,255,255,.82); border-radius: 18px; background: rgba(255,255,255,.65); box-shadow: 0 8px 28px rgba(28,28,28,.08), inset 0 1px rgba(255,255,255,.8); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
.footer-identity { display: grid; flex: none; gap: 4px; }
.footer-brand { width: fit-content; color: #252525; font-size: 30px; text-decoration: none; }
.footer-identity small { color: #666; font-size: 11px; line-height: 1.3; }
.footer-nav { display: flex; flex-wrap: wrap; align-items: center; gap: 0 2px; margin-left: auto; }
.footer-nav a { display: inline-flex; min-height: 44px; align-items: center; padding: 0 8px; border-radius: 8px; color: #444; font-size: 13px; text-decoration: none; white-space: nowrap; transition: background .2s ease, color .2s ease; }
.footer-nav a:hover { background: rgba(30,30,30,.07); color: #111; }
.footer-back-top { display: grid; width: 44px; height: 44px; flex: none; place-items: center; border: 1px solid rgba(38,38,38,.18); border-radius: 50%; background: rgba(255,255,255,.45); color: #292929; cursor: pointer; transition: background .2s ease, transform .2s ease; }
.footer-back-top:hover { background: #fff; transform: translateY(-3px); }
.unified-footer :focus-visible { outline: 2px solid #252525; outline-offset: 3px; }

@media (max-width: 760px) {
  .footer-panel { flex-wrap: wrap; gap: 8px; padding: 12px 14px; }
  .footer-nav { order: 3; width: 100%; justify-content: flex-start; gap: 0 4px; margin: 0; }
  .footer-back-top { margin-left: auto; }
}

@media (prefers-reduced-motion: reduce) {
  .footer-nav a, .footer-back-top { transition: none; }
  .footer-back-top:hover { transform: none; }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .footer-panel { background: #f7f7f7; }
}
</style>
