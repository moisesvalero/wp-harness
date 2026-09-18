import { resolveActiveModelRoute } from './router.js';
import { generateCordisModelPatch } from './cordis-overlay.js';
export function runCli() {
    const route = resolveActiveModelRoute();
    const format = process.argv.includes('--patch') ? 'patch' : 'json';
    if (format === 'patch') {
        process.stdout.write(generateCordisModelPatch(route));
    }
    else {
        console.log(JSON.stringify(route, null, 2));
    }
}
if (process.argv[1] && (process.argv[1].endsWith('cli.js') || process.argv[1].endsWith('cli.ts') || process.argv[1].endsWith('wp-model-route'))) {
    runCli();
}
//# sourceMappingURL=cli.js.map