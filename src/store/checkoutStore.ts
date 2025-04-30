import { defineStore } from 'pinia'

const baseUrl = import.meta.env.VITE_API_BASE_URL

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

interface CheckoutState {
  products: Product[]
  selectedProduct: Product | null
  transactionId: number | null
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | null
  customerEmail: string
}

export const useCheckoutStore = defineStore('checkout', {
  state: (): CheckoutState => ({
    products: [],
    selectedProduct: null,
    transactionId: null,
    status: null,
    customerEmail: '',
  }),

  actions: {
    async fetchProducts() {
      const response = await fetch(`${baseUrl}/products`)
      const data = await response.json()
      this.products = data
    },

    selectProduct(product: Product) {
      this.selectedProduct = product
    },

    setTransaction(id: number, email: string, productId: number) {
      this.transactionId = id
      this.customerEmail = email
    },

    setStatus(status: 'APPROVED' | 'DECLINED') {
      this.status = status
    },
  },
})
