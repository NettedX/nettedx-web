<template>
  <t-layout class="app-layout">
    <NavBar class="nav-bar" />
    <t-layout class="content-container">
      <SiderBar class="sider-bar" />

      <t-layout class="content">
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
.app-layout {
  background-color: var(--td-bg-color-container);
}

.nav-bar {
  position: fixed;
}

.content-container {
  background-color: var(--td-bg-color-container);
  height: 100svh;
  overflow: hidden;
  position: relative;
}

.sider-bar {
  padding-top: 3.5rem;
  box-sizing: border-box;
  height: 100svh;
}

.content {
  padding-top: 3.5rem;
  box-sizing: border-box;
  min-height: 100svh;
  overflow-y: auto;
}

.footer {
  text-align: center;
  padding: 1rem;
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
}
</style>
