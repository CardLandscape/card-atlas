import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bank, Card, CardGrade, CardNetwork, FilterState } from '@/types'
import banksData from '@/data/banks.json'
import networksData from '@/data/networks.json'
import gradesData from '@/data/grades.json'
import cardsData from '@/data/cards.json'

export const useCardStore = defineStore('card', () => {
  // State
  const banks = ref<Bank[]>([])
  const networks = ref<CardNetwork[]>([])
  const grades = ref<CardGrade[]>([])
  const cards = ref<Card[]>([])
  const selectedCard = ref<Card | null>(null)
  const loading = ref(false)

  const filter = ref<FilterState>({
    bankId: '',
    networkId: '',
    gradeId: '',
    cardType: '',
    keyword: '',
    sortBy: 'default',
  })

  // Actions
  function loadData() {
    loading.value = true
    banks.value = banksData as Bank[]
    networks.value = networksData as CardNetwork[]
    grades.value = gradesData as CardGrade[]
    cards.value = cardsData as Card[]
    loading.value = false
  }

  function setFilter(partial: Partial<FilterState>) {
    filter.value = { ...filter.value, ...partial }
  }

  function resetFilter() {
    filter.value = {
      bankId: '',
      networkId: '',
      gradeId: '',
      cardType: '',
      keyword: '',
      sortBy: 'default',
    }
  }

  function selectCard(card: Card | null) {
    selectedCard.value = card
  }

  // Getters
  const filteredCards = computed(() => {
    let result = [...cards.value]

    if (filter.value.bankId) {
      result = result.filter((c) => c.bankId === filter.value.bankId)
    }
    if (filter.value.networkId) {
      result = result.filter((c) => c.networkId === filter.value.networkId)
    }
    if (filter.value.gradeId) {
      result = result.filter((c) => c.gradeId === filter.value.gradeId)
    }
    if (filter.value.cardType) {
      result = result.filter((c) => c.cardType === filter.value.cardType)
    }
    if (filter.value.keyword) {
      const kw = filter.value.keyword.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          c.tags.some((t) => t.toLowerCase().includes(kw)) ||
          c.benefits.some((b) => b.toLowerCase().includes(kw)) ||
          getBankById(c.bankId)?.name.toLowerCase().includes(kw)
      )
    }

    if (filter.value.sortBy === 'annualFee') {
      result.sort((a, b) => a.annualFee.amount - b.annualFee.amount)
    } else if (filter.value.sortBy === 'grade') {
      result.sort((a, b) => {
        const ga = getGradeById(a.gradeId)?.tier ?? 0
        const gb = getGradeById(b.gradeId)?.tier ?? 0
        return gb - ga
      })
    }

    return result
  })

  const cardsByBank = computed(() => (bankId: string) =>
    cards.value.filter((c) => c.bankId === bankId)
  )

  const cardsByNetwork = computed(() => (networkId: string) =>
    cards.value.filter((c) => c.networkId === networkId)
  )

  const cardsByGrade = computed(() => (gradeId: string) =>
    cards.value.filter((c) => c.gradeId === gradeId)
  )

  function getBankById(id: string): Bank | undefined {
    return banks.value.find((b) => b.id === id)
  }

  function getNetworkById(id: string): CardNetwork | undefined {
    return networks.value.find((n) => n.id === id)
  }

  function getGradeById(id: string): CardGrade | undefined {
    return grades.value.find((g) => g.id === id)
  }

  function getCardById(id: string): Card | undefined {
    return cards.value.find((c) => c.id === id)
  }

  return {
    banks,
    networks,
    grades,
    cards,
    selectedCard,
    loading,
    filter,
    filteredCards,
    cardsByBank,
    cardsByNetwork,
    cardsByGrade,
    loadData,
    setFilter,
    resetFilter,
    selectCard,
    getBankById,
    getNetworkById,
    getGradeById,
    getCardById,
  }
})
