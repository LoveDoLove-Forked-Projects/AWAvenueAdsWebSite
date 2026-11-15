<script setup lang="ts">
import { ref } from 'vue'
import { useData } from 'vitepress'

// 天空底图 + 描边枫叶。打开页面时画一遍，鼠标移上去重画；两秒内连点五次，枫叶被吹走再飘回来。
const { site } = useData()
const blown = ref(false)
let taps = 0
let timer: ReturnType<typeof setTimeout> | undefined

function tap() {
  if (blown.value) return
  taps += 1
  clearTimeout(timer)
  if (taps < 5) {
    timer = setTimeout(() => (taps = 0), 2000)
    return
  }
  taps = 0
  blown.value = true
}
</script>

<template>
  <div class="awa-logo" :class="{ blown }" @click="tap">
    <img src="/logo-sky.webp" :alt="site.title" width="460" height="460" fetchpriority="high" />
    <svg viewBox="0 0 100 100" aria-hidden="true" @animationend.self="blown = false">
      <path
        pathLength="1"
        d="M45 61.5 23.3 56.6 36.4 54.7 24.8 43.4C27.5 42.6 29.3 41 29.5 38 29.8 33.5 27.6 30 25.8 26.7 30 30 35.5 34.6 39.6 33.2 41.3 32.6 41.8 31.4 42.3 30.2L48 39 54 24.2C56.5 27.2 61 27.6 65 23.6L69.3 18.7C68 23.2 66.6 28.6 68.3 31.8 69.4 33.6 71 34 73 34.2L62.7 47.3 73 47.5C71.2 50 71.3 52 74 53.8L84.5 60.3C79 61.5 73.4 63 71.8 66.6L70.8 69.3 55 65.3 59.3 76Z"
      />
      <path class="vein" pathLength="1" d="M45 61.5Q39 74 31.3 80.8M45 61.5 36.8 39M45 61.5 57.5 39.4M45 61.5 66.6 57.2" />
    </svg>
  </div>
</template>

<style scoped>
.awa-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

@media (min-width: 640px) {
  .awa-logo {
    width: 240px;
    height: 240px;
  }
}

@media (min-width: 960px) {
  .awa-logo {
    width: 264px;
    height: 264px;
  }
}

.awa-logo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 连续曲率圆角（squircle） */
  -webkit-mask: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20460%20460%22%3E%3Cpath%20d%3D%22M460%20316.1c0%205.5%200%2010.99-.04%2016.48-.03%204.63-.08%209.26-.2%2013.88a201.73%20201.73%200%200%201-2.66%2030.21c-1.71%2010-4.9%2019.68-9.47%2028.73a96.6%2096.6%200%200%201-42.23%2042.23%20101.86%20101.86%200%200%201-28.71%209.46c-10%201.65-20.1%202.54-30.22%202.66a649%20649%200%200%201-13.88.21c-5.5.03-10.99.03-16.48.03H143.89c-5.49%200-10.98%200-16.48-.03a648.8%20648.8%200%200%201-13.88-.2%20201.46%20201.46%200%200%201-30.22-2.67c-9.99-1.7-19.67-4.9-28.71-9.46a96.61%2096.61%200%200%201-42.23-42.22%20101.96%20101.96%200%200%201-9.47-28.74%20201.6%20201.6%200%200%201-2.66-30.2c-.12-4.63-.18-9.26-.2-13.89C0%20327.08%200%20321.6%200%20316.1V143.9c0-5.5%200-11%20.04-16.5.02-4.62.08-9.25.2-13.87a201.64%20201.64%200%200%201%202.66-30.2c1.71-10%204.9-19.68%209.47-28.74A96.6%2096.6%200%200%201%2054.6%2012.36%20101.96%20101.96%200%200%201%2083.3%202.9c10-1.64%2020.1-2.53%2030.22-2.66%204.63-.12%209.26-.18%2013.88-.2%205.5-.03%2011-.03%2016.48-.03H316.1c5.5%200%2011%200%2016.49.03a649%20649%200%200%201%2013.88.2c10.12.13%2020.22%201.02%2030.21%202.66%2010%201.71%2019.67%204.9%2028.72%209.46a96.58%2096.58%200%200%201%2042.24%2042.23%20101.92%20101.92%200%200%201%209.46%2028.73%20201.7%20201.7%200%200%201%202.66%2030.21c.12%204.63.18%209.26.2%2013.88.04%205.5.04%2010.99.04%2016.48V316.1z%22%2F%3E%3C%2Fsvg%3E')
    center/100% 100% no-repeat;
  mask: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20460%20460%22%3E%3Cpath%20d%3D%22M460%20316.1c0%205.5%200%2010.99-.04%2016.48-.03%204.63-.08%209.26-.2%2013.88a201.73%20201.73%200%200%201-2.66%2030.21c-1.71%2010-4.9%2019.68-9.47%2028.73a96.6%2096.6%200%200%201-42.23%2042.23%20101.86%20101.86%200%200%201-28.71%209.46c-10%201.65-20.1%202.54-30.22%202.66a649%20649%200%200%201-13.88.21c-5.5.03-10.99.03-16.48.03H143.89c-5.49%200-10.98%200-16.48-.03a648.8%20648.8%200%200%201-13.88-.2%20201.46%20201.46%200%200%201-30.22-2.67c-9.99-1.7-19.67-4.9-28.71-9.46a96.61%2096.61%200%200%201-42.23-42.22%20101.96%20101.96%200%200%201-9.47-28.74%20201.6%20201.6%200%200%201-2.66-30.2c-.12-4.63-.18-9.26-.2-13.89C0%20327.08%200%20321.6%200%20316.1V143.9c0-5.5%200-11%20.04-16.5.02-4.62.08-9.25.2-13.87a201.64%20201.64%200%200%201%202.66-30.2c1.71-10%204.9-19.68%209.47-28.74A96.6%2096.6%200%200%201%2054.6%2012.36%20101.96%20101.96%200%200%201%2083.3%202.9c10-1.64%2020.1-2.53%2030.22-2.66%204.63-.12%209.26-.18%2013.88-.2%205.5-.03%2011-.03%2016.48-.03H316.1c5.5%200%2011%200%2016.49.03a649%20649%200%200%201%2013.88.2c10.12.13%2020.22%201.02%2030.21%202.66%2010%201.71%2019.67%204.9%2028.72%209.46a96.58%2096.58%200%200%201%2042.24%2042.23%20101.92%20101.92%200%200%201%209.46%2028.73%20201.7%20201.7%200%200%201%202.66%2030.21c.12%204.63.18%209.26.2%2013.88.04%205.5.04%2010.99.04%2016.48V316.1z%22%2F%3E%3C%2Fsvg%3E')
    center/100% 100% no-repeat;
}

.awa-logo svg {
  position: absolute;
  inset: 0;
  overflow: visible;
  fill: none;
  stroke: #fff;
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}

.awa-logo path {
  stroke-dasharray: 1;
}

@media (prefers-reduced-motion: no-preference) {
  /* 打开页面时画一遍 */
  .awa-logo path {
    animation: awa-draw 1.1s 0.2s ease-in-out backwards;
  }

  .awa-logo .vein {
    animation: awa-draw 0.5s 1.05s ease-out backwards;
  }

  /* 悬停重画：换一个同内容的关键帧名，浏览器才会重新播放 */
  @media (hover: hover) {
    .awa-logo:hover path {
      animation: awa-redraw 0.9s ease-in-out;
    }

    .awa-logo:hover .vein {
      animation: awa-redraw 0.5s 0.55s ease-out backwards;
    }
  }

  .awa-logo.blown svg {
    animation: awa-blow 1.4s ease-in-out;
  }
}

@keyframes awa-draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes awa-redraw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes awa-blow {
  0% {
    transform: none;
    opacity: 1;
  }
  38% {
    transform: translate(130%, -45%) rotate(210deg) scale(0.7);
    opacity: 0;
  }
  39% {
    transform: translate(-130%, 35%) rotate(-150deg) scale(0.7);
    opacity: 0;
  }
  100% {
    transform: none;
    opacity: 1;
  }
}
</style>
