<template>
  <section class="transactions-page">
    <div class="transactions-page__bg"></div>
    <div class="transactions-page__inner">
      <div class="transactions-page__header">
        <h1>{{ t('transactions.title') }}</h1>
        <p>{{ t('transactions.subtitle') }}</p>
      </div>

      <div class="transactions-card">
        <div class="transactions-card__toolbar">
          <t-radio-group v-model="isRelated" variant="default-filled" @change="fetchTransactions">
            <t-radio-button :value="false">{{ t('transactions.filter.all') }}</t-radio-button>
            <t-radio-button :value="true">{{ t('transactions.filter.related') }}</t-radio-button>
          </t-radio-group>
        </div>

        <t-table
          :data="list"
          :columns="columns"
          :loading="loading"
          row-key="id"
          :empty="t('transactions.empty')"
          table-layout="auto"
          hover
        >
          <template #createdBy="{ row }">
            {{ formatOrganization(row.createdBy) }}
          </template>
          <template #senderOrganization="{ row }">
            {{ formatOrganization(row.senderOrganization) }}
          </template>
          <template #send="{ row }">
            {{ formatAmount(row.send?.amount) }} {{ row.send?.asset?.symbol }}
          </template>
          <template #receiverOrganization="{ row }">
            {{ formatOrganization(row.receiverOrganization) }}
          </template>
          <template #receive="{ row }">
            {{ formatAmount(row.receive?.amount) }} {{ row.receive?.asset?.symbol }}
          </template>
          <template #status="{ row }">
            <t-tag :theme="statusTheme(row.status)" variant="light-outline" shape="round">
              {{ t(`transactions.status.${row.status}`) }}
            </t-tag>
          </template>
          <template #createdAt="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
          <template #settledAt="{ row }">
            {{ row.settledAt ? formatDateTime(row.settledAt) : '-' }}
          </template>
          <template #operation="{ row }">
            <t-link theme="primary" hover="color" @click="viewTransaction(row.id)">
              {{ t('transactions.action.view') }}
            </t-link>
          </template>
        </t-table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import api from '@/utils/api'
import { useLocale } from '@/utils/i18n'

const { t } = useLocale()
const router = useRouter()

const list = ref([])
const loading = ref(false)
const isRelated = ref(false)

const columns = [
  { colKey: 'id', title: t('transactions.table.id'), width: 90 },
  { colKey: 'createdBy', title: t('transactions.table.createdBy') },
  { colKey: 'senderOrganization', title: t('transactions.table.sender') },
  { colKey: 'send', title: t('transactions.table.send') },
  { colKey: 'receiverOrganization', title: t('transactions.table.receiver') },
  { colKey: 'receive', title: t('transactions.table.receive') },
  { colKey: 'status', title: t('transactions.table.status') },
  { colKey: 'chainId', title: t('transactions.table.chainId'), width: 100 },
  { colKey: 'windowId', title: t('transactions.table.windowId'), width: 100 },
  { colKey: 'createdAt', title: t('transactions.table.createdAt') },
  { colKey: 'settledAt', title: t('transactions.table.settledAt') },
  { colKey: 'operation', title: t('transactions.table.operation'), width: 90, fixed: 'right' },
]

function formatOrganization(org) {
  if (!org) {
    return '-'
  }
  return org.name || org.code || '-'
}

function formatAmount(amount) {
  if (amount === null || amount === undefined) {
    return '-'
  }
  return Number(amount).toLocaleString()
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

function viewTransaction(id) {
  router.push(`/transactions/${id}`)
}

async function fetchTransactions() {
  loading.value = true
  try {
    const res = await api({
      method: 'get',
      url: '/transactions',
      params: { isRelated: isRelated.value },
    })
    if (res.data.code === 200) {
      list.value = res.data.data
    } else {
      throw new Error(res.data.msg)
    }
  } catch (e) {
    console.error(e)
    MessagePlugin.error(t('transactions.msg.fetchFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(fetchTransactions)
</script>

<style scoped>
.transactions-page {
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.transactions-page__bg {
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

.transactions-page__inner {
  position: relative;
  width: 100%;
  z-index: 1;
}

.transactions-page__header {
  margin-bottom: 1rem;
}

.transactions-page__header h1 {
  margin: 0;
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
}

.transactions-page__header p {
  margin: 0.5rem 0 0;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}

.transactions-card {
  border: 1px solid var(--td-component-stroke);
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(from var(--td-bg-color-container) r g b / 0.98),
    rgba(from var(--td-bg-color-container) r g b / 0.92)
  );
  padding: 1.5rem;
}

.transactions-card__toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}
</style>
