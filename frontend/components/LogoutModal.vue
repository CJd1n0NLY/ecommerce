<template>
  <div class="fixed bg-opacity-50 backdrop-blur-sm inset-0 z-50 flex items-center justify-center">
    <div class="bg-gray-800 p-6 rounded-lg w-96">
      <h3 class="text-xl text-white font-semibold mb-4">Confirm Logout</h3>
      <p class="text-gray-300 mb-6">Are you sure you want to logout?</p>
      <div class="flex justify-end gap-4">
        <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer">Cancel</button>
        <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">Logout</button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  defineEmits(['cancel', 'confirm']);
</script>
  