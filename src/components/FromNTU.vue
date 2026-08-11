<template>
  <section class="bg">
    <div class="overlay" />
    <div class="content">
      <h3>{{ $t('home.fromNTU.title') }}</h3>
      <a href="https://www.ntu.edu.sg/" target="_blank" rel="noopener noreferrer">
        <img src="@/assets/images/logo/ntu-white.png" alt="NTU" />
      </a>
    </div>
  </section>
</template>

<style scoped>
.bg {
  position: relative;
  background-color: var(--td-bg-color-container);
  background-image: url('@/assets/images/bg/ntu.png');
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to left, #d71440, #181c62);
  opacity: 0.8;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.content h3 {
  font: var(--td-font-title-large);
  color: var(--td-text-color-anti);
  margin-top: 0;
  margin-bottom: 1rem;
}

.content a {
  width: fit-content;
}

.content img {
  max-width: 150px;
  height: auto;
}
</style>
