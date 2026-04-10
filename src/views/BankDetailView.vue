<template>
  <div v-if="bank">
    <div class="mb-4">
      <el-button @click="$router.back()" size="small">← 返回</el-button>
    </div>

    <!-- Bank info card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold text-gray-900">{{ bank.name }}</h1>
            <span class="text-xs px-2 py-0.5 rounded-full" :class="bank.type === 'state' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'">
              {{ bank.type === 'state' ? '国有银行' : '股份制银行' }}
            </span>
          </div>
          <p class="text-gray-500 text-sm">代码: {{ bank.code }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm">
        <div>
          <span class="text-gray-500">客服热线</span>
          <p class="font-medium text-gray-900 mt-0.5">{{ bank.hotline }}</p>
        </div>
        <div>
          <span class="text-gray-500">官方网站</span>
          <a v-if="bank.website" :href="bank.website" target="_blank" class="block font-medium text-blue-600 hover:underline mt-0.5">{{ bank.website }}</a>
        </div>
        <div>
          <span class="text-gray-500">旗下卡产品</span>
          <p class="font-medium text-gray-900 mt-0.5">{{ bankCards.length }} 张</p>
        </div>
      </div>
    </div>

    <!-- Cards list -->
    <h2 class="text-lg font-semibold text-gray-900 mb-4">旗下卡产品</h2>
    <div v-if="bankCards.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <CardItem
        v-for="card in bankCards"
        :key="card.id"
        :card="card"
        @click="$router.push(`/cards/${card.id}`)"
      />
    </div>
    <div v-else class="bg-white rounded-xl p-8 text-center text-gray-400">
      <p>暂无卡产品数据</p>
    </div>
  </div>
  <div v-else class="text-center py-12 text-gray-400">
    <p>银行不存在</p>
    <el-button class="mt-4" @click="$router.push('/banks')">返回列表</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/cardStore'
import CardItem from '@/components/CardItem.vue'

const route = useRoute()
const store = useCardStore()

const bank = computed(() => store.getBankById(route.params.id as string))
const bankCards = computed(() => bank.value ? store.cardsByBank(bank.value.id) : [])
</script>
