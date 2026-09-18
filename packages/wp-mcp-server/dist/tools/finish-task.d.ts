import { CheckPhpSyntaxResult } from './check-php-syntax.js'
import { AuditResult } from '../utils/standards.js'
export interface FinishTaskOptions {
  themePath: string
  distDirectory?: string
}
export interface FinishTaskResult {
  completed: boolean
  themePath: string
  siteZipPath: string
  zipSizeBytes: number
  phpSyntax: CheckPhpSyntaxResult
  standardsAudit: AuditResult
  summary: string
}
/**
 * Terminal stopping tool that validates project files, executes coding standards audit,
 * and exports the production site package to dist/site.zip.
 */
export declare function finishTask(options: FinishTaskOptions): Promise<FinishTaskResult>
//# sourceMappingURL=finish-task.d.ts.map
