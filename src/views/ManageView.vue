<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">数据管理</h1>
      <div class="flex gap-2">
        <el-button size="small" type="success" @click="exportData">
          <el-icon><Download /></el-icon> 导出数据
        </el-button>
        <el-button size="small" type="warning" @click="triggerImport">
          <el-icon><Upload /></el-icon> 导入数据
        </el-button>
        <el-button size="small" type="danger" @click="confirmReset">
          <el-icon><RefreshLeft /></el-icon> 重置默认
        </el-button>
        <input ref="fileInput" type="file" accept=".json" class="hidden" @change="importData" />
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <el-tabs v-model="activeTab" class="p-4">
        <!-- Bank management tab -->
        <el-tab-pane label="银行管理" name="banks">
          <div class="flex justify-end mb-3">
            <el-button type="primary" size="small" @click="openBankDialog()">
              <el-icon><Plus /></el-icon> 添加银行
            </el-button>
          </div>
          <el-table :data="store.banks" size="small" border>
            <el-table-column prop="code" label="代码" width="80" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="shortName" label="简称" width="100" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.type === 'state' ? 'primary' : 'success'" size="small">
                  {{ row.type === 'state' ? '国有' : '股份制' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="hotline" label="热线" width="100" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button size="small" @click="openBankDialog(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteBank(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Network management tab -->
        <el-tab-pane label="卡组织管理" name="networks">
          <div class="flex justify-end mb-3">
            <el-button type="primary" size="small" @click="openNetworkDialog()">
              <el-icon><Plus /></el-icon> 添加卡组织
            </el-button>
          </div>
          <el-table :data="store.networks" size="small" border>
            <el-table-column prop="id" label="ID" width="120" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="代码" width="120" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button size="small" @click="openNetworkDialog(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteNetwork(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Grade management tab -->
        <el-tab-pane label="卡等级管理" name="grades">
          <div class="flex justify-end mb-3">
            <el-button type="primary" size="small" @click="openGradeDialog()">
              <el-icon><Plus /></el-icon> 添加等级
            </el-button>
          </div>
          <el-table :data="store.grades" size="small" border>
            <el-table-column prop="id" label="ID" width="120" />
            <el-table-column prop="name" label="名称" width="100" />
            <el-table-column prop="tier" label="Tier" width="80" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button size="small" @click="openGradeDialog(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteGrade(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Card management tab -->
        <el-tab-pane label="卡产品管理" name="cards">
          <div class="flex justify-end mb-3">
            <el-button type="primary" size="small" @click="openCardDialog()">
              <el-icon><Plus /></el-icon> 添加卡产品
            </el-button>
          </div>
          <el-table :data="store.cards" size="small" border>
            <el-table-column prop="name" label="卡名" />
            <el-table-column label="银行" width="100">
              <template #default="{ row }">{{ store.getBankById(row.bankId)?.shortName }}</template>
            </el-table-column>
            <el-table-column label="卡组织" width="90">
              <template #default="{ row }">{{ store.getNetworkById(row.networkId)?.name }}</template>
            </el-table-column>
            <el-table-column label="等级" width="80">
              <template #default="{ row }">{{ store.getGradeById(row.gradeId)?.name }}</template>
            </el-table-column>
            <el-table-column label="类型" width="80">
              <template #default="{ row }">{{ row.cardType === 'credit' ? '信用卡' : '借记卡' }}</template>
            </el-table-column>
            <el-table-column label="年费" width="80">
              <template #default="{ row }">{{ row.annualFee.amount > 0 ? row.annualFee.amount : '免费' }}</template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button size="small" @click="openCardDialog(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteCard(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Bank dialog -->
    <el-dialog v-model="bankDialogVisible" :title="editingBank?.id ? '编辑银行' : '添加银行'" width="500px">
      <el-form :model="bankForm" label-width="80px" size="small">
        <el-form-item label="ID">
          <el-input v-model="bankForm.id" :disabled="!!editingBank?.id" placeholder="英文小写，如 icbc" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="bankForm.name" placeholder="如 中国工商银行" />
        </el-form-item>
        <el-form-item label="简称">
          <el-input v-model="bankForm.shortName" placeholder="如 工商银行" />
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="bankForm.code" placeholder="如 ICBC" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="bankForm.type">
            <el-option label="国有银行" value="state" />
            <el-option label="股份制银行" value="joint-stock" />
          </el-select>
        </el-form-item>
        <el-form-item label="热线">
          <el-input v-model="bankForm.hotline" />
        </el-form-item>
        <el-form-item label="官网">
          <el-input v-model="bankForm.website" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bankDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBank">保存</el-button>
      </template>
    </el-dialog>

    <!-- Network dialog -->
    <el-dialog v-model="networkDialogVisible" :title="editingNetwork?.id ? '编辑卡组织' : '添加卡组织'" width="400px">
      <el-form :model="networkForm" label-width="60px" size="small">
        <el-form-item label="ID">
          <el-input v-model="networkForm.id" :disabled="!!editingNetwork?.id" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="networkForm.name" />
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="networkForm.code" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="networkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNetwork">保存</el-button>
      </template>
    </el-dialog>

    <!-- Grade dialog -->
    <el-dialog v-model="gradeDialogVisible" :title="editingGrade?.id ? '编辑等级' : '添加等级'" width="400px">
      <el-form :model="gradeForm" label-width="60px" size="small">
        <el-form-item label="ID">
          <el-input v-model="gradeForm.id" :disabled="!!editingGrade?.id" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="gradeForm.name" />
        </el-form-item>
        <el-form-item label="Tier">
          <el-input-number v-model="gradeForm.tier" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="gradeForm.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="gradeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGrade">保存</el-button>
      </template>
    </el-dialog>

    <!-- Card dialog -->
    <el-dialog v-model="cardDialogVisible" :title="editingCard?.id ? '编辑卡产品' : '添加卡产品'" width="600px">
      <el-form :model="cardForm" label-width="80px" size="small">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="ID">
              <el-input v-model="cardForm.id" :disabled="!!editingCard?.id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡名">
              <el-input v-model="cardForm.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="银行">
              <el-select v-model="cardForm.bankId" class="w-full">
                <el-option v-for="b in store.banks" :key="b.id" :label="b.shortName" :value="b.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡组织">
              <el-select v-model="cardForm.networkId" class="w-full">
                <el-option v-for="n in store.networks" :key="n.id" :label="n.name" :value="n.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="等级">
              <el-select v-model="cardForm.gradeId" class="w-full">
                <el-option v-for="g in store.grades" :key="g.id" :label="g.name" :value="g.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡类型">
              <el-select v-model="cardForm.cardType" class="w-full">
                <el-option label="信用卡" value="credit" />
                <el-option label="借记卡" value="debit" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="年费(元)">
              <el-input-number v-model="cardForm.annualFee.amount" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="减免条件">
              <el-input v-model="cardForm.annualFee.waiver" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="支持币种">
          <el-input v-model="currencyInput" placeholder="用逗号分隔，如 CNY,USD" />
        </el-form-item>
        <el-form-item label="权益">
          <el-input v-model="benefitsInput" type="textarea" :rows="2" placeholder="每行一条权益" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="tagsInput" placeholder="用逗号分隔" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="cardForm.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cardDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCard">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCardStore } from '@/stores/cardStore'
import type { Bank, CardNetwork, CardGrade, Card } from '@/types'

const store = useCardStore()
const activeTab = ref('cards')
const fileInput = ref<HTMLInputElement>()

// --- Bank ---
const bankDialogVisible = ref(false)
const editingBank = ref<Bank | null>(null)
const bankForm = reactive<Bank>({ id: '', name: '', shortName: '', code: '', type: 'joint-stock', logo: '', website: '', hotline: '' })

function openBankDialog(bank?: Bank) {
  editingBank.value = bank || null
  if (bank) Object.assign(bankForm, { ...bank })
  else Object.assign(bankForm, { id: '', name: '', shortName: '', code: '', type: 'joint-stock', logo: '', website: '', hotline: '' })
  bankDialogVisible.value = true
}

function saveBank() {
  if (!bankForm.id || !bankForm.name) return ElMessage.warning('ID和名称不能为空')
  if (editingBank.value?.id) store.updateBank({ ...bankForm })
  else store.addBank({ ...bankForm })
  bankDialogVisible.value = false
  ElMessage.success('保存成功')
}

function deleteBank(id: string) {
  ElMessageBox.confirm('确认删除该银行吗？', '警告', { type: 'warning' }).then(() => {
    store.deleteBank(id)
    ElMessage.success('删除成功')
  })
}

// --- Network ---
const networkDialogVisible = ref(false)
const editingNetwork = ref<CardNetwork | null>(null)
const networkForm = reactive<CardNetwork>({ id: '', name: '', code: '', logo: '' })

function openNetworkDialog(network?: CardNetwork) {
  editingNetwork.value = network || null
  if (network) Object.assign(networkForm, { ...network })
  else Object.assign(networkForm, { id: '', name: '', code: '', logo: '' })
  networkDialogVisible.value = true
}

function saveNetwork() {
  if (!networkForm.id || !networkForm.name) return ElMessage.warning('ID和名称不能为空')
  if (editingNetwork.value?.id) store.updateNetwork({ ...networkForm })
  else store.addNetwork({ ...networkForm })
  networkDialogVisible.value = false
  ElMessage.success('保存成功')
}

function deleteNetwork(id: string) {
  ElMessageBox.confirm('确认删除该卡组织吗？', '警告', { type: 'warning' }).then(() => {
    store.deleteNetwork(id)
    ElMessage.success('删除成功')
  })
}

// --- Grade ---
const gradeDialogVisible = ref(false)
const editingGrade = ref<CardGrade | null>(null)
const gradeForm = reactive<CardGrade>({ id: '', name: '', tier: 1, description: '' })

function openGradeDialog(grade?: CardGrade) {
  editingGrade.value = grade || null
  if (grade) Object.assign(gradeForm, { ...grade })
  else Object.assign(gradeForm, { id: '', name: '', tier: 1, description: '' })
  gradeDialogVisible.value = true
}

function saveGrade() {
  if (!gradeForm.id || !gradeForm.name) return ElMessage.warning('ID和名称不能为空')
  if (editingGrade.value?.id) store.updateGrade({ ...gradeForm })
  else store.addGrade({ ...gradeForm })
  gradeDialogVisible.value = false
  ElMessage.success('保存成功')
}

function deleteGrade(id: string) {
  ElMessageBox.confirm('确认删除该等级吗？', '警告', { type: 'warning' }).then(() => {
    store.deleteGrade(id)
    ElMessage.success('删除成功')
  })
}

// --- Card ---
const cardDialogVisible = ref(false)
const editingCard = ref<Card | null>(null)
const cardForm = reactive<Card>({
  id: '', bankId: '', networkId: '', gradeId: '', name: '',
  cardType: 'credit', currency: ['CNY'],
  annualFee: { amount: 0, unit: 'CNY/年', waiver: '' },
  benefits: [], applyUrl: '', imageUrl: '', description: '', tags: [],
  createdAt: '', updatedAt: ''
})
const currencyInput = ref('CNY')
const benefitsInput = ref('')
const tagsInput = ref('')

function openCardDialog(card?: Card) {
  editingCard.value = card || null
  if (card) {
    Object.assign(cardForm, JSON.parse(JSON.stringify(card)))
    currencyInput.value = card.currency.join(',')
    benefitsInput.value = card.benefits.join('\n')
    tagsInput.value = card.tags.join(',')
  } else {
    Object.assign(cardForm, {
      id: '', bankId: '', networkId: '', gradeId: '', name: '',
      cardType: 'credit', currency: ['CNY'],
      annualFee: { amount: 0, unit: 'CNY/年', waiver: '' },
      benefits: [], applyUrl: '', imageUrl: '', description: '', tags: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    })
    currencyInput.value = 'CNY'
    benefitsInput.value = ''
    tagsInput.value = ''
  }
  cardDialogVisible.value = true
}

function saveCard() {
  if (!cardForm.id || !cardForm.name) return ElMessage.warning('ID和卡名不能为空')
  cardForm.currency = currencyInput.value.split(',').map(s => s.trim()).filter(Boolean)
  cardForm.benefits = benefitsInput.value.split('\n').map(s => s.trim()).filter(Boolean)
  cardForm.tags = tagsInput.value.split(',').map(s => s.trim()).filter(Boolean)
  cardForm.updatedAt = new Date().toISOString().slice(0, 10)
  if (editingCard.value?.id) store.updateCard({ ...cardForm, annualFee: { ...cardForm.annualFee } })
  else {
    cardForm.createdAt = new Date().toISOString().slice(0, 10)
    store.addCard({ ...cardForm, annualFee: { ...cardForm.annualFee } })
  }
  cardDialogVisible.value = false
  ElMessage.success('保存成功')
}

function deleteCard(id: string) {
  ElMessageBox.confirm('确认删除该卡产品吗？', '警告', { type: 'warning' }).then(() => {
    store.deleteCard(id)
    ElMessage.success('删除成功')
  })
}

// --- Global actions ---
function exportData() {
  store.exportData()
}

function triggerImport() {
  fileInput.value?.click()
}

function importData(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      store.importData(json)
      ElMessage.success('导入成功')
    } catch {
      ElMessage.error('JSON文件格式错误')
    }
  }
  reader.readAsText(file)
  ;(event.target as HTMLInputElement).value = ''
}

function confirmReset() {
  ElMessageBox.confirm('确认重置为默认数据吗？所有自定义修改将丢失！', '警告', { type: 'warning' }).then(() => {
    store.resetToDefault()
    ElMessage.success('已重置为默认数据')
  })
}
</script>
