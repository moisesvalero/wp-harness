export interface PhpSyntaxError {
  file: string
  line: number
  message: string
  raw: string
}
export interface CheckPhpSyntaxResult {
  valid: boolean
  scannedFiles: number
  errors: PhpSyntaxError[]
  engine: 'native-php' | 'wp-playground-wasm'
}
/**
 * Runs PHP syntax lint check across given file or directory.
 */
export declare function checkPhpSyntax(targetPath: string): Promise<CheckPhpSyntaxResult>
//# sourceMappingURL=check-php-syntax.d.ts.map
