<template>
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      v-if="visible"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">💳 Datos de la tarjeta</h2>
  
        <form @submit.prevent="generateToken" class="space-y-3">
          <div class="relative">
            <input
              v-model="card.number"
              type="text"
              placeholder="Número de tarjeta"
              class="input pr-12"
              required
            />
            <img
              v-if="cardLogo"
              :src="cardLogo"
              alt="Card Logo"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 h-6"
            />
          </div>
  
          <div class="flex gap-2">
            <input
              v-model="card.exp_month"
              type="text"
              placeholder="Mes (MM)"
              class="input"
              required
            />
            <input
              v-model="card.exp_year"
              type="text"
              placeholder="Año (YY)"
              class="input"
              required
            />
          </div>
  
          <input v-model="card.cvc" type="text" placeholder="CVC" class="input" required />
          <input
            v-model="card.card_holder"
            type="text"
            placeholder="Titular"
            class="input"
            required
          />
  
          <button
            type="submit"
            :disabled="isGeneratingToken"
            class="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isGeneratingToken">Generar token</span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Generando...
            </span>
          </button>
  
          <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
        </form>
  
        <button @click="close" class="text-sm text-gray-600 mt-4 underline w-full">
          Cancelar
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import visaLogo from '@/assets/visa.svg';
  import mastercardLogo from '@/assets/mastercard.svg';
  
  const emit = defineEmits(['close', 'token-generated']);
  const props = defineProps<{ visible: boolean }>();
  
  const card = ref({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    card_holder: '',
  });
  
  const cardType = ref<'visa' | 'mastercard' | 'unknown'>('unknown');
  
  watch(
    () => card.value.number,
    (value) => {
      const clean = value.replace(/\s+/g, '');
      if (/^4[0-9]{0,}$/.test(clean)) cardType.value = 'visa';
      else if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) cardType.value = 'mastercard';
      else cardType.value = 'unknown';
    }
  );
  
  const cardLogo = computed(() => {
    if (cardType.value === 'visa') return visaLogo;
    if (cardType.value === 'mastercard') return mastercardLogo;
    return null;
  });
  
  const error = ref('');
  const isGeneratingToken = ref(false);
  
  async function generateToken() {
    try {
      isGeneratingToken.value = true;
      error.value = '';
  
      const response = await fetch('https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_WOMPI_PUBLIC_KEY}`,
        },
        body: JSON.stringify(card.value),
      });
  
      const result = await response.json();
  
      if (result.status === 'CREATED') {
        emit('token-generated', result.data.id);
        emit('close');
      } else {
        error.value = 'No se pudo generar el token. Intenta nuevamente.';
      }
    } catch (err: any) {
      error.value = 'Error al conectar con Wompi.';
    } finally {
      isGeneratingToken.value = false;
    }
  }
  
  function close() {
    emit('close');
  }
  </script>
  
  <style scoped>
  .input {
    @apply w-full border rounded px-3 py-2;
  }
  </style>
  