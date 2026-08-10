import { computed } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n'
import config from '@/config'

const t = i18n.global.t

const routes = computed(() => [
  {
    path: '/',
    redirect: `/${i18n.global.locale.value}`,
  },

  {
    path: '/:locale(zh-CN|zh-TW|en-US)',
    children: [
      {
        path: '',
        component: () => import('@/layouts/WebLayout.vue'),
        children: [
          {
            path: '',
            component: () => import('@/views/HomeView.vue'),
          },
        ],
      },

      {
        path: '',
        component: () => import('@/layouts/AppLayout.vue'),
        children: [
          {
            path: 'dashboard',
            meta: { title: t('dashboard.title') },
            component: () => import('@/views/DashboardView.vue'),
          },
        ],
      },
    ],
  },
])

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes.value,
})

router.beforeEach((to) => {
  // 设置语言
  const locale = to.params.locale

  if (locale && ['zh-CN', 'zh-TW', 'en-US'].includes(locale)) {
    i18n.global.locale.value = locale
  }

  // 设置页面标题
  const title = to.meta.title
  if (title) {
    document.title = `${title} - ${config.appName}`
  } else {
    document.title = `${config.appName} - ${config.slogan}`
  }
})

export default router
