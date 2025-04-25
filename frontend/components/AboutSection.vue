<script setup>
  defineProps({
    isMobileLayout: Boolean
  })
</script>

<template>
  <section id="about" class="py-16 px-6 md:px-20 bg-[#0e0e0e] text-white h-screen flex flex-col justify-center items-center relative"
           :class="{
             'items-center px-6 pt-10': isMobileLayout, 
             'items-center pl-35 pt-15 px-16': !isMobileLayout 
           }">
    <div class="absolute inset-0 bg-gradient-to-r from-black via-neutral-900 to-red-950 opacity-60"></div>
    
    <div class="max-w-4xl mx-auto z-10">
      <h2 class="text-4xl md:text-5xl font-bold mb-6 text-red-600 tracking-wider text-center">
        About
      </h2>
      <p class="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
        This is my <strong class="text-white">E-commerce Activity</strong> for <strong class="text-white">CCCI On-the-Job Training</strong>.
        I selected watches as my featured product because I have a deep appreciation for them. 
        Watches are not only practical timepieces, but they also symbolize elegance, discipline, 
        and professionalism. This project reflects my passion for quality and style, blending aesthetics 
        with clean development practices using modern techs.
      </p>

      <div class="flex justify-center mt-8">
        <a-image 
          :style="{ width: isMobileLayout ? '250px' : '350px' }" 
          src="/images/background-watch.svg" 
          alt="Watch Model" 
          class="h-auto object-cover rounded-full border-4 border-red-600 shadow-lg" 
        />
      </div>

      <div class="flex justify-center mt-6">
        <button class="learn-more bg-red-600 text-white py-2 px-8 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out cursor-pointer">
          Learn More
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .learn-more:hover {
    transform: scale(1.08);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  #about {
    position: relative;
    overflow: hidden;
  }

  .text-white, .text-gray-300 {
    font-family: 'Open Sans', sans-serif;
  }

  .text-red-600 {
    font-family: 'Montserrat', sans-serif;
  }

  @media (max-width: 500px) {
    .text-lg {
      font-size: 1rem;
    }

    .text-xl {
      font-size: 1.2rem;
    }

    .text-4xl {
      font-size: 1.8rem;
    }

    .text-5xl {
      font-size: 2rem;
    }

    .py-16 {
      padding-top: 8rem;
      padding-bottom: 8rem;
    }
  }
</style>
