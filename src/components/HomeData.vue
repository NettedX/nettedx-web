<template>
  <section class="data-section" id="data">
    <div class="title-container">
      <p class="data-description">{{ $t('home.data.description') }}</p>
      <h2 class="data-title">
        <span>
          <span class="highlight red">{{ $t('home.data.title.more') }}</span>
          <span>{{ $t('home.data.title.trades') }}</span>
          <span>{{ $t('home.data.title.space') }}</span>
        </span>

        <span>
          <span class="highlight yellow">{{ $t('home.data.title.less') }}</span>
          <span>{{ $t('home.data.title.liquidity') }}</span>
          <span>{{ $t('home.data.title.space') }}</span>
        </span>

        <span>
          <span class="highlight blue">{{ $t('home.data.title.smarter') }}</span>
          <span>{{ $t('home.data.title.settlement') }}</span>
          <span>{{ $t('home.data.title.space') }}</span>
        </span>
      </h2>
    </div>

    <div class="data-visualization">
      <t-row :gutter="[16, 16]" justify="center">
        <t-col v-for="(data, index) in shownDataList" :key="index" :span="12" :sm="6" :md="3">
          <div class="data-card">
            <t-statistic
              :title="data.title"
              :value="data.value"
              :prefix="data.prefix"
              :unit="data.unit"
              :animation="{
                duration: 1000,
                valueFrom: 0,
              }"
              animation-start
            />
          </div>
        </t-col>
      </t-row>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '@/utils/i18n'

const { t } = useLocale()

const dataList = ref({
  totalSettlementVolume: 1234567,
  transactionsNetted: 1234567,
  liquiditySaved: 12345678,
  obligationsReduced: 99.9,
})

const shownDataList = computed(() => [
  {
    title: t('home.data.visualization.TotalSettlementVolume'),
    value: dataList.value.totalSettlementVolume,
    prefix: '$',
    unit: null,
  },
  {
    title: t('home.data.visualization.TransactionsNetted'),
    value: dataList.value.transactionsNetted,
    prefix: null,
    unit: null,
  },
  {
    title: t('home.data.visualization.LiquiditySaved'),
    value: dataList.value.liquiditySaved,
    prefix: '$',
    unit: null,
  },
  {
    title: t('home.data.visualization.ObligationsReduced'),
    value: dataList.value.obligationsReduced,
    prefix: null,
    unit: '%',
  },
])
</script>

<style scoped>
.data-section {
  background-color: var(--td-bg-color-container);
  padding: 4rem 2rem;
  box-sizing: border-box;
}

.title-container {
  max-width: 1000px;
  margin: 0 auto;
}

.data-description {
  font: var(--td-font-title-large);
  color: var(--td-text-color-secondary);
}

.data-title {
  font: var(--td-font-headline-large);
  margin: 0;
}

.highlight {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.highlight.red {
  background-image: linear-gradient(90deg, #ff6016 0%, #ef1515 100%);
}

.highlight.yellow {
  background-image: linear-gradient(90deg, #d2e500 0%, #06a500 100%);
}

.highlight.blue {
  background-image: linear-gradient(90deg, #003cff 0%, #8b93ff 100%);
}

.data-visualization {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 2rem;
}

.data-card {
  background-color: var(--td-bg-color-container);
  border: 1px solid var(--td-border-level-1-color);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .data-section {
    padding: 2rem 1rem;
  }

  .data-description {
    font: var(--td-font-title-medium);
  }

  .data-title {
    font: var(--td-font-headline-medium);
    display: inline-flex;
    flex-direction: column;
  }
}
</style>
