import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { scaffoldWordPressTheme } from './tools/scaffold-theme.js';
import { checkPhpSyntax } from './tools/check-php-syntax.js';
import { verifyInPlayground } from './tools/verify-playground.js';
import { finishTask } from './tools/finish-task.js';
export { scaffoldWordPressTheme, checkPhpSyntax, verifyInPlayground, finishTask };
/**
 * Creates and configures the WordPress MCP Server.
 */
export function createWordPressMcpServer() {
    const server = new McpServer({
        name: 'wp-mcp-server',
        version: '0.1.0',
    });
    // Tool 1: wp_scaffold_theme
    server.tool('wp_scaffold_theme', 'Scaffolds a modern WordPress Block Theme with theme.json v3, style.css, template parts, and functions.php', {
        themeName: z.string().describe('The human-readable name of the theme, e.g. "Italian Restaurant"'),
        slug: z.string().optional().describe('Theme folder slug (kebab-case), e.g. "italian-restaurant"'),
        description: z.string().optional().describe('Brief description of the theme'),
        author: z.string().optional().describe('Author name'),
        targetDirectory: z.string().describe('Absolute or relative directory path where the theme should be created'),
        paletteTheme: z.enum(['dark-gold', 'minimal', 'custom']).optional().describe('Color palette preset'),
    }, async (params) => {
        const result = await scaffoldWordPressTheme({
            themeName: params.themeName,
            slug: params.slug,
            description: params.description,
            author: params.author,
            targetDirectory: params.targetDirectory,
            paletteTheme: params.paletteTheme,
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    });
    // Tool 2: check_php_syntax
    server.tool('check_php_syntax', 'Runs php -l syntax check across PHP files and parses any syntax errors into structured actionable JSON', {
        targetPath: z.string().describe('File path or directory path to check for PHP syntax errors'),
    }, async (params) => {
        const result = await checkPhpSyntax(params.targetPath);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    });
    // Tool 3: verify_in_playground
    server.tool('verify_in_playground', 'Mounts the theme into an ephemeral WP Playground CLI instance, executes a headless healthcheck, and asserts HTTP 200 with zero PHP fatal errors', {
        themePath: z.string().describe('Path to the theme directory to test in the playground'),
        port: z.number().optional().describe('Optional port to run the playground server on'),
        timeoutMs: z.number().optional().describe('Timeout in milliseconds (default: 35000)'),
    }, async (params) => {
        const result = await verifyInPlayground({
            themePath: params.themePath,
            port: params.port,
            timeoutMs: params.timeoutMs,
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    });
    // Tool 4: finish_task
    server.tool('finish_task', 'Terminal stopping tool that validates all project files, verifies against WordPress Coding Standards and PHP syntax, and exports to dist/site.zip', {
        themePath: z.string().describe('Path to the theme directory to validate and package'),
        distDirectory: z.string().optional().describe('Directory where dist/site.zip should be placed'),
    }, async (params) => {
        const result = await finishTask({
            themePath: params.themePath,
            distDirectory: params.distDirectory,
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    });
    return server;
}
// Start stdio transport if executed as standalone CLI
if (process.argv[1] && (process.argv[1].endsWith('wp-mcp-server') || process.argv[1].endsWith('index.js') || process.argv[1].endsWith('index.ts'))) {
    const server = createWordPressMcpServer();
    const transport = new StdioServerTransport();
    server.connect(transport).catch((err) => {
        console.error('Failed to start WordPress MCP Server:', err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map