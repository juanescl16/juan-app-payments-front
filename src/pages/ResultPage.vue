<template>
  <div class="p-6 max-w-xl mx-auto text-center">
    <div v-if="status === 'APPROVED'">
      <h1 class="text-2xl font-bold text-green-600 mb-4">🎉 ¡Pago exitoso!</h1>
      <p class="mb-2">Gracias por tu compra, {{ email }}.</p>
      <p>Recibirás tu producto pronto.</p>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold text-red-600 mb-4">❌ Pago rechazado</h1>
      <p class="mb-2">Lo sentimos, tu transacción no fue aprobada.</p>
    </div>

    <button
      @click="goBack"
      class="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Volver a la tienda
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/store/checkoutStore'

const checkoutStore = useCheckoutStore()
const router = useRouter()

const status = checkoutStore.status
const email = checkoutStore.email

function goBack() {
  router.push('/')
}
</script>
