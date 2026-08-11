<template>
  <section class="hero">
    <video autoplay muted loop playsinline class="background-video">
      <source src="@/assets/videos/hero-bg.mp4" type="video/mp4" />
    </video>

    <div class="hero-content">
      <h1>{{ $t('home.hero.title') }}</h1>

      <h1 class="features-text" aria-live="polite">
        <span class="feature-rotator-shell">
          <span
            v-for="(word, index) in featureWords"
            :key="word"
            :ref="(el) => setFeatureWordRef(el, index)"
            class="feature-word"
            :style="featureWordStyles[index]"
          >
            <component :is="featureIcons[index]" />
            {{ word }}
          </span>
        </span>
      </h1>

      <h1>{{ $t('home.hero.titl2') }}</h1>

      <p class="slogan">{{ $t('slogan') }}</p>

      <t-space class="action-box" size="large">
        <t-button shape="round" size="large" theme="primary" @click="$router.push('/dashboard')">
          {{ $t('hero.getStarted') }}
        </t-button>

        <t-button shape="round" size="large" theme="default" @click="$router.push('#features')">
          {{ $t('hero.learnMore') }}
        </t-button>
      </t-space>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { useLocale } from '@/utils/i18n'
import {
  TrendingDownIcon,
  Link1Icon,
  WalletIcon,
  LinkTransformIcon,
  AbilityOpenIcon,
} from 'tdesign-icons-vue-next'

const { t } = useLocale()

const featureWords = [
  t('home.hero.features.Liquidity-Saving'),
  t('home.hero.features.Blockchain-Native'),
  t('home.hero.features.Atomic-DvP'),
  t('home.hero.features.BlockN'),
  t('home.hero.features.Multilateral Netting'),
]

const featureIcons = [TrendingDownIcon, Link1Icon, WalletIcon, LinkTransformIcon, AbilityOpenIcon]

const featureWordStyles = [
  { backgroundImage: 'linear-gradient(90deg, #7cdbff 0%, #4f8cff 100%)', color: '#7cdbff' },
  { backgroundImage: 'linear-gradient(90deg, #76ffd8 0%, #16b3ff 100%)', color: '#76ffd8' },
  { backgroundImage: 'linear-gradient(90deg, #ffd56a 0%, #ff7a59 100%)', color: '#ffd56a' },
  { backgroundImage: 'linear-gradient(90deg, #c78bff 0%, #6e5bff 100%)', color: '#c78bff' },
  { backgroundImage: 'linear-gradient(90deg, #6ff2a5 0%, #00c2a8 100%)', color: '#6ff2a5' },
]

const featureWordRefs = ref([])
let featureTimeline = null

const setFeatureWordRef = (element, index) => {
  if (element) {
    featureWordRefs.value[index] = element
  }
}

onMounted(async () => {
  await nextTick()

  if (!featureWordRefs.value.length) {
    return
  }

  gsap.set(featureWordRefs.value, { autoAlpha: 0, yPercent: 55 })

  featureTimeline = gsap.timeline({ repeat: -1 })

  featureWordRefs.value.forEach((wordElement, index) => {
    featureTimeline
      .to(wordElement, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .to({}, { duration: 2 })
      .to(wordElement, {
        autoAlpha: 0,
        yPercent: -55,
        duration: 0.6,
        ease: 'power3.in',
      })
      .set(wordElement, { autoAlpha: 0, yPercent: 55 })

    if (index < featureWordRefs.value.length - 1) {
      featureTimeline.to({}, { duration: 0.35 })
    }
  })
})

onBeforeUnmount(() => {
  featureTimeline?.kill()
  featureTimeline = null
})
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: black;
}

.hero .background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  user-select: none;
  pointer-events: none;
}

.hero .hero-content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 0 2rem;
  box-sizing: border-box;
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
}

.hero .hero-content h1 {
  font: var(--td-font-display-large);
  margin: 0.5rem 0;
}

.hero .hero-content .features-text {
  font: var(--td-font-display-large);
}

.feature-rotator-shell {
  position: relative;
  display: inline-block;
  height: 1.2em;
  width: 100%;
  overflow: hidden;
  vertical-align: bottom;
}

.feature-word {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  width: max-content;
  white-space: nowrap;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  will-change: transform, opacity;
}

.slogan {
  font: var(--td-font-body-large);
  color: var(--td-text-color-anti);
  opacity: 0.5;
  margin-top: 1rem;
}

.action-box {
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .hero {
    height: 60vh;
  }

  .hero .hero-content {
    text-align: center;
  }

  .hero .hero-content h1 {
    font: var(--td-font-headline-medium);
  }

  .hero .hero-content .features-text {
    font: var(--td-font-headline-medium);
  }

  .hero .hero-content .feature-word {
    width: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}
</style>
