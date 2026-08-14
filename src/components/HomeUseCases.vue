<template>
  <section ref="containerEl" class="container">
    <div class="title-box">
      <i18n-t keypath="home.useCases.title.text" class="title" tag="h2" scope="global">
        <template #highlight>
          <span class="highlight">{{ $t('home.useCases.title.highlight') }}</span>
        </template>
      </i18n-t>

      <p class="desc">{{ $t('home.useCases.desc') }}</p>
    </div>

    <div class="animation-container">
      <div
        v-for="(item, index) in useCaseList"
        :key="index"
        :ref="(el) => getCardListEl(el, index)"
        class="card"
      >
        <t-icon :name="item.icon" size="56" />
        <h3 class="card-title">{{ item.title }}</h3>
        <p class="card-desc">{{ item.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useLocale } from '@/utils/i18n'
import { gsap } from 'gsap'

const { t } = useLocale()

const useCaseList = computed(() => [
  {
    icon: 'earth',
    title: t('home.useCases.case1.title'),
    desc: t('home.useCases.case1.desc'),
  },
  {
    icon: 'building',
    title: t('home.useCases.case2.title'),
    desc: t('home.useCases.case2.desc'),
  },
  {
    icon: 'currency-exchange',
    title: t('home.useCases.case3.title'),
    desc: t('home.useCases.case3.desc'),
  },
  {
    icon: 'card',
    title: t('home.useCases.case4.title'),
    desc: t('home.useCases.case4.desc'),
  },
])

const containerEl = ref(null)
const cardListEl = ref([])

function getCardListEl(el, index) {
  cardListEl.value[index] = el
}

let timeline = null

async function initAmination() {
  await nextTick()

  timeline?.scrollTrigger?.kill()
  timeline?.kill()

  if (!containerEl.value) return
  if (!cardListEl.value.length) return

  const cards = cardListEl.value
  const cardCount = cards.length

  // 初始状态
  cards.forEach((card, index) => {
    gsap.set(card, {
      y: -index * 20,
      scale: 1 - index * 0.05,
      zIndex: cardCount - index,
    })
  })

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl.value,
      start: 'center center',
      end: `+=${cardCount * 100}%`,
      scrub: true,
      pin: true,
    },
  })

  for (let i = 0; i < cardCount; i++) {
    const start = i

    // 第一张卡片先向上离开
    timeline.to(
      cards[i],
      {
        y: -400,
        duration: 1,
        scale: 0.6,
        rotateZ: -10,
        ease: 'back.out(1.7)',
      },
      start,
    )

    // 其他卡片向前移动
    for (let j = 1; j < cardCount; j++) {
      const cardIndex = (i + j) % cardCount
      const position = j - 1

      timeline.to(
        cards[cardIndex],
        {
          y: -position * 20,
          scale: 1 - position * 0.05,
          zIndex: cardCount - position,
          duration: 1,
          ease: 'back.out(1.7)',
        },
        start,
      )
    }

    // 刚刚出去的卡片回到最后
    timeline.to(
      cards[i],
      {
        y: -(cardCount - 1) * 20,
        scale: 1 - (cardCount - 1) * 0.05,
        zIndex: 1,
        rotateZ: 0,
        ease: 'back.out(1.7)',
      },
      start + 1,
    )
  }
}

onMounted(() => {
  initAmination()
  addEventListener('resize', initAmination)
})

onUnmounted(() => {
  timeline?.scrollTrigger?.kill()
  timeline?.kill()
  removeEventListener('resize', initAmination)
})
</script>

<style scoped>
.container {
  position: relative;
  background-color: var(--td-bg-color-container);
  padding: 0 2rem;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-box {
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
  text-align: center;
}

.title {
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
  margin-top: 0;
  margin-bottom: 1rem;
}

.title .highlight {
  background-image: linear-gradient(to right, #1d9dff, #1723f5);
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}

.desc {
  color: var(--td-text-color-secondary);
  font: var(--td-font-body-large);
  margin: 0;
  opacity: 0.8;
}

.animation-container {
  position: relative;
  max-width: 800px;
  margin-top: calc(6rem + 40px);
  margin-left: auto;
  margin-right: auto;
  min-height: 300px;
  width: 100%;
}

.animation-container .card {
  padding: 4rem 6rem;
  box-sizing: border-box;
  background-color: var(--td-bg-brand-color);
  border-radius: 2rem;
  background-image: linear-gradient(to right, #1d9dff, #1723f5), url('@/assets/images/bg/pit.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-blend-mode: overlay;
  box-shadow: 0 4px 24px rgba(13, 35, 204, 0.5);
  color: var(--td-text-color-anti);
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.animation-container .card-title {
  font: var(--td-font-headline-small);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.animation-container .card-desc {
  font: var(--td-font-body-large);
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .animation-container {
    margin-top: calc(4rem + 40px);
  }

  .animation-container .card {
    padding: 2rem 3rem;
  }
}
</style>
