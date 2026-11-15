<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as rules } from '../../rules.data'

// 首页现况条 + 迷你订阅入口。数字来自构建时读到的规则头部（rules.data.ts）。
const copySets = {
  'zh-CN': {
    label: '规则现况',
    version: '最新版本',
    ads: '广告',
    privacy: '隐私',
    unwelcome: '不受欢迎',
    unit: '条',
    updated: '上次更新',
    quick: '直接订阅',
    more: '全部工具'
  },
  'zh-TW': {
    label: '規則現況',
    version: '最新版本',
    ads: '廣告',
    privacy: '隱私權',
    unwelcome: '不受歡迎',
    unit: '條',
    updated: '上次更新',
    quick: '直接訂閱',
    more: '全部工具'
  },
  'en-US': {
    label: 'Rule status',
    version: 'Latest',
    ads: 'Ads',
    privacy: 'Privacy',
    unwelcome: 'Unwanted',
    unit: 'rules',
    updated: 'Updated',
    quick: 'Subscribe with',
    more: 'All tools'
  }
} as const

const quickTools = [
  { id: 'adguard', label: 'AdGuard' },
  { id: 'clashClassical', label: 'Clash Classical' },
  { id: 'clashMrs', label: 'Mihomo MRS' },
  { id: 'quantumultX', label: 'Quantumult X' },
  { id: 'shadowrocket', label: 'Shadowrocket' },
  { id: 'loon', label: 'Loon' },
  { id: 'surgeRuleSet', label: 'Surge' },
  { id: 'singbox', label: 'sing-box' }
]

const { lang } = useData()
const copy = computed(() => copySets[lang.value as keyof typeof copySets] || copySets['zh-CN'])
const subPath = computed(() => `${lang.value === 'en-US' ? '/en' : lang.value === 'zh-TW' ? '/zh_TW' : ''}/Sub.html`)
</script>

<template>
  <section class="home-now">
    <div class="home-now-inner">
    <dl class="now-strip" :aria-label="copy.label">
      <div>
        <dt>{{ copy.version }}</dt>
        <dd>{{ rules.version }}</dd>
      </div>
      <div class="count">
        <dt>{{ copy.ads }}</dt>
        <dd>
          <b>{{ rules.ads }}</b
          ><small>{{ copy.unit }}</small>
        </dd>
      </div>
      <div class="count">
        <dt>{{ copy.privacy }}</dt>
        <dd>
          <b>{{ rules.privacy }}</b
          ><small>{{ copy.unit }}</small>
        </dd>
      </div>
      <div class="count">
        <dt>{{ copy.unwelcome }}</dt>
        <dd>
          <b>{{ rules.unwelcome }}</b
          ><small>{{ copy.unit }}</small>
        </dd>
      </div>
      <div>
        <dt>{{ copy.updated }}</dt>
        <dd>{{ rules.updated }}</dd>
      </div>
    </dl>

    <nav class="quick-sub" :aria-label="copy.quick">
      <span class="quick-label">{{ copy.quick }}</span>
      <a v-for="tool in quickTools" :key="tool.id" :href="`${subPath}?tool=${tool.id}`">{{ tool.label }}</a>
      <a class="more" :href="subPath">{{ copy.more }} →</a>
    </nav>
    </div>
  </section>
</template>

<style scoped>
.home-now {
  position: relative;
  padding: 24px 24px 32px;
}

@media (min-width: 640px) {
  .home-now {
    padding: 24px 48px 40px;
  }
}

@media (min-width: 960px) {
  .home-now {
    padding: 0 64px 48px;
  }
}

.home-now-inner {
  margin: 0 auto;
  max-width: 1152px;
}

.now-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin: 0;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 16px;
  background: var(--awa-glass);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.now-strip > div {
  min-width: 0;
  padding: 18px 20px;
}

.now-strip > div + div {
  border-left: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
}

.now-strip dt {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 20px;
}

.now-strip dd {
  margin: 4px 0 0;
  color: var(--vp-c-text-1);
  font-size: 22px;
  font-weight: 650;
  line-height: 32px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.now-strip .count b {
  background: var(--awa-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 28px;
  font-weight: 700;
}

.now-strip small {
  margin-left: 4px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-weight: 400;
}

.quick-sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.quick-label {
  margin-right: 4px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.quick-sub a {
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 999px;
  padding: 5px 14px;
  color: var(--vp-c-text-1);
  background: var(--awa-glass);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  transition:
    border-color 0.2s,
    color 0.2s;
}

.quick-sub a:hover,
.quick-sub a:focus-visible {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.quick-sub .more {
  border-color: transparent;
  color: var(--vp-c-brand-1);
  background: none;
}

@media (max-width: 767px) {
  .now-strip {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .now-strip > div {
    grid-column: span 2;
    padding: 14px 16px;
  }

  /* 第一行放三类数量，第二行版本与日期各占一半 */
  .now-strip > div:first-child,
  .now-strip > div:last-child {
    grid-column: span 3;
    grid-row: 2;
    border-top: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  }

  .now-strip > div:first-child,
  .now-strip > div:nth-child(2) {
    border-left: 0;
  }

  .now-strip dd {
    font-size: 18px;
  }

  .now-strip .count b {
    font-size: 24px;
  }
}
</style>
