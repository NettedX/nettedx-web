<template>
  <section class="container">
    <div class="title-box">
      <i18n-t keypath="home.beforeAfter.title.text" class="title" tag="h2" scope="global">
        <template #highlight>
          <span class="highlight">{{ $t('home.beforeAfter.title.highlight') }}</span>
        </template>
      </i18n-t>

      <p class="desc">{{ $t('home.beforeAfter.desc') }}</p>

      <div class="compare-container">
        <div class="compare-card before">
          <h3 class="compare-title">{{ $t('home.beforeAfter.compare.before.title') }}</h3>
          <div class="compare-item">{{ $t('home.beforeAfter.compare.before.transaction') }}</div>
          <div class="compare-item">{{ $t('home.beforeAfter.compare.before.obligations') }}</div>
          <div class="compare-item">{{ $t('home.beforeAfter.compare.before.liquidity') }}</div>
          <div class="compare-item">{{ $t('home.beforeAfter.compare.before.settlement') }}</div>
        </div>

        <div class="compare-card after">
          <h3 class="compare-title">{{ $t('home.beforeAfter.compare.after.title') }}</h3>
          <div class="compare-item">{{ $t('home.beforeAfter.compare.after.transaction') }}</div>
          <div class="compare-item">{{ $t('home.beforeAfter.compare.after.obligations') }}</div>
          <div class="compare-item">{{ $t('home.beforeAfter.compare.after.liquidity') }}</div>
          <div class="compare-item">{{ $t('home.beforeAfter.compare.after.settlement') }}</div>
        </div>
      </div>

      <p class="footer">* {{ $t('home.beforeAfter.footer') }}</p>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.container {
  position: relative;
  background-color: var(--td-bg-color-container);
  padding: 2rem 0;
}

.title-box {
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.title {
  font: var(--td-font-headline-large);
  color: var(--td-text-color-primary);
  margin-top: 0;
  margin-bottom: 1rem;
}

.title .highlight {
  background-image: linear-gradient(to right, #1d9dff, #1723f5);
  background-clip: text;
  color: transparent;
}

.desc {
  font: var(--td-font-body-large);
  color: var(--td-text-color-secondary);
  margin-top: 0;
  margin-bottom: 0;
}

.compare-container {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
  padding: 2rem 0;
}

.compare-card {
  height: fit-content;
  margin: auto 0;
  padding: 4rem;
  box-sizing: border-box;
  border-radius: 1rem;
  background-color: var(--td-bg-color-container);
  box-shadow: var(--td-shadow-elevation-2);
}

.compare-card.before {
  border: 2px solid var(--td-border-level-2-color);
  background-color: var(--td-bg-color-component);
  padding: 2rem 4rem;
}

.compare-card.after {
  background: linear-gradient(150deg, #1dacff 0%, #1722f5 100%);
  color: var(--td-text-color-anti);
  position: relative;
  z-index: 1;
  transform: translateX(-10%) scale(1.2);
  box-shadow: 0 18px 30px rgba(23, 35, 245, 0.26);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.compare-card.after:hover {
  transform: translateX(-10%) scale(1.25);
  box-shadow: 0 18px 30px rgba(23, 35, 245, 0.36);
}

.compare-title {
  font: var(--td-font-headline-small);
  margin: 0 0 1rem;
}

.compare-item {
  font: var(--td-font-body-large);
  color: var(--td-text-color-secondary);
  margin-bottom: 0.5rem;
  font-family: 'TCloudNumber';
}

.compare-item:last-child {
  margin-bottom: 0;
}

.after .compare-item {
  color: var(--td-text-color-anti);
}

.footer {
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
  margin: 4rem 0;
}

@media (max-width: 768px) {
  .compare-container {
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
  }

  .compare-card {
    width: 100%;
    max-width: 400px;
  }

  .compare-card.before {
    padding: 4rem 1rem;
  }

  .compare-card.after {
    transform: translateX(0) scale(1.2);
    box-sizing: border-box;
    padding: 4rem 3rem;
    width: fit-content;
  }

  .compare-card.after:hover {
    transform: translateX(0) scale(1.3);
  }
}
</style>
