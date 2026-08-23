<template>
  <section class="transaction-detail-page">
    <div class="transaction-detail-page__bg"></div>
    <div class="transaction-detail-page__inner">
      <div class="transaction-detail-page__header">
        <t-link
          theme="primary"
          hover="color"
          class="transaction-detail-page__back"
          @click="router.back()"
        >
          <template #prefixIcon><ChevronLeftIcon /></template>
          {{ t('transactionDetail.back') }}
        </t-link>
        <h1>{{ t('transactionDetail.title') }} #{{ route.params.id }}</h1>
        <p>{{ t('transactionDetail.subtitle') }}</p>
      </div>

      <TransactionDetailPanel :transaction-id="route.params.id" />
    </div>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeftIcon } from 'tdesign-icons-vue-next'
import { useLocale } from '@/utils/i18n'
import TransactionDetailPanel from '@/components/TransactionDetailPanel.vue'

const { t } = useLocale()
const route = useRoute()
const router = useRouter()
</script>

<style scoped>
.transaction-detail-page {
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.transaction-detail-page__bg {
  position: fixed;
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

.transaction-detail-page__inner {
  position: relative;
  width: 100%;
  z-index: 1;
}

.transaction-detail-page__header {
  margin-bottom: 1rem;
}

.transaction-detail-page__back {
  margin-bottom: 0.5rem;
}

.transaction-detail-page__header h1 {
  margin: 0;
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
}

.transaction-detail-page__header p {
  margin: 0.5rem 0 0;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}
</style>
