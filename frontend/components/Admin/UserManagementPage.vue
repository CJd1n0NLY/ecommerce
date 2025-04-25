     
<script setup> 
import AdminDataTable from '~/components/Admin/AdminDataTable.vue' 
import { useCreateAccountModal } from '../composables/useCreateAccountModal'

const { open, activeTab } = useCreateAccountModal()

</script>

<template> 
  <div> 
    <h2 class="text-white text-3xl font-semibold mt-4 mb-4">User Management</h2> 
    <button
            @click="open()"
            class="text-red-400 hover:text-white border border-red-600 hover:border-white mb-4 px-4 py-2 rounded transition-colors duration-300 cursor-pointer"
    >
    Create a new Account
    </button>
    <AdminDataTable /> 
    <AdminCreateAccountModal />
  </div> 
</template> 
