<template>
  <div class="language-selector">
    <earth-icon class="icon" size="32" />
    <t-select borderless auto-width :value="locale" @change="handleLocaleChange">
      <t-option
        v-for="option in localeOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </t-select>
  </div>
</template>

<script setup>
import { useLocale } from '@/utils/i18n'
import { EarthIcon } from 'tdesign-icons-vue-next'

const { locale, localeOptions, changeLocale } = useLocale()

function handleLocaleChange(newLocale) {
  changeLocale(newLocale)
}
</script>

<style scoped>
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
