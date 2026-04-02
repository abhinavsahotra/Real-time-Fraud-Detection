export interface IncomingTransaction {
  transactionId: string
  userId: string
  amount: number
  currency: string
  country: string
  ip: string
  timestamp: string
}