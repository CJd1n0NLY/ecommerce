<template>
  <div class="bg-gray-800 p-4 rounded-lg mb-6 flex justify-between items-center">
    <div>
      <h2 class="text-xl font-semibold text-white">Welcome to your dashboard</h2>
      <p class="text-gray-400">Find your perfect watch below</p>
    </div>
    <button
      @click="$emit('logout')"
      class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center gap-2 cursor-pointer"
    >
      <i class="fas fa-sign-out-alt"></i> Logout
    </button>
  </div>
</template>
  
<script setup>
  defineEmits(['logout']);
</script>
  