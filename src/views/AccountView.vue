<template>
  <section class="account-page">
    <div class="account-page__bg"></div>
    <div class="account-page__inner">
      <div class="account-page__header">
        <h1>{{ t('account.title') }}</h1>
        <p>{{ t('account.subtitle') }}</p>
      </div>

      <div class="account-layout">
        <div class="account-card account-card--summary account-card--summary-grid">
          <div class="summary">
            <t-avatar size="96px" shape="circle" class="summary__avatar">
              <template #icon>
                <UserIcon />
              </template>
            </t-avatar>

            <h2 class="summary__name">{{ profileDisplayName }}</h2>
            <div class="summary__meta">
              <t-tag theme="primary" variant="light-outline" shape="round">
                {{ profileRole }}
              </t-tag>
              <t-tag theme="success" variant="light-outline" shape="round">
                ID: {{ profileId }}
              </t-tag>
            </div>
          </div>
        </div>

        <div class="account-card account-card--profile">
          <div class="account-card__title">{{ t('account.profileCardTitle') }}</div>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-item__label">{{ t('account.fields.displayName') }}</span>
              <span class="detail-item__value">{{ profileDisplayName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('account.fields.role') }}</span>
              <span class="detail-item__value">{{ profileRole }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('account.fields.accountId') }}</span>
              <span class="detail-item__value detail-item__value-with-action">
                <span>{{ profileId }}</span>
                <t-tooltip :content="t('account.actions.copy')">
                  <t-button
                    variant="text"
                    theme="default"
                    size="small"
                    @click="copyField(profileId, t('account.fields.accountId'))"
                  >
                    <template #icon>
                      <CopyIcon />
                    </template>
                  </t-button>
                </t-tooltip>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('account.fields.organizationCode') }}</span>
              <span class="detail-item__value detail-item__value-with-action">
                <span class="detail-item__value--nowrap">{{ organizationCode }}</span>
                <t-tooltip :content="t('account.actions.copy')">
                  <t-button
                    variant="text"
                    theme="default"
                    size="small"
                    @click="copyField(organizationCode, t('account.fields.organizationCode'))"
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

        <div class="account-card account-card--organization">
          <div class="account-card__title">{{ t('account.organizationCardTitle') }}</div>
          <div class="detail-grid detail-grid--org">
            <div class="detail-item">
              <span class="detail-item__label">{{ t('account.fields.organizationId') }}</span>
              <span class="detail-item__value">{{ organizationId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-item__label">{{ t('account.fields.organizationName') }}</span>
              <span class="detail-item__value">{{ organizationName }}</span>
            </div>
            <div class="detail-item detail-item--full">
              <span class="detail-item__label">{{ t('account.fields.walletAddress') }}</span>
              <span
                class="detail-item__value detail-item__value-with-action detail-item__value--mono"
              >
                <span>{{ organizationWalletAddress }}</span>
                <t-tooltip :content="t('account.actions.copy')">
                  <t-button
                    variant="text"
                    theme="default"
                    size="small"
                    @click="copyField(organizationWalletAddress, t('account.fields.walletAddress'))"
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
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { UserIcon, CopyIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useLocale } from '@/utils/i18n'

const { t } = useLocale()
const authStore = useAuthStore()

const profile = computed(() => authStore.userProfile || {})
const organization = computed(() => profile.value.organization || {})

const profileId = computed(() => profile.value.id ?? '-')
const profileDisplayName = computed(() => profile.value.displayName || '-')
const profileRole = computed(() => profile.value.role || '-')

const organizationId = computed(() => organization.value.id ?? '-')
const organizationCode = computed(() => organization.value.code || '-')
const organizationName = computed(() => organization.value.name || '-')
const organizationWalletAddress = computed(() => organization.value.walletAddress || '-')

async function copyField(value, label) {
  if (!value || value === '-') {
    return
  }
  try {
    await navigator.clipboard.writeText(String(value))
    MessagePlugin.success(t('account.msg.copySuccess', { label }))
  } catch (e) {
    console.error(e)
    MessagePlugin.error(t('account.msg.copyFailed'))
  }
}
</script>

<style scoped>
.account-page {
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.account-page__bg {
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

.account-page__inner {
  position: relative;
  width: 100%;
  z-index: 1;
}

.account-layout {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.6fr);
  grid-template-areas:
    'summary profile'
    'organization organization';
  gap: 1rem;
}

.account-page__header {
  margin-bottom: 1rem;
}

.account-page__header h1 {
  margin: 0;
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
}

.account-page__header p {
  margin: 0.5rem 0 0;
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
}

.account-card {
  border: 1px solid var(--td-component-stroke);
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(from var(--td-bg-color-container) r g b / 0.98),
    rgba(from var(--td-bg-color-container) r g b / 0.92)
  );
  padding: 2rem;
}

.account-card__title {
  margin: 0 0 0.875rem;
  font: var(--td-font-title-medium);
  color: var(--td-text-color-primary);
}

.account-card--summary {
  height: 100%;
  box-sizing: border-box;
}

.account-card--summary-grid {
  grid-area: summary;
}

.account-card--profile {
  grid-area: profile;
}

.account-card--organization {
  grid-area: organization;
}

.summary {
  min-height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.summary__avatar {
  background: linear-gradient(135deg, var(--td-brand-color-6), var(--td-brand-color-5));
  color: var(--td-text-color-anti);
}

.summary__name {
  margin: 0;
  font: var(--td-font-title-large);
  color: var(--td-text-color-primary);
  text-align: center;
}

.summary__meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
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

.detail-item__value--nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-item__value--mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .summary {
    min-height: 180px;
  }
}
</style>
