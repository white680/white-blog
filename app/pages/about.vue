<script setup lang="ts">
import { mockProfile } from "~/data/mock";

const avatarFailed = ref(false);

useSeoMeta({
  title: "关于 · white-博客",
  description: "关于 White 的写作、前端开发与界面设计。",
  ogTitle: "关于 · white-博客",
  ogDescription: "关于 White 的写作、前端开发与界面设计。",
  ogType: "website",
});
</script>

<template>
  <div class="about-page">
    <div class="about-page-background" aria-hidden="true" />
    <div class="about-content">
      <header class="about-heading">
        <h1>关于</h1>
      </header>
      <div class="about-card-stack">
        <section class="about-card about-card--front" aria-labelledby="about-name">
          <h2 id="about-name" class="about-name wordmark">{{ mockProfile.name }}</h2>
          <a
            class="about-avatar"
            :href="mockProfile.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="访问 White 的 GitHub 主页（新窗口打开）"
          >
            <img
              v-if="!avatarFailed"
              :src="mockProfile.githubAvatarUrl"
              alt="White 的 GitHub 头像"
              width="72"
              height="72"
              @error="avatarFailed = true"
            />
            <span v-else aria-hidden="true">W</span>
          </a>
          <p class="about-lead">{{ mockProfile.lead }}</p>
          <div class="about-front-bottom">
            <p>{{ mockProfile.intro }}</p>
            <nav aria-label="继续浏览">
              <NuxtLink to="/posts">文章 <span aria-hidden="true">↗</span></NuxtLink>
              <NuxtLink to="/projects">练习 <span aria-hidden="true">↗</span></NuxtLink>
            </nav>
          </div>
        </section>
        <section class="about-card about-card--back" aria-labelledby="about-focus-title">
          <h2 id="about-focus-title">当前关注</h2>
          <ol class="about-focus-list">
            <li v-for="item in mockProfile.focus" :key="item.number">
              <span aria-hidden="true">{{ item.number }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </div>
            </li>
          </ol>
          <div class="about-back-footer">
            <span>GitHub / {{ mockProfile.githubHandle }}</span>
            <a
              :href="mockProfile.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="访问 White 的 GitHub 主页（新窗口打开）"
            >
              查看主页 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </div>
      <section class="about-tech" aria-labelledby="about-tech-title">
        <h2 id="about-tech-title">收藏的前端技术</h2>
        <div v-for="group in mockProfile.technologyGroups" :key="group.title" class="about-tech-group">
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="technology in group.items" :key="technology.name">
              <a
                :href="technology.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`${technology.name} 官网（新窗口打开）`"
              >
                <span class="about-tech-mark" aria-hidden="true"
                  ><svg width="27" height="27" focusable="false">
                    <use :href="`/images/tech-icons.svg#${technology.icon}`" /></svg
                ></span>
                <span class="about-tech-copy">
                  <strong>{{ technology.name }}</strong>
                  <small>{{ technology.description }}</small>
                </span>
                <span class="about-tech-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  position: relative;
  isolation: isolate;
  min-height: calc(100svh - 94px);
  padding: 38px 0 100px;
  color: #252525;
}
.about-page-background {
  position: fixed;
  z-index: -2;
  inset: 0;
  background: #f4f4f4 url("/images/lineart/white.png") center / cover no-repeat;
  pointer-events: none;
}
.about-page::before {
  position: fixed;
  z-index: -1;
  inset: 0;
  background: rgba(248, 248, 248, 0.48);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  content: "";
  pointer-events: none;
}
.about-content {
  width: min(1120px, calc(100% - 48px));
  margin: auto;
}
.about-heading {
  width: min(930px, 100%);
  margin: 0 auto 28px;
  animation: about-arrive 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.about-heading h1 {
  margin: 0;
  font-family: "Noto Serif SC", "Songti SC", "SimSun", serif;
  font-size: clamp(34px, 4vw, 44px);
  font-weight: 500;
}
.about-card-stack {
  width: min(930px, 100%);
  min-height: calc(100svh - 290px);
  margin: auto;
}
.about-card {
  border-radius: 22px;
  box-shadow: 0 22px 55px rgba(18, 18, 18, 0.16);
  animation: about-arrive 0.68s cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
}
.about-card--front {
  position: relative;
  z-index: 2;
  isolation: isolate;
  display: grid;
  min-height: clamp(405px, 45svh, 500px);
  grid-template-columns: 0.9fr 1.1fr;
  grid-template-rows: 1fr auto;
  align-items: center;
  padding: clamp(34px, 4vw, 48px);
  background: transparent;
  color: #fff;
  box-shadow: none;
  animation-delay: 70ms;
}
.about-card--front::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: inherit;
  background: #272727;
  box-shadow: 0 22px 55px rgba(18, 18, 18, 0.16);
  content: "";
  transform: rotate(-1.1deg);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
}
.about-avatar {
  position: absolute;
  top: 34px;
  right: 38px;
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  background: #4b4b4b;
  color: #fff;
  font-family: Georgia, serif;
  font-size: 36px;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.about-avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1);
}
.about-avatar:hover {
  border-color: #fff;
  transform: scale(1.05);
}
.about-name {
  width: fit-content;
  margin: 0;
  font-size: clamp(78px, 9vw, 118px);
  font-weight: 600;
}
.about-lead {
  max-width: 15ch;
  margin: 0;
  font-family: "Noto Serif SC", "Songti SC", "SimSun", serif;
  font-size: clamp(26px, 2.6vw, 32px);
  line-height: 1.5;
}
.about-front-bottom {
  display: flex;
  grid-column: 1 / -1;
  align-items: end;
  justify-content: space-between;
  gap: 36px;
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.35);
}
.about-front-bottom p {
  max-width: 54ch;
  margin: 0;
  color: #e4e4e4;
  font-size: 14px;
  line-height: 1.8;
}
.about-front-bottom nav {
  display: flex;
  flex: none;
  gap: 8px;
}
.about-front-bottom a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 15px;
  padding: 0 12px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}
.about-front-bottom a:hover {
  background: #fff;
  color: #252525;
}
.about-card--back {
  position: relative;
  z-index: 1;
  display: flex;
  width: 94%;
  min-height: clamp(320px, 36svh, 420px);
  flex-direction: column;
  margin: -72px -24px 0 auto;
  padding: 112px 44px 36px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.96);
  animation-delay: 180ms;
}
.about-card--back > h2 {
  margin: 0;
  font-family: "Noto Serif SC", "Songti SC", "SimSun", serif;
  font-size: 21px;
  font-weight: 500;
}
.about-focus-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}
.about-focus-list li {
  display: flex;
  gap: 10px;
}
.about-focus-list li > span {
  padding-top: 5px;
  color: #777;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.about-focus-list h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}
.about-focus-list p {
  margin: 9px 0 0;
  color: #555;
  font-size: 13px;
  line-height: 1.65;
}
.about-back-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 26px;
}
.about-back-footer > span {
  color: #666;
  font-size: 14px;
}
.about-back-footer a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 24px;
  padding: 0 18px;
  border-radius: 8px;
  background: #272727;
  color: #fff;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.2s ease, translate 0.2s ease;
}
.about-back-footer a:hover {
  background: #484848;
  translate: 0 -2px;
}
.about-back-footer a:focus-visible {
  outline-color: #272727;
}
.about-tech {
  width: min(930px, 100%);
  margin: 36px auto 0;
  padding: 28px 34px;
  border: 1px solid rgba(38, 38, 38, 0.12);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 40px rgba(18, 18, 18, 0.08);
}
.about-tech h2 {
  margin: 0 0 14px;
  font-family: "Noto Serif SC", "Songti SC", "SimSun", serif;
  font-size: 21px;
  font-weight: 500;
}
.about-tech-group + .about-tech-group {
  margin-top: 26px;
}
.about-tech-group h3 {
  margin: 0 0 8px;
  color: #606060;
  font-size: 14px;
  font-weight: 600;
}
.about-tech-group ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.about-tech a {
  display: flex;
  min-height: 66px;
  align-items: center;
  gap: 12px;
  padding: 9px;
  border-radius: 9px;
  color: #282828;
  text-decoration: none;
  transition: background 0.2s ease, translate 0.2s ease;
}
.about-tech a:hover {
  background: #eeeeee;
  translate: 3px 0;
}
.about-tech-mark {
  display: grid;
  width: 42px;
  height: 42px;
  flex: none;
  place-items: center;
  border: 1px solid #d3d3d3;
  border-radius: 9px;
  background: #f4f4f4;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.03em;
}
.about-tech-copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}
.about-tech-copy strong {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}
.about-tech-copy small {
  color: #666;
  font-size: 12px;
}
.about-tech-arrow {
  margin-left: auto;
  color: #777;
  font-size: 17px;
}
.about-page a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
@keyframes about-arrive {
  from {
    opacity: 0;
    translate: 0 20px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
@media (hover: hover) {
  .about-card--front:hover::before {
    transform: rotate(-0.4deg) translateY(-3px);
    box-shadow: 0 30px 65px rgba(18, 18, 18, 0.2);
  }
  .about-card--back:hover {
    transform: translateY(-3px);
  }
}
@media (max-width: 700px) {
  .about-page {
    padding: 24px 0 64px;
  }
  .about-content {
    width: calc(100% - 32px);
  }
  .about-card-stack {
    min-height: 0;
  }
  .about-heading {
    margin-bottom: 20px;
  }
  .about-card--front {
    display: flex;
    min-height: 0;
    flex-direction: column;
    align-items: stretch;
    padding: 30px;
    transform: none;
  }
  .about-card--front::before {
    transform: rotate(-0.5deg);
  }
  .about-avatar {
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
  .about-name {
    font-size: clamp(64px, 18vw, 86px);
  }
  .about-lead {
    margin-top: 24px;
    font-size: clamp(24px, 6vw, 29px);
  }
  .about-front-bottom {
    display: block;
    margin-top: 44px;
  }
  .about-front-bottom nav {
    margin-top: 16px;
  }
  .about-card--back {
    width: 100%;
    min-height: 0;
    margin: 16px 0 0;
    padding: 30px;
    transform: none;
  }
  .about-back-footer {
    margin-top: 26px;
  }
  .about-focus-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .about-tech {
    margin-top: 26px;
    padding: 20px;
  }
  .about-tech-group ul {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .about-heading,
  .about-card {
    animation: none;
    transition: none;
  }
  .about-card--front::before,
  .about-back-footer a {
    transition: none;
  }
  .about-card--front:hover::before {
    transform: rotate(-1.1deg);
  }
  .about-card--back:hover {
    transform: none;
  }
  .about-front-bottom a,
  .about-avatar,
  .about-tech a {
    transition: none;
  }
  .about-tech a:hover {
    translate: none;
  }
  .about-back-footer a:hover {
    translate: none;
  }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .about-page::before {
    background: rgba(248, 248, 248, 0.83);
  }
  .about-card--back {
    background: #fff;
  }
}
</style>
