/**
 * Codex 添加：仅用于前台效果预览的演示内容。
 * 它是页面视图模型，不代表现有后端的接口、字段或真实作者资料。
 */
export interface MockSection {
  id: string
  title: string
  paragraphs: string[]
  quote?: string
  code?: string
}

export interface MockPost {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  category: string
  tags: string[]
  date: string
  minutes: number
  views: number
  comment: number
  praise: number
  cover: string
  coverAlt: string
  sections: MockSection[]
}

export interface MockProject {
  number: string
  title: string
  category: string
  summary: string
  details: string
  stack: string[]
  cover: string
  coverAlt: string
}

/** 图库与文章共用后端 article 模型；这里只保存前台展示所需的演示视图数据。 */
export interface MockGallery {
  id: number
  title: string
  category: string
  tags: string[]
  date: string
  summary: string
  cover: string
  coverAlt: string
  images: { src: string; alt: string }[]
  views: number
  comment: number
  praise: number
}

export const mockPosts: MockPost[] = [
  {
    slug: 'a-window-for-writing',
    title: '为写作留一扇窗',
    subtitle: '从一张夜景开始，重新组织个人网站的阅读节奏。',
    excerpt: '一个首页不必承担所有内容。让画面建立情绪，让文章成为下一步。',
    category: '设计手记', tags: ['视觉设计', '个人网站'], date: '2026-10-18', minutes: 6, views: 128, comment: 3, praise: 18,
    cover: '/images/moonlit-window.svg', coverAlt: '月光照进窗边书桌的蓝色夜景插画',
    sections: [
      { id: 'begin', title: '从阅读开始', paragraphs: ['搭建个人网站时，最容易先摆上许多功能：统计、时间线、标签墙、快捷入口。它们各自有用，却未必适合同时站在第一屏。', '这个演示版本先把入口收紧到写作与作品。访问者能够知道这里有什么，再沿着自己的兴趣继续浏览。'] },
      { id: 'scene', title: '让画面承担情绪', paragraphs: ['夜景没有解释网站的功能，却为内容确定了速度。深蓝色给白色字标留出空间，窗框和书页把视线带回阅读。', '画面由项目内的 SVG 构成，可以继续编辑，也不依赖第三方图片服务。'], quote: '装饰可以安静，导航必须清楚。' },
      { id: 'next', title: '下一步', paragraphs: ['等真实文章与项目接口准备好后，首页会从演示内容切换到已发布内容。版式仍然围绕标题、摘要、日期和图片的关系展开。'] },
    ],
  },
  {
    slug: 'small-rhythms',
    title: '让界面有呼吸感',
    subtitle: '字号、留白和图片面积如何共同建立主次。',
    excerpt: '少一些等大的卡片，多一些清晰的阅读顺序。',
    category: '设计手记', tags: ['排版', '交互'], date: '2026-10-12', minutes: 5, views: 96, comment: 2, praise: 12,
    cover: '/images/notebook-dawn.svg', coverAlt: '晨光中的笔记本与远山插画',
    sections: [
      { id: 'hierarchy', title: '先决定哪件事最重要', paragraphs: ['当所有区块都使用相同大小的卡片时，访问者需要逐个阅读才能知道重点。字号、位置与留白可以提前给出答案。', '在文章列表中，一篇重点文章拥有更大的图像面积，其余内容沿着紧凑的目录继续。'] },
      { id: 'space', title: '留白是节奏', paragraphs: ['留白不是把内容推远，而是帮助不同层级的内容分组。章节之间宽松，章节内部紧密，页面自然会有停顿。'], quote: '真正重要的内容，不需要每一处都被强调。' },
      { id: 'motion', title: '让变化有原因', paragraphs: ['悬停时图片轻微移动，链接的边界变得更清楚。动画只回应操作，不抢走阅读的注意力；偏好减少动态效果的用户可以得到稳定页面。'] },
    ],
  },
  {
    slug: 'component-to-page',
    title: '从组件到页面',
    subtitle: '把复用留给真正重复出现的部分。',
    excerpt: '页面结构先讲清楚，组件抽象才有可靠的边界。',
    category: '前端开发', tags: ['Vue', '组件'], date: '2026-10-06', minutes: 7, views: 174, comment: 5, praise: 26,
    cover: '/images/interface-studies.svg', coverAlt: '深蓝色编辑界面与银蓝网格插画',
    sections: [
      { id: 'boundary', title: '组件的边界', paragraphs: ['导航、页脚和文章入口会在多个页面出现，把它们抽出可以统一行为。只出现一次的页面编排，先留在页面里更容易修改。', '演示数据集中在一个文件中；等公共接口确定后，页面读取层可以逐步替换。'] },
      { id: 'example', title: '保持数据流简单', paragraphs: ['下面的示意代码展示从列表中寻找文章的最小逻辑。真正接入后端时，查找会由服务端请求取代。'], code: "const post = posts.find(item => item.slug === route.params.slug)\nif (!post) throw createError({ statusCode: 404 })" },
      { id: 'verify', title: '把验证留在流程里', paragraphs: ['功能能够点击只是第一步。类型检查、构建、窄屏布局、键盘焦点和找不到内容时的状态，都属于页面交付的一部分。'] },
    ],
  },
  {
    slug: 'the-maintainable-path',
    title: '写给长期维护的代码',
    subtitle: '把未来的变化留在清楚的位置。',
    excerpt: '少一层抽象，常常比多一层“扩展能力”更易于迭代。',
    category: '前端开发', tags: ['架构', 'TypeScript'], date: '2026-09-25', minutes: 4, views: 112, comment: 1, praise: 14,
    cover: '/images/interface-studies.svg', coverAlt: '编辑界面与网格构成的抽象插画',
    sections: [
      { id: 'read', title: '先让代码容易读', paragraphs: ['清晰的命名和少量稳定的类型，往往比提早建立复杂配置更能帮助后来的人。页面所需的数据模型应围绕真实使用场景，而不是想象中的全部场景。'] },
      { id: 'change', title: '为明确的变化准备', paragraphs: ['可以预见的变化是数据来源：演示内容会换成公开 API。把这层边界写清楚，界面就不需要知道后台内部如何保存文章。'] },
    ],
  },
  {
    slug: 'notes-in-the-morning',
    title: '清晨的记录方法',
    subtitle: '让零散想法有机会成为完整文章。',
    excerpt: '把问题、观察和下一步写在一起，记录才会成为可继续的线索。',
    category: '日常札记', tags: ['写作', '记录'], date: '2026-09-14', minutes: 3, views: 73, comment: 0, praise: 8,
    cover: '/images/notebook-dawn.svg', coverAlt: '窗边打开的笔记本插画',
    sections: [
      { id: 'capture', title: '记下问题', paragraphs: ['完整的文章常常从一个很小的问题开始。先保留当时的上下文、尝试过的路径，以及为什么它值得继续想。'] },
      { id: 'return', title: '留一个返回的入口', paragraphs: ['为每条笔记写下一步，之后重新打开时就不必从头理解。记录可以短，但要帮助自己继续。'] },
    ],
  },
  {
    slug: 'quiet-by-design',
    title: '给页面留一点安静',
    subtitle: '减少不必要的解释，让内容自己说话。',
    excerpt: '每一行标语、标签和装饰，都应有清楚的任务。',
    category: '设计手记', tags: ['体验', '排版'], date: '2026-09-02', minutes: 4, views: 89, comment: 2, praise: 11,
    cover: '/images/moonlit-window.svg', coverAlt: '月色夜景与书页插画',
    sections: [
      { id: 'remove', title: '先做减法', paragraphs: ['如果一个区块的标题、说明和标签在反复表达同一件事，先删掉重复文字。还看不懂时，应检查布局和信息顺序，而不是继续补充说明。'] },
      { id: 'retain', title: '留下有用的线索', paragraphs: ['日期帮助判断文章的新旧，分类帮助浏览，清楚的链接帮助行动。它们应当安静地服务阅读。'] },
    ],
  },
]

export const mockProjects: MockProject[] = [
  { number: '01', title: '文字节奏实验', category: '动效练习', summary: '让一段短文逐字进入视线，练习停顿、速度与阅读节奏。', details: '演示文字出现、暂停与重新播放等状态；正式 Demo 上传后可在这里补充预览入口。', stack: ['Vue 3', 'CSS Animation', 'TypeScript'], cover: '/images/interface-studies.svg', coverAlt: '抽象界面研究插画' },
  { number: '02', title: '阅读界面组件', category: '界面练习', summary: '把目录、阅读进度和标签筛选组合成清晰的文章阅读界面。', details: '演示长文的导航与信息层级；当前展示内容为 Mock，后续可替换为实际练习。', stack: ['Nuxt 4', 'Vue 3', 'CSS'], cover: '/images/notebook-dawn.svg', coverAlt: '晨光笔记本插画' },
  { number: '03', title: '卡片排布实验', category: '布局练习', summary: '用不同宽度与留白组织卡片，观察布局如何改变阅读顺序。', details: '在桌面与手机宽度下尝试不同的网格节奏，并保持内容的自然阅读顺序。', stack: ['CSS Grid', 'Responsive', 'Vue 3'], cover: '/images/moonlit-window.svg', coverAlt: '夜窗与书页场景插画' },
  { number: '04', title: '相册切换小样', category: '交互练习', summary: '练习缩略图、主图与切换状态之间的轻量过渡。', details: '以键盘和触屏都能使用的切换方式为目标，真实 Demo 会在后续上传。', stack: ['Vue 3', 'Accessibility', 'CSS'], cover: '/images/daily-quote-blossoms.png', coverAlt: '蓝天下盛开的白色花朵' },
]

export const mockGalleries: MockGallery[] = [
  {
    id: 1,
    title: '春日花影', category: '摄影', tags: ['花', '春天'], date: '2026-10-21',
    summary: '白色的花在蓝天下舒展，枝影也留在了画面里。',
    cover: '/images/daily-quote-blossoms.png', coverAlt: '蓝天下盛开的白色花朵',
    images: [{ src: '/images/daily-quote-blossoms.png', alt: '蓝天下盛开的白色花朵' }],
    views: 86, comment: 2, praise: 15,
  },
  {
    id: 2,
    title: '纸上的 White', category: '线稿', tags: ['人物', '铅笔'], date: '2026-10-17',
    summary: '人物、手写字与留白组成的一张线稿。',
    cover: '/images/lineart/white.png', coverAlt: 'White 手写字与动漫人物铅笔线稿',
    images: [{ src: '/images/lineart/white.png', alt: 'White 手写字与动漫人物铅笔线稿' }],
    views: 132, comment: 4, praise: 28,
  },
  {
    id: 3,
    title: '蓝调画面', category: '插画', tags: ['人物', '蓝色'], date: '2026-10-11',
    summary: '蓝与灰的光线里，保留画面安静的一瞬。',
    cover: '/images/lunaris-home.webp', coverAlt: '蓝灰色调的动漫人物插画',
    images: [{ src: '/images/lunaris-home.webp', alt: '蓝灰色调的动漫人物插画' }],
    views: 109, comment: 1, praise: 21,
  },
  {
    id: 4,
    title: '页面插画练习', category: '插画', tags: ['网页', '场景'], date: '2026-10-03',
    summary: '为页面绘制的三个小场景：夜窗、晨光与界面。',
    cover: '/images/moonlit-window.svg', coverAlt: '月光照进书桌的夜窗插画',
    images: [
      { src: '/images/moonlit-window.svg', alt: '月光照进书桌的夜窗插画' },
      { src: '/images/notebook-dawn.svg', alt: '晨光中的笔记本插画' },
      { src: '/images/interface-studies.svg', alt: '编辑界面的抽象插画' },
    ],
    views: 64, comment: 0, praise: 11,
  },
]

export function findMockGallery(id: number): MockGallery | undefined {
  return mockGalleries.find(gallery => gallery.id === id)
}

export interface MockMoment {
  date: string
  title: string
  text: string
  weather: string
  mood: string
  pictures: { src: string; alt: string }[]
}

export const mockMoments: MockMoment[] = [
  { date: '2026-10-20', title: '给首页留白', text: '把首页的入口收得更简单之后，整张夜景终于有了安静的空间。以前总觉得首页应该把所有内容一次说完，后来才发现，第一眼只需要让人知道这里是谁、可以去哪里。\n\n留白并不是少做一点，而是把阅读的节奏还给访客。其他故事放在往下滚动之后，愿意停留的人自然会继续看。', weather: '多云', mood: '平静', pictures: [{ src: '/images/lineart/white.png', alt: 'White 字样与人物线稿' }] },
  { date: '2026-10-08', title: '整理组件边界', text: '最近在整理组件边界：只有真正重复出现的部分，才值得先抽出来。相似的外观不一定意味着相同的职责，过早合并反而让每次调整都要照顾许多例外。\n\n先把页面做清楚，再观察哪里真的需要共享。这样留下来的组件，名字、数据和行为都会更容易理解。', weather: '晴天', mood: '专注', pictures: [] },
  { date: '2026-09-18', title: '清晨的笔记', text: '清晨的笔记里留一句“下一步”，回来看时就不会丢掉线索。', weather: '晴天', mood: '轻快', pictures: [{ src: '/images/notebook-dawn.svg', alt: '晨光中的笔记本插画' }] },
  { date: '2026-09-06', title: '作品的阅读顺序', text: '试着把作品列表做成有主次的目录，比铺满相同大小的卡片更容易读。', weather: '阴天', mood: '思考', pictures: [{ src: '/images/interface-studies.svg', alt: '编辑界面的抽象插画' }] },
  { date: '2026-08-22', title: '做一次减法', text: '今天把一段说明文字删掉了。入口本身更清楚，页面也跟着松了一口气。', weather: '有风', mood: '放松', pictures: [] },
  { date: '2026-08-10', title: '给记录留线索', text: '好的记录会保留当时的问题，也会为下一次实践留下方向。', weather: '多云', mood: '平静', pictures: [{ src: '/images/daily-quote-blossoms.png', alt: '蓝天下盛开的白色花朵' }] },
]

export const mockProfile = {
  name: 'White',
  githubUrl: 'https://github.com/white680',
  githubHandle: 'white680',
  githubAvatarUrl: 'https://github.com/white680.png?size=256',
  lead: '在技术与表达之间，寻找更清楚的页面。',
  intro: '这里收集关于前端开发、界面设计和日常观察的笔记。希望每个项目都能被认真使用，每篇文章都能让问题更容易理解。',
  focus: [
    { number: '01', title: '前端开发', text: '用稳定的结构和清晰的数据流，让页面持续可维护。' },
    { number: '02', title: '界面设计', text: '从阅读顺序出发，让排版、图像与交互共同服务内容。' },
    { number: '03', title: '持续记录', text: '把实践中的问题写下来，留下可以继续追问的线索。' },
  ],
  tools: ['Vue', 'Nuxt', 'TypeScript', 'CSS', '设计系统'],
  technologyGroups: [
    { title: 'Vue 生态', items: [
      { name: 'Vue', icon: 'vue', description: '界面框架', url: 'https://vuejs.org/' },
      { name: 'Nuxt', icon: 'nuxt', description: 'Vue 应用框架', url: 'https://nuxt.com/' },
      { name: 'Vue Router', icon: 'vue', description: 'Vue 路由', url: 'https://router.vuejs.org/' },
      { name: 'Pinia', icon: 'pinia', description: 'Vue 状态管理', url: 'https://pinia.vuejs.org/' },
      { name: 'Element Plus', icon: 'element-plus', description: 'Vue 组件库', url: 'https://element-plus.org/' },
    ] },
    { title: 'React 生态', items: [
      { name: 'React', icon: 'react', description: '界面框架', url: 'https://react.dev/' },
      { name: 'Next.js', icon: 'nextjs', description: 'React 应用框架', url: 'https://nextjs.org/' },
      { name: 'React Router', icon: 'react-router', description: 'React 路由', url: 'https://reactrouter.com/' },
      { name: 'Ant Design', icon: 'ant-design', description: 'React 组件库', url: 'https://ant.design/components/overview-cn/' },
    ] },
    { title: '工程工具', items: [
      { name: 'TypeScript', icon: 'typescript', description: '类型系统', url: 'https://www.typescriptlang.org/' },
      { name: 'Vite', icon: 'vite', description: '前端构建工具', url: 'https://vite.dev/' },
      { name: 'Axios', icon: 'axios', description: 'HTTP 请求库', url: 'https://axios-http.com/' },
      { name: 'Vitest', icon: 'vitest', description: '测试框架', url: 'https://vitest.dev/' },
    ] },
    { title: '界面与动效', items: [
      { name: 'Tailwind CSS', icon: 'tailwind-css', description: '样式工具', url: 'https://tailwindcss.com/' },
      { name: 'Less CSS', icon: 'less', description: 'CSS 预处理器', url: 'https://lesscss.org/' },
      { name: 'ECharts', icon: 'echarts', description: '数据可视化', url: 'https://echarts.apache.org/' },
      { name: 'GSAP', icon: 'gsap', description: '交互动效', url: 'https://gsap.com/' },
      { name: 'Animate.css', icon: 'animate-css', description: 'CSS 动效库', url: 'https://animate.style/' },
    ] },
  ],
} as const

export const mockCategories = ['全部', '设计手记', '前端开发', '日常札记'] as const

export function findMockPost(slug: string): MockPost | undefined {
  return mockPosts.find(post => post.slug === slug)
}
