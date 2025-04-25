<script setup>
  defineProps({
    isMobileLayout: Boolean
  })
</script>

<template>
  <div id="collection" class="py-16 bg-black text-white h-screen flex flex-col justify-center"
       :class="{
         'items-center px-6 pt-10': isMobileLayout, 
         'items-center pl-35 pt-15 px-16': !isMobileLayout
       }">
    <h2 class="text-4xl font-semibold text-center mb-10 text-white tracking-wider">Our Collection</h2>
  
    <div class="flex justify-center items-center w-full">
      <a-carousel arrows class="max-w-5xl w-full" :dots="false" :centerMode="true" :slidesToShow="isMobileLayout ? 1 : 3">
        <template #prevArrow v-if="!isMobileLayout">
          <div class="custom-slick-arrow left-2 z-10">
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow v-if="!isMobileLayout">
          <div class="custom-slick-arrow right-2 z-10">
            <right-circle-outlined />
          </div>
        </template>
  
        <div v-for="n in 4" :key="n" class="carousel-item flex justify-center items-center">
          <div class="bg-gradient-to-t from-red-950 via-neutral-800 to-red-950 rounded-xl p-8 flex flex-col items-center justify-center h-96 max-w-[320px] mx-4 hover:shadow-2xl transition-all duration-500 ease-in-out">
            <img src="/images/watch-1.svg" alt="Watch Model" class="w-full h-56 object-cover rounded-xl mb-4" />
            <h3 class="text-3xl font-bold mb-2 text-white">Watch Model {{ n }}</h3>
            <p class="text-gray-300 text-lg mb-4">Elegant. Timeless. Professional.</p>
            <span class="bg-red-700 text-white py-2 px-4 rounded-full text-sm uppercase font-semibold">New</span> 
            <p class="mt-4 text-2xl font-bold text-white">₱ 3,***</p>
          </div>
        </div>
      </a-carousel>
    </div>
  </div>
</template>

<style scoped>
  :deep(.slick-arrow.custom-slick-arrow) {
    width: 40px;
    height: 40px;
    font-size: 32px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.25);
    border-radius: 50%;
    transition: all 0.3s ease-in-out;
    opacity: 0.6;
    z-index: 1;
    margin-left: -10px; 
    margin-right: -18px;  
  }

  :deep(.slick-arrow.custom-slick-arrow:before) {
    display: none;
  }

  :deep(.slick-arrow.custom-slick-arrow:hover) {
    opacity: 1;
    background-color: rgba(31, 45, 61, 0.4);
    transform: scale(1.1);
  }

  :deep(.slick-dots) {
    display: none;
  }

  .carousel-item {
    transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  }

  .carousel-item:hover {
    transform: scale(1.08);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .carousel-item h3 {
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 0.5px;
  }

  .carousel-item p {
    font-family: 'Open Sans', sans-serif;
    font-size: 1.1rem;
  }

  .carousel-item span {
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
  }
</style>
