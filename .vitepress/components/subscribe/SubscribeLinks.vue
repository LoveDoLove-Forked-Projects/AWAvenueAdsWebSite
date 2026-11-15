<template>
  <section class="sub">
    <p class="sub-lede">{{ copy.lede }}</p>

    <div class="sub-grid">
      <!-- 左：选工具 -->
      <div class="sub-tools" :class="{ collapsed: selectedTool && !pickerOpen }">
        <div v-if="selectedTool" class="sub-current">
          <span class="mark" :class="{ logo: icons[selectedTool.id] }">
            <img v-if="icons[selectedTool.id]" :src="icons[selectedTool.id]" alt="" width="36" height="36" />
            <template v-else>{{ marks[selectedTool.id] }}</template>
          </span>
          <strong>{{ selectedTool.label }}</strong>
          <button type="button" @click="pickerOpen = true">{{ copy.changeTool }}</button>
        </div>

        <div class="sub-picker">
          <label class="sub-search">
            <span class="sr-only">{{ copy.searchLabel }}</span>
            <input v-model="toolQuery" type="search" :placeholder="copy.searchPlaceholder" autocomplete="off" />
          </label>

          <div v-for="group in visibleGroups" :key="group" class="tool-group">
            <h3>{{ copy.groups[group] }}</h3>
            <div class="tool-grid">
              <button
                v-for="tool in filteredTools(group)"
                :key="tool.id"
                type="button"
                class="tool"
                :class="{ active: tool.id === selectedToolId }"
                :aria-pressed="tool.id === selectedToolId"
                @click="chooseTool(tool.id)"
              >
                <span class="mark" :class="{ logo: icons[tool.id] }">
                  <img v-if="icons[tool.id]" :src="icons[tool.id]" alt="" width="36" height="36" loading="lazy" decoding="async" />
                  <template v-else>{{ marks[tool.id] }}</template>
                </span>
                <span class="name">{{ tool.label }}</span>
                <span class="ext">{{ tool.extension }}</span>
              </button>
            </div>
          </div>

          <p v-if="visibleGroups.length === 0" class="sub-empty">{{ copy.noTools }}</p>
        </div>
      </div>

      <!-- 右：结果，始终可见 -->
      <aside ref="resultEl" class="sub-result" :aria-label="copy.resultLabel">
        <header class="res-head">
          <div>
            <p class="res-tool">{{ selectedTool ? selectedTool.label : copy.noToolYet }}</p>
            <h2>
              {{ profileTitle }}
              <span v-if="allOn && !independent" class="sweep">{{ copy.sweep }}</span>
            </h2>
          </div>
          <p v-if="!independent" class="res-count">
            <b>{{ shownCount }}</b>
            <span>{{ copy.rules }}</span>
          </p>
        </header>

        <div v-if="!independent" class="cats">
          <div class="cat on locked">
            <span class="dot"></span>
            <span class="cat-text">
              <strong>{{ copy.ads }}</strong>
              <small>{{ copy.adsHelp }}</small>
            </span>
            <span class="cat-num">{{ rules.ads }}</span>
            <span class="track"><i></i></span>
          </div>
          <button type="button" role="switch" class="cat" :class="{ on: blockPrivacy }" :aria-checked="blockPrivacy" @click="toggle('privacy')">
            <span class="dot"></span>
            <span class="cat-text">
              <strong>{{ copy.privacy }}</strong>
              <small>{{ copy.privacyHelp }}</small>
            </span>
            <span class="cat-num">{{ rules.privacy }}</span>
            <span class="track"><i></i></span>
          </button>
          <button type="button" role="switch" class="cat" :class="{ on: blockUnwelcome }" :aria-checked="blockUnwelcome" @click="toggle('unwelcome')">
            <span class="dot"></span>
            <span class="cat-text">
              <strong>{{ copy.unwelcome }}</strong>
              <small>{{ copy.unwelcomeHelp }}</small>
            </span>
            <span class="cat-num">{{ rules.unwelcome }}</span>
            <span class="track"><i></i></span>
          </button>
        </div>
        <p v-else class="res-note">{{ copy.independentHelp }}</p>

        <template v-if="selectedTool && mainLink">
          <p class="res-source">{{ copy.sources[mainLink.source.id].name }}</p>
          <code class="res-url">{{ mainLink.link }}</code>

          <div class="copy-wrap">
            <button type="button" class="copy-main" :class="{ done: copiedKey === 'main' }" @click="copyLink(mainLink.link, 'main')">
              {{ copiedKey === 'main' ? copy.copied : copy.copyLink }}
            </button>
            <span v-for="leaf in leaves" :key="leaf.id" class="leaf" :style="leaf.style" aria-hidden="true">
              <svg viewBox="18 14 72 70"><path :d="leafPath" /></svg>
            </span>
          </div>
          <p v-if="copyFailed" class="copy-error" role="alert">{{ copy.copyError }}</p>
          <span class="sr-only" aria-live="polite">{{ copiedKey ? copy.copied : '' }}</span>

          <a class="res-tutorial" :href="tutorialLink">{{ copy.viewTutorial }} →</a>

          <details v-if="otherLinks.length" class="res-more">
            <summary>{{ copy.moreSources }}</summary>
            <ul>
              <li v-for="item in otherLinks" :key="item.source.id">
                <span class="src-name">
                  {{ copy.sources[item.source.id].name }}
                  <em>{{ copy.sources[item.source.id].badge }}</em>
                </span>
                <code :title="item.link">{{ item.link }}</code>
                <button type="button" :class="{ done: copiedKey === item.source.id }" @click="copyLink(item.link, item.source.id)">
                  {{ copiedKey === item.source.id ? copy.copied : copy.copyShort }}
                </button>
              </li>
            </ul>
          </details>
        </template>
        <p v-else class="res-placeholder">{{ copy.pickFirst }}</p>
      </aside>
    </div>

    <footer class="sub-footer">
      <a :href="localePath('/Protocol.html')">{{ copy.protocol }}</a>
      <a :href="localePath('/Support.html')">{{ copy.feedback }}</a>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { getSubscriptionLink, getTool, getVariantId, sources, tools, type SourceId, type ToolGroup, type VariantId } from '../../../SubData'
import { tutorialMap } from '../../tutorials.mjs'
import { data as rules } from '../../rules.data'

type CopySet = {
  lede: string
  searchLabel: string
  searchPlaceholder: string
  groups: Record<ToolGroup, string>
  noTools: string
  changeTool: string
  resultLabel: string
  noToolYet: string
  pickFirst: string
  sweep: string
  rules: string
  ads: string
  adsHelp: string
  privacy: string
  privacyHelp: string
  unwelcome: string
  unwelcomeHelp: string
  independentHelp: string
  copyLink: string
  copyShort: string
  copied: string
  copyError: string
  viewTutorial: string
  moreSources: string
  protocol: string
  feedback: string
  profiles: Record<VariantId | 'independent', string>
  sources: Record<SourceId, { name: string; badge: string }>
}

const copySets: Record<string, CopySet> = {
  'zh-CN': {
    lede: '选工具，拨开关，复制链接。',
    searchLabel: '搜索工具',
    searchPlaceholder: '搜索 AdGuard、Clash、Surge……',
    groups: { popular: '常用', proxy: '代理客户端', dns: 'DNS、路由器与 hosts', advanced: '其他格式' },
    noTools: '没搜到。它要是个广告，我们早拦了。',
    changeTool: '换一个',
    resultLabel: '订阅链接',
    noToolYet: '还没选工具',
    pickFirst: '先选一个工具，订阅链接会出现在这里。',
    sweep: '秋风扫落叶',
    rules: '条规则',
    ads: '广告',
    adsHelp: '投放、竞价、素材、监测归因',
    privacy: '隐私',
    privacyHelp: '统计埋点、遥测、崩溃收集、设备指纹',
    unwelcome: '不受欢迎',
    unwelcomeHelp: '强制更新、P2P/PCDN、推送、云控下发',
    independentHelp: '补充规则不分三类，单独订阅。',
    copyLink: '复制订阅链接',
    copyShort: '复制',
    copied: '已复制',
    copyError: '复制失败，请长按或选中上面的链接手动复制。',
    viewTutorial: '导入教程',
    moreSources: '连不上 GitHub？换个来源',
    protocol: '使用说明与许可',
    feedback: '反馈误杀或漏拦',
    profiles: { full: '完整防护', ads: '纯广告', noPrivacy: '广告＋不受欢迎', noUnwelcome: '广告＋隐私', independent: '独立规则' },
    sources: {
      ghraw: { name: 'GitHub Raw · 官方仓库', badge: '官方' },
      uura: { name: '王富贵镜像', badge: '国内推荐' },
      cxplay: { name: 'CXPLAY 镜像', badge: '社区镜像' },
      jsdelivr: { name: 'jsDelivr', badge: 'CDN，可能晚几小时' },
      ghproxy: { name: 'ghproxy', badge: 'GitHub 代理' }
    }
  },
  'zh-TW': {
    lede: '選工具，撥開關，複製連結。',
    searchLabel: '搜尋工具',
    searchPlaceholder: '搜尋 AdGuard、Clash、Surge……',
    groups: { popular: '常用', proxy: '代理用戶端', dns: 'DNS、路由器與 hosts', advanced: '其他格式' },
    noTools: '沒搜到。它要是廣告，我們早就攔了。',
    changeTool: '換一個',
    resultLabel: '訂閱連結',
    noToolYet: '還沒選工具',
    pickFirst: '先選一個工具，訂閱連結會出現在這裡。',
    sweep: '秋風掃落葉',
    rules: '條規則',
    ads: '廣告',
    adsHelp: '投放、競價、素材、成效歸因',
    privacy: '隱私權',
    privacyHelp: '使用統計、遙測、當機回報、裝置指紋',
    unwelcome: '不受歡迎',
    unwelcomeHelp: '強制更新、P2P/PCDN、推播、雲端控制',
    independentHelp: '補充規則不分三類，單獨訂閱。',
    copyLink: '複製訂閱連結',
    copyShort: '複製',
    copied: '已複製',
    copyError: '複製失敗，請長按或選取上面的連結手動複製。',
    viewTutorial: '匯入教學',
    moreSources: '連不上 GitHub？換個來源',
    protocol: '使用說明與授權',
    feedback: '回報誤擋或漏攔',
    profiles: { full: '完整防護', ads: '純廣告', noPrivacy: '廣告＋不受歡迎', noUnwelcome: '廣告＋隱私權', independent: '獨立規則' },
    sources: {
      ghraw: { name: 'GitHub Raw · 官方儲存庫', badge: '官方' },
      uura: { name: '王富貴鏡像', badge: '中國大陸推薦' },
      cxplay: { name: 'CXPLAY 鏡像', badge: '社群鏡像站' },
      jsdelivr: { name: 'jsDelivr', badge: 'CDN，可能晚幾小時' },
      ghproxy: { name: 'ghproxy', badge: 'GitHub 代理' }
    }
  },
  'en-US': {
    lede: 'Pick a tool, flip the switches, copy the link.',
    searchLabel: 'Search tools',
    searchPlaceholder: 'Search AdGuard, Clash, Surge…',
    groups: { popular: 'Popular', proxy: 'Proxy clients', dns: 'DNS, routers, and hosts', advanced: 'Other formats' },
    noTools: 'Nothing here. If it were an ad, we would have blocked it already.',
    changeTool: 'Change',
    resultLabel: 'Subscription link',
    noToolYet: 'No tool selected',
    pickFirst: 'Pick a tool and the subscription link shows up here.',
    sweep: 'clean sweep',
    rules: 'rules',
    ads: 'Ads',
    adsHelp: 'Ad serving, bidding, creatives, attribution',
    privacy: 'Privacy',
    privacyHelp: 'Analytics, telemetry, crash reports, fingerprinting',
    unwelcome: 'Unwanted',
    unwelcomeHelp: 'Forced updates, P2P/PCDN, push, remote config',
    independentHelp: 'The supplementary list is not split into categories; it has a single subscription.',
    copyLink: 'Copy subscription link',
    copyShort: 'Copy',
    copied: 'Copied',
    copyError: 'Copy failed. Select or long-press the link above to copy it manually.',
    viewTutorial: 'Import guide',
    moreSources: 'GitHub unreachable? Try another source',
    protocol: 'Usage and licensing',
    feedback: 'Report a false positive or a miss',
    profiles: { full: 'Full protection', ads: 'Ads only', noPrivacy: 'Ads + unwanted', noUnwelcome: 'Ads + privacy', independent: 'Standalone list' },
    sources: {
      ghraw: { name: 'GitHub Raw · Official repository', badge: 'Official' },
      uura: { name: 'Uura mirror', badge: 'Best in mainland China' },
      cxplay: { name: 'CXPLAY mirror', badge: 'Community mirror' },
      jsdelivr: { name: 'jsDelivr', badge: 'CDN, may lag a few hours' },
      ghproxy: { name: 'ghproxy', badge: 'GitHub proxy' }
    }
  }
}

// 工具卡左侧的图标：有官方 logo 的用 public/tools/ 里的小图（每个 0.4–1.7 KB），其余用字母标
const icons: Record<string, string> = {
  adguard: '/tools/adguard.svg',
  adguardReplenish: '/tools/adguard.svg',
  clashClassical: '/tools/mihomo.webp',
  clashMrs: '/tools/mihomo.webp',
  clash: '/tools/mihomo.webp',
  quantumultX: '/tools/quantumultx.webp',
  shadowrocket: '/tools/shadowrocket.webp',
  loon: '/tools/loon.webp',
  surgeRuleSet: '/tools/surge.webp',
  surgeDomainSet: '/tools/surge.webp',
  surgeModule: '/tools/surge.webp',
  singbox: '/tools/singbox.webp',
  hosts: '/tools/adaway.webp',
  routerosAdlist: '/tools/mikrotik.svg',
  routeros: '/tools/mikrotik.svg',
  adclose: '/tools/adclose.svg'
}

const marks: Record<string, string> = {
  adguard: 'AG',
  clashClassical: 'CM',
  clashMrs: 'CM',
  clash: 'CM',
  quantumultX: 'QX',
  shadowrocket: 'SR',
  loon: 'Lo',
  surgeRuleSet: 'Su',
  surgeDomainSet: 'Su',
  surgeModule: 'Su',
  singbox: 'sb',
  hosts: 'h',
  dnsmasq: 'dm',
  mosdns: 'Mo',
  smartdns: 'SD',
  routerosAdlist: 'RO',
  routeros: 'RO',
  adclose: 'AC',
  geosite: 'Geo',
  adguardReplenish: 'AG+'
}

const leafPath =
  'M45 61.5 23.3 56.6 36.4 54.7 24.8 43.4C27.5 42.6 29.3 41 29.5 38 29.8 33.5 27.6 30 25.8 26.7 30 30 35.5 34.6 39.6 33.2 41.3 32.6 41.8 31.4 42.3 30.2L48 39 54 24.2C56.5 27.2 61 27.6 65 23.6L69.3 18.7C68 23.2 66.6 28.6 68.3 31.8 69.4 33.6 71 34 73 34.2L62.7 47.3 73 47.5C71.2 50 71.3 52 74 53.8L84.5 60.3C79 61.5 73.4 63 71.8 66.6L70.8 69.3 55 65.3 59.3 76Z'

const storageKey = 'awa-sub-tool'

const { lang } = useData()
const copy = computed(() => copySets[lang.value] || copySets['zh-CN'])

const toolQuery = ref('')
const selectedToolId = ref('')
const blockPrivacy = ref(true)
const blockUnwelcome = ref(true)
const pickerOpen = ref(true)
const resultEl = ref<HTMLElement | null>(null)

const selectedTool = computed(() => getTool(selectedToolId.value))
const independent = computed(() => selectedTool.value?.supportsVariants === false)
const allOn = computed(() => blockPrivacy.value && blockUnwelcome.value)

const visibleGroups = computed(() => (['popular', 'proxy', 'dns', 'advanced'] as ToolGroup[]).filter(group => filteredTools(group).length > 0))

function filteredTools(group: ToolGroup) {
  const query = toolQuery.value.trim().toLocaleLowerCase()
  return tools.filter(tool => tool.group === group && (!query || `${tool.label} ${tool.extension}`.toLocaleLowerCase().includes(query)))
}

const variantId = computed<VariantId>(() => (independent.value ? 'full' : getVariantId(blockPrivacy.value, blockUnwelcome.value)))
const profileTitle = computed(() => copy.value.profiles[independent.value ? 'independent' : variantId.value])

const availableLinks = computed(() => {
  const tool = selectedTool.value
  if (!tool) return []
  return sources.map(source => ({ source, link: getSubscriptionLink(tool, variantId.value, source.id) })).filter(item => item.link)
})
const mainLink = computed(() => availableLinks.value[0])
// 备用来源：国内镜像排前面
const otherLinks = computed(() => {
  const rest = availableLinks.value.slice(1)
  return [...rest.filter(item => item.source.domestic), ...rest.filter(item => !item.source.domestic)]
})

const tutorialLink = computed(() => localePath(tutorialMap[selectedToolId.value as keyof typeof tutorialMap] || '/Knowledge.html'))

function localePath(path: string) {
  const prefix = lang.value === 'en-US' ? '/en' : lang.value === 'zh-TW' ? '/zh_TW' : ''
  return `${prefix}${path}`
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 规则数量：拨开关时滚动到新值
const total = computed(() => rules.ads + (blockPrivacy.value ? rules.privacy : 0) + (blockUnwelcome.value ? rules.unwelcome : 0))
const shownCount = ref(total.value)
let rollFrame = 0
watch(total, target => {
  cancelAnimationFrame(rollFrame)
  if (reducedMotion()) {
    shownCount.value = target
    return
  }
  const from = shownCount.value
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / 420)
    shownCount.value = Math.round(from + (target - from) * (1 - (1 - t) ** 3))
    if (t < 1) rollFrame = requestAnimationFrame(step)
  }
  rollFrame = requestAnimationFrame(step)
})

function chooseTool(toolId: string) {
  selectedToolId.value = toolId
  pickerOpen.value = false
  persistState()
  // 窄屏下工具列表收起后，把结果带回视野
  if (window.matchMedia('(max-width: 859px)').matches) {
    requestAnimationFrame(() => resultEl.value?.closest('.sub')?.scrollIntoView({ block: 'start' }))
  }
}

function toggle(kind: 'privacy' | 'unwelcome') {
  if (kind === 'privacy') blockPrivacy.value = !blockPrivacy.value
  else blockUnwelcome.value = !blockUnwelcome.value
  persistState()
}

function persistState() {
  const params = new URLSearchParams()
  if (selectedToolId.value) params.set('tool', selectedToolId.value)
  if (!blockPrivacy.value) params.set('privacy', 'keep')
  if (!blockUnwelcome.value) params.set('unwelcome', 'keep')
  const query = params.toString()
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
  try {
    localStorage.setItem(storageKey, selectedToolId.value)
  } catch {}
}

// 复制
const copiedKey = ref('')
const copyFailed = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyLink(link: string, key: string) {
  copyFailed.value = false
  try {
    await navigator.clipboard.writeText(link)
  } catch {
    copyFailed.value = true
    return
  }
  copiedKey.value = key
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copiedKey.value = ''), 2000)
  if (key === 'main') dropLeaves()
}

watch([selectedToolId, variantId], () => {
  copiedKey.value = ''
  copyFailed.value = false
})

// 复制成功：按钮处飘下几片小枫叶
const leaves = ref<{ id: number; style: Record<string, string> }[]>([])
let leafId = 0
let leafTimer: ReturnType<typeof setTimeout> | undefined

function dropLeaves() {
  if (reducedMotion()) return
  const tints = ['var(--awa-pink)', 'var(--awa-mauve)']
  leaves.value = Array.from({ length: 4 }, (_, index) => ({
    id: ++leafId,
    style: {
      left: `${12 + index * 22 + Math.random() * 10}%`,
      color: tints[index % 2],
      animationDelay: `${index * 90}ms`,
      '--sway': `${Math.round(Math.random() * 40 - 20)}px`,
      '--spin': `${Math.round(Math.random() * 240 - 120)}deg`
    }
  }))
  clearTimeout(leafTimer)
  leafTimer = setTimeout(() => (leaves.value = []), 1500)
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  let toolId = params.get('tool')
  if (!toolId) {
    try {
      toolId = localStorage.getItem(storageKey)
    } catch {}
  }
  if (toolId && getTool(toolId)) {
    selectedToolId.value = toolId
    pickerOpen.value = false
  }
  blockPrivacy.value = params.get('privacy') !== 'keep'
  blockUnwelcome.value = params.get('unwelcome') !== 'keep'
})

onUnmounted(() => {
  cancelAnimationFrame(rollFrame)
  clearTimeout(copiedTimer)
  clearTimeout(leafTimer)
})
</script>

<style>
.subscription-page .VPDoc {
  padding: 0;
}

.subscription-page .VPPage {
  width: min(1280px, calc(100% - 48px));
  margin-inline: auto;
}

.subscription-page .container,
.subscription-page .content {
  max-width: none;
}

.subscription-page .content-container {
  max-width: 1180px;
}

.subscription-page .VPPage h1 {
  margin-top: 40px;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -0.01em;
}

.sub {
  scroll-margin-top: calc(var(--vp-nav-height) + 12px);
  padding-bottom: 40px;
}

.sub-lede {
  margin: 8px 0 28px;
  color: var(--vp-c-text-2);
  font-size: 17px;
}

.sub-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 384px);
  align-items: start;
  gap: 28px;
}

/* ---------- 工具 ---------- */

.sub-current {
  display: none;
}

.sub-search {
  display: block;
  margin-bottom: 24px;
}

.sub-search input {
  width: 100%;
  height: 46px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 0 16px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.sub-search input:focus {
  border-color: var(--vp-c-brand-1);
}

.tool-group + .tool-group {
  margin-top: 24px;
}

.sub .tool-group h3 {
  margin: 0 0 10px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}

.tool {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.18s,
    background-color 0.18s;
}

.tool:hover,
.tool:focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.tool.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.sub .mark {
  display: grid;
  flex: 0 0 36px;
  height: 36px;
  place-items: center;
  border-radius: 10px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition:
    color 0.18s,
    background-color 0.18s;
}

.tool.active .mark,
.sub-current .mark {
  color: #fff;
  background: var(--vp-c-brand-3);
}

.sub .mark.logo {
  overflow: hidden;
  background: transparent;
}

.sub .mark img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 选中的工具：logo 外圈一道品牌色描边，代替字母标的实心底 */
.tool.active .mark.logo {
  background: transparent;
  box-shadow:
    0 0 0 2px var(--vp-c-bg-soft),
    0 0 0 4px var(--vp-c-brand-1);
}

.tool .name {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  text-wrap: balance;
}

.tool .ext {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.sub-empty {
  color: var(--vp-c-text-2);
}

/* ---------- 结果 ---------- */

.sub-result {
  position: sticky;
  top: calc(var(--vp-nav-height) + 24px);
  max-height: calc(100vh - var(--vp-nav-height) - 48px);
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
}

.res-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.res-tool {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 20px;
}

.sub .res-head h2 {
  margin: 2px 0 0;
  border: 0;
  padding: 0;
  font-size: 22px;
  line-height: 32px;
  letter-spacing: 0;
}

.sweep {
  display: inline-block;
  margin-left: 6px;
  color: var(--awa-mauve);
  font-size: 12px;
  font-weight: 500;
  vertical-align: 2px;
  animation: sweep-in 0.4s ease-out;
}

@keyframes sweep-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
}

.res-count {
  flex: 0 0 auto;
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 32px;
  white-space: nowrap;
}

.res-count b {
  margin-right: 4px;
  background: var(--awa-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 30px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  vertical-align: -2px;
}

.cats {
  display: grid;
  gap: 8px;
  margin-top: 18px;
}

.cat {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  text-align: left;
  transition:
    border-color 0.2s,
    opacity 0.2s;
}

button.cat {
  cursor: pointer;
}

button.cat:hover,
button.cat:focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.cat:not(.on) .cat-text,
.cat:not(.on) .cat-num {
  opacity: 0.45;
}

.cat .dot {
  flex: 0 0 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
}

.cat.on .dot {
  background: var(--awa-pink);
  box-shadow: 0 0 8px var(--awa-pink);
}

.cat-text {
  flex: 1;
  min-width: 0;
  transition: opacity 0.2s;
}

.cat-text strong {
  display: block;
  font-size: 15px;
  line-height: 22px;
}

.cat-text small {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 18px;
}

.cat-num {
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  transition: opacity 0.2s;
}

.cat .track {
  position: relative;
  flex: 0 0 38px;
  height: 22px;
  border-radius: 11px;
  background: var(--vp-c-divider);
  transition: background-color 0.2s;
}

.cat .track i {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}

.cat.on .track {
  background: var(--vp-c-brand-3);
}

.cat.on .track i {
  transform: translateX(16px);
}

.cat.locked .track {
  opacity: 0.5;
}

.res-note,
.res-placeholder {
  margin: 18px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.res-placeholder {
  border: 1px dashed var(--vp-c-border);
  border-radius: 12px;
  padding: 18px;
  text-align: center;
}

.res-source {
  margin: 20px 0 6px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 20px;
}

.sub .res-url {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-size: 12.5px;
  line-height: 1.6;
  overflow-wrap: anywhere;
  user-select: all;
}

.copy-wrap {
  position: relative;
  margin-top: 12px;
}

.copy-main {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 52px;
  border-radius: 12px;
  color: #fff;
  background: var(--vp-c-brand-3);
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.copy-main:hover,
.copy-main:focus-visible {
  background: var(--vp-c-brand-2);
}

.copy-main:active {
  transform: scale(0.985);
}

.leaf {
  position: absolute;
  top: 30px;
  width: 18px;
  height: 18px;
  opacity: 0;
  pointer-events: none;
  animation: leaf-fall 1.1s ease-in forwards;
}

.leaf svg {
  display: block;
  fill: currentColor;
}

@keyframes leaf-fall {
  0% {
    opacity: 0;
    transform: none;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--sway), 96px) rotate(var(--spin));
  }
}

.copy-error {
  margin: 8px 0 0;
  color: var(--vp-c-danger-1);
  font-size: 13px;
}

.sub .res-tutorial {
  display: inline-block;
  margin-top: 14px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.res-more {
  margin-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 12px;
}

.res-more summary {
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
}

.res-more summary:hover {
  color: var(--vp-c-brand-1);
}

.sub .res-more ul {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.sub .res-more li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 2px 12px;
  margin: 0;
  padding: 8px 0;
}

.sub .res-more li + li {
  border-top: 1px solid var(--vp-c-divider);
}

.src-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.src-name em {
  margin-left: 6px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
}

.sub .res-more code {
  grid-column: 1;
  overflow: hidden;
  padding: 0;
  color: var(--vp-c-text-3);
  background: none;
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.res-more button {
  grid-column: 2;
  grid-row: 1 / span 2;
  min-width: 64px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 5px 12px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;
}

.res-more button:hover,
.res-more button:focus-visible {
  border-color: var(--vp-c-brand-1);
}

.res-more button.done {
  color: var(--awa-pink);
}

.sub-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 28px;
  font-size: 13px;
}

.sub .sub-footer a {
  color: var(--vp-c-text-2);
  font-weight: 400;
  text-decoration: none;
}

.sub .sub-footer a:hover {
  color: var(--vp-c-brand-1);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

/* ---------- 窄屏：单列，选完工具后列表收成一行 ---------- */

@media (max-width: 859px) {
  .sub-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .sub-result {
    position: static;
    max-height: none;
    padding: 20px 16px;
  }

  .sub-tools.collapsed .sub-picker {
    display: none;
  }

  .sub-tools.collapsed .sub-current {
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid var(--vp-c-brand-1);
    border-radius: 12px;
    padding: 10px 12px;
    background: var(--vp-c-brand-soft);
  }

  .sub-current strong {
    flex: 1;
    min-width: 0;
    font-size: 15px;
  }

  .sub-current button {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    padding: 5px 12px;
    color: var(--vp-c-brand-1);
    background: var(--vp-c-bg);
    font-size: 13px;
    font-weight: 600;
  }
}

@media (max-width: 640px) {
  .subscription-page .VPPage {
    width: min(100%, calc(100% - 32px));
  }

  .tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .tool {
    gap: 8px;
    padding: 8px;
  }

  .tool .ext {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sub *,
  .sub *::before {
    animation: none !important;
    transition: none !important;
  }
}
</style>
