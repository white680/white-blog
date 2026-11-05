export default defineNuxtConfig({
  compatibilityDate: '2026-10-27',
  typescript: {
    strict: true,
    typeCheck: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'white-博客',
      meta: [
        { name: 'description', content: '个人文章、项目与日常记录' },
      ],
    },
  },
})
