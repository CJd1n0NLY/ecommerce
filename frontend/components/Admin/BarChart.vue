<template>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import Chart from 'chart.js/auto';
  
  const chartCanvas = ref(null);
  let chartInstance = null;
  
  const props = defineProps({
    dataType: {
      type: String,
      default: 'Total Users'
    }
  });
  
  // Function to get chart data based on data type
  const getChartData = (dataType) => {
    console.log('Getting data for:', dataType);
    
    switch (dataType) {
      case 'Total Users':
        return {
          label: 'Total Users',
          data: [1200, 1400, 1600, 1800]
        };
      case 'Total Sales':
        return {
          label: 'Total Sales in ₱',
          data: [500000, 600000, 700000, 800000]
        };
      case 'Pending Orders':
        return {
          label: 'Pending Orders',
          data: [35, 50, 60, 45]
        };
      default:
        return {
          label: 'Total Users',
          data: [1200, 1400, 1600, 1800]
        };
    }
  };
  
  // Function to create or update chart
  const updateChart = () => {
    if (!chartCanvas.value) return;
    
    const chartData = getChartData(props.dataType);
    console.log('Updating chart with data:', chartData);
    
    // If chart already exists, destroy it first
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    // Create new chart
    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [{
          label: chartData.label,
          data: chartData.data,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartData.label,
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };
  
  // Watch for changes in dataType prop
  watch(() => props.dataType, (newValue) => {
    console.log('Data type changed to:', newValue);
    updateChart();
  });
  
  onMounted(() => {
    console.log('Chart mounted with dataType:', props.dataType);
    updateChart();
  });
  
  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    width: 100%;
    max-width: 1500px;
    height: 550px;
    margin: 0 auto;
  }
  </style>