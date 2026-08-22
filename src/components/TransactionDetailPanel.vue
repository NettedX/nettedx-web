<template>
  <div class="transaction-detail">
    <t-skeleton
      v-if="loading"
      theme="paragraph"
      animation="gradient"
      :row-col="[{ width: '100%' }, { width: '88%' }, { width: '76%' }, { width: '60%' }]"
    />

    <div v-else-if="!transaction" class="transaction-empty-container">
      <t-empty :description="t('transactionDetail.notFound')" />
    </div>

    <div v-else class="transaction-detail__body">
      <div v-if="showVerifiedStamp" class="verified-stamp">
        <CheckCircleFilledIcon size="36px" />
        <span>{{ t('verify.stamp') }}</span>
      </div>

      <div class="transaction-detail__layout">
        <div class="transaction-detail__card transaction-detail__card--visual">
          <div class="transaction-detail__card-title">{{ t('transactionDetail.parties') }}</div>

          <TradeVisual
            :from-name="transaction.senderOrganization?.name"
            :from-role="t('transactionDetail.fields.sender')"
            :to-name="transaction.receiverOrganization?.name"
            :to-role="t('transactionDetail.fields.receiver')"
            :send-asset="transaction.send?.asset?.symbol"
            :send-asset-name="transaction.send?.asset?.name"
            :send-asset-symbol="transaction.send?.asset?.symbol"
            :send-amount="transaction.send?.amount"
            :send-label="t('transactionDetail.fields.send')"
            :receive-asset="transaction.receive?.asset?.symbol"
            :receive-asset-name="transaction.receive?.asset?.name"
            :receive-asset-symbol="transaction.receive?.asset?.symbol"
            :receive-amount="transaction.receive?.amount"
            :receive-label="t('transactionDetail.fields.receive')"
          />
        </div>

        <div class="transaction-detail__card">
          <div class="transaction-detail__card-title">{{ t('transactionDetail.basicInfo') }}</div>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-item__label">{{ t('transactionDetail.fields.id') }}</span>
              <span class="detail-item__value">#{{ transaction.id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('transactionDetail.fields.status') }}</span>
              <span class="detail-item__value">
                <t-tag
                  :theme="statusTheme(transaction.status)"
                  variant="light-outline"
                  shape="round"
                >
                  {{ t(`transactions.status.${transaction.status}`) }}
                </t-tag>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('transactionDetail.fields.createdBy') }}</span>
              <span class="detail-item__value">{{
                formatOrganization(transaction.createdBy)
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('transactionDetail.fields.chainId') }}</span>
              <span class="detail-item__value">{{ transaction.chainId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('transactionDetail.fields.windowId') }}</span>
              <span class="detail-item__value">{{ transaction.windowId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('transactionDetail.fields.createdAt') }}</span>
              <span class="detail-item__value">{{ formatDateTime(transaction.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('transactionDetail.fields.settledAt') }}</span>
              <span class="detail-item__value">
                {{ transaction.settledAt ? formatDateTime(transaction.settledAt) : '-' }}
              </span>
            </div>
            <div v-if="transaction.status === 'failed'" class="detail-item detail-item--full">
              <span class="detail-item__label">{{
                t('transactionDetail.fields.failureReason')
              }}</span>
              <span class="detail-item__value">{{ transaction.failureReason || '-' }}</span>
            </div>
          </div>
        </div>

        <div class="transaction-detail__card">
          <div class="transaction-detail__card-title">{{ t('transactionDetail.hashInfo') }}</div>
          <div class="detail-grid detail-grid--single">
            <div class="detail-item">
              <span class="detail-item__label">{{
                t('transactionDetail.fields.submissionHash')
              }}</span>
              <span
                class="detail-item__value detail-item__value-with-action detail-item__value--mono"
              >
                <span>{{ transaction.submissionHash || '-' }}</span>
                <t-tooltip :content="t('transactionDetail.copy')">
                  <t-button
                    variant="text"
                    theme="default"
                    size="small"
                    :disabled="!transaction.submissionHash"
                    @click="
                      copyField(
                        transaction.submissionHash,
                        t('transactionDetail.fields.submissionHash'),
                      )
                    "
                  >
                    <template #icon>
                      <CopyIcon />
                    </template>
                  </t-button>
                </t-tooltip>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{
                t('transactionDetail.fields.settlementHash')
              }}</span>
              <span
                class="detail-item__value detail-item__value-with-action detail-item__value--mono"
              >
                <span>{{ transaction.settlementHash || '-' }}</span>
                <t-tooltip :content="t('transactionDetail.copy')">
                  <t-button
                    variant="text"
                    theme="default"
                    size="small"
                    :disabled="!transaction.settlementHash"
                    @click="
                      copyField(
                        transaction.settlementHash,
                        t('transactionDetail.fields.settlementHash'),
                      )
                    "
                  >
                    <template #icon>
                      <CopyIcon />
                    </template>
                  </t-button>
                </t-tooltip>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { CheckCircleFilledIcon, CopyIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import api from '@/utils/api'
import { useLocale } from '@/utils/i18n'
import TradeVisual from '@/components/TradeVisual.vue'

const props = defineProps({
  transactionId: { type: [String, Number], default: null },
  transaction: { type: Object, default: null },
  showVerifiedStamp: { type: Boolean, default: false },
})

const { t } = useLocale()

const fetchedTransaction = ref(null)
const transaction = computed(() => props.transaction ?? fetchedTransaction.value)
const loading = ref(false)

function formatOrganization(org) {
  if (!org) {
    return '-'
  }
  return org.name || org.code || '-'
}

function formatDateTime(timestamp) {
  if (!timestamp) {
    return '-'
  }
  return new Date(timestamp * 1000).toLocaleString()
}

function statusTheme(status) {
  switch (status) {
    case 'settled':
      return 'success'
    case 'failed':
      return 'danger'
    default:
      return 'warning'
  }
}

async function copyField(value, label) {
  if (!value) {
    return
  }
  try {
    await navigator.clipboard.writeText(String(value))
    MessagePlugin.success(t('transactionDetail.copySuccess', { label }))
  } catch (e) {
    console.error(e)
    MessagePlugin.error(t('transactionDetail.copyFailed'))
  }
}

async function fetchTransaction() {
  if (!props.transactionId) {
    return
  }
  loading.value = true
  try {
    const res = await api({
      method: 'get',
      url: `/transactions/${props.transactionId}`,
    })
    if (res.data.code === 200) {
      fetchedTransaction.value = res.data.data
    } else {
      throw new Error(res.data.msg)
    }
  } catch (e) {
    console.error(e)
    MessagePlugin.error(t('transactionDetail.msg.fetchFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!props.transaction) {
    fetchTransaction()
  }
})
</script>

<style scoped>
.transaction-empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.transaction-detail__body {
  position: relative;
}

.verified-stamp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0 auto 1.5rem;
  width: fit-content;
  padding: 0.75rem 2.5rem;
  border: 6px double var(--td-success-color);
  border-radius: 12px;
  color: var(--td-success-color);
  font: var(--td-font-headline-medium);
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  transform: rotate(-4deg);
  opacity: 0.85;
  user-select: none;
  pointer-events: none;
}

.transaction-detail__layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.transaction-detail__card {
  border: 1px solid var(--td-component-stroke);
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(from var(--td-bg-color-container) r g b / 0.98),
    rgba(from var(--td-bg-color-container) r g b / 0.92)
  );
  padding: 1.5rem;
}

.transaction-detail__card--visual {
  grid-column: 1 / -1;
}

.transaction-detail__card-title {
  margin: 0 0 0.875rem;
  font: var(--td-font-title-medium);
  color: var(--td-text-color-primary);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.detail-grid--single {
  grid-template-columns: 1fr;
}

.detail-item {
  padding: 0.75rem 0.875rem;
  border: 1px solid var(--td-component-border);
  border-radius: 14px;
  background: var(--td-bg-color-page);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item--full {
  grid-column: 1 / -1;
}

.detail-item__label {
  font: var(--td-font-body-small);
  color: var(--td-text-color-secondary);
}

.detail-item__value {
  font: var(--td-font-body-medium);
  color: var(--td-text-color-primary);
  word-break: break-word;
}

.detail-item__value-with-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.detail-item__value--mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .transaction-detail__layout {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
