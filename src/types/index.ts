export interface Bank {
  id: string
  name: string
  shortName: string
  code: string
  type: 'state' | 'joint-stock'
  logo: string
  website: string
  hotline: string
}

export interface CardNetwork {
  id: string
  name: string
  code: string
  logo: string
}

export interface CardGrade {
  id: string
  name: string
  tier: number
  description: string
}

export interface AnnualFee {
  amount: number
  unit: string
  waiver: string
}

export interface Card {
  id: string
  bankId: string
  networkId: string
  gradeId: string
  name: string
  cardType: 'credit' | 'debit'
  currency: string[]
  annualFee: AnnualFee
  benefits: string[]
  applyUrl: string
  imageUrl: string
  description: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface FilterState {
  bankId: string
  networkId: string
  gradeId: string
  cardType: string
  keyword: string
  sortBy: 'default' | 'annualFee' | 'grade'
}
