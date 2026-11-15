<script setup lang="ts">
import { nextTick, provide } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import HomeBadges from '../components/home/HomeBadges.vue'
import HomeLogo from '../components/home/HomeLogo.vue'
import HomeStatus from '../components/home/HomeStatus.vue'

const { isDark } = useData()

// 深浅色切换从开关位置圆形展开；浏览器不支持或用户要求减少动效时直接切。
provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  const animated = 'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  if (!animated) {
    isDark.value = !isDark.value
    return
  }

  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    { duration: 320, easing: 'ease-in', fill: 'forwards', pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)` }
  )
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-image>
      <HomeLogo />
    </template>
    <template #home-hero-after>
      <HomeStatus />
    </template>
    <template #home-features-after>
      <HomeBadges />
    </template>
  </DefaultTheme.Layout>
</template>
