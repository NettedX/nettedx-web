<template>
  <div class="trade-visual">
    <div class="trade-party you">
      <div class="trade-party__avatar">
        <BuildingIcon size="28px" />
      </div>
      <div class="trade-party__name">{{ fromName }}</div>
      <div class="trade-party__role">{{ fromRole }}</div>
    </div>

    <div class="trade-center">
      <div class="trade-chip trade-chip--out">
        <span class="trade-chip__label">{{ sendLabel }}</span>
        <span class="trade-chip__asset">{{ getAssetName(sendAsset, sendAssetName) }}</span>
        <span class="trade-chip__value">
          {{ formatAmount(sendAmount) }} {{ getAssetSymbol(sendAsset, sendAssetSymbol) }}
        </span>
      </div>
      <ArrowLeftRight1Icon size="32px" class="trade-center__icon" />
      <div class="trade-chip trade-chip--in">
        <span class="trade-chip__label">{{ receiveLabel }}</span>
        <span class="trade-chip__asset">{{ getAssetName(receiveAsset, receiveAssetName) }}</span>
        <span class="trade-chip__value">
          {{ formatAmount(receiveAmount) }} {{ getAssetSymbol(receiveAsset, receiveAssetSymbol) }}
        </span>
      </div>
    </div>

    <div class="trade-party">
      <div class="trade-party__avatar">
        <BuildingIcon size="28px" />
      </div>
      <div class="trade-party__name">{{ toName || toPlaceholder }}</div>
      <div class="trade-party__role">{{ toRole }}</div>
    </div>
  </div>
</template>

<script setup>
import { BuildingIcon, ArrowLeftRight1Icon } from 'tdesign-icons-vue-next'
import { ASSETS } from '@/utils/assets'

defineProps({
  fromName: { type: String, default: '-' },
  fromRole: { type: String, default: '' },
  toName: { type: String, default: '' },
  toPlaceholder: { type: String, default: '' },
  toRole: { type: String, default: '' },
  sendAsset: { type: String, default: '' },
  sendAssetName: { type: String, default: '' },
  sendAssetSymbol: { type: String, default: '' },
  sendAmount: { type: [Number, String, null], default: null },
  sendLabel: { type: String, default: '' },
  receiveAsset: { type: String, default: '' },
  receiveAssetName: { type: String, default: '' },
  receiveAssetSymbol: { type: String, default: '' },
  receiveAmount: { type: [Number, String, null], default: null },
  receiveLabel: { type: String, default: '' },
})

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === '') {
    return '-'
  }
  return Number(amount).toLocaleString()
}

function getAssetName(code, override) {
  return override || ASSETS[code]?.name || code || '-'
}

function getAssetSymbol(code, override) {
  return override || ASSETS[code]?.symbol || code || ''
}
</script>

<style scoped>
.trade-visual {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.trade-party {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
  text-align: center;
}

.trade-party__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: var(--td-bg-color-secondarycontainer);
  color: var(--td-brand-color);
}

.trade-party.you .trade-party__avatar {
  background-color: var(--td-brand-color);
  color: var(--td-text-color-anti);
}

.trade-party__name {
  width: 100%;
  overflow: hidden;
  font: var(--td-font-title-medium);
  color: var(--td-text-color-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trade-party__role {
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}

.trade-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;
}

.trade-center__icon {
  color: var(--td-text-color-placeholder);
}

.trade-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  padding: 0.4rem 0.9rem;
  border-radius: 12px;
  background-color: var(--td-bg-color-secondarycontainer);
  min-width: 110px;
}

.trade-chip__label {
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}

.trade-chip__asset {
  font: var(--td-font-body-small);
  color: var(--td-text-color-secondary);
}

.trade-chip--out .trade-chip__value {
  font: var(--td-font-body-medium);
  color: var(--td-error-color);
}

.trade-chip--in .trade-chip__value {
  font: var(--td-font-body-medium);
  color: var(--td-success-color);
}
</style>
