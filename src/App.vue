<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">CA</span>
              </div>
              <span class="font-bold text-lg text-gray-900">CardAtlas</span>
              <span class="text-sm text-gray-500 hidden sm:block">银行卡图鉴</span>
            </router-link>
          </div>
          <nav class="flex space-x-1">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.path === item.path ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              {{ item.label }}
            </router-link>
          </nav>
        </div>
      </div>
    </header>
    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>CardAtlas 银行卡图鉴 © 2026 · 数据仅供参考</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCardStore } from '@/stores/cardStore'

const store = useCardStore()
const navItems = [
  { path: '/', label: '首页' },
  { path: '/cards', label: '卡产品' },
  { path: '/banks', label: '银行列表' },
  { path: '/manage', label: '管理' },
]

onMounted(() => {
  store.loadData()
})
</script>
