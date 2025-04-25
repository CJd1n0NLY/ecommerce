import { ref, onMounted, onUnmounted } from 'vue'

export function useLandingPage() {
  const isSidebarOpen = ref(false)
  const isMobileLayout = ref(false)
  const isScrolled = ref(false)
  const activeSection = ref('home')
  let manualScroll = false

  const handleResize = () => {
    const match = window.matchMedia('(max-width: 766px) and (max-height: 932px)')
    isMobileLayout.value = match.matches
  }

  const observeSections = () => {
    const sections = ['home', 'collection', 'about', 'contact']
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    }

    const observer = new IntersectionObserver((entries) => {
      if (manualScroll) return

      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visibleEntries.length > 0) {
        activeSection.value = visibleEntries[0].target.id
      }
    }, options)

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
  }

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10

    if (!manualScroll && window.scrollY < 30) {
      activeSection.value = 'home'
    }
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      manualScroll = true
      activeSection.value = id
      el.scrollIntoView({ behavior: 'smooth' })

      setTimeout(() => {
        manualScroll = false
      }, 1000)
    }
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    observeSections()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isSidebarOpen,
    isMobileLayout,
    isScrolled,
    activeSection,
    scrollToSection,
  }
}
