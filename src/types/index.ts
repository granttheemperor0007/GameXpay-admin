import type React from 'react'

export type GameStatus = 'active' | 'inactive'
export type OrderStatus = 'completed' | 'pending' | 'cancelled'
export type PaymentStatus = 'success' | 'failed' | 'abandoned'
export type TransactionStatus = 'success' | 'failed' | 'abandoned'
export type UserRole = 'superadmin' | 'admin'
export type ToastType = 'success' | 'error' | 'warning'
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
export type KycLevel = 'None' | 'Basic' | 'Full'

export interface Bundle {
  id: string
  name: string
  sellingPrice: number
  costPrice: number
}

export interface Game {
  id: string
  name: string
  shortName: string
  image: string
  redemptionInstructions: string
  status: GameStatus
  createdAt: string
  bundles: Bundle[]
}

export interface Order {
  id: string
  status: OrderStatus
  customerEmail: string
  playerID: string
  game: { id: string; name: string }
  bundle: { id: string; name: string; sellingPrice: number; costPrice: number }
  profit: number
  amount: number
  paystackRef: string
  paymentStatus: PaymentStatus
  transactionId: string
  transactionTimestamp: string
  redemptionInstructions: string
  notes: string
  createdAt: string
}

export interface Transaction {
  id: string
  paystackRef: string
  amount: number
  customerEmail: string
  status: TransactionStatus
  linkedOrderId: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface Region {
  code: string
  name: string
  flag: string
  enabled: boolean
  kyc: KycLevel
  minAge: number
  taxRate: number
  amlThreshold: number
}

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  width?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  updateUser: (patch: Partial<User>) => void
  isSuperAdmin: boolean
  isAuthenticated: boolean
}
