<template>
  <section class="dashboard-page">
    <div class="dashboard-page__bg"></div>
    <div class="dashboard-page__inner">
      <div class="dashboard-page__header">
        <h1>{{ t('dashboard.title') }}</h1>
        <p>{{ t('dashboard.subtitle') }}</p>
      </div>

      <div class="forecast-card">
        <div class="forecast-card__title-row">
          <div class="forecast-card__title">{{ t('dashboard.forecast.title') }}</div>
          <t-tooltip :content="t('dashboard.forecast.refresh')">
            <t-button
              variant="text"
              theme="default"
              size="small"
              :loading="loading"
              @click="fetchForecast"
            >
              <template #icon>
                <RefreshIcon />
              </template>
            </t-button>
          </t-tooltip>
        </div>
        <p class="forecast-card__desc">{{ t('dashboard.forecast.desc') }}</p>

        <div class="forecast-body">
          <div class="block-visual">
            <span ref="blockCoreRef" class="block-visual__core active">
              <LayersIcon size="28px" />
            </span>
            <span class="block-visual__label">
              {{ t('dashboard.forecast.active') }}
            </span>
          </div>

          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-item__label">
                <RootListIcon /> {{ t('dashboard.forecast.windowId') }}
              </span>
              <span class="stat-item__value">{{ forecast.windowId ?? '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-item__label">
                <ChartRing1Icon /> {{ t('dashboard.forecast.settlementBlock') }}
              </span>
              <span class="stat-item__value">{{ forecast.settlementBlock ?? '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-item__label">
                <HourglassIcon /> {{ t('dashboard.forecast.blocksRemaining') }}
              </span>
              <span class="stat-item__value">
                <template v-if="forecast.blocksRemaining === 0">
                  {{ t('dashboard.forecast.reached') }}
                </template>
                <template v-else>
                  {{ forecast.blocksRemaining ?? '-' }}
                  <span v-if="forecast.blocksRemaining != null" class="stat-item__unit">{{
                    t('dashboard.forecast.blocksUnit')
                  }}</span>
                </template>
              </span>
            </div>
          </div>
        </div>

        <p class="forecast-card__footer">
          {{ t('dashboard.forecast.lastUpdated.label', { time: lastUpdatedText }) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { MessagePlugin } from 'tdesign-vue-next'
import {
  RefreshIcon,
  LayersIcon,
  RootListIcon,
  ChartRing1Icon,
  HourglassIcon,
} from 'tdesign-icons-vue-next'
import api from '@/utils/api'
import { useLocale } from '@/utils/i18n'

const { t } = useLocale()

const forecast = ref({
  windowId: null,
  settlementBlock: null,
  blocksRemaining: null,
})
const loading = ref(false)
const lastUpdatedAt = ref(null)
const currentTime = ref(new Date())

const blockCoreRef = ref(null)

const lastUpdatedText = computed(() => {
  if (!lastUpdatedAt.value) {
    return '-'
  }
  const diffSeconds = Math.floor((currentTime.value - lastUpdatedAt.value) / 1000)
  if (diffSeconds < 60) {
    return t('dashboard.forecast.lastUpdated.justNow')
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60)
    return t('dashboard.forecast.lastUpdated.minutesAgo', { minutes })
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600)
    return t('dashboard.forecast.lastUpdated.hoursAgo', { hours })
  } else {
    const days = Math.floor(diffSeconds / 86400)
    return t('dashboard.forecast.lastUpdated.daysAgo', { days })
  }
})

const GLOW_OFF = '0 0 0px 0px rgba(0, 168, 112, 0)'
const GLOW_ON = '0 0 26px 8px rgba(0, 168, 112, 0.65)'

let breatheTimeline = null
let pollTimer = null
let clockTimer = null

function startBreathing() {
  breatheTimeline?.kill()
  if (!blockCoreRef.value) {
    return
  }
  gsap.set(blockCoreRef.value, { boxShadow: GLOW_OFF, scale: 1 })
  breatheTimeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: { duration: 1.4, ease: 'sine.inOut' },
  })
  breatheTimeline.to(blockCoreRef.value, { boxShadow: GLOW_ON, scale: 1.06 })
}

function stopBreathing() {
  breatheTimeline?.kill()
  breatheTimeline = null
  if (blockCoreRef.value) {
    gsap.set(blockCoreRef.value, { boxShadow: GLOW_OFF, scale: 1 })
  }
}

async function fetchForecast() {
  loading.value = true
  try {
    const res = await api({
      method: 'get',
      url: '/dashboard/settlement-window-forecast',
    })
    if (res.data.code === 200) {
      forecast.value = res.data.data
      lastUpdatedAt.value = new Date()
    } else {
      throw new Error(res.data.msg)
    }
  } catch (e) {
    console.error(e)
    MessagePlugin.error(t('dashboard.forecast.msg.fetchFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  clockTimer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
  await fetchForecast()
  startBreathing()
  pollTimer = setInterval(fetchForecast, 5000)
})

onBeforeUnmount(() => {
  stopBreathing()
  if (pollTimer) {
    clearInterval(pollTimer)
  }
  if (clockTimer) {
    clearInterval(clockTimer)
  }
})
</script>

<style scoped>
.dashboard-page {
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.dashboard-page__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      1000px 260px at 10% 0%,
      rgba(from var(--td-brand-color-3) r g b / 0.22),
      transparent
    ),
    radial-gradient(
      800px 220px at 90% 10%,
      rgba(from var(--td-success-color-3) r g b / 0.2),
      transparent
    );
}

.dashboard-page__inner {
  width: 100%;
}

.dashboard-page__header {
  margin-bottom: 1rem;
}

.dashboard-page__header h1 {
  margin: 0;
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
}

.dashboard-page__header p {
  margin: 0.25rem 0 0;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}

.forecast-card {
  position: relative;
  max-width: 640px;
  padding: 2rem;
  border-radius: 28px;
  background-color: var(--td-bg-color-container);
  border: 1px solid var(--td-component-stroke);
}

.forecast-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.forecast-card__title {
  font: var(--td-font-title-large);
  color: var(--td-text-color-primary);
}

.forecast-card__desc {
  margin: 0.25rem 0 1.5rem;
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}

.forecast-body {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.block-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 1rem;
}

.block-visual__core {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background-color: var(--td-bg-color-secondarycontainer);
  color: var(--td-text-color-placeholder);
  box-shadow: 0 0 0px 0px rgba(0, 168, 112, 0);
  transition:
    color 0.3s ease,
    background-color 0.3s ease;
}

.block-visual__core.active {
  background-color: rgba(from var(--td-success-color-6) r g b / 0.14);
  color: var(--td-success-color-6);
}

.block-visual__label {
  font: var(--td-font-body-small);
  color: var(--td-success-color-6);
  min-height: 1.2em;
}

.stat-grid {
  flex: 1;
  display: grid;
  gap: 0.9rem;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.stat-item__label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}

.stat-item__value {
  font: var(--td-font-title-medium);
  color: var(--td-text-color-primary);
}

.stat-item__unit {
  margin-left: 0.25rem;
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}

.forecast-card__footer {
  margin: 1.25rem 0 0;
  text-align: right;
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}
</style>
