<template>
  <footer class="bg-black text-white py-16">
    <div class="container mx-auto text-center">
      <div class="mb-4 flex flex-col items-center justify-center">
      <img src="/images/dashboard-logo.svg" alt="Logo" class="h-auto sm:h-20 md:h-24 lg:h-28 xl:h-32 cursor-pointer"/>
      </div>

      <div class="flex justify-center gap-6 mb-8">
        <a href="https://www.facebook.com/charlespostrado" class="text-gray-400 hover:text-white transition duration-300" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-facebook"></i>
        </a>
        <a href="https://x.com/chrls_pstrd" class="text-gray-400 hover:text-white transition duration-300" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="https://www.instagram.com/chawws_/" class="text-gray-400 hover:text-white transition duration-300" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="https://www.linkedin.com/in/charles-jacob-postrado-096844360/" class="text-gray-400 hover:text-white transition duration-300" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-linkedin"></i>
        </a>
      </div>

      <div class="flex justify-center gap-12 mb-8">
        <a href="/" class="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
        <a href="/" class="text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
        <a href="/" class="text-gray-400 hover:text-white transition duration-300">Help</a>
      </div>

      <p class="text-gray-500 text-sm">&copy; 2025 CJ Luxury Co. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.fab {
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.fab:hover {
  color: #ff4500;
}

footer .text-sm {
  color: #bbb;
}
</style>
