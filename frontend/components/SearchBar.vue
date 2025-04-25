<template>
    <div class="mb-6">
      <input
        type="text"
        v-model="search"
        placeholder="Search for watches..."
        class="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  const search = defineModel<string>();
  </script>
  