export type ResolveToRoutePath = (file: string) => string

export interface PluginOptions {
  postDir: string
  resolveToRoutePath?: ResolveToRoutePath
}
