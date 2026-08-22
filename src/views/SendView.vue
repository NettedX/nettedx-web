<template>
  <section class="send-page">
    <div class="send-page__bg"></div>
    <div class="send-page__inner">
      <div class="send-page__header">
        <h1>{{ t('send.title') }}</h1>
        <p>{{ t('send.subtitle') }}</p>
      </div>

      <div class="send-layout">
        <div class="send-card send-card--form">
          <div class="send-card__title">{{ t('send.form.title') }}</div>
          <p class="send-card__desc">{{ t('send.form.desc') }}</p>

          <t-form :data="form" layout="vertical" @submit.prevent>
            <t-form-item :label="t('send.form.counterparty')">
              <t-select
                v-model="form.receiverOrganizationId"
                filterable
                clearable
                :loading="orgLoading"
                :placeholder="t('send.form.counterpartyPlaceholder')"
                :empty="t('send.form.counterpartyEmpty')"
                :options="organizationOptions"
              />
            </t-form-item>

            <div class="asset-group">
              <div class="asset-group__label">{{ t('send.form.youSend') }}</div>
              <div class="asset-group__row">
                <t-select
                  v-model="form.sendAsset"
                  class="asset-group__asset"
                  :options="assetOptions"
                />
                <t-input-number
                  v-model="form.sendAmount"
                  class="asset-group__amount"
                  theme="normal"
                  :min="0"
                  :decimalPlaces="sendDecimals"
                  :placeholder="t('send.form.amountPlaceholder')"
                />
              </div>
            </div>

            <div class="asset-group">
              <div class="asset-group__label">{{ t('send.form.youReceive') }}</div>
              <div class="asset-group__row">
                <t-select
                  v-model="form.receiveAsset"
                  class="asset-group__asset"
                  :options="assetOptions"
                />
                <t-input-number
                  v-model="form.receiveAmount"
                  class="asset-group__amount"
                  theme="normal"
                  :min="0"
                  :decimalPlaces="receiveDecimals"
                  :placeholder="t('send.form.amountPlaceholder')"
                />
              </div>
            </div>

            <div class="send-card__actions">
              <t-button variant="outline" theme="default" :disabled="submitting" @click="resetForm">
                {{ t('send.form.reset') }}
              </t-button>
              <t-button theme="primary" :loading="submitting" @click="submitTransaction">
                {{ t('send.form.submit') }}
              </t-button>
            </div>
          </t-form>
        </div>

        <div class="send-card send-card--visual">
          <div class="send-card__title">{{ t('send.visual.title') }}</div>
          <p class="send-card__desc">{{ t('send.visual.desc') }}</p>

          <TradeVisual
            :from-name="currentOrganizationName"
            :from-role="t('send.visual.you')"
            :to-name="selectedOrganization?.name"
            :to-placeholder="t('send.visual.counterpartyPlaceholder')"
            :to-role="t('send.visual.counterparty')"
            :send-asset="form.sendAsset"
            :send-amount="form.sendAmount"
            :send-label="t('send.visual.send')"
            :receive-asset="form.receiveAsset"
            :receive-amount="form.receiveAmount"
            :receive-label="t('send.visual.receive')"
          />
        </div>
      </div>
    </div>

    <t-dialog
      v-model:visible="successVisible"
      :header="t('send.success.title')"
      :close-btn="true"
      :footer="false"
      width="420px"
    >
      <div class="result-dialog">
        <CheckCircleFilledIcon
          size="48px"
          class="result-dialog__icon result-dialog__icon--success"
        />
        <p class="result-dialog__desc">{{ t('send.success.desc') }}</p>
        <p v-if="lastTransaction" class="result-dialog__meta">
          {{ t('send.success.transactionId') }}: #{{ lastTransaction.id }}
        </p>
        <div class="result-dialog__actions">
          <t-button variant="outline" theme="default" @click="handleSendAnother">
            {{ t('send.success.again') }}
          </t-button>
          <t-button theme="primary" @click="handleViewDetail">
            {{ t('send.success.viewDetail') }}
          </t-button>
        </div>
      </div>
    </t-dialog>

    <t-dialog
      v-model:visible="failureVisible"
      :header="t('send.failure.title')"
      :close-btn="true"
      :footer="false"
      width="420px"
    >
      <div class="result-dialog">
        <ErrorCircleFilledIcon
          size="48px"
          class="result-dialog__icon result-dialog__icon--failure"
        />
        <p class="result-dialog__desc">{{ failureReason }}</p>
        <div class="result-dialog__actions">
          <t-button variant="outline" theme="default" @click="failureVisible = false">
            {{ t('send.failure.close') }}
          </t-button>
          <t-button theme="primary" @click="handleRetry">
            {{ t('send.failure.retry') }}
          </t-button>
        </div>
      </div>
    </t-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { CheckCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-vue-next'
import api from '@/utils/api'
import { useLocale } from '@/utils/i18n'
import { useAuthStore } from '@/stores/auth'
import TradeVisual from '@/components/TradeVisual.vue'
import { ASSET_OPTIONS, getAssetDecimals, toBaseUnits } from '@/utils/assets'

const { t } = useLocale()
const router = useRouter()
const authStore = useAuthStore()

const assetOptions = ASSET_OPTIONS

const organizations = ref([])
const orgLoading = ref(false)

const form = reactive({
  receiverOrganizationId: null,
  sendAsset: 'USDC',
  sendAmount: null,
  receiveAsset: 'BOUND',
  receiveAmount: null,
})

const submitting = ref(false)
const successVisible = ref(false)
const failureVisible = ref(false)
const lastTransaction = ref(null)
const failureReason = ref('')

const sendDecimals = computed(() => getAssetDecimals(form.sendAsset))
const receiveDecimals = computed(() => getAssetDecimals(form.receiveAsset))

const organizationOptions = computed(() =>
  organizations.value.map((org) => ({
    label: `${org.name} (${org.code})`,
    value: org.id,
  })),
)

const selectedOrganization = computed(() =>
  organizations.value.find((org) => org.id === form.receiverOrganizationId),
)

const currentOrganizationName = computed(() => authStore.userProfile?.organization?.name || '-')

async function fetchOrganizations() {
  orgLoading.value = true
  try {
    const res = await api({ method: 'get', url: '/transactions/organizations' })
    if (res.data.code === 200) {
      organizations.value = res.data.data
    } else {
      throw new Error(res.data.msg)
    }
  } catch (e) {
    console.error(e)
    MessagePlugin.error(t('send.msg.fetchOrganizationsFailed'))
  } finally {
    orgLoading.value = false
  }
}

function validateForm() {
  if (!form.receiverOrganizationId) {
    MessagePlugin.warning(t('send.msg.validation.counterparty'))
    return false
  }
  if (!(Number(form.sendAmount) > 0)) {
    MessagePlugin.warning(t('send.msg.validation.sendAmount'))
    return false
  }
  if (!(Number(form.receiveAmount) > 0)) {
    MessagePlugin.warning(t('send.msg.validation.receiveAmount'))
    return false
  }
  return true
}

function resolveFailureReason(code, msg) {
  const key = `send.errors.${code}`
  const translated = t(key)
  return translated === key ? msg : translated
}

async function submitTransaction() {
  if (!validateForm()) {
    return
  }
  submitting.value = true
  try {
    const res = await api({
      method: 'post',
      url: '/transactions/send',
      data: {
        receiverOrganizationId: form.receiverOrganizationId,
        send: {
          asset: form.sendAsset,
          amount: toBaseUnits(form.sendAmount, form.sendAsset),
        },
        receive: {
          asset: form.receiveAsset,
          amount: toBaseUnits(form.receiveAmount, form.receiveAsset),
        },
      },
    })
    if (res.data.code === 200) {
      lastTransaction.value = res.data.data
      successVisible.value = true
    } else {
      failureReason.value = resolveFailureReason(res.data.code, res.data.msg)
      failureVisible.value = true
    }
  } catch (e) {
    console.error(e)
    failureReason.value = e.response?.data?.msg || t('send.msg.submitFailed')
    failureVisible.value = true
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.receiverOrganizationId = null
  form.sendAsset = 'USDC'
  form.sendAmount = null
  form.receiveAsset = 'BOUND'
  form.receiveAmount = null
}

function handleSendAnother() {
  successVisible.value = false
  resetForm()
}

function handleViewDetail() {
  successVisible.value = false
  if (lastTransaction.value) {
    router.push({ path: '/transactions', query: { id: lastTransaction.value.id } })
  } else {
    router.push('/transactions')
  }
}

function handleRetry() {
  failureVisible.value = false
  submitTransaction()
}

onMounted(() => {
  fetchOrganizations()
})
</script>

<style scoped>
.send-page {
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.send-page__bg {
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

.send-page__inner {
  position: relative;
  width: 100%;
  z-index: 1;
}

.send-page__header {
  margin-bottom: 1rem;
}

.send-page__header h1 {
  margin: 0;
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
}

.send-page__header p {
  margin: 0.25rem 0 0;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}

.send-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.5rem;
}

.send-card {
  padding: 2rem;
  border-radius: 28px;
  background-color: var(--td-bg-color-container);
  border: 1px solid var(--td-component-stroke);
}

.send-card__title {
  font: var(--td-font-title-large);
  color: var(--td-text-color-primary);
}

.send-card__desc {
  margin: 0.25rem 0 1.5rem;
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}

.asset-group {
  margin-bottom: 1.25rem;
}

.asset-group__label {
  margin-bottom: 0.5rem;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}

.asset-group__row {
  display: flex;
  gap: 0.75rem;
}

.asset-group__asset {
  flex: 0 0 130px;
}

.asset-group__amount {
  flex: 1;
}

.send-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.result-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0 1rem;
  text-align: center;
}

.result-dialog__icon--success {
  color: var(--td-success-color-6);
}

.result-dialog__icon--failure {
  color: var(--td-error-color-6);
}

.result-dialog__desc {
  margin: 0;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-primary);
}

.result-dialog__meta {
  margin: 0;
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}

.result-dialog__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
