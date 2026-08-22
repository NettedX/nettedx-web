<template>
  <section class="verify-page">
    <div class="verify-page__bg"></div>
    <div class="verify-page__inner">
      <div class="verify-page__header">
        <h1>{{ t('verify.title') }}</h1>
        <p>{{ t('verify.subtitle') }}</p>
      </div>

      <div class="verify-card">
        <div class="verify-card__search">
          <t-input
            v-model="hashInput"
            clearable
            :placeholder="t('verify.placeholder')"
            @enter="verify"
          />
          <t-button theme="primary" :loading="verifying" @click="verify">
            {{ t('verify.button') }}
          </t-button>
        </div>

        <div v-if="verifyState === 'fail'" class="verify-card__result">
          <t-empty type="fail" size="large" :description="t('verify.failDescription')" />
        </div>

        <div v-else-if="verifyState === 'success'" class="verify-card__result">
          <TransactionDetailPanel :transaction="transactionResult" show-verified-stamp />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import api from '@/utils/api'
import { useLocale } from '@/utils/i18n'
import TransactionDetailPanel from '@/components/TransactionDetailPanel.vue'

const { t } = useLocale()

const HASH_PATTERN = /^0x[a-fA-F0-9]{64}$/

const hashInput = ref('')
const verifying = ref(false)
const verifyState = ref('idle')
const transactionResult = ref(null)

async function verify() {
  const hash = hashInput.value.trim()
  if (!HASH_PATTERN.test(hash)) {
    MessagePlugin.warning(t('verify.invalidHash'))
    return
  }

  verifying.value = true
  verifyState.value = 'idle'
  transactionResult.value = null
  try {
    const res = await api({
      method: 'get',
      url: '/transactions/verify',
      params: { submissionHash: hash },
    })
    if (res.data.code === 200 && res.data.data) {
      transactionResult.value = res.data.data
      verifyState.value = 'success'
    } else {
      verifyState.value = 'fail'
    }
  } catch (e) {
    console.error(e)
    verifyState.value = 'fail'
  } finally {
    verifying.value = false
  }
}
</script>

<style scoped>
.verify-page {
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.verify-page__bg {
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

.verify-page__inner {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  z-index: 1;
}

.verify-page__header {
  margin-bottom: 1rem;
  text-align: center;
}

.verify-page__header h1 {
  margin: 0;
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
}

.verify-page__header p {
  margin: 0.5rem 0 0;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}

.verify-card {
  border: 1px solid var(--td-component-stroke);
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(from var(--td-bg-color-container) r g b / 0.98),
    rgba(from var(--td-bg-color-container) r g b / 0.92)
  );
  padding: 1.5rem;
}

.verify-card__search {
  display: flex;
  gap: 0.75rem;
}

.verify-card__search :deep(.t-input) {
  flex: 1;
}

.verify-card__result {
  margin-top: 1.5rem;
}
</style>
