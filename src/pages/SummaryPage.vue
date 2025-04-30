<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">🧾 Resumen de compra</h1>

    <div v-if="product" class="border p-4 rounded shadow bg-white mb-4">
      <h2 class="text-lg font-semibold">{{ product.name }}</h2>
      <p class="text-gray-600">{{ product.description }}</p>
      <p class="text-green-700 font-bold mt-2">
        Precio: {{ product.price.toLocaleString() }} COP
      </p>
      <p class="text-sm text-gray-500">Base fee: {{ baseFee.toLocaleString() }} COP</p>
      <p class="text-sm text-gray-500">Envío: {{ deliveryFee.toLocaleString() }} COP</p>
      <p class="mt-2 font-bold">
        Total: {{ totalAmount.toLocaleString() }} COP
      </p>
    </div>

    <form @submit.prevent="submitPayment" class="space-y-4">
  <div>
    <label class="block mb-1 font-medium">Nombre del cliente</label>
    <input
      v-model="customerName"
      type="text"
      required
      class="w-full border rounded px-3 py-2"
    />
  </div>

  <div>
    <label class="block mb-1 font-medium">Dirección</label>
    <input
      v-model="customerAddress"
      type="text"
      required
      class="w-full border rounded px-3 py-2"
    />
  </div>

  <div>
    <label class="block mb-1 font-medium">Teléfono</label>
    <input
      v-model="customerPhone"
      type="text"
      required
      class="w-full border rounded px-3 py-2"
    />
  </div>

  <div>
    <label class="block mb-1 font-medium">Correo electrónico</label>
    <input
      v-model="email"
      type="email"
      required
      class="w-full border rounded px-3 py-2"
    />
  </div>

  <div>
    <button
      type="button"
      @click="showCardModal = true"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      💳 Ingresar datos de tarjeta
    </button>
    <p class="text-sm text-gray-500 mt-2" v-if="cardToken">
      ✅ Token generado: {{ cardToken }}
    </p>
  </div>

  <button
  type="submit"
  :disabled="!cardToken || isLoading"
  class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
>
  <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></span>
  {{ isLoading ? 'Procesando...' : 'Confirmar y pagar' }}
</button>
</form>


    <p v-if="error" class="text-red-600 mt-4 font-semibold">{{ error }}</p>

    <CreditCardModal
      :visible="showCardModal"
      @close="showCardModal = false"
      @token-generated="onTokenGenerated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useRouter } from 'vue-router'
import CreditCardModal from '@/components/CreditCardModal.vue'

const checkoutStore = useCheckoutStore()
const router = useRouter()

const product = checkoutStore.selectedProduct
const email = ref('')
const cardToken = ref('')
const error = ref('')
const showCardModal = ref(false)

const customerName = ref('')
const customerAddress = ref('')
const customerPhone = ref('')

const isLoading = ref(false)

const baseFee = 1000
const deliveryFee = 2000

const totalAmount = computed(() => {
  return Number(product?.price || 0) + baseFee + deliveryFee
})

function onTokenGenerated(token: string) {
  cardToken.value = token
}

async function submitPayment() {
  try {
    isLoading.value = true
    const txResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount.value,
        customerName: customerName.value,
        customerAddress: customerAddress.value,
        customerPhone: customerPhone.value,
        productId: product.id
      }),
    })
    console.log('x1')
    const txData = await txResponse.json()
    const transactionId = txData.transaction?.id
    console.log('x1.5')
    checkoutStore.setTransaction(transactionId, email.value)
    console.log(transactionId, 'x2')
    const payResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/transactions/${transactionId}/pay`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: email.value,
          cardToken: cardToken.value,
        }),
      }
    )

    const payData = await payResponse.json()

    if (payData.message === 'Pago procesado exitosamente.') {
      checkoutStore.setStatus('APPROVED')
    } else {
      checkoutStore.setStatus('DECLINED')
    }

    router.push('/result')
  } catch (err: any) {
    try {
      const errorResponse = await err.response?.json()
      error.value = errorResponse?.message || 'Error procesando el pago. Intenta de nuevo.'
    } catch {
      error.value = err.message || 'Error procesando el pago. Intenta de nuevo.'
    }
  }finally {
    isLoading.value = false
  }
}
</script>
