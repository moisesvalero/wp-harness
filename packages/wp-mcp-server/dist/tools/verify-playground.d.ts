export interface VerifyPlaygroundOptions {
  themePath: string
  port?: number
  timeoutMs?: number
}
export interface VerifyPlaygroundResult {
  success: boolean
  statusCode: number
  healthCheck: 'PASSED' | 'FAILED'
  url: string
  themeActivated: boolean
  phpFatalErrorsCount: number
  errors: string[]
  executionTimeMs: number
  details: string
}
/**
 * Headlessly verifies WordPress theme mounting in WP Playground CLI sandbox.
 */
export declare function verifyInPlayground(options: VerifyPlaygroundOptions): Promise<VerifyPlaygroundResult>
//# sourceMappingURL=verify-playground.d.ts.map
