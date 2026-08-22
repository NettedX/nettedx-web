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
      <span>© {{ currentYear }} NettedX {{ t('footer.rights') }}</span>

      <LanguageSelector />
    </div>

    <div class="language-wrapper"></div>
  </t-footer>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '@/utils/i18n'
import LanguageSelector from '@/components/LanguageSelector.vue'
const { t } = useLocale()

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  margin-top: auto;
  background-color: var(--td-bg-color-container);
  color: var(--td-text-color-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  max-width: var(--nx-max-content-width);
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
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  border-top: 1px solid var(--td-border-level-1-color);
  width: 100%;
  max-width: var(--nx-max-content-width);
  margin-top: 1rem;
  padding: 1rem 0;
  box-sizing: border-box;
}
</style>
