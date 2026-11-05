<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="site-shell" :class="{ 'site-shell--home': route.path === '/', 'site-shell--posts': route.path === '/posts' }">
    <a class="skip-link" href="#main-content">跳到正文</a>
    <SiteHeader />
    <main id="main-content">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
