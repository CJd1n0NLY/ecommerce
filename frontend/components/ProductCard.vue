<template>
  <div class="bg-gray-800 p-4 rounded-lg h-80 shadow-lg flex flex-col justify-between hover:scale-105 transition-all">
    <a-image :src="product.watch_image" alt="Product Image" :height="200" :width="400" class="w-full h-40 object-cover rounded-md mb-4" />
    <h3 class="text-xl font-semibold text-white mb-2">{{ product.watch_name }}</h3>
    <p class="text-sm text-gray-400 mb-3">{{ product.characteristic_name }}</p>
    <div class="flex justify-between items-center">
      <span class="text-lg font-semibold text-white">₱{{ product.watch_price }}</span>
      <button @click="handleBuyNow" class="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 flex items-center gap-2">
        Buy Now
      </button>
      <button 
        @click="handleAddToCart"
        class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 cursor-pointer"
      >
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { useAuth } from '../composables/useAuth';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const auth = useAuth();
  const props = defineProps(['product']);
  const emit = defineEmits(['add', 'buy-now']);

  const handleBuyNow = () => {
    emit('buy-now', props.product)
  }

  const handleAddToCart = () => {
    if (!auth.isAuthenticated()) {
      router.push('/login?returnUrl=' + encodeURIComponent(router.currentRoute.value.path));
      return;
    }
    emit('add', props.product);
  };
</script>
  