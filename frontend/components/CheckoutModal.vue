<template>
  <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
    <div class="bg-gray-700 rounded-2xl shadow-lg p-6 w-full max-w-md max-h-[90vh] flex flex-col">
      <h2 class="text-xl text-white font-semibold mb-4">Checkout Details</h2>

      <!-- Scrollable Product Section -->
      <div class="flex-1 overflow-y-auto mb-4">
        <h3 class="text-lg text-white font-medium mb-2 sticky top-0 bg-gray-700 py-2 z-10">
          Order Summary ({{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }})
        </h3>
        <div class="space-y-3 pr-2"> <!-- Added padding to prevent scrollbar overlap -->
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="flex justify-between items-center group"
          >
            <div class="flex items-center min-w-0 flex-1">
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="w-12 h-12 object-cover rounded mr-3 flex-shrink-0 border border-gray-100"
              >
              <div class="min-w-0">
                <p class="font-medium truncate text-white">{{ product.name }}</p>
                <p class="text-sm text-white">
                  {{ product.quantity }} × ₱{{ product.price.toLocaleString('en-PH') }}
                </p>
              </div>
            </div>
            <p class="font-medium whitespace-nowrap pl-2 text-white">
              ₱{{ (product.price * product.quantity).toLocaleString('en-PH') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Fixed Total Section -->
      <div class="border-t border-gray-200 pt-4 pb-2 sticky bottom-0 bg-gray-700">
        <div class="flex justify-between items-center font-semibold text-lg">
          <span class="text-white">Total:</span>
          <span class="text-red-600">₱{{ totalAmount.toLocaleString('en-PH') }}</span>
        </div>
      </div>

      <!-- Checkout Form -->
      <form @submit.prevent="submitCheckout" class="mt-4">
        <div class="mb-4">
          <label for="shippingAddress" class="block text-sm font-medium text-white mb-1">
            Shipping Address
          </label>
          <textarea 
            id="shippingAddress" 
            v-model="shippingAddress" 
            class="mt-1 block w-full border text-white border-gray-300 rounded-md p-2 text-sm focus:ring-red-500 focus:border-red-500" 
            rows="3"
            required
            placeholder="Enter your complete shipping address"
          ></textarea>
        </div>

        <div class="mb-6">
          <label for="paymentMethod" class="block text-sm font-medium text-white mb-1">
            Payment Method
          </label>
          <select 
            id="paymentMethod" 
            v-model="paymentMethod" 
            class="mt-1 block w-full border text-white border-gray-300 rounded-md p-2 text-sm focus:ring-red-500 focus:border-red-500" 
            required
          >
            <option disabled value="" class="text-gray-800">Select payment method</option>
            <option value="credit_card" class="text-gray-800">Credit Card</option>
            <option value="paypal" class="text-gray-800">PayPal</option>
            <option value="gcash" class="text-gray-800">GCash</option>
            <option value="cod" class="text-gray-800">Cash on Delivery</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
            :disabled="isProcessing"
          >
            <span v-if="!isProcessing">Confirm Order</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  products: {
    type: Array as () => Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }>,
    default: () => []
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);

const shippingAddress = ref('');
const paymentMethod = ref('');

const totalAmount = computed(() => {
  return props.products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
});

const totalItems = computed(() => {
  return props.products.reduce((total, product) => {
    return total + product.quantity;
  }, 0);
});

function submitCheckout() {
  if (!shippingAddress.value || !paymentMethod.value) return;
  
  emit('confirm', {
    shipping_address: shippingAddress.value,
    payment_method: paymentMethod.value
  });
}
</script>

<style scoped>
/* Custom scrollbar for the product list */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>