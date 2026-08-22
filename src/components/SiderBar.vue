<template>
  <t-aside style="border-top: 1px solid var(--component-border)">
    <t-menu theme="light" value="dashboard" style="margin-right: 50px" height="550px">
      <t-menu-item v-for="item in menuItems" :key="item.value" :value="item.value">
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

const slectedValue = ref('dashboard')

const menuItems = computed(() => [
  {
    value: 'dashboard',
    label: t('menu.dashboard'),
    icon: 'dashboard',
  },
  {
    value: 'send',
    label: t('menu.send'),
    icon: 'send',
  },
  {
    value: 'records',
    label: t('menu.records'),
    icon: 'tree-list',
  },
  {
    value: 'account',
    label: t('menu.account'),
    icon: 'user',
  },
])

// 根据route的路径来设置选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    const menuItem = newPath.split('/')[1] // 获取路径的第一个部分作为菜单项的值
    if (menuItem) {
      slectedValue.value = menuItem
    }
  },
  { immediate: true },
)
</script>

<style scoped></style>
