<template>
  <section class="problem-section" id="problem">
    <div class="problem-shell">
      <div class="section-intro">
        <h2>{{ t('home.problem.title') }}</h2>
        <p class="lead">
          {{ t('home.problem.lead') }}
        </p>
      </div>

      <div class="problem-grid">
        <article class="settlement-card">
          <div class="card-label">{{ t('home.problem.traditionalLabel') }}</div>
          <div class="settlement-flow" ref="flowTrack">
            <div class="flow-track">
              <div class="flow-group">
                <p v-for="(line, index) in settlementLines" :key="index" class="settlement-line">
                  {{ line }}
                </p>
              </div>
              <div class="flow-group duplicate-group">
                <p
                  v-for="(line, index) in settlementLines"
                  :key="`${index}-dup`"
                  class="settlement-line"
                >
                  {{ line }}
                </p>
              </div>
            </div>
          </div>
          <p class="obligations">{{ t('home.problem.obligations') }}</p>
        </article>

        <article class="quote-card">
          <p class="quote-mark">&ldquo;</p>
          <p class="quote-text">{{ t('home.problem.conclusion') }}</p>
        </article>
      </div>

      <div class="impact-grid">
        <div v-for="item in impactItems" :key="item.key" class="impact-card">
          <span class="impact-icon">
            <t-icon :name="item.icon" size="28" style="color: white" />
          </span>
          <p>{{ item.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { useLocale } from '@/utils/i18n'

const { t } = useLocale()

const flowTrack = ref(null)
let flowTimeline = null

const settlementLines = [
  'A → B 2000',
  'B → C 1500',
  'C → A 1000',
  'A → C 2500',
  'B → A 3000',
  'C → B 2000',
]

onMounted(() => {
  if (!flowTrack.value) return

  const flowTrackEl = flowTrack.value.querySelector('.flow-track')
  const flowGroup = flowTrack.value.querySelector('.flow-group')
  if (!flowTrackEl || !flowGroup) return

  const totalHeight = flowGroup.offsetHeight

  flowTimeline = gsap.to(flowTrackEl, {
    y: -totalHeight,
    duration: 10,
    ease: 'none',
    repeat: -1,
  })
})

onBeforeUnmount(() => {
  flowTimeline?.kill()
  flowTimeline = null
})

const impactItems = computed(() => [
  { icon: 'lock-on', index: '01', label: t('home.problem.impacts.capitalLocked') },
  {
    icon: 'trending-up',
    index: '02',
    label: t('home.problem.impacts.liquidityRequirements'),
  },
  {
    icon: 'currency-exchange',
    index: '03',
    label: t('home.problem.impacts.settlementOperations'),
  },
  { icon: 'link-1', index: '04', label: t('home.problem.impacts.onChainActivity') },
])
</script>

<style scoped>
.problem-section {
  position: relative;
  overflow: hidden;
  padding: 5rem 2rem;
  background-image: url('@/assets/images/bg/problem.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.problem-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
}

.section-intro {
  max-width: 820px;
}

.section-intro h2 {
  margin: 0;
  font: var(--td-font-headline-large);
  color: var(--td-text-color-anti);
}

.lead {
  margin: 1rem 0 0;
  max-width: 800px;
  font: var(--td-font-body-large);
  color: rgba(255, 255, 255, 0.74);
}

.problem-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.settlement-card,
.quote-card,
.impact-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(180deg, rgba(6, 10, 16, 0.94), rgba(3, 7, 13, 0.92));
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.settlement-card {
  border-radius: 24px;
  padding: 1.5rem;
}

.card-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: var(--td-brand-color);
  color: var(--td-text-color-anti);
  font: var(--td-font-body-medium);
}

.settlement-flow {
  margin: 1.25rem 0 0;
  padding: 1.25rem;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  overflow: hidden;
  max-height: 200px;
  position: relative;
}

.flow-track {
  display: flex;
  flex-direction: column;
  will-change: transform;
}

.flow-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.duplicate-group {
  margin-top: 0.5rem;
}

.settlement-line {
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-family: 'TCloudNumber', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  line-height: 1.7;
  white-space: nowrap;
  will-change: transform;
}

.obligations {
  margin: 1rem 0 0;
  font: var(--td-font-headline-small);
  color: var(--td-brand-color);
}

.quote-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 24px;
  padding: 1.5rem;
  box-sizing: border-box;
  min-height: 100%;
  background:
    linear-gradient(160deg, rgba(18, 38, 172, 0.9), transparent 60%), rgba(4, 8, 14, 0.92);
}

.quote-mark {
  margin: 0;
  font: var(--td-font-headline-large);
  line-height: 1;
  color: var(--td-brand-color);
}

.quote-text {
  margin: 0.75rem 0 0;
  font: var(--td-font-headline-medium);
  color: var(--td-text-color-anti);
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.impact-card {
  border-radius: 20px;
  padding: 1.25rem;
}

.impact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--td-brand-color);
  margin-bottom: 0.75rem;
  padding: 0.8rem;
}

.impact-card p {
  margin: 0;
  font: var(--td-font-title-large);
  color: var(--td-text-color-anti);
}

@media (max-width: 1024px) {
  .problem-grid,
  .impact-grid {
    grid-template-columns: 1fr;
  }

  .quote-card {
    min-height: 220px;
  }
}

@media (max-width: 768px) {
  .problem-section {
    padding: 3.5rem 1rem;
  }

  .section-intro h2 {
    font: var(--td-font-headline-medium);
  }

  .lead {
    font: var(--td-font-body-medium);
  }

  .settlement-card,
  .quote-card,
  .impact-card {
    border-radius: 18px;
  }

  .settlement-flow {
    font-size: 1.05rem;
  }

  .quote-text,
  .impact-card p {
    font: var(--td-font-title-medium);
  }
}
</style>
