let theme = 'light'

export function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    theme = saved
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
  } else {
    theme = 'light'
  }
  applyThemeClass()
}

export function toggleTheme() {
  theme = theme === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme)
  applyThemeClass()
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))
}

export function currentTheme() {
  return theme
}

function applyThemeClass() {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
