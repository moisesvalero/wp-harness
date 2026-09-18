export interface AuditIssue {
  file: string
  line: number
  severity: 'error' | 'warning'
  rule: string
  message: string
}
export interface AuditResult {
  passed: boolean
  themeJsonValid: boolean
  styleCssValid: boolean
  templatesValid: boolean
  issues: AuditIssue[]
}
/**
 * Validates a WordPress Block Theme against standard WordPress guidelines and security best practices.
 */
export declare function auditWordPressTheme(themeDir: string): Promise<AuditResult>
//# sourceMappingURL=standards.d.ts.map
