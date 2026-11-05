# 前台架构与维护

## 当前结构

```text
app/
  app.vue                  全局样式与布局入口
  layouts/default.vue      跳转正文、页眉、主体和页脚
  components/              SiteHeader、SiteFooter
  pages/                   首页、文章、作品、关于、归档、片刻
  data/mock.ts             演示数据、视图类型与文章查找
  assets/styles/main.css   设计变量和响应式样式
public/images/             原创 SVG 场景与配图
tests/                     演示内容、资源与路由工具检查
```

Nuxt 4 文件路由负责页面组织；`app/pages/posts/[slug].vue` 对不存在的演示文章返回 404。列表页的分类、标签、搜索和分页由 URL 查询参数驱动，可以复制链接并保持筛选状态；作品分类是页内状态。页面使用 `useSeoMeta` 写标题、描述与 Open Graph 基础信息。

## 数据边界

`app/data/mock.ts` 只是一份前端**视图模型**，不是后台响应模型或接口契约。文章正文按章节、段落、引文和示例代码渲染，不使用 `v-html`。本站目前无需请求层、代理或环境变量；待真实接口和部署地址确定后再建立服务层、后端到视图模型的映射，以及加载、空、错状态。避免把管理端 Mock 或管理员接口直接接到访客页面。

## 常见修改

1. 改配色、字级、布局：先改 `main.css` 的语义变量和对应页面区块，再检查 375 至 1440px。
2. 换 Hero：替换 `public/images/moonlit-window.svg` 或调整 `.hero` 背景，检查文字对比度、裁切和素材授权。
3. 改交互动画：从 `main.css` 的悬停、过渡和 `prefers-reduced-motion` 规则入手；只有确有复杂时间线需求时再考虑库。
4. 新增文章呈现：在 `mock.ts` 的 `MockPost` / `MockSection` 和详情模板中同步调整，并运行测试、类型检查和构建。接入真实正文后用独立转换层替换 Mock。
5. 新增页面：在 `app/pages/` 建路由，按需要更新导航、页脚、SEO 及手机布局。

当前没有第三方 UI 或动画库；保持原生组件即可覆盖现有交互。未来 API 接入顺序与安全边界见 [API 接入清单](API_INTEGRATION.md)。
