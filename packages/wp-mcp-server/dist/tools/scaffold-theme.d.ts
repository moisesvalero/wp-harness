export interface ScaffoldOptions {
  themeName: string
  slug?: string
  description?: string
  author?: string
  targetDirectory: string
  paletteTheme?: 'dark-gold' | 'minimal' | 'custom'
  customPostTypes?: Array<{
    slug: string
    singular: string
    plural: string
    icon?: string
    supports?: string[]
  }>
}
export interface ScaffoldResult {
  success: boolean
  themeDirectory: string
  createdFiles: string[]
  message: string
}
export declare function scaffoldWordPressTheme(options: ScaffoldOptions): Promise<ScaffoldResult>
//# sourceMappingURL=scaffold-theme.d.ts.map
