---
name: wordpress-fse-theme
description: Architecture, file structure, and design rules for modern WordPress Full Site Editing (FSE) Block Themes using theme.json version 3.
---

# WordPress Full Site Editing (FSE) Block Theme Development

This skill governs the generation and modification of WordPress Block Themes in WP-Harness.

## 1. Mandatory Block Theme File Architecture
Every WordPress Block Theme MUST strictly provide the following structure:
```
<theme-folder>/
├── style.css             # Theme metadata header (Theme Name, Version, Requires at least: 6.6)
├── theme.json            # Version 3 design token schema
├── functions.php         # Strict types, theme supports, CPT registration, REST hooks
├── readme.txt            # WordPress metadata and changelog
├── templates/
│   └── index.html        # Root FSE template with Gutenberg block markup
└── parts/
    ├── header.html       # Header template part
    └── footer.html       # Footer template part
```

## 2. theme.json (Version 3) Rules
- MUST specify `"$schema": "https://schemas.wp.org/trunk/theme.json"`.
- MUST use `"version": 3`.
- Enable `"appearanceTools": true` under `"settings"`.
- Define semantic color palettes under `"settings.color.palette"` with descriptive names and slugs (`primary`, `base`, `contrast`, `muted`, etc.).
- Enable fluid typography under `"settings.typography.fluid": true`.
- Style elements (`heading`, `link`, `button`) under `"styles.elements"` referencing preset variables (e.g. `var(--wp--preset--color--primary)`).

## 3. Template & Block Markup Standards
- Block template files (`.html`) MUST contain valid Gutenberg HTML block comments:
  - `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->`
  - `<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} --> ... <!-- /wp:group -->`
  - `<!-- wp:query {"queryId":1,"query":{"postType":"..."}} --> ... <!-- /wp:query -->`
- NEVER write classic PHP template tags (`get_header()`, `have_posts()`, `the_post()`) inside `.html` template files.

## 4. Custom Post Types & Meta
- Register custom post types inside `functions.php` on the `init` action.
- Always include `'show_in_rest' => true` to ensure CPTs are visible in the Block Editor and Query Loop blocks.
- Set appropriate capabilities and labels.
