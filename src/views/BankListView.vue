<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">银行列表</h1>

    <div class="space-y-8">
      <div v-for="type in bankTypes" :key="type.key">
        <h2 class="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span class="w-1 h-5 rounded" :class="type.accent"></span>
          {{ type.label }}
          <span class="text-sm font-normal text-gray-400">({{ banksByType(type.key).length }}家)</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="bank in banksByType(type.key)"
            :key="bank.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="$router.push(`/banks/${bank.id}`)"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900">{{ bank.name }}</h3>
                <p class="text-sm text-gray-500 mt-0.5">{{ bank.code }}</p>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full" :class="type.badge">{{ type.label.slice(0, 2) }}</span>
            </div>
            <div class="mt-3 flex items-center justify-between text-sm">
              <span class="text-gray-500">热线: {{ bank.hotline }}</span>
              <span class="text-blue-600 font-medium">{{ store.cardsByBank(bank.id).length }} 张卡</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCardStore } from '@/stores/cardStore'

const store = useCardStore()

const bankTypes = [
  { key: 'state', label: '国有银行', accent: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
  { key: 'joint-stock', label: '股份制银行', accent: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
]

function banksByType(type: string) {
  return store.banks.filter(b => b.type === type)
}
</script>
