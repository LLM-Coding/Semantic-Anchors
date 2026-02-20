#!/usr/bin/env node

/**
 * extract-metadata.js
 *
 * Extracts metadata from AsciiDoc anchor files and generates JSON for the website.
 *
 * Usage: node scripts/extract-metadata.js
 */

const fs = require('fs')
const path = require('path')
const asciidoctor = require('@asciidoctor/core')()

// Paths
const ANCHORS_DIR = path.join(__dirname, '..', 'docs', 'anchors')
const OUTPUT_DIR = path.join(__dirname, '..', 'website', 'public', 'data')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

/**
 * Decode HTML entities to plain Unicode characters
 */
function decodeHtmlEntities(str) {
  if (!str) return str
  const named = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    rsquo: '\u2019',
    lsquo: '\u2018',
    rdquo: '\u201d',
    ldquo: '\u201c',
    mdash: '\u2014',
    ndash: '\u2013',
    nbsp: '\u00a0',
    hellip: '\u2026',
  }
  return str.replace(/&#(\d+);|&([a-z]+);/gi, (match, num, name) => {
    if (num) return String.fromCharCode(parseInt(num, 10))
    return named[name] || match
  })
}

/**
 * Parse a single anchor file
 */
function parseAnchorFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const doc = asciidoctor.load(content, { safe: 'safe', attributes: { 'skip-front-matter': true } })

  // Extract attributes
  const attributes = doc.getAttributes()
  const id = path.basename(filePath, '.adoc')
  const title = decodeHtmlEntities(doc.getDocumentTitle())

  // Parse comma-separated attributes
  const parseList = (attr) => {
    if (!attr) return []
    return attr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  const anchor = {
    id,
    title: title || id,
    categories: parseList(attributes.categories),
    roles: parseList(attributes.roles),
    related: parseList(attributes.related),
    proponents: parseList(attributes.proponents),
    tags: parseList(attributes.tags),
    filePath: `docs/anchors/${id}.adoc`,
  }

  // Validation
  const errors = []
  const warnings = []

  if (!anchor.title || anchor.title === id) {
    errors.push(`Missing or invalid title`)
  }
  if (anchor.categories.length === 0) {
    warnings.push(`Missing :categories: attribute`)
  }
  if (anchor.roles.length === 0) {
    errors.push(`Missing :roles: attribute`)
  }
  if (anchor.proponents.length === 0) {
    warnings.push(`Missing :proponents: attribute`)
  }

  if (errors.length > 0) {
    return { anchor, errors, warnings }
  }

  return { anchor, errors: null, warnings: warnings.length > 0 ? warnings : null }
}

/**
 * Generate categories data from anchors
 */
function generateCategoriesData(anchors) {
  const categoryMap = new Map()

  anchors.forEach((anchor) => {
    anchor.categories.forEach((categoryId) => {
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          id: categoryId,
          name: categoryIdToName(categoryId),
          anchors: [],
        })
      }
      categoryMap.get(categoryId).anchors.push(anchor.id)
    })
  })

  return Array.from(categoryMap.values()).sort((a, b) => a.id.localeCompare(b.id))
}

/**
 * Generate roles data from anchors
 */
function generateRolesData(anchors) {
  const roleMap = new Map()

  anchors.forEach((anchor) => {
    anchor.roles.forEach((roleId) => {
      if (!roleMap.has(roleId)) {
        roleMap.set(roleId, {
          id: roleId,
          name: roleIdToName(roleId),
          anchors: [],
        })
      }
      roleMap.get(roleId).anchors.push(anchor.id)
    })
  })

  return Array.from(roleMap.values()).sort((a, b) => a.id.localeCompare(b.id))
}

/**
 * Convert category ID to human-readable name
 */
function categoryIdToName(id) {
  const names = {
    'testing-quality': 'Testing & Quality Practices',
    'architecture-design': 'Architecture & Design',
    'design-principles': 'Design Principles & Patterns',
    'requirements-engineering': 'Requirements Engineering',
    documentation: 'Documentation',
    'communication-presentation': 'Communication & Presentation',
    'decision-making-strategy': 'Decision Making & Strategy',
    'development-practices': 'Development Practices',
    'statistical-methods': 'Statistical Methods & Process Monitoring',
    'interaction-reasoning': 'Interaction & Reasoning Patterns',
    uncategorized: 'Uncategorized',
  }
  return (
    names[id] ||
    id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  )
}

/**
 * Convert role ID to human-readable name
 */
function roleIdToName(id) {
  const names = {
    'software-developer': 'Software Developer / Engineer',
    'software-architect': 'Software Architect',
    'qa-engineer': 'QA Engineer / Tester',
    'devops-engineer': 'DevOps Engineer',
    'product-owner': 'Product Owner / Product Manager',
    'business-analyst': 'Business Analyst / Requirements Engineer',
    'technical-writer': 'Technical Writer / Documentation Specialist',
    'ux-designer': 'UX Designer / Researcher',
    'data-scientist': 'Data Scientist / Statistician',
    consultant: 'Consultant / Coach',
    'team-lead': 'Team Lead / Engineering Manager',
    educator: 'Educator / Trainer',
  }
  return (
    names[id] ||
    id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  )
}

/**
 * Generate metadata summary
 */
function generateMetadata(anchors, categories, roles) {
  return {
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    counts: {
      anchors: anchors.length,
      categories: categories.length,
      roles: roles.length,
    },
    statistics: {
      averageRolesPerAnchor: (
        anchors.reduce((sum, a) => sum + a.roles.length, 0) / anchors.length
      ).toFixed(2),
      averageCategoriesPerAnchor: (
        anchors.reduce((sum, a) => sum + a.categories.length, 0) / anchors.length
      ).toFixed(2),
      anchorsWithTags: anchors.filter((a) => a.tags.length > 0).length,
      anchorsWithRelated: anchors.filter((a) => a.related.length > 0).length,
    },
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Extracting metadata from anchor files...\n')

  // Read all anchor files (excluding language-specific versions like .de.adoc)
  const files = fs
    .readdirSync(ANCHORS_DIR)
    .filter((f) => f.endsWith('.adoc') && f !== '_template.adoc' && !f.match(/\.\w{2}\.adoc$/))
    .sort()

  console.log(`📂 Found ${files.length} anchor files\n`)

  // Parse all files
  const anchors = []
  const errors = []
  const warnings = []

  files.forEach((file) => {
    const filePath = path.join(ANCHORS_DIR, file)
    try {
      const result = parseAnchorFile(filePath)

      if (result.errors) {
        errors.push({ file, issues: result.errors })
        console.log(`   ✗ ${file}: ${result.errors.join(', ')}`)
      } else {
        anchors.push(result.anchor)
        if (result.warnings) {
          warnings.push({ file, issues: result.warnings })
          console.log(`   ⚠️  ${file}: ${result.warnings.join(', ')}`)
        } else {
          console.log(`   ✓ ${file}`)
        }
      }
    } catch (error) {
      errors.push({ file, issues: [error.message] })
      console.error(`   ✗ ${file}: ${error.message}`)
    }
  })

  console.log('')

  // Exit if there are errors
  if (errors.length > 0) {
    console.error(
      `\n❌ Found ${errors.length} files with errors. Please fix them before continuing.\n`
    )
    errors.forEach(({ file, issues }) => {
      console.error(`   ${file}:`)
      issues.forEach((err) => console.error(`      - ${err}`))
    })
    process.exit(1)
  }

  // Show warnings summary
  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} files have warnings (non-blocking):\n`)
    warnings.forEach(({ file, issues }) => {
      console.log(`   ${file}: ${issues.join(', ')}`)
    })
    console.log('')
  }

  // Generate derived data
  console.log('📊 Generating derived data...')
  const categories = generateCategoriesData(anchors)
  const roles = generateRolesData(anchors)
  const metadata = generateMetadata(anchors, categories, roles)
  console.log(`   ✓ ${categories.length} categories`)
  console.log(`   ✓ ${roles.length} roles`)
  console.log('')

  // Write JSON files
  console.log('💾 Writing JSON files...')

  fs.writeFileSync(path.join(OUTPUT_DIR, 'anchors.json'), JSON.stringify(anchors, null, 2), 'utf-8')
  console.log(`   ✓ anchors.json (${anchors.length} anchors)`)

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2),
    'utf-8'
  )
  console.log(`   ✓ categories.json (${categories.length} categories)`)

  fs.writeFileSync(path.join(OUTPUT_DIR, 'roles.json'), JSON.stringify(roles, null, 2), 'utf-8')
  console.log(`   ✓ roles.json (${roles.length} roles)`)

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf-8'
  )
  console.log(`   ✓ metadata.json`)

  console.log('')
  console.log('✅ Metadata extraction complete!\n')
  console.log('📈 Statistics:')
  console.log(`   - Anchors: ${metadata.counts.anchors}`)
  console.log(`   - Categories: ${metadata.counts.categories}`)
  console.log(`   - Roles: ${metadata.counts.roles}`)
  console.log(`   - Avg roles per anchor: ${metadata.statistics.averageRolesPerAnchor}`)
  console.log(`   - Avg categories per anchor: ${metadata.statistics.averageCategoriesPerAnchor}`)
  console.log(`   - Anchors with tags: ${metadata.statistics.anchorsWithTags}`)
  console.log(`   - Anchors with related: ${metadata.statistics.anchorsWithRelated}`)
  console.log('')
  console.log(`📁 Output directory: ${OUTPUT_DIR}`)
}

// Run
main()
