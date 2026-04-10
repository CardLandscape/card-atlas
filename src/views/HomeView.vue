<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">概览</h1>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <StatCard title="银行数量" :value="store.banks.length" icon="Bank" color="blue" />
      <StatCard title="卡产品数量" :value="store.cards.length" icon="CreditCard" color="green" />
      <StatCard title="卡组织数量" :value="store.networks.length" icon="Grid" color="purple" />
      <StatCard title="卡等级数量" :value="store.grades.length" icon="Star" color="orange" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Network distribution chart -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">按卡组织分布</h2>
        <div class="space-y-3">
          <div v-for="network in store.networks" :key="network.id" class="flex items-center gap-3">
            <span class="text-sm text-gray-600 w-20 flex-shrink-0">{{ network.name }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="networkBarColor(network.id)"
                :style="{ width: networkBarWidth(network.id) }"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-700 w-8 text-right">{{ store.cardsByNetwork(network.id).length }}</span>
          </div>
        </div>
      </div>

      <!-- Bank type distribution -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">按银行类型分布</h2>
        <div class="space-y-3">
          <div v-for="type in bankTypes" :key="type.key" class="flex items-center gap-3">
            <span class="text-sm text-gray-600 w-24 flex-shrink-0">{{ type.label }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="type.color"
                :style="{ width: bankTypeWidth(type.key) }"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-700 w-8 text-right">{{ bankTypeCount(type.key) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent cards -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">最新卡产品</h2>
        <router-link to="/cards" class="text-sm text-blue-600 hover:text-blue-800">查看全部 →</router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardItem
          v-for="card in recentCards"
          :key="card.id"
          :card="card"
          @click="$router.push(`/cards/${card.id}`)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCardStore } from '@/stores/cardStore'
import StatCard from '@/components/StatCard.vue'
import CardItem from '@/components/CardItem.vue'

const store = useCardStore()

const recentCards = computed(() => store.cards.slice(0, 6))

const maxNetworkCount = computed(() => {
  return Math.max(...store.networks.map(n => store.cardsByNetwork(n.id).length), 1)
})

function networkBarWidth(networkId: string) {
  const count = store.cardsByNetwork(networkId).length
  return `${(count / maxNetworkCount.value) * 100}%`
}

const barColors = ['bg-red-400', 'bg-blue-400', 'bg-orange-400', 'bg-green-400', 'bg-purple-400', 'bg-indigo-400']
function networkBarColor(networkId: string) {
  const idx = store.networks.findIndex(n => n.id === networkId)
  return barColors[idx % barColors.length]
}

const bankTypes = [
  { key: 'state', label: '国有银行', color: 'bg-blue-400' },
  { key: 'joint-stock', label: '股份制银行', color: 'bg-green-400' },
]

function bankTypeCount(type: string) {
  return store.banks.filter(b => b.type === type).length
}

function bankTypeWidth(type: string) {
  const count = bankTypeCount(type)
  const max = Math.max(store.banks.filter(b => b.type === 'state').length, store.banks.filter(b => b.type === 'joint-stock').length)
  return `${(count / Math.max(max, 1)) * 100}%`
}
</script>
