import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { checkPhpSyntax } from './check-php-syntax.js';
import { auditWordPressTheme } from '../utils/standards.js';
import { createZipArchive } from '../utils/zip.js';
/**
 * Terminal stopping tool that validates project files, executes coding standards audit,
 * and exports the production site package to dist/site.zip.
 */
export async function finishTask(options) {
    const resolvedThemePath = path.resolve(options.themePath);
    const resolvedDistDir = path.resolve(options.distDirectory || path.join(resolvedThemePath, '..', 'dist'));
    const zipTargetPath = path.join(resolvedDistDir, 'site.zip');
    // 1. Run PHP Syntax Check
    const phpSyntax = await checkPhpSyntax(resolvedThemePath);
    if (!phpSyntax.valid) {
        throw new Error(`Cannot finish task: PHP syntax errors detected in ${phpSyntax.errors.length} location(s).`);
    }
    // 2. Run Standards & Security Audit
    const standardsAudit = await auditWordPressTheme(resolvedThemePath);
    if (!standardsAudit.passed) {
        const errorCount = standardsAudit.issues.filter(i => i.severity === 'error').length;
        throw new Error(`Cannot finish task: Theme failed coding standards & security audit with ${errorCount} error(s).`);
    }
    // 3. Export to dist/site.zip
    await fs.mkdir(resolvedDistDir, { recursive: true });
    const { sizeBytes } = await createZipArchive(resolvedThemePath, zipTargetPath);
    return {
        completed: true,
        themePath: resolvedThemePath,
        siteZipPath: zipTargetPath,
        zipSizeBytes: sizeBytes,
        phpSyntax,
        standardsAudit,
        summary: `WordPress project successfully validated and packaged to dist/site.zip (${(sizeBytes / 1024).toFixed(1)} KB). All WordPress Coding Standards & PHP syntax checks passed.`,
    };
}
//# sourceMappingURL=finish-task.js.map