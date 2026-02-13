import * as echarts from 'echarts'
import { buildTreemapData, getAnchorsByRole, getFilteredAnchors, fetchData, getCategoryColor } from '../utils/data-loader.js'

export function getThemeColors(isDark) {
  if (isDark) {
    return {
      textColor: '#f9fafb',
      bgColor: '#1f2937',
      borderColor: '#374151',
      breadcrumbBg: '#374151',
      breadcrumbText: '#9ca3af',
      tooltipBg: '#1f2937',
      tooltipBorder: '#374151',
      tooltipText: '#f9fafb'
    }
  }
  return {
    textColor: '#1f2937',
    bgColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    breadcrumbBg: '#e5e7eb',
    breadcrumbText: '#6b7280',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e5e7eb',
    tooltipText: '#1f2937'
  }
}

export function buildTreemapOptions(data, isDark) {
  const colors = getThemeColors(isDark)

  return {
    tooltip: {
      show: true,
      formatter(info) {
        if (!info.data || !info.data.id) {
          return `<strong>${info.name}</strong><br/>Anchors: ${info.value}`
        }
        const roles = (info.data.roles || []).join(', ')
        return `<strong>${info.name}</strong>${roles ? '<br/>Roles: ' + roles : ''}`
      },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText }
    },
    series: [{
      type: 'treemap',
      data,
      roam: false,
      width: '100%',
      height: '100%',
      nodeClick: 'zoomToNode',
      breadcrumb: {
        show: true,
        top: 5,
        left: 10,
        itemStyle: {
          color: colors.breadcrumbBg,
          borderColor: 'transparent',
          textStyle: { color: colors.breadcrumbText }
        },
        emphasis: {
          itemStyle: { color: colors.breadcrumbBg }
        }
      },
      label: {
        show: true,
        formatter: '{b}',
        fontSize: 12,
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowBlur: 2
      },
      upperLabel: {
        show: true,
        height: 30,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowBlur: 2
      },
      itemStyle: {
        borderColor: colors.borderColor,
        borderWidth: 2,
        gapWidth: 2
      },
      levels: [
        {
          itemStyle: {
            borderColor: colors.borderColor,
            borderWidth: 3,
            gapWidth: 3
          },
          upperLabel: { show: true }
        },
        {
          itemStyle: {
            borderColor: colors.borderColor,
            borderWidth: 1,
            gapWidth: 1
          },
          label: { show: true },
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' }
          }
        }
      ]
    }]
  }
}

let chartInstance = null
let currentData = { anchors: [], categories: [], roles: [] }
let currentFilters = { roleId: '', searchQuery: '' }

function isDarkMode() {
  return document.documentElement.classList.contains('dark')
}

function renderChart(filteredAnchors) {
  const container = document.getElementById('treemap-container')
  if (!container) return

  if (!chartInstance) {
    chartInstance = echarts.init(container)
  }

  const treemapData = buildTreemapData(currentData.categories, filteredAnchors)
  const options = buildTreemapOptions(treemapData, isDarkMode())
  chartInstance.setOption(options, true)
}

function handleResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

function handleThemeChange() {
  if (!chartInstance) return
  const treemapData = buildTreemapData(currentData.categories, currentData.anchors)
  const options = buildTreemapOptions(treemapData, isDarkMode())
  chartInstance.setOption(options, true)
}

export async function initTreemap() {
  try {
    currentData = await fetchData()
    renderChart(currentData.anchors)

    window.addEventListener('resize', handleResize)

    const themeToggle = document.getElementById('theme-toggle')
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTimeout(handleThemeChange, 50)
      })
    }

    chartInstance.on('click', (params) => {
      if (params.data && params.data.id && params.data.categoryId) {
        const event = new CustomEvent('anchor-selected', {
          detail: { anchorId: params.data.id }
        })
        document.dispatchEvent(event)
      }
    })

    return { chartInstance, currentData }
  } catch (err) {
    const container = document.getElementById('treemap-container')
    if (container) {
      container.innerHTML = `
        <div class="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
          <p>Failed to load treemap data. Please try refreshing the page.</p>
        </div>
      `
    }
    throw err
  }
}

export function updateTreemapByRole(roleId) {
  if (!currentData.anchors.length) return
  currentFilters.roleId = roleId
  applyFilters()
}

export function updateTreemapBySearch(searchQuery) {
  if (!currentData.anchors.length) return
  currentFilters.searchQuery = searchQuery
  applyFilters()
}

function applyFilters() {
  const filtered = getFilteredAnchors(
    currentData.anchors,
    currentFilters.roleId,
    currentFilters.searchQuery
  )
  renderChart(filtered)
}

export function destroyTreemap() {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}
