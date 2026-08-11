<template>
  <t-footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <RouterLink to="/" class="brand-link">
          <img src="@/assets/images/logo/text.svg" alt="NettedX" />
        </RouterLink>
        <p>{{ t('slogan') }}</p>
      </div>

      <div class="footer-links">
        <div class="footer-column">
          <h4>{{ t('footer.product') }}</h4>
          <RouterLink to="/">{{ t('footer.home') }}</RouterLink>
          <RouterLink to="/dashboard">{{ t('footer.dashboard') }}</RouterLink>
        </div>

        <div class="footer-column">
          <h4>{{ t('footer.support') }}</h4>
          <a href="mailto:hi@nettedx.com">hi@nettedx.com</a>
          <a href="https://github.com/NettedX" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {{ currentYear }} NettedX</span>
      <span>{{ t('footer.rights') }}</span>
    </div>

    <div class="language-wrapper">
      <div class="language-selector">
        <earth-icon class="icon" size="40" />
        <t-select borderless auto-width :value="locale" @change="handleLocaleChange">
          <t-option
            v-for="option in localeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </t-select>
      </div>
    </div>
  </t-footer>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '@/utils/i18n'
import { EarthIcon } from 'tdesign-icons-vue-next'
const { locale, t, localeOptions, changeLocale } = useLocale()

const currentYear = computed(() => new Date().getFullYear())

function handleLocaleChange(newLocale) {
  changeLocale(newLocale)
}
</script>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--td-border-level-1);
  background-color: var(--td-bg-color-container);
  color: var(--td-text-color-secondary);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
}

.footer-brand {
  max-width: 24rem;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.brand-link img {
  height: 3rem;
}

.footer-brand p {
  margin: 0;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-column h4 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  color: var(--td-text-color-primary);
}

.footer-column a,
.footer-column :deep(a) {
  color: inherit;
  text-decoration: none;
}

.footer-column a:hover,
.footer-column :deep(a:hover) {
  color: var(--td-brand-color);
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.9rem;
  border-top: 1px solid var(--td-border-level-1);
  width: 100%;
  max-width: 1000px;
  margin-top: 1rem;
}

.language-wrapper {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 1000px;
  margin-top: 1rem;
}

.language-selector {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-selector .icon {
  color: var(--td-brand-color);
}
</style>
