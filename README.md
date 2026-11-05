# White Blog

基于 **Nuxt 4、Vue 3 和 TypeScript** 的个人博客前台，包含文章、相册、归档、片刻记录、练习和关于页面。

> 当前是可独立运行的前端演示版。公开页面无需登录，文章、相册、练习、片刻记录及统计数字均来自本地 Mock 数据；真实后端接口与数据库尚未联调。

## 页面与功能

| 页面 | 路径 | 功能 |
| --- | --- | --- |
| 首页 | `/` | 线稿 Hero、滚动进入内容区、每日文案、精选文章与内容入口 |
| 文章 | `/posts` | 分类、标签、搜索、分页与空结果状态 |
| 文章详情 | `/posts/[slug]` | 正文、目录、封面预览、代码复制、前后篇与相关文章 |
| 相册 | `/gallery` | 分类筛选、单图与多图影集封面 |
| 相册详情 | `/gallery/[id]` | 主图、缩略图、前后切换、触屏滑动与图片预览 |
| 归档 | `/archive` | 可横向浏览的文章时间轴，支持按钮、拖动和滚轮 |
| 片刻 | `/moments` | 彩色便利贴列表，点击查看完整记录 |
| 练习 | `/projects` | 练习卡片、搜索和展开说明；实际 Demo 待后续上传 |
| 关于 | `/about` | 个人名片、GitHub 入口与分类展示的前端技术链接 |

公共导航和页脚适配桌面与移动端；明暗主题可手动切换，并遵循系统偏好。主要页面包含基础 SEO 信息，动效考虑了系统的“减少动态效果”设置。

## 技术栈

| 类别 | 当前使用情况 |
| --- | --- |
| 框架 | Nuxt 4.6.2、Vue 3；Nuxt 文件路由与服务端渲染 |
| 语言 | TypeScript 5.9、Vue 单文件组件 |
| 样式与动效 | 原生 CSS、SVG、浏览器原生 API；未引入 UI 组件库或动画库 |
| 包管理与验证 | pnpm、Node.js 内置测试运行器、`nuxt typecheck` |

项目依赖中也包含 Vue Router 和 Axios。页面路由由 Nuxt 管理；Axios 请求封装目前是待联调代码，公开页面尚未通过它读取后端数据。

## 本地开发

本项目在 **Node.js 24.18.1**、**pnpm 11.22.0** 环境下开发。进入项目根目录后运行：

```bash
pnpm install --frozen-lockfile
pnpm dev --host 127.0.0.1 --port 3001
```

打开 <http://127.0.0.1:3001/>。当前演示内容无需启动后端，也无需配置 `.env`。`pnpm-workspace.yaml` 将 pnpm store 放在项目内的 `.pnpm-store/`，该目录已被 Git 忽略。

## 检查与构建

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm preview --port 3001
```

`pnpm build` 生成 `.output/`，`pnpm preview` 用于本地预览构建结果。部署为 Node 服务时，可在构建后运行 `node .output/server/index.mjs`；默认监听 3000 端口，可通过 `PORT` 环境变量调整。`node_modules/`、`.nuxt/`、`.output/` 和 `.pnpm-store/` 均无需提交到 Git。

## 项目结构与数据

```text
app/
  assets/styles/       全局、首页、内容页与暗色主题样式
  components/          导航、页脚、首页线稿和每日文案
  data/mock.ts         文章、相册、片刻、练习及个人资料演示数据
  pages/               Nuxt 页面路由
  utils/               滚动交互与待接入的请求配置
public/images/         网站图片、线稿与 SVG 素材
tests/                 Node.js 内置测试运行器的测试
docs/                  设计、架构、进度及接口接入记录
```

目前页面直接读取 `app/data/mock.ts`，其中的标题、日期、阅读量和个人介绍都是演示数据，不代表真实发布内容。`app/utils/env.ts`、`app/utils/axios.ts` 是尚未接入页面的请求准备代码，不能直接当作正式环境的接口配置。后端提供公共只读接口后，再按 [API 接入清单](docs/API_INTEGRATION.md) 确认字段、地址和发布状态，逐页替换 Mock 数据。

## 素材与许可

首页布局参考 Lunaris，项目中的 `public/images/lunaris-home.jpg` 及其 WebP 版本来自该项目。原项目采用 MIT 许可，来源、版本及许可文本见 [LUNARIS_LICENSE.txt](LUNARIS_LICENSE.txt)。其他图片和线稿请分别核对其来源与公开使用授权；此处的 Lunaris 许可不自动覆盖整个仓库的所有素材。

更多背景可查看 [前端架构](docs/FRONTEND_ARCHITECTURE.md) 和 [接口接入清单](docs/API_INTEGRATION.md)。
