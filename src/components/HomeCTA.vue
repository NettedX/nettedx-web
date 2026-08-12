<template>
  <section class="container">
    <div class="card">
      <div class="card-background">
        <div class="background-gradient"></div>
        <div class="icons-grid" ref="iconsGrid">
          <div
            v-for="(icon, index) in bgIcons"
            :key="index"
            class="icon-item"
            :ref="(el) => setIconRef(el, index)"
            :style="{
              '--icon-delay': `${index * 0.1}s`,
            }"
          >
            <component :is="icon" :size="getRandomSize()" />
          </div>
        </div>
        <div class="background-overlay"></div>
      </div>

      <div class="card-content">
        <h2>{{ $t('home.cta.title.text') }}</h2>
        <p>{{ $t('home.cta.description') }}</p>

        <t-button
          theme="primary"
          shape="round"
          size="large"
          @click="$router.push('/dashboard')"
          @mouseenter="handleButtonHover"
          @mouseleave="handleButtonLeave"
        >
          {{ $t('home.cta.title.button') }}
        </t-button>
      </div>

      <div class="scroll-bar" aria-label="announcement">
        <div class="scroll-track" ref="scrollTrack">
          <div class="scroll-group">
            <div class="scroll-item">
              <img src="@/assets/images/logo/icon-white.svg" alt="NettedX Logo" />
              <span>{{ $t('home.cta.scroll') }}</span>
            </div>
          </div>

          <div v-for="i in 5" :key="i" class="scroll-group" aria-hidden="true">
            <div class="scroll-item">
              <img src="@/assets/images/logo/icon-white.svg" alt="" />
              <span>{{ $t('home.cta.scroll') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import {
  WalletIcon,
  Link1Icon,
  SecuredIcon,
  CloudUploadIcon,
  AppIcon,
  InstitutionCheckedIcon,
  LockOnIcon,
  ChartAnalyticsIcon,
  CheckIcon,
  RocketIcon,
} from 'tdesign-icons-vue-next'

const scrollTrack = ref(null)
const iconsGrid = ref(null)
const iconRefs = ref([])
let scrollTimeline = null
let hoverTimeline = null

const bgIcons = [
  WalletIcon,
  Link1Icon,
  SecuredIcon,
  CloudUploadIcon,
  AppIcon,
  InstitutionCheckedIcon,
  LockOnIcon,
  ChartAnalyticsIcon,
  CheckIcon,
  RocketIcon,
  WalletIcon,
  Link1Icon,
  SecuredIcon,
  CloudUploadIcon,
  AppIcon,
  InstitutionCheckedIcon,
]

function getRandomSize() {
  const sizes = [24, 32, 40, 48]
  return sizes[Math.floor(Math.random() * sizes.length)].toString()
}

function setIconRef(el, index) {
  if (el) {
    iconRefs.value[index] = el
  }
}

function initScrollAnimation() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion || !scrollTrack.value) return

  const groups = [...scrollTrack.value.children]

  if (groups.length < 2) return

  const cycleWidth = groups[0].offsetWidth

  scrollTimeline = gsap
    .timeline({ repeat: -1, defaults: { ease: 'none' } })
    .to(scrollTrack.value, {
      x: -cycleWidth,
      duration: 12,
    })
    .set(scrollTrack.value, { x: 0 })
}

function initBackgroundAnimation() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion || iconRefs.value.length === 0) return

  // 初始化icon的随机位置和透明度
  gsap.set(iconRefs.value, {
    opacity: 0.35,
    y: 0,
    x: 0,
  })

  // 创建浮动动画
  iconRefs.value.forEach((icon) => {
    const randomDelay = Math.random() * 2
    const randomDuration = 3 + Math.random() * 2
    const randomDistance = 15 + Math.random() * 20

    gsap.to(icon, {
      y: randomDistance,
      opacity: 0.5,
      duration: randomDuration,
      delay: randomDelay,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  })
}

function handleButtonHover() {
  if (hoverTimeline) {
    hoverTimeline.kill()
  }

  hoverTimeline = gsap.timeline()

  // 动画所有icon
  hoverTimeline.to(
    iconRefs.value,
    {
      opacity: 0.8,
      scale: 1.3,
      duration: 0.4,
      stagger: {
        amount: 0.3,
        from: 'random',
      },
      ease: 'back.out',
    },
    0,
  )

  // 添加旋转效果
  hoverTimeline.to(
    iconRefs.value,
    {
      rotation: 360,
      duration: 3,
      stagger: 0.05,
      ease: 'none',
    },
    0,
  )

  // 色彩脉冲效果
  hoverTimeline.to(
    '.background-gradient',
    {
      backgroundPosition: '200% center',
      duration: 2,
      repeat: 1,
      yoyo: true,
    },
    0,
  )
}

function handleButtonLeave() {
  if (hoverTimeline) {
    hoverTimeline.kill()
  }

  // 恢复原状
  gsap.to(iconRefs.value, {
    opacity: 0.35,
    scale: 1,
    rotation: 0,
    duration: 0.6,
    stagger: {
      amount: 0.2,
      from: 'random',
    },
    ease: 'power2.inOut',
  })
}

onMounted(() => {
  initScrollAnimation()
  initBackgroundAnimation()
})

onBeforeUnmount(() => {
  scrollTimeline?.kill()
  hoverTimeline?.kill()
})
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 60vh;
  position: relative;
  padding: 6rem 2rem;
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, var(--td-brand-color), rgb(255, 255, 255));
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card {
  position: relative;
  width: 100%;
  max-width: var(--nx-max-content-width);
  background-color: var(--td-bg-color-container);
  width: 100%;
  height: 100%;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: black;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(4, 13, 36, 0.98) 0%,
    rgba(38, 0, 121, 0.70) 20%,
    rgba(6, 19, 56, 0.905) 40%,
    rgba(0, 27, 181, 0.70) 60%,
    rgba(0, 36, 94, 0.643) 80%,
    rgba(2, 3, 6, 0.98) 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  opacity: 0.8;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.icons-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2rem;
  padding: 2rem;
  box-sizing: border-box;
  z-index: 1;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(27, 53, 255, 0.6);
  font-size: 2rem;
  filter: drop-shadow(0 4px 16px rgba(42, 53, 255, 0.4))
    drop-shadow(0 0 8px rgba(100, 150, 255, 0.3));
  will-change: transform, opacity;
  transition: color 0.3s ease;
}

.icon-item :deep(svg) {
  filter: drop-shadow(0 2px 12px rgba(94, 143, 255, 0.5))
    drop-shadow(0 0 6px rgba(24, 28, 255, 0.4));
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
  z-index: 2;
  pointer-events: none;
}

.card-content {
  position: relative;
  z-index: 3;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--td-text-color-anti);
}

.card-content h2 {
  font: var(--td-font-headline-large);
  margin-top: 0;
  margin-bottom: 1rem;
}

.card-content p {
  font: var(--td-font-body-large);
  margin: 0;
  margin-bottom: 2rem;
}

.scroll-bar {
  overflow: hidden;
  background-color: var(--td-brand-color);
  color: var(--td-text-color-anti);
  width: 100%;
  padding: 0.5rem 0;
  box-sizing: border-box;
  position: relative;
  z-index: 4;
}

.scroll-track {
  display: flex;
  align-items: center;
  gap: 0;
  width: max-content;
  white-space: nowrap;
  will-change: transform;
}

.scroll-group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding-right: 2rem;
}

.scroll-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: var(--td-font-body-large);
}

.scroll-bar img {
  width: 1.2rem;
  height: auto;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .background-gradient {
    animation: none;
  }

  .scroll-track {
    animation: none;
    transform: none !important;
  }

  .icon-item {
    animation: none !important;
  }
}

@media (max-width: 768px) {
  .icons-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1rem;
    padding: 1rem;
  }

  .icon-item {
    font-size: 1.5rem;
  }
}
</style>
