<template>
  <t-config-provider :global-config="tdesignLang">
    <RouterView />
  </t-config-provider>
</template>

<script setup>
import { useLocale } from '@/utils/i18n'
const { tdesignLang } = useLocale()
</script>
