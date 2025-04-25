<template>
  <transition name="slide">
    <aside
      v-show="visible"
      class="fixed top-0 right-0 h-full w-[250px] p-6 flex flex-col justify-between bg-black z-50 shadow-xl"
    >
      <div class="flex justify-end">
        <button @click="$emit('close')" class="text-white text-xl p-2"></button>
      </div>

      <div class="mt-12">
        <nav class="space-y-6">
          <p @click="handleNavigation('home')" class="text-gray-400 font-semibold cursor-pointer">Home</p>
          <p @click="handleNavigation('collection')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">Collection</p>
          <p @click="handleNavigation('about')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">About</p>
          <p @click="handleNavigation('contact')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">Contact</p>
        </nav>
      </div>
      <p class="text-xs text-gray-500 mt-10">&copy; 2025 YourBrand. All rights reserved.</p>
    </aside>
  </transition>
</template>

<script setup>
  const emit = defineEmits(['close']);
  const { scrollToSection } = useLandingPage();  

  const handleNavigation = (section) => {
    scrollToSection(section); 
    emit('close');  
  };

  defineProps({
    visible: Boolean,
  })
</script>

  
<style scoped>
  .slide-enter-from {
    transform: translateX(100%);
  }
  .slide-enter-to {
    transform: translateX(0%);
  }
  .slide-leave-from {
    transform: translateX(0%);
  }
  .slide-leave-to {
    transform: translateX(100%);
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }
</style>