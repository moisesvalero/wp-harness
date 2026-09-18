/**
 * Autonomous End-to-End WordPress Verification Test
 *
 * Simulates receiving the user prompt:
 * "Create a modern Italian Restaurant website with menu custom post types, booking form, and dark gold theme"
 *
 * Execution Pipeline:
 * 1. Scaffolds complete Block Theme (theme.json v3, style.css, templates, functions.php) into workspace/
 * 2. Runs PHP syntax validation via check_php_syntax
 * 3. Mounts into ephemeral @wp-playground/cli sandbox via verify_in_playground
 * 4. Asserts HTTP 200 OK, zero PHP fatal errors, zero WSOD
 * 5. Validates coding standards and packages production artifact dist/site.zip
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  scaffoldWordPressTheme,
  checkPhpSyntax,
  verifyInPlayground,
  finishTask,
} from './packages/wp-mcp-server/dist/index.js';
import { auditWordPressTheme } from './packages/wp-mcp-server/dist/utils/standards.js';

async function runAutonomousWordPressTest(): Promise<void> {
  console.log('='.repeat(80));
  console.log('🚀 WP-HARNESS: AUTONOMOUS VERIFICATION PIPELINE');
  console.log('='.repeat(80));

  const userPrompt = 'Create a modern Italian Restaurant website with menu custom post types, booking form, and dark gold theme';
  console.log(`\n📥 Received User Prompt: "${userPrompt}"\n`);

  const workspaceRoot = path.resolve('workspace');
  const distRoot = path.resolve('dist');

  // Ensure clean workspace
  await fs.rm(workspaceRoot, { recursive: true, force: true });
  await fs.mkdir(workspaceRoot, { recursive: true });

  // --------------------------------------------------------------------------
  // STEP 1: Scaffold Block Theme
  // --------------------------------------------------------------------------
  console.log('▶ [Step 1/5] Scaffolding Modern WordPress Block Theme (FSE)...');
  const themeSlug = 'ristorante-bella-italia';
  const scaffoldResult = await scaffoldWordPressTheme({
    themeName: 'Ristorante Bella Italia',
    slug: themeSlug,
    description: 'Bespoke Italian dining experience with dark gold palette, custom menu items, and secure table reservation.',
    author: 'WP-Harness Autonomous Lead',
    targetDirectory: workspaceRoot,
    paletteTheme: 'dark-gold',
  });

  console.log(`  ✓ Theme created at: ${scaffoldResult.themeDirectory}`);
  console.log(`  ✓ Created ${scaffoldResult.createdFiles.length} files: ${scaffoldResult.createdFiles.join(', ')}`);

  const themePath = scaffoldResult.themeDirectory;

  // --------------------------------------------------------------------------
  // STEP 2: PHP Syntax Linting
  // --------------------------------------------------------------------------
  console.log('\n▶ [Step 2/5] Running PHP Syntax Validation (check_php_syntax)...');
  const syntaxResult = await checkPhpSyntax(themePath);
  console.log(`  ✓ Scanned ${syntaxResult.scannedFiles} PHP file(s) via [${syntaxResult.engine}]`);
  if (!syntaxResult.valid) {
    console.error('  ✗ PHP Syntax Errors found:', syntaxResult.errors);
    throw new Error(`PHP Syntax validation failed with ${syntaxResult.errors.length} error(s).`);
  }
  console.log('  ✓ 0 PHP Syntax errors detected. Syntax clean.');

  // --------------------------------------------------------------------------
  // STEP 3: WordPress Coding Standards & Security Audit
  // --------------------------------------------------------------------------
  console.log('\n▶ [Step 3/5] Auditing WordPress Coding Standards & Security Invariants...');
  const auditResult = await auditWordPressTheme(themePath);
  console.log(`  ✓ style.css valid: ${auditResult.styleCssValid}`);
  console.log(`  ✓ theme.json v3 valid: ${auditResult.themeJsonValid}`);
  console.log(`  ✓ templates/index.html valid: ${auditResult.templatesValid}`);

  if (!auditResult.passed) {
    console.error('  ✗ Standards Audit Failed with issues:', auditResult.issues);
    throw new Error('Coding standards and security audit failed.');
  }
  console.log('  ✓ Standards and security audit PASSED (Nonces, Sanitization, Escaping checked).');

  // --------------------------------------------------------------------------
  // STEP 4: Ephemeral WP Playground Sandbox Verification
  // --------------------------------------------------------------------------
  console.log('\n▶ [Step 4/5] Booting Ephemeral WP Playground Sandbox (verify_in_playground)...');
  console.log('  ⏳ Mounting workspace into WebAssembly WordPress runtime...');

  const playgroundResult = await verifyInPlayground({
    themePath,
    timeoutMs: 45000,
  });

  console.log(`  ✓ Healthcheck Status: ${playgroundResult.healthCheck}`);
  console.log(`  ✓ HTTP Status Code: ${playgroundResult.statusCode}`);
  console.log(`  ✓ Target Sandbox URL: ${playgroundResult.url}`);
  console.log(`  ✓ Theme Activated: ${playgroundResult.themeActivated}`);
  console.log(`  ✓ Fatal PHP Errors Count: ${playgroundResult.phpFatalErrorsCount}`);
  console.log(`  ✓ Execution Time: ${playgroundResult.executionTimeMs}ms`);

  if (!playgroundResult.success || playgroundResult.statusCode !== 200) {
    console.error('  ✗ WP Playground verification failed:', playgroundResult.errors);
    throw new Error(`WP Playground verification failed: HTTP ${playgroundResult.statusCode}, errors: ${playgroundResult.errors.join('; ')}`);
  }
  console.log('  ✓ WordPress Playground Sandbox VERIFIED: HTTP 200 OK with ZERO fatal errors & zero WSOD.');

  // --------------------------------------------------------------------------
  // STEP 5: Terminal Stopping Tool & Packaging (finish_task)
  // --------------------------------------------------------------------------
  console.log('\n▶ [Step 5/5] Invoking Terminal Stopping Tool (finish_task)...');
  const finishResult = await finishTask({
    themePath,
    distDirectory: distRoot,
  });

  console.log(`  ✓ Exported ZIP: ${finishResult.siteZipPath}`);
  console.log(`  ✓ Archive Size: ${(finishResult.zipSizeBytes / 1024).toFixed(1)} KB`);
  console.log(`  ✓ Summary: ${finishResult.summary}`);

  // Assert zip exists and has size
  const zipStats = await fs.stat(finishResult.siteZipPath);
  if (zipStats.size === 0) {
    throw new Error('Exported site.zip is empty!');
  }

  console.log('\n' + '='.repeat(80));
  console.log('🎉 ALL VERIFICATION CRITERIA MET! DEFINITION OF DONE ACHIEVED.');
  console.log('='.repeat(80));
}

runAutonomousWordPressTest()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ FATAL TEST FAILURE:', error);
    process.exit(1);
  });
