// 构建时从官方仓库读规则头部，算出版本、更新日期和三类规则数量。
// 首页和订阅页直接用构建结果，访客浏览器不用再发请求；部署工作流每天定时重建一次保持新鲜。
// 构建机连不上 GitHub 时退回下面的快照。

export type RuleStats = {
  version: string
  updated: string
  ads: number
  privacy: number
  unwelcome: number
}

const snapshot: RuleStats = { version: '1.7.9', updated: '2026-11-15', ads: 650, privacy: 224, unwelcome: 97 }

const base = 'https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Adblock'

async function header(tag: string) {
  const response = await fetch(`${base}${tag}.txt`, { signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error(`${response.status} ${tag}`)
  const head = (await response.text()).slice(0, 600)
  const total = Number(head.match(/^!Total lines: (\d+)/m)?.[1])
  if (!total) throw new Error(`no total ${tag}`)
  return { total, version: head.match(/^!Version: ([\d.]+)/m)?.[1], updated: head.match(/^!Update time: (\d{4}-\d\d-\d\d)/m)?.[1] }
}

declare const data: RuleStats
export { data }

export default {
  async load(): Promise<RuleStats> {
    try {
      const [full, ads, noPrivacy, noUnwelcome] = await Promise.all(['', '-Only.Ads', '-No.Privacy', '-No.Unwelcome'].map(header))
      const stats = {
        version: full.version || snapshot.version,
        updated: full.updated || snapshot.updated,
        ads: ads.total,
        privacy: full.total - noPrivacy.total,
        unwelcome: full.total - noUnwelcome.total
      }
      if (stats.privacy <= 0 || stats.unwelcome <= 0) throw new Error('unexpected counts')
      return stats
    } catch (error) {
      console.warn(`[rules.data] 使用快照：${error}`)
      return snapshot
    }
  }
}
