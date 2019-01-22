export const walk = (tree, callback, options) => {
  const { childrenPropName } = {
    childrenPropName: 'children',
    ...(options || {})
  }
  let loopContext = {}

  const loop = ({ tree, parent, level, path, callback }) => {
    tree.forEach(item => {
      const skipChildren = callback({
        node: item,
        parent,
        level,
        path,
        context: loopContext
      })
      if (skipChildren !== false && item[childrenPropName]) {
        loop({
          tree: item[childrenPropName],
          parent: item,
          level: level + 1,
          path: [...path, item.key],callback
        })
      }
    })
  }

  loop({
    tree,
    parent: null,
    level: 0,
    path: [],
    callback
  })
  loopContext = null
}

export const buildTree = (
  flatData = [],
  options
) => {
  const opts = {
    keyPropName: 'key',
    parentPropName: 'parent',
    childrenPropName: 'children',
    ...(options || {})
  }
  const KEY = opts.keyPropName
  const PARENT_KEY = opts.parentPropName
  const CHILDREN_KEY = opts.childrenPropName

  const process = value => {
    const children = []
    for (let i = 0; i < flatData.length; i++) {
      const node = flatData[i]
      if (node[PARENT_KEY] === value) {
        children.push(Object.assign(Object.create(null), node, { [CHILDREN_KEY]: process(node[KEY]) }))
      }
    }
    return children.length > 0 ? children : null
  }

  return flatData
    .filter(d => !d[PARENT_KEY])
    .map(d => Object.assign(Object.create(null), d, { [CHILDREN_KEY]: process(d[KEY]) }))
}