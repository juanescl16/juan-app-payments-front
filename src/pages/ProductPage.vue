<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">📦 Productos disponibles</h1>

    <div
      v-for="product in products"
      :key="product.id"
      class="border rounded p-4 mb-4 bg-white shadow-sm"
    >
      <h2 class="text-lg font-semibold">{{ product.name }}</h2>
      <p class="text-gray-600">{{ product.description }}</p>
      <p class="text-green-600 font-bold mt-2">
        {{ product.price.toLocaleString() }} COP
      </p>
      <p class="text-sm text-gray-500">Stock disponible: {{ product.stock }}</p>

      <button
        @click="select(product)"
        class="mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Seleccionar y pagar
      </button>
    </div>

    <p v-if="!products.length" class="text-gray-500">No hay productos disponibles.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/store/checkoutStore'

const checkoutStore = useCheckoutStore()
const router = useRouter()

onMounted(() => {
  checkoutStore.fetchProducts()
})

const products = computed(() => checkoutStore.products?.products || [])

function select(product: any) {
  checkoutStore.selectProduct(product)
  router.push('/summary')
}
</script>
