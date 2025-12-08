#!/usr/bin/env tsx
/**
 * Cleanup Script: Replace console statements with logger
 * Keeps console.error in API routes for production debugging
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

let filesChanged = 0;
let statementsReplaced = 0;

function processFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');
  let modified = content;
  let changed = false;

  // In API routes: Keep console.error, remove console.log/warn/debug
  if (filePath.includes('/api/')) {
    // Remove console.log
    const logMatches = modified.match(/console\.log\(/g);
    if (logMatches) {
      modified = modified.replace(/console\.log\(/g, '// console.log(');
      statementsReplaced += logMatches.length;
      changed = true;
    }

    // Remove console.warn
    const warnMatches = modified.match(/console\.warn\(/g);
    if (warnMatches) {
      modified = modified.replace(/console\.warn\(/g, '// console.warn(');
      statementsReplaced += warnMatches.length;
      changed = true;
    }

    // Remove console.debug
    const debugMatches = modified.match(/console\.debug\(/g);
    if (debugMatches) {
      modified = modified.replace(/console\.debug\(/g, '// console.debug(');
      statementsReplaced += debugMatches.length;
      changed = true;
    }
  } else {
    // In components/hooks: Comment out all console statements
    const allMatches = modified.match(/console\.(log|warn|debug|error)\(/g);
    if (allMatches) {
      modified = modified.replace(/console\.(log|warn|debug|error)\(/g, '// console.$1(');
      statementsReplaced += allMatches.length;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, modified, 'utf-8');
    filesChanged++;
  }
}

function processDirectory(dir: string) {
  const files = readdirSync(dir);

  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'dist', '.git'].includes(file)) {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

console.log('🧹 Starting console cleanup...\n');

processDirectory(join(process.cwd(), 'app'));

console.log(`✅ Cleanup complete!`);
console.log(`   Files changed: ${filesChanged}`);
console.log(`   Statements commented: ${statementsReplaced}\n`);

if (filesChanged > 0) {
  console.log('⚠️  Note: console.error in API routes kept for production debugging');
  console.log('💡 Review changes with: git diff\n');
}
