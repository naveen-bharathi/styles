import type { AcceptedPlugin } from 'postcss'

export interface Plugins {
  [pluginName: string]: AcceptedPlugin
}

function addInPx(firstValue: string, secondValue: string) {
  return `${parseFloat(firstValue) + parseFloat(secondValue)}px`
}

function conditionalValue(...args: string[]) {
  const [condition, valueIfSatisfied, valueIfUnsatisfied] = args

  if (!condition || (condition === 'false')) {
    return valueIfUnsatisfied
  }

  return valueIfSatisfied
}

function getNotchSafeAreaValue(edge: string, value: string) {
  return `max(${value}, env(safe-area-inset-${edge}))`
}

function isEqual(firstValue: string, secondValue: string) {
  if (firstValue === secondValue) {
    return 'true'
  }

  return 'false'
}

function setImportance(value: string, importanceValue: string) {
  const isImportant = (importanceValue === '!important')

  return `${value}${isImportant ? ' !important' : ''}`
}

function unit(value: string, unit: string) {
  if (unit) {
    return `${value}${unit}`
  }

  return `${parseFloat(String(value)) / 4}rem`
}

export function getPostCssConfig(plugins: Plugins = {}) {
  return {
    plugins: Object.assign({
      'postcss-import': {},
      'postcss-each': {},
      'postcss-mixins': {},
      'postcss-simple-vars': {},
      'postcss-nested': {},
      'postcss-functions': {
        functions: {
          addInPx,
          conditionalValue,
          getNotchSafeAreaValue,
          isEqual,
          setImportance,
          unit,
        },
      },
      autoprefixer: {},
    }, plugins || {}),
  }
}
