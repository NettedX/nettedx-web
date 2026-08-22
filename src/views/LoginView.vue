<template>
  <section class="login-container">
    <div class="card">
      <div class="image-box">
        <img src="@/assets/images/logo/icon.svg" alt="logo" />
      </div>

      <div class="login-form">
        <h2>{{ $t('login.title') }}</h2>
        <p>{{ $t('login.subtitle') }}</p>

        <t-button
          class="btn"
          theme="primary"
          variant="base"
          size="large"
          shape="round"
          @click="loginSIWE"
        >
          <template #icon>
            <t-icon name="wallet" />
          </template>
          {{ $t('login.btn') }}
        </t-button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { createWalletClient, defineChain, custom } from 'viem'
import api from '@/utils/api'
import config from '@/config'
import { MessagePlugin } from 'tdesign-vue-next'
import { useLocale } from '@/utils/i18n'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const { t } = useLocale()

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

async function loginSIWE() {
  const anvil = defineChain({
    id: 31337,
    name: 'NettedX Chain',
    nativeCurrency: {
      name: 'USDC',
      symbol: '$',
      decimals: 6,
    },
    rpcUrls: {
      default: {
        http: [config.rpcUrl],
      },
    },
  })

  const walletClient = createWalletClient({
    chain: anvil,
    transport: custom(window.ethereum),
  })

  const [address] = await walletClient.requestAddresses()

  console.log(address)

  const res = await api.post('/auth/siwe/nonce', {
    walletAddress: address,
    chainId: 31337,
  })

  if (res.data.code !== 200) {
    MessagePlugin.error(t('login.msg.failedGetNonce'))
    return
  }

  const { message } = res.data.data

  const signature = await walletClient.signMessage({
    account: address,
    message: message,
  })

  const verifyRes = await api.post('/auth/siwe/verify', {
    message,
    signature,
  })

  if (verifyRes.data.code === 200) {
    MessagePlugin.success(t('login.msg.success'))
    authStore.accessToken = verifyRes.data.data.access
    authStore.refreshToken = verifyRes.data.data.refresh
    await authStore.requestUserProfile()
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    MessagePlugin.error(t('login.msg.failedVerify'))
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100svh - 3.5rem);
  background-color: var(--td-bg-color-container);
  background-image: url('@/assets/images/bg/login.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem;
  box-sizing: border-box;
}

.card {
  width: 100%;
  box-sizing: border-box;
  max-width: 800px;
  background-color: var(--td-bg-color-container);
  border-radius: 2rem;
  box-shadow: var(--td-shadow-3);
  display: flex;
  flex-direction: row;
}

.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.image-box img {
  width: 100%;
  max-width: 120px;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 4rem 4rem 0;
}

.login-form h2 {
  font: var(--td-font-headline-medium);
  color: var(--td-text-color-primary);
  margin: 0;
}

.login-form p {
  font: var(--td-font-body-large);
  color: var(--td-text-color-secondary);
  margin: 0;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }

  .card {
    flex-direction: column;
    padding: 3rem 2rem;
  }

  .image-box {
    padding: 0;
    margin-bottom: 2rem;
  }

  .login-form {
    padding: 0;
    text-align: center;
  }
}
</style>
