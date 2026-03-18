#!/usr/bin/env node
/**
 * Create one GitHub Discussion per semantic anchor in the "Anchor Feedback" category.
 *
 * Prerequisites:
 *   - gh CLI authenticated with discussions:write scope
 *   - "Anchor Feedback" discussion category exists
 *
 * Usage: node scripts/create-anchor-discussions.js [--dry-run]
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const REPO_ID = 'R_kgDOQTHmRw'
const CATEGORY_ID = 'DIC_kwDOQTHmR84C4oz7'
const WEBSITE_URL = 'https://llm-coding.github.io/Semantic-Anchors'
const DRY_RUN = process.argv.includes('--dry-run')

const anchorsPath = path.join(__dirname, '..', 'website', 'public', 'data', 'anchors.json')
const anchors = JSON.parse(fs.readFileSync(anchorsPath, 'utf-8'))

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function ghGraphql(query) {
  const payload = JSON.stringify({ query })
  const result = execSync('gh api graphql --input -', {
    input: payload,
    encoding: 'utf-8',
  })
  return JSON.parse(result)
}

function fetchExistingDiscussions() {
  const discussions = []
  let cursor = null
  let hasNext = true

  while (hasNext) {
    const afterClause = cursor ? `, after: "${cursor}"` : ''
    const result = ghGraphql(`{
      repository(owner: "LLM-Coding", name: "Semantic-Anchors") {
        discussions(first: 100, categoryId: "${CATEGORY_ID}"${afterClause}) {
          nodes { title body }
          pageInfo { hasNextPage endCursor }
        }
      }
    }`)

    const data = result.data.repository.discussions
    discussions.push(...data.nodes)
    hasNext = data.pageInfo.hasNextPage
    cursor = data.pageInfo.endCursor
  }

  return discussions
}

function extractAnchorId(body) {
  const match = body.match(/<!-- anchor-id: ([a-z0-9-]+) -->/)
  return match ? match[1] : null
}

async function main() {
  console.log(`Found ${anchors.length} anchors`)

  // Fetch existing discussions to avoid duplicates
  console.log('Fetching existing discussions...')
  const existing = fetchExistingDiscussions()
  const existingIds = new Set(existing.map((d) => extractAnchorId(d.body)).filter(Boolean))
  console.log(`Found ${existing.length} existing discussions (${existingIds.size} with anchor IDs)`)

  const toCreate = anchors.filter((a) => !existingIds.has(a.id))
  console.log(`${toCreate.length} discussions to create`)

  if (DRY_RUN) {
    toCreate.forEach((a) => console.log(`  [dry-run] Would create: ⚓ ${a.title}`))
    return
  }

  let created = 0
  let failed = 0
  let index = 0
  const total = toCreate.length
  for (const anchor of toCreate) {
    index++
    const title = `⚓ ${anchor.title}`
    const body = [
      `<!-- anchor-id: ${anchor.id} -->`,
      '',
      `**${anchor.title}** — vote and discuss this semantic anchor.`,
      '',
      `👉 [View on Semantic Anchors website](${WEBSITE_URL}/#/anchor/${anchor.id})`,
      '',
      '---',
      '_Upvote this discussion if you find this anchor useful. Leave a comment to suggest improvements._',
    ].join('\n')

    try {
      const result = ghGraphql(`mutation {
        createDiscussion(input: {
          repositoryId: "${REPO_ID}",
          categoryId: "${CATEGORY_ID}",
          title: ${JSON.stringify(title)},
          body: ${JSON.stringify(body)}
        }) {
          discussion { url }
        }
      }`)
      const url = result.data.createDiscussion.discussion.url
      created++
      console.log(`  [${created}/${toCreate.length}] Created: ${title} → ${url}`)
    } catch (err) {
      failed++
      console.error(`  ✗ Failed: ${title} — ${err.stderr || err.message}`)
    }

    // Delay to avoid secondary rate limits
    if (index < total) {
      await sleep(2000)
    }
  }

  console.log(`\nDone. Created ${created} discussions.`)
  if (failed > 0) {
    console.error(`Failed to create ${failed} discussions.`)
    process.exitCode = 1
  }
}

main().catch(console.error)
