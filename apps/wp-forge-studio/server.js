import http from 'node:http';
import fs from 'node:fs/promises';
import { existsSync, createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');
const WORKSPACE_DIR = path.resolve(REPO_ROOT, 'workspace');
const DIST_DIR = path.resolve(REPO_ROOT, 'dist');
const ENV_FILE = path.resolve(REPO_ROOT, '.env');

import { scaffoldWordPressTheme } from '../../packages/wp-mcp-server/dist/tools/scaffold-theme.js';
import { checkPhpSyntax } from '../../packages/wp-mcp-server/dist/tools/check-php-syntax.js';
import { verifyInPlayground } from '../../packages/wp-mcp-server/dist/tools/verify-playground.js';
import { finishTask } from '../../packages/wp-mcp-server/dist/tools/finish-task.js';

async function loadEnv() {
  const env = { ...process.env };
  try {
    if (existsSync(ENV_FILE)) {
      const content = await fs.readFile(ENV_FILE, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim();
          env[k] = v;
        }
      }
    }
  } catch (err) {
    console.error('Error reading .env:', err);
  }
  return env;
}

let playgroundProcess = null;
let playgroundPort = 9400;
let playgroundTheme = null;

const MODELS = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (Recomendado)', provider: 'OpenAI / OpenRouter', desc: 'Rápido, económico y preciso para código FSE' },
  { id: 'openai/gpt-4o', name: 'GPT-4o (Máxima Potencia)', provider: 'OpenAI / OpenRouter', desc: 'Capacidad de razonamiento superior' },
  { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic / OpenRouter', desc: 'Excelente arquitectura y diseño WordPress' },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic / OpenRouter', desc: 'Ultrarrápido para iteraciones' },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google / OpenRouter', desc: 'Gran ventana de contexto y rapidez' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek / OpenRouter', desc: 'Modelo insignia de DeepSeek' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta / OpenRouter', desc: 'Open Source de última generación' }
];

const WP_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'wp_scaffold_theme',
      description: 'Generates a complete modern WordPress Block Theme (FSE) with theme.json v3, style.css, Gutenberg template parts (header, footer), templates/index.html, and functions.php.',
      parameters: {
        type: 'object',
        properties: {
          themeName: { type: 'string', description: 'Human-readable theme name, e.g. "Ristorante Bella Italia"' },
          slug: { type: 'string', description: 'Folder slug (kebab-case), e.g. "ristorante-bella-italia"' },
          description: { type: 'string', description: 'Short theme description' },
          paletteTheme: { type: 'string', enum: ['dark-gold', 'minimal', 'custom'], description: 'Color palette preset' }
        },
        required: ['themeName']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'check_php_syntax',
      description: 'Checks PHP syntax errors across the theme using WebAssembly PHP. Always run this after creating or editing PHP files.',
      parameters: {
        type: 'object',
        properties: {
          targetPath: { type: 'string', description: 'Absolute or relative path to the theme directory or file' }
        },
        required: ['targetPath']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'verify_in_playground',
      description: 'Boots an ephemeral WordPress WebAssembly instance, mounts the theme, and verifies HTTP 200 OK and absence of PHP fatal errors or White Screen of Death (WSOD).',
      parameters: {
        type: 'object',
        properties: {
          themePath: { type: 'string', description: 'Path to theme folder' }
        },
        required: ['themePath']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'finish_task',
      description: 'Audits WordPress coding standards, verifies nonces, escaping, and exports the final installable production zip to dist/site.zip.',
      parameters: {
        type: 'object',
        properties: {
          themePath: { type: 'string', description: 'Path to the finalized theme' }
        },
        required: ['themePath']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_or_update_file',
      description: 'Creates or modifies a specific file in the theme (e.g. templates/single.html, parts/header.html, style.css, functions.php).',
      parameters: {
        type: 'object',
        properties: {
          filePath: { type: 'string', description: 'Relative path from theme directory, e.g. "parts/header.html" or "style.css"' },
          content: { type: 'string', description: 'Complete file contents' },
          themeSlug: { type: 'string', description: 'Target theme slug/folder' }
        },
        required: ['filePath', 'content', 'themeSlug']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_theme_file',
      description: 'Reads the contents of an existing file in the theme.',
      parameters: {
        type: 'object',
        properties: {
          filePath: { type: 'string', description: 'Relative path from theme directory' },
          themeSlug: { type: 'string', description: 'Theme slug/folder' }
        },
        required: ['filePath', 'themeSlug']
      }
    }
  }
];

async function executeTool(name, args, emitEvent) {
  emitEvent('tool_start', { name, args });
  console.log('[WP Forge Tool] Executing: ' + name, args);

  try {
    let result = null;
    if (name === 'wp_scaffold_theme') {
      const targetDir = WORKSPACE_DIR;
      await fs.mkdir(targetDir, { recursive: true });
      result = await scaffoldWordPressTheme({
        themeName: args.themeName,
        slug: args.slug,
        description: args.description || 'Theme generated by WP Forge',
        author: 'WP Forge Autonomous Lead',
        targetDirectory: targetDir,
        paletteTheme: args.paletteTheme || 'dark-gold'
      });
      playgroundTheme = result.themeDirectory;
    } else if (name === 'check_php_syntax') {
      const targetPath = path.isAbsolute(args.targetPath)
        ? args.targetPath
        : path.resolve(WORKSPACE_DIR, args.targetPath);
      result = await checkPhpSyntax(targetPath);
    } else if (name === 'verify_in_playground') {
      const themePath = path.isAbsolute(args.themePath)
        ? args.themePath
        : path.resolve(WORKSPACE_DIR, args.themePath);
      result = await verifyInPlayground({ themePath, timeoutMs: 35000 });
    } else if (name === 'finish_task') {
      const themePath = path.isAbsolute(args.themePath)
        ? args.themePath
        : path.resolve(WORKSPACE_DIR, args.themePath);
      await fs.mkdir(DIST_DIR, { recursive: true });
      result = await finishTask({ themePath, distDirectory: DIST_DIR });
    } else if (name === 'create_or_update_file') {
      const targetPath = path.resolve(WORKSPACE_DIR, args.themeSlug, args.filePath);
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, args.content, 'utf-8');
      result = { success: true, path: targetPath, bytes: Buffer.byteLength(args.content) };
    } else if (name === 'read_theme_file') {
      const targetPath = path.resolve(WORKSPACE_DIR, args.themeSlug, args.filePath);
      const content = await fs.readFile(targetPath, 'utf-8');
      result = { success: true, path: targetPath, content };
    } else {
      throw new Error('Unknown tool: ' + name);
    }

    emitEvent('tool_finish', { name, result });
    return result;
  } catch (error) {
    console.error('[WP Forge Tool Error]:', error);
    const errorPayload = { error: error.message || String(error) };
    emitEvent('tool_error', { name, error: error.message });
    return errorPayload;
  }
}

const SYSTEM_PROMPT = `Eres WP Forge, el asistente de ingenieria y diseno especializado en WordPress mas avanzado del mundo.
Tu objetivo es disenar, codificar, verificar y entregar temas y componentes completos para WordPress basandote en lo que el usuario te pida.

DIRECTRICES CLAVE:
1. Habla siempre en espanol si el usuario escribe en espanol.
2. Se directo, profesional y enfocado en la accion.
3. Para construir un sitio o tema:
   a. Llama a 'wp_scaffold_theme' para crear la estructura FSE completa (theme.json v3, templates Gutenberg, style.css, functions.php).
   b. Si es necesario personalizar archivos, usa 'create_or_update_file' para refinar templates/index.html, parts/header.html, etc.
   c. Valida con 'check_php_syntax' para garantizar 0 errores de PHP.
   d. Verifica con 'verify_in_playground' para confirmar que el sandbox de WordPress responde HTTP 200 OK sin fallos.
   e. Empaqueta el producto final con 'finish_task' para generar el archivo dist/site.zip listo para produccion.
4. Explica brevemente lo que has hecho y avisa al usuario de que puede pulsar el boton "Probar en Playground" o "Descargar site.zip".`;

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, 'http://' + req.headers.host);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/api/config' && req.method === 'GET') {
    const env = await loadEnv();
    const openRouterKey = env.OPENROUTER_API_KEY || '';
    const openAiKey = env.OPENAI_API_KEY || '';
    const anthropicKey = env.ANTHROPIC_API_KEY || '';
    const geminiKey = env.GOOGLE_API_KEY || '';

    let activeKeyPreview = '';
    let activeProvider = 'Ninguno';
    if (openRouterKey) {
      activeKeyPreview = openRouterKey.slice(0, 10) + '...' + openRouterKey.slice(-4);
      activeProvider = 'OpenRouter';
    } else if (openAiKey) {
      activeKeyPreview = openAiKey.slice(0, 8) + '...' + openAiKey.slice(-4);
      activeProvider = 'OpenAI';
    } else if (anthropicKey) {
      activeKeyPreview = anthropicKey.slice(0, 8) + '...' + anthropicKey.slice(-4);
      activeProvider = 'Anthropic';
    } else if (geminiKey) {
      activeKeyPreview = geminiKey.slice(0, 6) + '...' + geminiKey.slice(-4);
      activeProvider = 'Gemini';
    }

    let existingThemes = [];
    try {
      if (existsSync(WORKSPACE_DIR)) {
        const dirs = await fs.readdir(WORKSPACE_DIR, { withFileTypes: true });
        existingThemes = dirs.filter(d => d.isDirectory()).map(d => d.name);
      }
    } catch {}

    const distZipExists = existsSync(path.resolve(DIST_DIR, 'site.zip'));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      hasKeys: !!(openRouterKey || openAiKey || anthropicKey || geminiKey),
      activeProvider,
      activeKeyPreview,
      models: MODELS,
      defaultModel: 'openai/gpt-4o-mini',
      existingThemes,
      distZipExists,
      playgroundRunning: !!playgroundProcess,
      playgroundPort,
      rawKeys: {
        openRouter: openRouterKey,
        openAi: openAiKey,
        anthropic: anthropicKey,
        gemini: geminiKey
      }
    }));
    return;
  }

  if (pathname === '/api/config' && req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      const data = JSON.parse(body || '{}');

      let currentEnv = '';
      if (existsSync(ENV_FILE)) {
        currentEnv = await fs.readFile(ENV_FILE, 'utf-8');
      }

      const updateKey = (text, key, val) => {
        if (!val) return text;
        const regex = new RegExp('^#?\\s*' + key + '=.*$', 'm');
        if (regex.test(text)) {
          return text.replace(regex, key + '=' + val);
        } else {
          return text.trim() + '\n' + key + '=' + val + '\n';
        }
      };

      let updated = currentEnv;
      if (data.openRouterKey) updated = updateKey(updated, 'OPENROUTER_API_KEY', data.openRouterKey);
      if (data.openAiKey) updated = updateKey(updated, 'OPENAI_API_KEY', data.openAiKey);
      if (data.anthropicKey) updated = updateKey(updated, 'ANTHROPIC_API_KEY', data.anthropicKey);
      if (data.geminiKey) updated = updateKey(updated, 'GOOGLE_API_KEY', data.geminiKey);

      await fs.writeFile(ENV_FILE, updated, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Claves guardadas correctamente en .env' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  if (pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { message, model = 'openai/gpt-4o-mini', history = [] } = JSON.parse(body || '{}');

    const env = await loadEnv();
    const apiKey = env.OPENROUTER_API_KEY || env.OPENAI_API_KEY;

    if (!apiKey) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No hay ninguna API key configurada. Pulsa en "Ajustes" para añadir tu clave de OpenRouter u OpenAI.' }));
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const sendSSE = (event, data) => {
      res.write('event: ' + event + '\ndata: ' + JSON.stringify(data) + '\n\n');
    };

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-8),
        { role: 'user', content: message }
      ];

      let keepLooping = true;
      let iterations = 0;
      const maxIterations = 8;

      while (keepLooping && iterations < maxIterations) {
        iterations++;
        sendSSE('status', { message: 'Pensando...' });

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/moisesvalero/wp-harness',
            'X-Title': 'WP Forge Studio',
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            tools: WP_TOOLS,
            tool_choice: 'auto',
            temperature: 0.3,
          })
        });

        if (!openRouterResponse.ok) {
          const errText = await openRouterResponse.text();
          throw new Error('OpenRouter Error (' + openRouterResponse.status + '): ' + errText);
        }

        const completion = await openRouterResponse.json();
        const choice = completion.choices?.[0];
        if (!choice) throw new Error('Respuesta vacia del modelo.');

        const assistantMsg = choice.message;
        messages.push(assistantMsg);

        if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
          for (const toolCall of assistantMsg.tool_calls) {
            const funcName = toolCall.function.name;
            let funcArgs = {};
            try {
              funcArgs = JSON.parse(toolCall.function.arguments || '{}');
            } catch {}

            sendSSE('tool_call', {
              id: toolCall.id,
              name: funcName,
              args: funcArgs
            });

            const toolOutput = await executeTool(funcName, funcArgs, (evt, d) => sendSSE(evt, d));

            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              name: funcName,
              content: JSON.stringify(toolOutput)
            });
          }
        } else {
          sendSSE('text', { content: assistantMsg.content || '' });
          keepLooping = false;
        }
      }

      sendSSE('done', { success: true });
      res.end();
    } catch (err) {
      console.error('[Chat Error]:', err);
      sendSSE('error', { message: err.message });
      res.end();
    }
    return;
  }

  if (pathname === '/api/playground/launch' && req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { themeName } = JSON.parse(body || '{}');

      if (playgroundProcess && playgroundProcess.exitCode === null) {
        try { playgroundProcess.kill('SIGKILL'); } catch {}
      }

      let targetMount = WORKSPACE_DIR;
      if (themeName && existsSync(path.resolve(WORKSPACE_DIR, themeName))) {
        targetMount = path.resolve(WORKSPACE_DIR, themeName);
      } else {
        const dirs = await fs.readdir(WORKSPACE_DIR).catch(() => []);
        if (dirs.length > 0) targetMount = path.resolve(WORKSPACE_DIR, dirs[0]);
      }

      playgroundPort = 9400;
      playgroundProcess = spawn('npx', [
        '-y',
        '@wp-playground/cli',
        'server',
        '--port', String(playgroundPort),
        '--auto-mount', targetMount,
        '--verbosity', 'quiet'
      ], {
        detached: false,
        stdio: 'ignore'
      });

      playgroundProcess.on('exit', () => {
        playgroundProcess = null;
      });

      let ready = false;
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 600));
        try {
          const check = await fetch('http://127.0.0.1:' + playgroundPort + '/', { redirect: 'manual' });
          if (check.status === 200 || check.status === 302) {
            ready = true;
            break;
          }
        } catch {}
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        url: 'http://127.0.0.1:' + playgroundPort + '/',
        port: playgroundPort,
        mountedTheme: path.basename(targetMount)
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  if (pathname === '/api/playground/stop' && req.method === 'POST') {
    if (playgroundProcess && playgroundProcess.exitCode === null) {
      try { playgroundProcess.kill('SIGKILL'); } catch {}
      playgroundProcess = null;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Playground detenido' }));
    return;
  }

  if (pathname === '/api/download-zip' && req.method === 'GET') {
    const zipPath = path.resolve(DIST_DIR, 'site.zip');
    if (existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="wp-forge-theme.zip"');
      createReadStream(zipPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('site.zip no encontrado. Pide al agente que genere y empaquete el tema primero.');
    }
    return;
  }

  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (existsSync(filePath) && (await fs.stat(filePath)).isFile()) {
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.ico': 'image/x-icon',
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
    return;
  }

  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    createReadStream(indexPath).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 3888;
server.listen(PORT, '127.0.0.1', () => {
  console.log('\n=============================================================');
  console.log('🔨 WP FORGE STUDIO INICIADO CON EXITO');
  console.log('=============================================================');
  console.log('📍 URL Local: http://127.0.0.1:' + PORT);
  console.log('🤖 Agente de desarrollo WordPress conectado y listo.');
  console.log('=============================================================\n');
});
