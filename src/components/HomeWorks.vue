<template>
  <section ref="container" class="container">
    <div class="title-box">
      <h2 class="title">{{ $t('home.howWorks.title') }}</h2>
      <p class="desc">{{ $t('home.howWorks.desc') }}</p>
    </div>

    <div class="content-container">
      <div class="scroll-wrapper" ref="scroller">
        <div v-for="card in cardList" :key="card.title" class="card">
          <t-icon :name="card.icon" size="56" />
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.desc }}</p>
        </div>
      </div>
    </div>

    <div class="arrow-container">
      <div ref="arrowWrapper" class="arrow-wrapper">
        <div ref="arrowIcon">
          <t-icon name="arrow-right-circle" size="36" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useLocale } from '@/utils/i18n'
import { gsap } from 'gsap'

const { t } = useLocale()

const container = ref(null)
const scroller = ref(null)
const arrowWrapper = ref(null)
const arrowIcon = ref(null)

const cardList = computed(() => [
  {
    icon: 'ai-article',
    title: t('home.howWorks.card1.title'),
    desc: t('home.howWorks.card1.desc'),
  },
  {
    icon: 'arrow-left-right-1',
    title: t('home.howWorks.card2.title'),
    desc: t('home.howWorks.card2.desc'),
  },
  {
    icon: 'link-1',
    title: t('home.howWorks.card3.title'),
    desc: t('home.howWorks.card3.desc'),
  },
  {
    icon: 'saving-pot',
    title: t('home.howWorks.card4.title'),
    desc: t('home.howWorks.card4.desc'),
  },
  {
    icon: 'window',
    title: t('home.howWorks.card5.title'),
    desc: t('home.howWorks.card5.desc'),
  },
  {
    icon: 'verified',
    title: t('home.howWorks.card6.title'),
    desc: t('home.howWorks.card6.desc'),
  },
  {
    icon: 'currency-exchange',
    title: t('home.howWorks.card7.title'),
    desc: t('home.howWorks.card7.desc'),
  },
  {
    icon: 'code',
    title: t('home.howWorks.card8.title'),
    desc: t('home.howWorks.card8.desc'),
  },
])

let timeline = null

async function initAnimation() {
  await nextTick() // 等待 DOM 渲染完成
  if (!container.value) return
  if (!scroller.value) return
  if (!arrowWrapper.value) return
  if (!arrowIcon.value) return

  timeline?.scrollTrigger?.kill()
  timeline?.kill()
  timeline = null

  // 窗口滚动，scroller水平滚动
  const scrollerWidth = scroller.value.scrollWidth
  let scrollDistance = scrollerWidth - window.innerWidth

  // 箭头滚动距离
  const arrowDistance = arrowWrapper.value.offsetWidth - arrowIcon.value.offsetWidth

  // 如果窗口宽度大于1200px，增加滚动距离(页边距)
  if (window.innerWidth > 1200) {
    const offSet = (window.innerWidth - 1200) / 2
    scrollDistance += offSet
    gsap.set(scroller.value, { x: offSet })
  }

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container.value,
      start: 'center center',
      end: `+=${scrollDistance}`,
      scrub: 0.5,
      pin: true,
    },
  })

  timeline.to(scroller.value, {
    x: -scrollDistance,
    ease: 'none',
  })

  timeline.to(
    arrowIcon.value,
    {
      x: arrowDistance,
      ease: 'none',
    },
    0, // 同步开始
  )
}

onMounted(() => {
  initAnimation()
  addEventListener('resize', initAnimation)
})

onUnmounted(() => {
  timeline?.scrollTrigger?.kill()
  timeline?.kill()
  timeline = null
  removeEventListener('resize', initAnimation)
})
</script>

<style scoped>
.container {
  position: relative;
  padding: 6rem 0;
  background-image: url('@/assets/images/bg/how-works.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #081119;
  background-attachment: fixed;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-box {
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  box-sizing: border-box;
}

.title {
  font: var(--td-font-headline-large);
  color: var(--td-text-color-anti);
  margin-top: 0;
  margin-bottom: 1rem;
}

.desc {
  font: var(--td-font-body-large);
  color: var(--td-text-color-anti);
  margin: 0;
  opacity: 0.8;
}

.content-container {
  padding: 4rem 0;
  overflow: hidden;
}

.scroll-wrapper {
  display: flex;
  gap: 3rem;
  width: fit-content;
  padding: 0 2rem;
  box-sizing: border-box;
  will-change: transform;
}

.card {
  width: 300px;
  flex-shrink: 0;
  padding: 2rem;
  color: var(--td-text-color-anti);
  border: 1px solid var(--td-text-color-anti);
  border-radius: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 48px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px) scale(1.02);
  backdrop-filter: blur(10px);
}

.card .card-title {
  font: var(--td-font-headline-small);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.card .card-desc {
  font: var(--td-font-body-medium);
  margin: 0;
  opacity: 0.6;
}

.arrow-container {
  width: 100%;
  color: var(--td-text-color-anti);
  width: 100%;
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

.arrow-wrapper > div {
  width: fit-content;
}

@media (max-width: 768px) {
  .title-box {
    padding: 0 1rem;
  }

  .content-container {
    padding: 3rem 0;
  }

  .scroll-wrapper {
    gap: 2rem;
    padding: 0 1rem;
  }

  .card {
    width: 200px;
  }

  .arrow-container {
    padding: 0 1rem;
  }
}
</style>
