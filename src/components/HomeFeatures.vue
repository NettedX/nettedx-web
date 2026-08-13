<template>
  <section class="container">
    <div class="title-box">
      <i18n-t keypath="home.features.title.text" class="title" tag="h2" scope="global">
        <template #highlight>
          <span class="highlight">{{ $t('home.features.title.highlight') }}</span>
        </template>
      </i18n-t>

      <p class="desc">{{ $t('home.features.desc') }}</p>
    </div>

    <div class="content-box">
      <div class="option-group">
        <t-radio-group v-model="selectedOption" variant="default-filled" size="large">
          <t-radio-button :value="1">
            <div class="option-item">
              <t-icon name="layers" size="20" />
              <span> {{ $t('home.features.radio.option1') }}</span>
            </div>
          </t-radio-button>

          <t-radio-button :value="2">
            <div class="option-item">
              <t-icon name="shield-error" size="20" />
              <span> {{ $t('home.features.radio.option2') }}</span>
            </div>
          </t-radio-button>
        </t-radio-group>
      </div>

      <div class="option-content">
        <transition name="fade" mode="out-in">
          <div v-if="selectedOption === 1" key="option1" class="card">
            <p>{{ $t('home.features.option1.desc') }}</p>
            <img src="@/assets/images/features/buffer.png" />
            <span class="mask" />
          </div>
          <div v-else-if="selectedOption === 2" key="option2" class="card">
            <p>{{ $t('home.features.option2.desc') }}</p>
            <img src="@/assets/images/features/failure.png" />
            <span class="mask" />
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const selectedOption = ref(1)
</script>

<style scoped>
.container {
  padding: 6rem 0;
  background-color: var(--td-bg-color-container);
}

.title-box {
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.title {
  font: var(--td-font-headline-large);
  margin: 0;
  margin-bottom: 1rem;
}

.title .highlight {
  color: transparent;
  background-image: linear-gradient(to right, #1d9dff, #1723f5);
  background-clip: text;
  -webkit-background-clip: text;
}

.desc {
  color: var(--td-text-color-secondary);
  font: var(--td-font-body-large);
  margin: 0;
  opacity: 0.8;
}

.content-box {
  max-width: var(--nx-max-content-width);
  margin: 0 auto;
  padding: 0 2rem;
  margin-top: 4rem;
}

.option-group {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.option-group > div {
  width: max-content;
  max-width: none;
  flex-wrap: nowrap;
}

.option-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from {
  transform: translateX(20vw);
}

.fade-leave-from {
  opacity: 1;
}

.option-content .card {
  position: relative;
  padding: 2rem 3rem;
  border-radius: 2rem;
  background-color: var(--td-bg-color-container);
  box-shadow: var(--td-box-shadow-1);
  min-height: 300px;
  overflow: hidden;
  border: 1px solid var(--td-border-level-1-color);
  display: flex;
  align-items: center;
}

.option-content .card img {
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.option-content .card .mask {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #ffffff 0%, #ffffff00 80%);
  opacity: 0.8;
  pointer-events: none;
}

.option-content .card p {
  position: relative;
  z-index: 3;
  max-width: 35%;
  font: var(--td-font-body-large);
  margin: 0;
}

@media (max-width: 768px) {
  .title-box {
    padding: 0 1rem;
  }

  .content-box {
    padding: 0 1rem;
  }


  .option-content .card {
    padding: 1rem 2rem;
  }

  .option-content .card .mask {
    background: linear-gradient(to right, #ffffff 60%, #ffffff00 100%);
  }

  .option-content .card p {
    max-width: 100%;
  }
}
</style>
