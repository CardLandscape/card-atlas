import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/cards', name: 'cards', component: () => import('@/views/CardListView.vue') },
    { path: '/cards/:id', name: 'card-detail', component: () => import('@/views/CardDetailView.vue') },
    { path: '/banks', name: 'banks', component: () => import('@/views/BankListView.vue') },
    { path: '/banks/:id', name: 'bank-detail', component: () => import('@/views/BankDetailView.vue') },
    { path: '/manage', name: 'manage', component: () => import('@/views/ManageView.vue') },
  ],
})

export default router
