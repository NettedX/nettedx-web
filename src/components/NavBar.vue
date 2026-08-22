<template>
  <t-header class="nav-bar-container">
    <t-head-menu class="nav-bar">
      <template #logo>
        <RouterLink class="logo-link" to="/">
          <img src="@/assets/images/logo/text.svg" alt="logo" />
        </RouterLink>
      </template>

      <template v-if="$route.path !== '/login'" #operations>
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
            {{ $t('navbar.btn.login') }}
          </t-button>

          <div v-else>
            <t-dropdown
              placement="bottom-right"
              trigger="click"
              :min-column-width="180"
              :max-height="400"
              direction="left"
            >
              <t-avatar class="user-avatar" :size="32">
                <template #icon>
                  <UserIcon />
                </template>
              </t-avatar>

              <t-dropdown-menu>
                <t-dropdown-item value="displayName" @click="$router.push('/account')">
                  <template #prefixIcon>
                    <UserIcon />
                  </template>
                  {{ authStore.userProfile?.displayName }}
                </t-dropdown-item>

                <t-dropdown-item value="dashboard" @click="$router.push('/dashboard')">
                  <template #prefixIcon>
                    <Dashboard1Icon />
                  </template>
                  <span>{{ $t('navbar.item.dashboard') }}</span>
                </t-dropdown-item>

                <t-dropdown-item
                  value="logout"
                  theme="error"
                  @click="
                    () => {
                      MessagePlugin.success($t('navbar.msg.logout'))
                      authStore.logout()
                    }
                  "
                >
                  <template #prefixIcon>
                    <LogoutIcon />
                  </template>
                  <span>{{ $t('navbar.item.logout') }}</span>
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
import { UserIcon, LoginIcon, LogoutIcon, Dashboard1Icon } from 'tdesign-icons-vue-next'
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

.user-avatar {
  cursor: pointer;
}
</style>
