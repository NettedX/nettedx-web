<template>
  <t-header class="nav-bar-container">
    <t-head-menu class="nav-bar">
      <template #logo>
        <RouterLink class="logo-link" to="/">
          <img src="@/assets/images/logo/text.svg" alt="logo" />
        </RouterLink>
      </template>

      <template #operations>
        <div class="operations">
          <t-button
            v-if="!authStore.isLogined"
            shape="round"
            theme="primary"
            @click="$router.push('/login')"
          >
            <template #icon>
              <LoginIcon />
            </template>
            Login
          </t-button>

          <div v-else class="user-container">
            <t-dropdown
              placement="bottom-right"
              trigger="click"
              :min-column-width="180"
              :max-height="400"
              direction="left"
            >
              <t-dropdown-menu>
                <t-dropdown-item value="nickname" @click="$router.push('/account')">
                  <template #prefixIcon>
                    <UserIcon />
                  </template>
                  {{ authStore.userProfile?.nickname || '未命名用户' }}
                </t-dropdown-item>

                <t-dropdown-item
                  value="logout"
                  theme="error"
                  @click="
                    () => {
                      MessagePlugin.success('已退出登录')
                      authStore.logout()
                    }
                  "
                >
                  <template #prefixIcon>
                    <LogoutIcon />
                  </template>
                  <span>退出登录</span>
                </t-dropdown-item>
              </t-dropdown-menu>
            </t-dropdown>
          </div>
        </div>
      </template>
    </t-head-menu>
  </t-header>
</template>

<script setup>
import { UserIcon, LoginIcon, LogoutIcon } from 'tdesign-icons-vue-next'
import { useAuthStore } from '@/stores/auth'
import { MessagePlugin } from 'tdesign-vue-next'

const authStore = useAuthStore()
</script>

<style scoped>
.nav-bar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(from var(--td-bg-color-container) r g b / 0.8);
  box-shadow: var(--td-box-shadow-1);
  backdrop-filter: blur(10px);
}

.nav-bar {
  background-color: transparent;
}

.logo-link {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-link img {
  height: 32px;
}

.operations {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 1rem;
}
</style>
