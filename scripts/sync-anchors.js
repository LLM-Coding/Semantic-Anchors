#!/usr/bin/env node
/**
 * Sync anchor .adoc files from docs/anchors/ to website/public/docs/anchors/
 *
 * Ensures the website always has the latest anchor files available for
 * client-side rendering in the anchor modal. Runs as a pre-step for
 * both dev and build.
 *
 * Usage: node scripts/sync-anchors.js
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'docs', 'anchors')
const DEST = path.join(ROOT, 'website', 'public', 'docs', 'anchors')

function sync() {
  if (!fs.existsSync(SRC)) {
    console.warn(`[sync-anchors] Source directory not found: ${SRC}`)
    return
  }

  fs.mkdirSync(DEST, { recursive: true })

  const srcFiles = fs.readdirSync(SRC).filter((f) => f.endsWith('.adoc'))
  let copied = 0
  let skipped = 0

  for (const file of srcFiles) {
    const srcPath = path.join(SRC, file)
    const destPath = path.join(DEST, file)

    const srcStat = fs.statSync(srcPath)

    if (fs.existsSync(destPath)) {
      const destStat = fs.statSync(destPath)
      if (srcStat.mtimeMs <= destStat.mtimeMs) {
        skipped++
        continue
      }
    }

    fs.copyFileSync(srcPath, destPath)
    copied++
  }

  console.log(`[sync-anchors] ${copied} copied, ${skipped} up-to-date (${srcFiles.length} total)`)
}

sync()
