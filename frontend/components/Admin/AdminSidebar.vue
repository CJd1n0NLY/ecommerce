<template>
  <div>
    <button 
      class="text-white p-4 fixed top-6 left-4 z-50 transition-transform duration-300 transform hover:scale-110 cursor-pointer"
      @click="toggleSidebar">
      <span class="text-xl">☰</span>
    </button>

    <aside 
      :class="['bg-black text-white p-4 space-y-4 fixed top-0 left-0 h-full transition-all duration-300 z-50', sidebarClass]"
      v-show="sidebarVisible">
      <ul class="space-y-2 mt-16">
        <li>
          <a href="#" 
            @click.prevent="changePage('overview')" 
            :class="{'bg-gradient-to-br from-black to-red-600 text-white': currentPage === 'overview'}" 
            class="block p-2 hover:text-red-600 hover:scale-110 transition-transform duration-300">
            Overview
          </a>
        </li>
        <li>
          <a href="#" 
            @click.prevent="changePage('userManagement')" 
            :class="{'bg-gradient-to-br from-black to-red-600 text-white': currentPage === 'userManagement'}" 
            class="block p-2 hover:text-red-600 hover:scale-110 transition-transform duration-300">
            User Management
          </a>
        </li>
        <li>
          <a href="#" 
            @click.prevent="changePage('productManagement')" 
            :class="{'bg-gradient-to-br from-black to-red-600 text-white': currentPage === 'productManagement'}" 
            class="block p-2 hover:text-red-600 hover:scale-110 transition-transform duration-300">
            Product Management
          </a>
        </li>
      </ul>
    </aside>

    <!-- Overlay background to blur content when sidebar is open -->
    <div 
      v-show="sidebarVisible"
      class="fixed inset-0 bg-black opacity-50 z-40"
      @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  sidebarVisible: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: String,
    default: 'overview'
  }
})

const emit = defineEmits(['update:sidebarVisible', 'page-change'])

const sidebarClass = 'w-64'

function toggleSidebar() {
  console.log('Toggle sidebar. Current value:', props.sidebarVisible)
  emit('update:sidebarVisible', !props.sidebarVisible)
}

function changePage(page) {
  console.log('Changing page to:', page)
  emit('page-change', page)
  emit('update:sidebarVisible', false)  
}
</script>

<style scoped>
.w-0 {
  width: 0 !important;
}

.w-64 {
  width: 16rem !important;
}

@media (min-width: 768px) {
  .md\\:hidden {
    display: none;
  }

  .md\\:w-64 {
    width: 16rem !important;
  }
}

a.bg-gradient-to-br {
  background: linear-gradient(to bottom right, black, red);
  color: white;
}
</style>
