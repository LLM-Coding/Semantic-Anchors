#!/usr/bin/env node

/**
 * split-readme.js
 *
 * Splits README.adoc into individual anchor files with AsciiDoc attributes.
 *
 * Usage: node scripts/split-readme.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Paths
const README_PATH = path.join(__dirname, '..', 'README.adoc');
const ANCHORS_DIR = path.join(__dirname, '..', 'docs', 'anchors');
const ROLES_YAML_PATH = path.join(__dirname, '..', 'docs', 'metadata', 'roles.yml');

// Ensure output directory exists
if (!fs.existsSync(ANCHORS_DIR)) {
  fs.mkdirSync(ANCHORS_DIR, { recursive: true });
}

/**
 * Convert anchor title to kebab-case ID
 * "TDD, London School" → "tdd-london-school"
 */
function toKebabCase(title) {
  return title
    .toLowerCase()
    .replace(/[,()]/g, '') // Remove commas and parentheses
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric except hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Extract proponents from anchor content
 */
function extractProponents(content) {
  const match = content.match(/\*Key Proponents\*:\s*([^\n]+)/);
  if (match) {
    return match[1]
      .split(/,(?![^(]*\))/) // Split on commas not inside parentheses
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }
  return [];
}

/**
 * Extract related anchors (placeholder - requires manual review)
 */
function extractRelated(content, anchorId) {
  // This is a heuristic - may need manual review
  const related = [];

  // Look for explicit "Related" sections or links
  const relatedMatch = content.match(/\*Related\*:\s*([^\n]+)/i);
  if (relatedMatch) {
    const mentions = relatedMatch[1].split(',').map(r => r.trim());
    mentions.forEach(mention => {
      const kebab = toKebabCase(mention);
      if (kebab && kebab !== anchorId) {
        related.push(kebab);
      }
    });
  }

  return related;
}

/**
 * Determine category based on section header
 */
function getCategoryForSection(sectionTitle) {
  const categoryMap = {
    'Testing & Quality Practices': 'testing-quality',
    'Architecture & Design': 'architecture-design',
    'Design Principles & Patterns': 'design-principles',
    'Requirements Engineering': 'requirements-engineering',
    'Documentation': 'documentation',
    'Communication & Presentation': 'communication-presentation',
    'Decision Making & Strategy': 'decision-making-strategy',
    'Development Practices': 'development-practices',
    'Statistical Methods & Process Monitoring': 'statistical-methods',
    'Interaction & Reasoning Patterns': 'interaction-reasoning',
  };

  return categoryMap[sectionTitle] || 'uncategorized';
}

/**
 * Parse README.adoc and extract anchors
 */
function parseReadme() {
  const content = fs.readFileSync(README_PATH, 'utf-8');
  const lines = content.split('\n');

  const anchors = [];
  let currentCategory = null;
  let currentAnchor = null;
  let anchorContent = [];
  let inAnchor = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip catalog section header
    if (line.match(/^==\s+Semantic Anchor Catalog/)) {
      continue;
    }

    // Category header: === Category Name
    if (line.match(/^===\s+(.+)$/) && !inAnchor) {
      // Save previous anchor if exists
      if (currentAnchor && anchorContent.length > 0) {
        currentAnchor.content = anchorContent.join('\n').trim();
        if (currentAnchor.title) { // Only save if it has a title
          anchors.push(currentAnchor);
        }
        currentAnchor = null;
        anchorContent = [];
        inAnchor = false;
      }

      const categoryTitle = line.match(/^===\s+(.+)$/)[1];
      currentCategory = getCategoryForSection(categoryTitle);
      continue;
    }

    // Stop at "Testing and Contributing" section (end of anchors)
    if (line.match(/^==\s+Testing and Contributing/)) {
      if (currentAnchor && anchorContent.length > 0) {
        currentAnchor.content = anchorContent.join('\n').trim();
        if (currentAnchor.title) {
          anchors.push(currentAnchor);
        }
      }
      break;
    }

    // Anchor ID: [[anchor-id]]
    if (line.match(/^\[\[([^\]]+)\]\]$/)) {
      // Save previous anchor if exists
      if (currentAnchor && anchorContent.length > 0) {
        currentAnchor.content = anchorContent.join('\n').trim();
        if (currentAnchor.title) {
          anchors.push(currentAnchor);
        }
      }

      // Start new anchor
      const anchorId = line.match(/^\[\[([^\]]+)\]\]$/)[1];
      currentAnchor = {
        id: anchorId,
        category: currentCategory,
        content: '',
        title: null,
      };
      anchorContent = [];
      inAnchor = true;
      continue;
    }

    // Anchor title: ==== Title (only if we're in an anchor)
    if (inAnchor && !currentAnchor.title && line.match(/^====\s+(.+)$/)) {
      currentAnchor.title = line.match(/^====\s+(.+)$/)[1];
      // Don't include the ==== title line in content since we use it for file header
      continue;
    }

    // Capture all content when in anchor
    if (inAnchor) {
      anchorContent.push(line);
    }
  }

  // Save last anchor
  if (currentAnchor && anchorContent.length > 0 && currentAnchor.title) {
    currentAnchor.content = anchorContent.join('\n').trim();
    anchors.push(currentAnchor);
  }

  return anchors;
}

/**
 * Load role mappings
 */
function loadRoleMappings() {
  try {
    const yamlContent = fs.readFileSync(ROLES_YAML_PATH, 'utf-8');
    return yaml.load(yamlContent);
  } catch (_error) {
    console.error('Warning: Could not load roles.yml, proceeding without role mapping');
    return {};
  }
}

/**
 * Generate AsciiDoc file for anchor
 */
function generateAnchorFile(anchor, roleMappings) {
  const { id, title, content, category } = anchor;

  // Get roles from mapping
  const roles = roleMappings[id]?.roles || [];

  // Extract proponents from content
  const proponents = extractProponents(content);

  // Extract related anchors (may need manual review)
  const related = extractRelated(content, id);

  // Generate AsciiDoc attributes
  const attributes = [];
  if (category) {
    attributes.push(`:categories: ${category}`);
  }
  if (roles.length > 0) {
    attributes.push(`:roles: ${roles.join(', ')}`);
  }
  if (related.length > 0) {
    attributes.push(`:related: ${related.join(', ')}`);
  }
  if (proponents.length > 0) {
    attributes.push(`:proponents: ${proponents.join(', ')}`);
  }

  // Build file content
  const fileContent = `= ${title}
${attributes.join('\n')}

${content}
`;

  return fileContent;
}

/**
 * Create template file
 */
function createTemplate() {
  const templateContent = `= Anchor Title
:categories: category-id
:roles: role-id-1, role-id-2
:related: related-anchor-1, related-anchor-2
:proponents: Author Name, Another Author
:tags: tag1, tag2, tag3

[%collapsible]
====
*Also known as*: Alternative Name, Other Name

*Core Concepts*:

* Concept 1
* Concept 2
* Concept 3

*Key Proponents*: Author Name ("Book Title"), Another Author

*When to Use*:

* Use case 1
* Use case 2
* Use case 3

*Related Anchors*:

* <<related-anchor-1,Related Anchor Name>>
* <<related-anchor-2,Another Related Anchor>>
====
`;

  const templatePath = path.join(ANCHORS_DIR, '_template.adoc');
  fs.writeFileSync(templatePath, templateContent, 'utf-8');
  console.log(`✅ Created template: ${templatePath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting README split...\n');

  // Parse README
  console.log('📖 Parsing README.adoc...');
  const anchors = parseReadme();
  console.log(`   Found ${anchors.length} anchors\n`);

  // Load role mappings
  console.log('📊 Loading role mappings...');
  const roleMappings = loadRoleMappings();
  console.log(`   Loaded mappings for ${Object.keys(roleMappings).length} anchors\n`);

  // Create template
  console.log('📝 Creating template file...');
  createTemplate();
  console.log('');

  // Generate individual files
  console.log('✨ Generating anchor files...');
  let successCount = 0;
  let errorCount = 0;

  anchors.forEach(anchor => {
    try {
      const fileContent = generateAnchorFile(anchor, roleMappings);
      const fileName = `${anchor.id}.adoc`;
      const filePath = path.join(ANCHORS_DIR, fileName);

      fs.writeFileSync(filePath, fileContent, 'utf-8');
      console.log(`   ✓ ${fileName}`);
      successCount++;
    } catch (error) {
      console.error(`   ✗ ${anchor.id}: ${error.message}`);
      errorCount++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully created: ${successCount} files`);
  if (errorCount > 0) {
    console.log(`   ❌ Errors: ${errorCount} files`);
  }
  console.log(`   📁 Output directory: ${ANCHORS_DIR}`);
  console.log(`\n✅ Split complete!`);
}

// Run
main();
