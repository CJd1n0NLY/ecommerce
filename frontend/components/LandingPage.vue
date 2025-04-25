<script setup lang="ts">
  import { useLandingPage } from '../composables/useLandingPage'
  import { useAuthModal } from '../composables/useAuthModal'

  const {
    isSidebarOpen,
    isMobileLayout,
    isScrolled,
    activeSection,
    scrollToSection
  } = useLandingPage()

  const { open } = useAuthModal()

</script>

<template>
    <div class="min-h-screen bg-black text-white flex flex-col">
      <header :class="['hidden md:flex items-center justify-center px-8 py-4 sticky top-0 z-50 transition-all duration-300', 
        isScrolled ? 'bg-black/40 backdrop-blur-md' : 'bg-black']"
      >
        <div class="container mx-auto flex justify-between items-center">
          <a href="/" class="cursor-pointer">
            <img src="/images/navbar-logo.svg" alt="Logo" class="h-auto sm:h-18 md:h-20 lg:h-22 xl:h-auto max-w-[150px] mx-auto" />
          </a>
          <nav class="flex gap-10 text-xl absolute left-1/2 transform -translate-x-1/2">
            <button @click="scrollToSection('home')" :class="['nav-link', activeSection === 'home' ? 'text-white active' : '', 'text-gray-400 hover:text-white cursor-pointer']">
              Home
            </button>
            <button @click="scrollToSection('collection')" :class="['nav-link', activeSection === 'collection' ? 'text-white active' : '', 'text-gray-400 hover:text-white cursor-pointer']">
              Collection
            </button>
            <button @click="scrollToSection('about')" :class="['nav-link', activeSection === 'about' ? 'text-white active' : '', 'text-gray-400 hover:text-white cursor-pointer']">
              About
            </button>
            <button @click="scrollToSection('contact')" :class="['nav-link', activeSection === 'contact' ? 'text-white active' : '', 'text-gray-400 hover:text-white cursor-pointer']">
              Contact
            </button>
          </nav>

          <div>
            <button
              @click="open('login')"
              class="text-gray-400 hover:text-white border border-gray-600 hover:border-white px-4 py-2 rounded transition-colors duration-300 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </header>

  
      <div class="flex md:hidden justify-between items-center px-6 py-4 sticky top-0 z-50 bg-transparent backdrop-blur-md">
        <a href="/" class="cursor-pointer"><img src="/images/nav-bar-logo.svg" alt="Logo" class="h-20 sm:h-22 md:h-20 lg:h-22 xl:h-18" /></a>

        <div class="flex items-center gap-4">
          <button @click="open('login')" class="text-gray-400 hover:text-white border border-gray-600 hover:border-white px-3 py-1 rounded text-sm transition-colors duration-300">
            Login
          </button>

          <button @click="isSidebarOpen = !isSidebarOpen" class="text-white text-2xl">
            ☰
          </button>
        </div>
      </div>
  
      <transition name="fade">
        <div
            v-if="isSidebarOpen"
            class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            @click="isSidebarOpen = false"
        ></div>
      </transition>
      <SideBar :visible="isSidebarOpen" @close="isSidebarOpen = false" />
  
      <section 
        id="home" 
        :class="{
          'h-64 md:h-screen flex relative overflow-hidden': isMobileLayout, 
          'h-screen flex relative overflow-hidden': !isMobileLayout
        }"
      >
        <HeroContent />
        <BackgroundImage v-if="!isMobileLayout" />
      </section>

      
      <Collection :isMobileLayout="isMobileLayout" />
      <AboutSection :isMobileLayout="isMobileLayout" />
      <FooterSection />
      <AuthModal />

    </div>

</template>

<style scoped>
    html {
      scroll-behavior: smooth;
    }
    .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
    }
    .fade-enter-from, .fade-leave-to {
    opacity: 0;
    }
    .fade-enter-to, .fade-leave-from {
    opacity: 1;
    }

    .nav-link {
      position: relative;
      padding-bottom: 4px;
      transition: color 0.3s ease;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      height: 2px;
      width: 0%;
      background-color: red;
      transition: width 0.3s ease-in-out;
    }

    .nav-link:hover::after,
    .nav-link.active::after {
      width: 100%;
    }

</style>