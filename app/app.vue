<script setup lang="ts">
import '~/assets/styles/main.css'
import '~/assets/styles/dark.css'

// 在页面绘制前确定主题，避免刷新时先闪出浅色背景。
useHead({
  script: [{
    innerHTML: `try{const saved=localStorage.getItem('white-theme');document.documentElement.dataset.theme=saved==='dark'||(saved!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch{document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}`,
  }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
