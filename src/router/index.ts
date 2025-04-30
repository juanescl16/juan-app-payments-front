import { createRouter, createWebHistory } from 'vue-router'

import ProductPage from '@/pages/ProductPage.vue'
import SummaryPage from '@/pages/SummaryPage.vue'
import ResultPage from '@/pages/ResultPage.vue'

const routes = [
  { path: '/', name: 'Product', component: ProductPage },
  { path: '/summary', name: 'Summary', component: SummaryPage },
  { path: '/result', name: 'Result', component: ResultPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
