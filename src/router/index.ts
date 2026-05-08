import { createRouter, createWebHistory } from 'vue-router'
import CheckIn from '../views/CheckIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'checkin',
      component: CheckIn,
    },
  ],
})

export default router
