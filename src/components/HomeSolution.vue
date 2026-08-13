<template>
  <section ref="sectionRef" class="solution-section">
    <div class="title-container">
      <h2>
        <i18n-t keypath="home.solution.title.text" tag="span" scope="global">
          <template #highlight>
            <span class="highlight">{{ $t('home.solution.title.highlight') }}</span>
          </template>
        </i18n-t>
      </h2>
      <p class="lead">{{ $t('home.solution.lead') }}</p>
    </div>

    <div ref="animationRef" class="animation-container">
      <span class="mask" />

      <div ref="blockchainRef" class="blockchain">
        <span
          v-for="block in blocks"
          :key="block.id"
          :ref="(element) => setBlockRef(element, block.id - 1)"
          class="block-item"
        >
          {{ block.id }}
        </span>
      </div>

      <span
        v-for="transaction in transactions"
        :key="transaction.id"
        :ref="(element) => setTransactionRef(element, transaction.id - 1)"
        class="transaction"
      >
        {{ $t('home.solution.transaction', { id: transaction.id }) }}
      </span>
    </div>

    <div class="description-panel" :class="`stage-${currentStage}`" aria-live="polite">
      <div
        :ref="(element) => setDescriptionRef(element, 0)"
        class="description-step"
        :class="{ active: currentStage === 'aggregate' }"
      >
        <p class="step-title">
          <i18n-t keypath="home.solution.steps.aggregate.title" tag="span" scope="global">
            <template #highlight>
              <span class="highlight">{{ $t('home.solution.steps.aggregate.highlight') }}</span>
            </template>
          </i18n-t>
        </p>
        <p class="step-text">{{ $t('home.solution.steps.aggregate.text') }}</p>
      </div>

      <div
        :ref="(element) => setDescriptionRef(element, 1)"
        class="description-step"
        :class="{ active: currentStage === 'final' }"
      >
        <p class="step-title">
          <i18n-t keypath="home.solution.steps.net.title" tag="span" scope="global">
            <template #highlight>
              <span class="highlight">{{ $t('home.solution.steps.net.highlight') }}</span>
            </template>
          </i18n-t>
        </p>
        <p class="step-text">{{ $t('home.solution.steps.net.text') }}</p>
      </div>

      <div
        :ref="(element) => setDescriptionRef(element, 2)"
        class="description-step"
        :class="{ active: currentStage === 'final' }"
      >
        <p class="step-title">
          <i18n-t keypath="home.solution.steps.settle.title" tag="span" scope="global">
            <template #highlight>
              <span class="highlight">{{ $t('home.solution.steps.settle.highlight') }}</span>
            </template>
          </i18n-t>
        </p>
        <p class="step-text">{{ $t('home.solution.steps.settle.text') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const blockCount = 11
const transactionsPerBlock = 2

const blocks = Array.from({ length: blockCount }, (_, index) => ({
  id: index + 1,
}))

const transactions = Array.from(
  { length: (blockCount - 1) * transactionsPerBlock },
  (_, index) => ({
    id: index + 1,
  }),
)

const sectionRef = ref(null)
const animationRef = ref(null)
const blockchainRef = ref(null)
const blockList = ref([])
const transactionList = ref([])
const descriptionRefs = ref([])
const currentBlock = ref(1)

const currentStage = computed(() => {
  if (currentBlock.value < blockCount) {
    return 'aggregate'
  }

  return 'final'
})

let solutionTimeline = null

const setBlockRef = (element, index) => {
  if (element) {
    blockList.value[index] = element
  }
}

const setTransactionRef = (element, index) => {
  if (element) {
    transactionList.value[index] = element
  }
}

const setDescriptionRef = (element, index) => {
  if (element) {
    descriptionRefs.value[index] = element
  }
}

function buildTransactionStartState() {
  const randomDirection = Math.random() > 0.5 ? 1 : -1
  const horizontalOffset = 120 + Math.random() * 220
  const verticalOffset = 40 + Math.random() * 160

  return {
    x: randomDirection * horizontalOffset,
    y: (Math.random() > 0.5 ? 1 : -1) * verticalOffset,
    rotation: (Math.random() - 0.5) * 18,
  }
}

function getCenteredBlockX(trackWidth, blockElement) {
  const blockWidth = blockElement.offsetWidth || 104
  return trackWidth / 2 - blockElement.offsetLeft - blockWidth / 2
}

async function initAnimation() {
  await nextTick()

  solutionTimeline?.scrollTrigger?.kill()
  solutionTimeline?.kill()
  solutionTimeline = null

  const blockElements = blockList.value.filter(Boolean)
  const transactionElements = transactionList.value.filter(Boolean)
  const descriptionElements = descriptionRefs.value.filter(Boolean)

  if (!sectionRef.value || !animationRef.value || !blockchainRef.value) {
    return
  }

  if (!blockElements.length || !transactionElements.length || !descriptionElements.length) {
    return
  }

  const aggregateDescription = descriptionElements[0]
  const trailingDescriptions = descriptionElements.slice(1)

  currentBlock.value = 1

  const animationWidth = animationRef.value.clientWidth || 1
  const trackWidth = blockchainRef.value.scrollWidth || animationWidth
  const startX = getCenteredBlockX(trackWidth, blockElements[0])

  gsap.set(blockchainRef.value, { x: startX })
  gsap.set(blockElements, { autoAlpha: 0, scale: 0.84, transformOrigin: 'center center' })
  transactionElements.forEach((transactionElement) => {
    gsap.set(transactionElement, {
      autoAlpha: 0,
      scale: 0.85,
      ...buildTransactionStartState(),
    })
  })
  descriptionElements.forEach((descriptionElement, index) => {
    gsap.set(descriptionElement, {
      autoAlpha: 0,
      y: index * 18,
      scale: 1 - index * 0.04,
      zIndex: descriptionElements.length - index,
      filter: 'blur(10px)',
      transformOrigin: 'center top',
    })
  })

  solutionTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: () => `+=${Math.max(window.innerHeight * 6.3, 3600)}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        currentBlock.value = Math.min(
          blockCount,
          Math.max(1, Math.ceil(self.progress * blockCount)),
        )
      },
    },
    defaults: { ease: 'none' },
  })

  solutionTimeline.to(
    aggregateDescription,
    {
      autoAlpha: 1,
      filter: 'blur(0px)',
      duration: 0.45,
      ease: 'power2.out',
    },
    0,
  )

  blockElements.forEach((blockElement, index) => {
    const transactionStartIndex = index * transactionsPerBlock
    const pairedTransactions = transactionElements.slice(
      transactionStartIndex,
      transactionStartIndex + transactionsPerBlock,
    )
    const stepStart = index * 1.15
    const blockTargetX = getCenteredBlockX(trackWidth, blockElement)

    solutionTimeline
      .to(
        blockchainRef.value,
        {
          x: blockTargetX,
          duration: 0.55,
          ease: 'power2.inOut',
        },
        stepStart,
      )
      .to(
        blockElement,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
        },
        stepStart,
      )
    if (pairedTransactions.length) {
      solutionTimeline
        .to(
          pairedTransactions,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.42,
            ease: 'power3.out',
          },
          stepStart + 0.08,
        )
        .to(
          pairedTransactions,
          {
            autoAlpha: 0,
            scale: 0.72,
            duration: 0.45,
            ease: 'power2.in',
          },
          stepStart + 0.36,
        )
    }
  })

  const descriptionStart = blockCount * 1.15 + 0.4

  if (trailingDescriptions[0]) {
    solutionTimeline
      .to(
        aggregateDescription,
        {
          y: -16,
          scale: 0.95,
          autoAlpha: 0.78,
          zIndex: 1,
          duration: 0.28,
          ease: 'power2.inOut',
        },
        descriptionStart,
      )
      .to(
        trailingDescriptions[0],
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          zIndex: 3,
          filter: 'blur(0px)',
          duration: 0.38,
          ease: 'power2.out',
        },
        descriptionStart,
      )
  }

  if (trailingDescriptions[1]) {
    solutionTimeline
      .to(
        aggregateDescription,
        {
          y: -28,
          scale: 0.9,
          autoAlpha: 0.6,
          zIndex: 0,
          duration: 0.22,
          ease: 'power2.inOut',
        },
        descriptionStart + 0.34,
      )
      .to(
        trailingDescriptions[0],
        {
          y: -16,
          scale: 0.95,
          autoAlpha: 0.82,
          zIndex: 2,
          duration: 0.22,
          ease: 'power2.inOut',
        },
        descriptionStart + 0.34,
      )
      .to(
        trailingDescriptions[1],
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          zIndex: 3,
          filter: 'blur(0px)',
          duration: 0.38,
          ease: 'power2.out',
        },
        descriptionStart + 0.34,
      )
  }
}

onMounted(() => {
  initAnimation()
})

onBeforeUnmount(() => {
  solutionTimeline?.scrollTrigger?.kill()
  solutionTimeline?.kill()
  solutionTimeline = null
})
</script>

<style scoped>
.solution-section {
  position: relative;
  background-color: var(--td-bg-color-container);
  padding: 6rem 0;
  box-sizing: border-box;
  overflow: clip;
  min-height: 100svh;
}

.title-container {
  width: 100%;
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
  box-sizing: border-box;
}

.title-container h2 {
  margin: 0;
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
}

.title-container .highlight {
  background: linear-gradient(90deg, #1d9dff, #1723f5);
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}

.title-container .lead {
  margin: 1rem 0 0;
  font: var(--td-font-body-large);
  color: var(--td-text-color-secondary);
}

.animation-container {
  position: relative;
  width: 100%;
  min-height: 50svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.animation-container .mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    to right,
    var(--td-bg-color-container) 0,
    transparent 20%,
    transparent 80%,
    var(--td-bg-color-container) 100%
  );
  z-index: 10;
  user-select: none;
  pointer-events: none;
}

.blockchain {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  will-change: transform;
}

.block-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background: linear-gradient(180deg, #1d9dff 0%, #1723f5 100%);
  color: var(--td-text-color-anti);
  font: var(--td-font-title-large);
  text-align: center;
  user-select: none;
  box-shadow: 0 18px 30px rgba(23, 35, 245, 0.26);
  will-change: transform, opacity;
}

.block-item:not(:first-child)::before {
  content: '';
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 0;
  width: 20px;
  height: 4px;
  transform: translateY(-50%) translateX(-100%);
  background-color: var(--td-brand-color);
}

.transaction {
  position: absolute;
  z-index: 5;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem 1rem;
  background-color: var(--td-bg-color-container);
  color: var(--td-brand-color);
  box-shadow: 0 4px 16px rgba(0, 17, 255, 0.3);
  border-radius: 999px;
  white-space: nowrap;
  font: var(--td-font-body-medium);
  will-change: transform, opacity;
  pointer-events: none;
}

.description-panel {
  width: 100%;
  max-width: var(--nx-max-content-width);
  margin: 1.75rem auto 0;
  padding: 0 2rem;
  box-sizing: border-box;
  position: relative;
  min-height: 130px;
}

.description-step {
  position: absolute;
  inset: 0 2rem auto 2rem;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  border: 1px solid var(--td-brand-color);
  opacity: 1;
  transform-origin: center top;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.description-step.active {
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 36px rgba(23, 35, 245, 0.12);
}

.step-title {
  margin: 0;
  font: var(--td-font-headline-small);
  color: var(--td-text-color-primary);
}

.step-title .highlight {
  background: linear-gradient(90deg, #1d9dff, #1723f5);
  background-clip: text;
  color: var(--td-brand-color);
  white-space: nowrap;
}

.step-text {
  margin: 0.35rem 0 0;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
  line-height: 1.7;
  text-align: justify;
}

@media (max-width: 768px) {
  .title-container {
    padding: 0 1.5rem;
  }

  .animation-container {
    min-height: 30svh;
  }

  .block-item {
    width: 84px;
    height: 84px;
    border-radius: 18px;
  }

  .transaction {
    padding: 0.45rem 0.8rem;
    font-size: 0.9rem;
  }

  .description-panel {
    padding: 0 1rem;
  }

  .description-step {
    padding: 0.9rem 1rem;
    inset: 0 1rem auto 1rem;
  }

  .description-panel {
    min-height: 130px;
  }

  .description-step:nth-child(2) {
    transform: translateY(14px) scale(0.96);
  }

  .description-step:nth-child(3) {
    transform: translateY(28px) scale(0.92);
  }
}
</style>
