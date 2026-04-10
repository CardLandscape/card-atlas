<template>
  <div v-if="card">
    <div class="mb-4">
      <el-button @click="$router.back()" size="small">← 返回</el-button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Card preview area -->
      <div class="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 flex items-center justify-center min-h-48">
        <div v-if="card.imageUrl" class="max-w-sm">
          <img :src="card.imageUrl" :alt="card.name" class="rounded-xl shadow-lg" />
        </div>
        <div v-else class="w-72 h-44 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl shadow-xl flex flex-col justify-between p-6">
          <div class="flex justify-between items-start">
            <span class="text-white font-bold">{{ bank?.shortName }}</span>
            <span class="text-white/80 text-sm">{{ network?.name }}</span>
          </div>
          <div>
            <p class="text-white font-semibold text-lg">{{ card.name }}</p>
            <span :class="gradeBadgeClass" class="grade-badge mt-1">{{ grade?.name }}</span>
          </div>
        </div>
      </div>

      <!-- Card info -->
      <div class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ card.name }}</h1>
            <p class="text-gray-500 mt-1">{{ card.description }}</p>
          </div>
          <div class="flex gap-2">
            <span :class="gradeBadgeClass" class="grade-badge text-sm px-3 py-1">{{ grade?.name }}</span>
            <span class="grade-badge text-sm px-3 py-1 bg-gray-100 text-gray-700">{{ card.cardType === 'credit' ? '信用卡' : '借记卡' }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">银行</h3>
              <p class="text-gray-900">{{ bank?.name }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">卡组织</h3>
              <p class="text-gray-900">{{ network?.name }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">支持币种</h3>
              <div class="flex flex-wrap gap-1">
                <span v-for="c in card.currency" :key="c" class="tag-item">{{ c }}</span>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">年费</h3>
              <p class="text-gray-900">{{ card.annualFee.amount > 0 ? `${card.annualFee.amount} ${card.annualFee.unit}` : '免年费' }}</p>
              <p v-if="card.annualFee.waiver" class="text-sm text-gray-500 mt-0.5">{{ card.annualFee.waiver }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">权益</h3>
              <ul class="space-y-1">
                <li v-for="benefit in card.benefits" :key="benefit" class="flex items-start gap-2 text-sm text-gray-700">
                  <span class="text-green-500 mt-0.5">✓</span>
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">标签</h3>
              <div class="flex flex-wrap">
                <span v-for="tag in card.tags" :key="tag" class="tag-item">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="card.applyUrl" class="mt-6">
          <a :href="card.applyUrl" target="_blank" rel="noopener">
            <el-button type="primary">立即申请</el-button>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-gray-400">
    <p>卡产品不存在</p>
    <el-button class="mt-4" @click="$router.push('/cards')">返回列表</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/cardStore'

const route = useRoute()
const store = useCardStore()

const card = computed(() => store.getCardById(route.params.id as string))
const bank = computed(() => card.value ? store.getBankById(card.value.bankId) : undefined)
const network = computed(() => card.value ? store.getNetworkById(card.value.networkId) : undefined)
const grade = computed(() => card.value ? store.getGradeById(card.value.gradeId) : undefined)

const gradeClassMap: Record<string, string> = {
  standard: 'grade-standard',
  gold: 'grade-gold',
  platinum: 'grade-platinum',
  diamond: 'grade-diamond',
  infinite: 'grade-infinite',
}

const gradeBadgeClass = computed(() => card.value ? (gradeClassMap[card.value.gradeId] || 'grade-standard') : '')
</script>
