---
name: wordpress-security-and-verification
description: Security guidelines (nonces, capability checks, input sanitization, output escaping) and mandatory automated WP Playground verification rules.
---

# WordPress Security Standards & Ephemeral Verification Rules

This skill governs the security requirements and the verification loop for all WordPress code generated within WP-Harness.

## 1. WordPress Security Standards

### A. Nonce Verification
- Every form submission, AJAX handler, and state-modifying action MUST verify a nonce.
- Admin forms: `check_admin_referer('action_name', 'nonce_field_name')`.
- Custom / frontend forms: `wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'])), 'action_name')`.
- Reject invalid requests with `wp_die(..., 'Security Check', ['response' => 403])`.

### B. Capability Checks
- Never rely solely on authentication; verify specific capabilities before performing privileged actions:
  ```php
  if (!current_user_can('edit_posts')) {
      wp_die(esc_html__('Non hai i permessi per eseguire questa azione.', 'text-domain'), 403);
  }
  ```

### C. Input Sanitization
- All incoming input from superglobals (`$_GET`, `$_POST`, `$_REQUEST`) must be unslashed and sanitized before use:
  - Text: `sanitize_text_field(wp_unslash($_POST['key']))`
  - Email: `sanitize_email(wp_unslash($_POST['email']))`
  - Slugs/Keys: `sanitize_key(...)`
  - Integers: `absint(...)` or `intval(...)`
  - Rich text: `wp_kses_post(wp_unslash($_POST['content']))`

### D. Output Escaping
- Never output raw data or variables to HTML directly.
- HTML text: `esc_html(...)` or `esc_html__()`
- HTML attributes: `esc_attr(...)`
- URLs: `esc_url(...)`
- JavaScript inline: `esc_js(...)` or `wp_json_encode(...)`

## 2. Mandatory Verification in WP Playground CLI
- **PROHIBITION**: An agent is strictly prohibited from marking a task as done, invoking `finish_task`, or declaring completion without first executing `verify_in_playground`.
- Verification criteria:
  1. `check_php_syntax`: Must yield 0 errors.
  2. `verify_in_playground`: Mount workspace in `@wp-playground/cli`, assert `HTTP 200` OK, verify theme is active, and assert ZERO PHP fatal errors / warnings / WSOD.
  3. `finish_task`: Must validate coding standards and package `dist/site.zip`.
