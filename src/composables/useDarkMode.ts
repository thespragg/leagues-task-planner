import { ref, onMounted, watch } from 'vue'

export const useDarkMode = () => {
  const isDark = ref(false)

  const getSystemDarkMode = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const getInitialDarkMode = () => {
    const darkModeFromStorage = localStorage.getItem('darkMode')
    if (darkModeFromStorage !== null) {
      return darkModeFromStorage === 'true'
    }
    return getSystemDarkMode()
  }

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem('darkMode', isDark.value.toString())
    updateDocumentClass()
  }

  const updateDocumentClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  onMounted(() => {
    isDark.value = getInitialDarkMode()
    updateDocumentClass()

    // Watch for system dark mode changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
          isDark.value = e.matches
          updateDocumentClass()
        }
      })
  })

  watch(isDark, () => {
    updateDocumentClass()
  })

  return {
    isDark,
    toggleDarkMode
  }
}