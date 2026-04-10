<template>
  <div class="card-item" @click="$emit('click')">
    <!-- Card header with grade badge -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 truncate">{{ card.name }}</h3>
        <p class="text-sm text-gray-500 mt-0.5">{{ bank?.shortName }}</p>
      </div>
      <span :class="gradeBadgeClass" class="grade-badge ml-2 flex-shrink-0">{{ grade?.name }}</span>
    </div>

    <!-- Network and type -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-xs px-2 py-0.5 rounded bg-gray-50 text-gray-600">{{ network?.name }}</span>
      <span class="text-xs px-2 py-0.5 rounded" :class="card.cardType === 'credit' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'">
        {{ card.cardType === 'credit' ? '信用卡' : '借记卡' }}
      </span>
      <span class="text-xs text-gray-500 ml-auto">
        {{ card.annualFee.amount > 0 ? `¥${card.annualFee.amount}/年` : '免年费' }}
      </span>
    </div>

    <!-- Benefits tags -->
    <div class="flex flex-wrap gap-1">
      <span v-for="benefit in card.benefits.slice(0, 3)" :key="benefit" class="tag-item">{{ benefit }}</span>
      <span v-if="card.benefits.length > 3" class="tag-item">+{{ card.benefits.length - 3 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCardStore } from '@/stores/cardStore'
import type { Card } from '@/types'

const props = defineProps<{ card: Card }>()
defineEmits(['click'])

const store = useCardStore()

const bank = computed(() => store.getBankById(props.card.bankId))
const network = computed(() => store.getNetworkById(props.card.networkId))
const grade = computed(() => store.getGradeById(props.card.gradeId))

const gradeClassMap: Record<string, string> = {
  standard: 'grade-standard',
  gold: 'grade-gold',
  platinum: 'grade-platinum',
  diamond: 'grade-diamond',
  infinite: 'grade-infinite',
}
const gradeBadgeClass = computed(() => gradeClassMap[props.card.gradeId] || 'grade-standard')
</script>
