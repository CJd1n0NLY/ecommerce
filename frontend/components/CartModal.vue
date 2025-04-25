<template>
  <div class="fixed bg-opacity-50 backdrop-blur-sm inset-0 z-50 flex items-center justify-center">
    <div class="bg-gradient-to-b from-gray-950 via-neutral-600 to-red-900 w-1/3 max-h-[80vh] h-[80%] p-6 overflow-y-scroll rounded-lg relative">
      <button @click="$emit('close')" class="absolute top-2 right-4 text-white text-2xl hover:text-red-500 cursor-pointer">
        <i class="fas fa-times"></i>
      </button>
      <h3 class="text-2xl text-white font-semibold mb-4">Your Cart</h3>

      <div v-if="cart.length === 0" class="text-white">Your cart is empty.</div>

      <div v-for="item in cart" :key="item.cart_item_id" class="bg-gray-800 p-4 rounded-lg mb-4">
        <div class="flex justify-between items-center mb-2">
          <div class="text-white font-semibold">{{ item.watch.watch_name }}</div>
          <div class="text-white">{{ formatPrice(parseFloat(item.watch.watch_price) * item.quantity) }}</div>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('decrease', item.cart_item_id)"
              class="bg-gray-700 text-white py-1 px-2 rounded-lg hover:bg-gray-600 cursor-pointer"
            >
              <i class="fas fa-minus"></i>
            </button>
            <span class="text-white">{{ item.quantity }}</span>
            <button
              @click="$emit('increase', item.cart_item_id)"
              class="bg-gray-700 text-white py-1 px-2 rounded-lg hover:bg-gray-600 cursor-pointer"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>

          <button
            @click="$emit('remove', item.cart_item_id)"
            class="bg-red-600 text-white py-1 px-3 rounded-lg flex items-center gap-2 hover:bg-red-500 cursor-pointer"
          >
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>

      <div v-if="cart.length > 0" class="mt-6 border-t border-gray-600 pt-4 text-white text-lg font-semibold flex justify-between">
        <span>Total:</span>
        <span>{{ formatPrice(cartTotal) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['cart', 'cartTotal']);
defineEmits(['close', 'remove', 'increase', 'decrease']);

const formatPrice = (amount: number) => {
  return '$' + amount.toLocaleString('en-US');
};
</script>
