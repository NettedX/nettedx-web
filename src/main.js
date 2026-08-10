import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

import TDesign from 'tdesign-vue-next';

import 'tdesign-vue-next/es/style/index.css';
import '@/css/common.css';


const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.use(TDesign);

app.mount('#app')
