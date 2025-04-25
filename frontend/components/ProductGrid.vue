<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProductCard
      v-for="(product, index) in products"
      :key="index"
      :product="product"
      @add="$emit('add', $event)"
      @buy-now="$emit('buy-now', $event)"
    />
  </div>
</template>
  
<script setup lang="ts">
  defineProps(['products']);
  defineEmits(['add', 'buy-now'])
</script>
  