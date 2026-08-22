<template>
  <t-layout>
    <NavBar class="nav-bar" />
    <t-layout class="content-container">
      <SiderBar />

      <t-layout>
        <t-content>
          <RouterView />
        </t-content>

        <t-footer class="footer">
          Copyright @ {{ new Date().getFullYear() }} NettedX. All Rights Reserved
        </t-footer>
      </t-layout>
    </t-layout>
  </t-layout>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import SiderBar from '@/components/SiderBar.vue'
</script>

<style scoped>
.nav-bar {
  position: fixed;
}

.content-container {
  background-color: var(--td-bg-color-container);
  min-height: 100svh;
  padding-top: 3.5rem;
}

.footer {
  text-align: center;
  padding: 1rem;
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}
</style>
