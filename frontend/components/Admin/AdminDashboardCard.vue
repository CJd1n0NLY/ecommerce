<template>
  <div 
    class="bg-black text-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-gradient-to-br hover:from-black hover:to-red-500 transition cursor-pointer"
    @click="handleClick">
    <h3 class="text-xl font-bold">{{ title }}</h3>
    <p class="text-lg">{{ content }}</p>
  </div>
</template>

<script setup>
// Defining props
const props = defineProps({
  title: String,
  content: String
})

const emit = defineEmits()

// Handle the click event on the card
function handleClick() {
  console.log('Card clicked:', props.title); // Log the clicked card title
  emit('card-clicked', props.title) // Emit the card clicked event with the title
}
</script>
