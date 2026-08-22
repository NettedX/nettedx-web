<template>
  <t-aside style="border-top: 1px solid var(--component-border)">
    <t-menu theme="light" v-model="selectedValue" style="margin-right: 50px" height="550px">
      <t-menu-item v-for="item in menuItems" :key="item.value" :value="item.value" :to="item.path">
        <template #icon>
          <t-icon :name="item.icon" />
        </template>
        {{ item.label }}
      </t-menu-item>
    </t-menu>
  </t-aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useLocale } from '@/utils/i18n'
import { useRoute } from 'vue-router'

const { t } = useLocale()

const route = useRoute()

const selectedValue = ref('dashboard')

const menuItems = computed(() => [
  {
    value: 'dashboard',
    label: t('menu.dashboard'),
    icon: 'dashboard',
    path: '/dashboard',
  },
  {
    value: 'send',
    label: t('menu.send'),
    icon: 'send',
    path: '/send',
  },
  {
    value: 'transactions',
    label: t('menu.transactions'),
    icon: 'tree-list',
    path: '/transactions',
  },
  {
    value: 'verify',
    label: t('menu.verify'),
    icon: 'verified',
    path: '/verify',
  },
  {
    value: 'account',
    label: t('menu.account'),
    icon: 'user',
    path: '/account',
  },
])

// 根据route的路径来设置选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    const selectedItem = menuItems.value.find((item) => newPath.startsWith(item.path))
    if (selectedItem) {
      selectedValue.value = selectedItem.value
    }
  },
  { immediate: true },
)
</script>

<style scoped></style>
