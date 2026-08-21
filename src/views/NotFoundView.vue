<template>
  <section class="container">
    <no-result-icon class="icon" />
    <h1>{{ $t('notFound.title') }}</h1>
    <p>{{ $t('notFound.description') }}</p>
    <t-button class="btn" theme="primary" size="large" shape="round" @click="$router.push('/')">
      {{ $t('notFound.btn.backToHome') }}
    </t-button>
  </section>
</template>

<script setup>
import { NoResultIcon } from 'tdesign-icons-vue-next'
</script>

<style scoped>
.icon {
  width: 100px;
  height: auto;
  margin-bottom: 2rem;
  color: var(--td-text-color-anti);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  background-color: #000000a0;
  background-image: url('@/assets/images/bg/404.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100svh;
  padding: 2rem;
}

.container h1 {
  font: var(--td-font-display-medium);
  color: var(--td-text-color-anti);
  margin: 0;
  margin-bottom: 1rem;
}

.container p {
  font: var(--td-font-body-large);
  color: var(--td-text-color-anti);
  opacity: 0.8;
  margin: 0;
}

.container .btn {
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .container h1 {
    font: var(--td-font-headline-large);
  }

  .container p {
    font: var(--td-font-body-large);
  }
}
</style>
