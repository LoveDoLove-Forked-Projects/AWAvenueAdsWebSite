import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  description: 'Eliminate All Malicious Ads',

  themeConfig: {
    nav: nav(),

    editLink: {
      pattern: 'https://github.com/TG-Twilight/AWAvenueAdsWebSite/edit/main/:path',
      text: 'Edit this page on GitHub'
    }
  }
})

function nav() {
  return [
    { text: 'Donate', link: '/en/Donate.html' },
    { text: 'Subscribe', link: '/en/Sub.html' },
    { text: 'Thanks', link: '/en/Thank.html' },
    { text: 'Communication', link: '/en/Support.html' },
    { text: 'Protocol', link: '/en/Protocol.html' },
    { text: 'Knowledge', link: '/en/Knowledge.html' }
  ]
}
