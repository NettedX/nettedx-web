<template>
  <section class="data-section" id="data">
    <div class="title-container">
      <p class="data-description">{{ $t('home.data.description') }}</p>
      <h2 class="data-title">
        <i18n-t keypath="home.data.title.text" scope="global">
          <template #More>
            <span class="highlight red">{{ $t('home.data.title.more') }}</span>
          </template>

          <template #Less>
            <span class="highlight yellow">{{ $t('home.data.title.less') }}</span>
          </template>

          <template #Smarter>
            <span class="highlight blue">{{ $t('home.data.title.smarter') }}</span>
          </template>
        </i18n-t>
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

    <div class="compare">
      <div class="compare-item">
        <span class="progress-bar traditional" />
        <div>{{ $t('home.data.compare.without') }} ${{ dataList.totalSettlementVolume }}</div>
      </div>

      <div class="compare-item">
        <span
          class="progress-bar nettedx"
          :style="{ width: 100 - dataList.obligationsReduced + '%' }"
        />
        <div>
          <span>{{ $t('home.data.compare.with') }} ${{ afterNettedVolume }}</span>
          <span> · </span>
          <span class="highlight-blue">
            {{ $t('home.data.compare.less', { amount: dataList.obligationsReduced }) }}
          </span>
        </div>
      </div>
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
  liquiditySaved: 888888,
  obligationsReduced: 72,
})

const afterNettedVolume = computed(
  () => dataList.value.totalSettlementVolume - dataList.value.liquiditySaved,
)

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
  padding: 4rem 2rem;
  box-sizing: border-box;
  background-color: var(--td-bg-color-container);
}

.title-container {
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
}

.data-description {
  font: var(--td-font-title-large);
  color: var(--td-text-color-secondary);
}

.data-title {
  font: var(--td-font-headline-large);
  margin: 0;
  width: 100%;
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
  max-width: var(--nx-max-content-width);
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

.compare {
  width: 100%;
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-right: 30%;
  box-sizing: border-box;
}

.compare-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.compare-item div {
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}

.progress-bar {
  height: 8px;
  border-radius: 8px;
  flex-grow: 1;
  background-color: var(--td-bg-color-component);
  position: relative;
}

.progress-bar.nettedx {
  background-color: var(--td-brand-color);
}

.compare-item .highlight-blue {
  color: var(--td-brand-color);
  font-weight: bold;
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
  }

  .compare {
    padding-right: 0;
  }
}
</style>
