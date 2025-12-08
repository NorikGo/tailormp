#!/usr/bin/env tsx
/**
 * Performance Check Script
 * Checks for common performance issues
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

interface Issue {
  type: 'console.log' | 'large-file' | 'missing-lazy-load';
  file: string;
  line?: number;
  message: string;
}

const issues: Issue[] = [];

// Check for console.logs in production code
function checkConsoleLogs(dir: string) {
  const files = readdirSync(dir);

  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'dist', '.git'].includes(file)) {
        checkConsoleLogs(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        if (line.includes('console.log') && !line.includes('// ')) {
          issues.push({
            type: 'console.log',
            file: fullPath,
            line: index + 1,
            message: `Found console.log (should use logger in production)`,
          });
        }
      });

      // Check file size
      const sizeKB = stat.size / 1024;
      if (sizeKB > 300) {
        issues.push({
          type: 'large-file',
          file: fullPath,
          message: `File is ${Math.round(sizeKB)}KB (consider splitting)`,
        });
      }
    }
  }
}

// Run checks
console.log('🔍 Running performance checks...\n');

checkConsoleLogs(join(process.cwd(), 'app'));

// Report
if (issues.length === 0) {
  console.log('✅ No performance issues found!\n');
} else {
  console.log(`⚠️  Found ${issues.length} potential issues:\n`);

  const byType = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('Summary:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  console.log('\nDetails:');
  issues.slice(0, 20).forEach((issue) => {
    const location = issue.line ? `:${issue.line}` : '';
    console.log(`  ${issue.file}${location}`);
    console.log(`    → ${issue.message}\n`);
  });

  if (issues.length > 20) {
    console.log(`  ... and ${issues.length - 20} more\n`);
  }
}

process.exit(issues.length > 0 ? 1 : 0);
