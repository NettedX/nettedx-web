<template>
  <t-layout>
    <NavBar />

    <t-content>
      <router-view />
    </t-content>

    <PageFooter />
  </t-layout>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import PageFooter from '@/components/PageFooter.vue'
</script>
