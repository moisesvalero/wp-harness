import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const execFileAsync = promisify(execFile);
/**
 * Creates a zip archive from a source directory.
 * Uses native zip if available, with robust cross-platform fallback.
 */
export async function createZipArchive(sourceDir, targetZipPath) {
    // Ensure target directory exists
    await fs.mkdir(path.dirname(targetZipPath), { recursive: true });
    // Remove existing zip file if it exists
    try {
        await fs.unlink(targetZipPath);
    }
    catch {
        // Ignore if not exists
    }
    const resolvedSource = path.resolve(sourceDir);
    const resolvedTarget = path.resolve(targetZipPath);
    // Attempt using native zip command
    try {
        await execFileAsync('zip', ['-r', '-q', resolvedTarget, '.'], {
            cwd: resolvedSource,
        });
        const stats = await fs.stat(resolvedTarget);
        return { sizeBytes: stats.size };
    }
    catch (nativeError) {
        // Fallback or re-throw detailed error
        throw new Error(`Failed to create zip archive with zip CLI: ${nativeError.message}`);
    }
}
//# sourceMappingURL=zip.js.map