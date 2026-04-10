<template>
  <div class="stat-card">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-3xl font-bold mt-1" :class="valueColor">{{ value }}</p>
      </div>
      <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="iconBg">
        <el-icon size="20" :class="iconColor"><component :is="icon" /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  icon?: string
  color?: string
}>()

const colorMap: Record<string, { value: string; iconBg: string; iconColor: string }> = {
  blue: { value: 'text-blue-600', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  green: { value: 'text-green-600', iconBg: 'bg-green-50', iconColor: 'text-green-500' },
  purple: { value: 'text-purple-600', iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
  orange: { value: 'text-orange-600', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
}

const colors = computed(() => colorMap[props.color || 'blue'] || colorMap.blue)
const valueColor = computed(() => colors.value.value)
const iconBg = computed(() => colors.value.iconBg)
const iconColor = computed(() => colors.value.iconColor)
</script>
