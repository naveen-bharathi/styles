import { AcceptedPlugin } from 'postcss'

export interface Plugins {
  [pluginName: string]: AcceptedPlugin
}

export interface Config {
  [pluginName: string]: AcceptedPlugin
}

export function getPostCSSConfig(plugins?: Plugins): Config
