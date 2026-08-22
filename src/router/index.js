import { computed } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n'
import config from '@/config'
import { useAuthStore } from '@/stores/auth'

const t = i18n.global.t

const routes = computed(() => [
  {
    path: '',
    component: () => import('@/layouts/WebLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: '/login',
        component: () => import('@/views/LoginView.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/NotFoundView.vue'),
      },
    ],
  },

  {
    path: '',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        meta: { title: t('dashboard.title') },
        component: () => import('@/views/DashboardView.vue'),
      },
    ],
  },
])

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes.value,
  scrollBehavior: (to) => {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
          })
        }, 100)
      })
    }

    return { top: 0 }
  },
})

router.beforeEach((to) => {
  // 设置页面标题
  const title = to.meta.title
  if (title) {
    document.title = `${title} - ${config.appName}`
  } else {
    document.title = `${config.appName} - ${t('slogan')}`
  }

  const authStore = useAuthStore()

  // login
  if (to.path === '/login' && authStore.isLogined) {
    router.push('/dashboard')
  }

  // requires auth
  if (to.meta.requiresAuth && !authStore.isLogined) {
    const redirect = encodeURIComponent(to.fullPath)
    router.push(`/login?redirect=${redirect}`)
  }
})

export default router
