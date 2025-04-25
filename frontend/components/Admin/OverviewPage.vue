<template>
    <div>
      <h2 class="text-white text-3xl font-semibold mt-4 mb-4">Overview</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <AdminDashboardCard 
          title="Total Users" 
          content="1200" 
          @card-clicked="handleCardClick" />
        <AdminDashboardCard 
          title="Total Sales" 
          content="₱500,000" 
          @card-clicked="handleCardClick" />
        <AdminDashboardCard 
          title="Pending Orders" 
          content="35" 
          @card-clicked="handleCardClick" />
      </div>
  
      <div class="mt-10">
        <h3 class="text-white text-2xl">Data Summary: {{ selectedData }}</h3>
        <!-- Use kebab-case for prop names in template -->
        <BarChart :dataType="selectedData" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import AdminDashboardCard from '~/components/Admin/AdminDashboardCard.vue'
  import BarChart from '~/components/Admin/BarChart.vue'
  
  const selectedData = ref('Total Users')
  
  // Handle the click event on the card
  function handleCardClick(dataType) {
    console.log('Card clicked:', dataType); // Log the clicked data type
    selectedData.value = dataType; // Update the selected data for the BarChart
  }
  </script>
  
  <style scoped>
  .grid {
    margin-bottom: 30px;
  }
  </style>