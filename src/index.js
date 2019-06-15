import { selectOne, selectAll } from 'css-select'
import { getRootNodes, getNode } from 'svelte-listener'
import adapter from './adapter.js'

export function get(selector, detail) {
  let context = Array.isArray(detail)
    ? detail.map(getNode)
    : detail
    ? getNode(detail)
    : null
  if (context == null) context = getRootNodes()

  const result = selectOne(selector, context, { xmlMode: true, adapter })
  return result ? result.detail : null
}

export function getAll(selector, detail) {
  let context = Array.isArray(detail)
    ? detail.map(getNode)
    : detail
    ? getNode(detail)
    : null
  if (context == null) context = getRootNodes()

  return selectAll(selector, context, { xmlMode: true, adapter }).map(o => o.detail)
}
