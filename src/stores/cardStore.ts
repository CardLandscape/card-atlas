import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bank, Card, CardGrade, CardNetwork, FilterState } from '@/types'
import banksData from '@/data/banks.json'
import networksData from '@/data/networks.json'
import gradesData from '@/data/grades.json'
import cardsData from '@/data/cards.json'

const LS_KEY = 'card-atlas-data'

export const useCardStore = defineStore('card', () => {
  const banks = ref<Bank[]>([])
  const networks = ref<CardNetwork[]>([])
  const grades = ref<CardGrade[]>([])
  const cards = ref<Card[]>([])
  const selectedCard = ref<Card | null>(null)
  const loading = ref(false)

  const filter = ref<FilterState>({
    bankId: '', networkId: '', gradeId: '', cardType: '', keyword: '', sortBy: 'default',
  })

  function saveToLocal() {
    localStorage.setItem(LS_KEY, JSON.stringify({
      banks: banks.value,
      networks: networks.value,
      grades: grades.value,
      cards: cards.value,
    }))
  }

  function loadData() {
    loading.value = true
    const stored = localStorage.getItem(LS_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        banks.value = data.banks || (banksData as Bank[])
        networks.value = data.networks || (networksData as CardNetwork[])
        grades.value = data.grades || (gradesData as CardGrade[])
        cards.value = data.cards || (cardsData as Card[])
      } catch {
        banks.value = banksData as Bank[]
        networks.value = networksData as CardNetwork[]
        grades.value = gradesData as CardGrade[]
        cards.value = cardsData as Card[]
      }
    } else {
      banks.value = banksData as Bank[]
      networks.value = networksData as CardNetwork[]
      grades.value = gradesData as CardGrade[]
      cards.value = cardsData as Card[]
    }
    loading.value = false
  }

  function resetToDefault() {
    localStorage.removeItem(LS_KEY)
    banks.value = banksData as Bank[]
    networks.value = networksData as CardNetwork[]
    grades.value = gradesData as CardGrade[]
    cards.value = cardsData as Card[]
  }

  function exportData() {
    const data = { banks: banks.value, networks: networks.value, grades: grades.value, cards: cards.value }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `card-atlas-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(json: { banks?: Bank[]; networks?: CardNetwork[]; grades?: CardGrade[]; cards?: Card[] }) {
    if (json.banks) banks.value = json.banks
    if (json.networks) networks.value = json.networks
    if (json.grades) grades.value = json.grades
    if (json.cards) cards.value = json.cards
    saveToLocal()
  }

  // Bank CRUD
  function addBank(bank: Bank) { banks.value.push(bank); saveToLocal() }
  function updateBank(bank: Bank) {
    const idx = banks.value.findIndex(b => b.id === bank.id)
    if (idx >= 0) { banks.value[idx] = bank; saveToLocal() }
  }
  function deleteBank(id: string) { banks.value = banks.value.filter(b => b.id !== id); saveToLocal() }

  // Network CRUD
  function addNetwork(network: CardNetwork) { networks.value.push(network); saveToLocal() }
  function updateNetwork(network: CardNetwork) {
    const idx = networks.value.findIndex(n => n.id === network.id)
    if (idx >= 0) { networks.value[idx] = network; saveToLocal() }
  }
  function deleteNetwork(id: string) { networks.value = networks.value.filter(n => n.id !== id); saveToLocal() }

  // Grade CRUD
  function addGrade(grade: CardGrade) { grades.value.push(grade); saveToLocal() }
  function updateGrade(grade: CardGrade) {
    const idx = grades.value.findIndex(g => g.id === grade.id)
    if (idx >= 0) { grades.value[idx] = grade; saveToLocal() }
  }
  function deleteGrade(id: string) { grades.value = grades.value.filter(g => g.id !== id); saveToLocal() }

  // Card CRUD
  function addCard(card: Card) { cards.value.push(card); saveToLocal() }
  function updateCard(card: Card) {
    const idx = cards.value.findIndex(c => c.id === card.id)
    if (idx >= 0) { cards.value[idx] = card; saveToLocal() }
  }
  function deleteCard(id: string) { cards.value = cards.value.filter(c => c.id !== id); saveToLocal() }

  function setFilter(partial: Partial<FilterState>) { filter.value = { ...filter.value, ...partial } }
  function resetFilter() {
    filter.value = { bankId: '', networkId: '', gradeId: '', cardType: '', keyword: '', sortBy: 'default' }
  }
  function selectCard(card: Card | null) { selectedCard.value = card }

  const filteredCards = computed(() => {
    let result = [...cards.value]
    if (filter.value.bankId) result = result.filter(c => c.bankId === filter.value.bankId)
    if (filter.value.networkId) result = result.filter(c => c.networkId === filter.value.networkId)
    if (filter.value.gradeId) result = result.filter(c => c.gradeId === filter.value.gradeId)
    if (filter.value.cardType) result = result.filter(c => c.cardType === filter.value.cardType)
    if (filter.value.keyword) {
      const kw = filter.value.keyword.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(kw) ||
        c.tags.some(t => t.toLowerCase().includes(kw)) ||
        c.benefits.some(b => b.toLowerCase().includes(kw)) ||
        getBankById(c.bankId)?.name.toLowerCase().includes(kw)
      )
    }
    if (filter.value.sortBy === 'annualFee') result.sort((a, b) => a.annualFee.amount - b.annualFee.amount)
    else if (filter.value.sortBy === 'grade') {
      result.sort((a, b) => {
        const ga = getGradeById(a.gradeId)?.tier ?? 0
        const gb = getGradeById(b.gradeId)?.tier ?? 0
        return gb - ga
      })
    }
    return result
  })

  const cardsByBank = computed(() => (bankId: string) => cards.value.filter(c => c.bankId === bankId))
  const cardsByNetwork = computed(() => (networkId: string) => cards.value.filter(c => c.networkId === networkId))
  const cardsByGrade = computed(() => (gradeId: string) => cards.value.filter(c => c.gradeId === gradeId))

  function getBankById(id: string): Bank | undefined { return banks.value.find(b => b.id === id) }
  function getNetworkById(id: string): CardNetwork | undefined { return networks.value.find(n => n.id === id) }
  function getGradeById(id: string): CardGrade | undefined { return grades.value.find(g => g.id === id) }
  function getCardById(id: string): Card | undefined { return cards.value.find(c => c.id === id) }

  return {
    banks, networks, grades, cards, selectedCard, loading, filter,
    filteredCards, cardsByBank, cardsByNetwork, cardsByGrade,
    loadData, saveToLocal, resetToDefault, exportData, importData,
    addBank, updateBank, deleteBank,
    addNetwork, updateNetwork, deleteNetwork,
    addGrade, updateGrade, deleteGrade,
    addCard, updateCard, deleteCard,
    setFilter, resetFilter, selectCard,
    getBankById, getNetworkById, getGradeById, getCardById,
  }
})
