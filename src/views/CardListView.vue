<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">卡产品列表</h1>
      <span class="text-sm text-gray-500">共 {{ store.filteredCards.length }} 张卡</span>
    </div>

    <!-- Filter Panel -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <el-select v-model="filter.bankId" placeholder="选择银行" clearable size="small" @change="applyFilter">
          <el-option v-for="b in store.banks" :key="b.id" :label="b.shortName" :value="b.id" />
        </el-select>
        <el-select v-model="filter.networkId" placeholder="卡组织" clearable size="small" @change="applyFilter">
          <el-option v-for="n in store.networks" :key="n.id" :label="n.name" :value="n.id" />
        </el-select>
        <el-select v-model="filter.gradeId" placeholder="卡等级" clearable size="small" @change="applyFilter">
          <el-option v-for="g in store.grades" :key="g.id" :label="g.name" :value="g.id" />
        </el-select>
        <el-select v-model="filter.cardType" placeholder="卡类型" clearable size="small" @change="applyFilter">
          <el-option label="信用卡" value="credit" />
          <el-option label="借记卡" value="debit" />
        </el-select>
        <el-select v-model="filter.sortBy" placeholder="排序" size="small" @change="applyFilter">
          <el-option label="默认排序" value="default" />
          <el-option label="按年费排序" value="annualFee" />
          <el-option label="按等级排序" value="grade" />
        </el-select>
        <el-input v-model="filter.keyword" placeholder="搜索关键词" clearable size="small" @input="applyFilter" @clear="applyFilter">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
      </div>
      <div class="mt-2 flex justify-end">
        <el-button size="small" @click="resetFilter">重置筛选</el-button>
      </div>
    </div>

    <!-- Card Grid -->
    <div v-if="store.filteredCards.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <CardItem
        v-for="card in store.filteredCards"
        :key="card.id"
        :card="card"
        @click="$router.push(`/cards/${card.id}`)"
      />
    </div>
    <div v-else class="bg-white rounded-xl p-12 text-center text-gray-400">
      <el-icon size="48" class="mb-3"><CreditCard /></el-icon>
      <p>暂无符合条件的卡产品</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useCardStore } from '@/stores/cardStore'
import CardItem from '@/components/CardItem.vue'
import type { FilterState } from '@/types'

const store = useCardStore()

const filter = reactive<FilterState>({ ...store.filter })

function applyFilter() {
  store.setFilter({ ...filter })
}

function resetFilter() {
  filter.bankId = ''
  filter.networkId = ''
  filter.gradeId = ''
  filter.cardType = ''
  filter.keyword = ''
  filter.sortBy = 'default'
  store.resetFilter()
}
</script>
