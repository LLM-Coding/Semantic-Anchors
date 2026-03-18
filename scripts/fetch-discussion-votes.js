#!/usr/bin/env node
/**
 * Fetch upvote and comment counts from GitHub Discussions (Anchor Feedback category).
 * Outputs website/public/data/feedback.json mapping anchor IDs to vote/comment data.
 *
 * Usage: node scripts/fetch-discussion-votes.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const CATEGORY_ID = 'DIC_kwDOQTHmR84C4oz7'

function ghGraphql(query) {
  const payload = JSON.stringify({ query })
  const result = execSync('gh api graphql --input -', {
    input: payload,
    encoding: 'utf-8',
  })
  return JSON.parse(result)
}

function fetchAllDiscussions() {
  const discussions = []
  let cursor = null
  let hasNext = true

  while (hasNext) {
    const afterClause = cursor ? `, after: "${cursor}"` : ''
    const result = ghGraphql(`{
      repository(owner: "LLM-Coding", name: "Semantic-Anchors") {
        discussions(first: 100, categoryId: "${CATEGORY_ID}"${afterClause}) {
          nodes {
            title
            body
            url
            upvoteCount
            comments { totalCount }
          }
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

function main() {
  console.log('Fetching discussion data...')
  const discussions = fetchAllDiscussions()
  console.log(`Fetched ${discussions.length} discussions`)

  const feedback = {}
  let mapped = 0

  for (const d of discussions) {
    const anchorId = extractAnchorId(d.body)
    if (!anchorId) continue

    if (feedback[anchorId]) {
      console.warn(`Duplicate mapping for "${anchorId}" found: ${d.url}`)
      continue
    }

    feedback[anchorId] = {
      upvotes: d.upvoteCount,
      comments: d.comments.totalCount,
      url: d.url,
    }
    mapped++
  }

  const outPath = path.join(__dirname, '..', 'website', 'public', 'data', 'feedback.json')
  fs.writeFileSync(outPath, JSON.stringify(feedback, null, 2) + '\n', 'utf-8')
  console.log(`✓ Written ${outPath}`)
  console.log(`  ${mapped} anchors mapped, ${discussions.length - mapped} unmapped`)
}

main()
