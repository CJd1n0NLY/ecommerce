<template> 
  <div class="flex min-h-screen"> 
    <!-- Sidebar with v-model syntax --> 
    <AdminSidebar 
      :sidebarVisible="sidebarVisible"
      :current-page="currentPage" 
      @update:sidebarVisible="sidebarVisible = $event"
      @page-change="changePage" 
    /> 
 
    <!-- Main Content Area --> 
    <div  
      class="flex-1 bg-gray-900 p-6 transition-all duration-300 ease-in-out" 
      :class="{ 'blur-sm': sidebarVisible }"> 
      <AdminHeader /> 
      <div v-if="currentPage === 'overview'"> 
        <OverviewPage /> 
      </div> 
      <div v-else-if="currentPage === 'userManagement'"> 
        <AdminUserManagementPage /> 
      </div> 
      <div v-else-if="currentPage === 'productManagement'"> 
        <div class="text-white">Product Management (Coming Soon)</div>
      </div> 
    </div> 
  </div> 
</template> 
 
<script setup> 
import { ref } from 'vue' 
import OverviewPage from '~/components/Admin/OverviewPage.vue' 
import AdminUserManagementPage from '~/components/Admin/UserManagementPage.vue' 
// import ProductManagementPage from '~/components/Admin/ProductManagementPage.vue' 
 
const currentPage = ref('overview') 
const sidebarVisible = ref(false) 
 
function changePage(page) { 
  console.log('Page changed to:', page)
  currentPage.value = page
  sidebarVisible.value = false  
} 
</script>