import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const execFileAsync = promisify(execFile);
/**
 * Checks if native PHP CLI is present on PATH.
 */
async function hasNativePhp() {
    try {
        await execFileAsync('which', ['php']);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Parses `php -l` stdout/stderr output for syntax errors.
 */
function parsePhpLintOutput(filePath, output) {
    const errors = [];
    const lines = output.split('\n');
    for (const line of lines) {
        // Standard PHP lint error format:
        // Parse error: syntax error, unexpected token ... on line X
        // PHP Parse error:  syntax error, unexpected token ... on line X
        const match = /(?:PHP\s+)?Parse error:\s+(.*?)\s+in\s+.*?\s+on line\s+(\d+)/i.exec(line);
        if (match) {
            errors.push({
                file: filePath,
                line: parseInt(match[2], 10),
                message: match[1].trim(),
                raw: line.trim(),
            });
        }
    }
    return errors;
}
/**
 * Recursively retrieves all .php files in a directory.
 */
async function collectPhpFiles(targetPath) {
    const stats = await fs.stat(targetPath);
    if (stats.isFile()) {
        return targetPath.endsWith('.php') ? [targetPath] : [];
    }
    const results = [];
    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    for (const entry of entries) {
        if (['node_modules', 'vendor', '.git', 'dist', '.sessions'].includes(entry.name)) {
            continue;
        }
        const fullPath = path.join(targetPath, entry.name);
        if (entry.isDirectory()) {
            results.push(...(await collectPhpFiles(fullPath)));
        }
        else if (entry.isFile() && entry.name.endsWith('.php')) {
            results.push(fullPath);
        }
    }
    return results;
}
/**
 * Runs PHP syntax lint check across given file or directory.
 */
export async function checkPhpSyntax(targetPath) {
    const resolvedTarget = path.resolve(targetPath);
    const phpFiles = await collectPhpFiles(resolvedTarget);
    const errors = [];
    const isNative = await hasNativePhp();
    for (const file of phpFiles) {
        const fileDir = path.dirname(file);
        try {
            if (isNative) {
                await execFileAsync('php', ['-l', file]);
            }
            else {
                // Run via WP Playground CLI WebAssembly PHP
                const result = await execFileAsync('npx', [
                    '-y',
                    '@wp-playground/cli',
                    'php',
                    '--mount',
                    `${fileDir}:${fileDir}`,
                    '--',
                    '-l',
                    file,
                ]);
                const output = (result.stdout || '') + (result.stderr || '');
                if (output.includes('Parse error') || output.includes('Errors parsing')) {
                    errors.push(...parsePhpLintOutput(file, output));
                }
            }
        }
        catch (err) {
            const execErr = err;
            const output = (execErr.stdout || '') + (execErr.stderr || '') + (execErr.message || '');
            const parsed = parsePhpLintOutput(file, output);
            if (parsed.length > 0) {
                errors.push(...parsed);
            }
            else {
                errors.push({
                    file,
                    line: 1,
                    message: execErr.message || 'Unknown PHP syntax error',
                    raw: output,
                });
            }
        }
    }
    return {
        valid: errors.length === 0,
        scannedFiles: phpFiles.length,
        errors,
        engine: isNative ? 'native-php' : 'wp-playground-wasm',
    };
}
//# sourceMappingURL=check-php-syntax.js.map