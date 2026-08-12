<template>
  <t-layout>
    <NavBar />

    <t-content class="main-content">
      <router-view />
    </t-content>

    <PageFooter />
  </t-layout>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import PageFooter from '@/components/PageFooter.vue'
</script>

<style scoped>
.main-content {
  background-color: var(--td-bg-color-container);
}
</style>
