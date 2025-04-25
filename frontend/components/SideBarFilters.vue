<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  characteristics: string[]
  categories: string[]
  selectedCharacteristics: string[]
}>()

const emit = defineEmits(['filter-category', 'logout', 'update:selectedCharacteristics'])

const localSelected = ref([...props.selectedCharacteristics])

watch(() => props.selectedCharacteristics, (newVal) => {
  localSelected.value = [...newVal]
})

watch(localSelected, (newVal) => {
  emit('update:selectedCharacteristics', newVal)
})
</script>

<template>
  <div class="bg-gray-800 p-6 rounded-lg">
    <div class="mb-8 text-center">
      <img src="/images/dashboard-logo.svg" alt="Logo" class="h-auto w-full mb-4" />
      <p class="text-gray-400 text-sm font-semibold">Discover the perfect timepiece for you</p>
    </div>

    <div class="text-white mb-6">
      <h3 class="text-2xl font-semibold mb-4">Filter Watch Characteristics</h3>
      <div v-for="c in characteristics" :key="c" class="flex items-center mb-4">
        <input
          type="checkbox"
          :id="c"
          v-model="localSelected"
          :value="c"
          class="mr-2 cursor-pointer"
        />
        <label :for="c" class="text-gray-400 cursor-pointer">{{ c }}</label>
      </div>
    </div>

    <div class="text-white">
      <h3 class="text-2xl font-semibold mb-4">Categories</h3>
      <div class="space-y-2">
        <button
          v-for="category in categories"
          :key="category"
          @click="$emit('filter-category', category)"
          class="w-full py-2 px-4 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors cursor-pointer"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-700">
      <button
        @click="$emit('logout')"
        class="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer"
      >
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </div>
</template>
