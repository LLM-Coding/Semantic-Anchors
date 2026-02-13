const CATEGORY_PALETTE = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#48b8d0',
  '#c23531', '#2f4554', '#61a0a8', '#d48265', '#749f83'
]

export function getCategoryColor(index) {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]
}

export function buildTreemapData(categories, anchors) {
  const anchorMap = new Map(anchors.map(a => [a.id, a]))

  return categories.map((category, index) => {
    const children = category.anchors
      .map(anchorId => anchorMap.get(anchorId))
      .filter(Boolean)
      .map(anchor => ({
        id: anchor.id,
        name: anchor.title,
        value: 1,
        roles: anchor.roles || [],
        categoryId: category.id
      }))

    return {
      name: category.name,
      id: category.id,
      children,
      itemStyle: { color: getCategoryColor(index) }
    }
  })
}

export function getAnchorsByRole(anchors, roleId) {
  if (!roleId) return anchors
  return anchors.filter(a => a.roles && a.roles.includes(roleId))
}

export function getAnchorsBySearch(anchors, query) {
  if (!query || query.trim() === '') return anchors

  const lowerQuery = query.toLowerCase().trim()

  return anchors.filter(anchor => {
    const titleMatch = anchor.title.toLowerCase().includes(lowerQuery)
    const idMatch = anchor.id.toLowerCase().includes(lowerQuery)
    const tagsMatch = anchor.tags && anchor.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    const proponentsMatch = anchor.proponents && anchor.proponents.some(p => p.toLowerCase().includes(lowerQuery))

    return titleMatch || idMatch || tagsMatch || proponentsMatch
  })
}

export function getFilteredAnchors(anchors, roleId, searchQuery) {
  let filtered = anchors

  if (roleId) {
    filtered = getAnchorsByRole(filtered, roleId)
  }

  if (searchQuery) {
    filtered = getAnchorsBySearch(filtered, searchQuery)
  }

  return filtered
}

export async function fetchData() {
  const [anchorsRes, categoriesRes, rolesRes] = await Promise.all([
    fetch('./data/anchors.json'),
    fetch('./data/categories.json'),
    fetch('./data/roles.json')
  ])

  const anchors = await anchorsRes.json()
  const categories = await categoriesRes.json()
  const roles = await rolesRes.json()

  return { anchors, categories, roles }
}
