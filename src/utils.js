const walk = (treeData, callback, options = { childrenPropName: 'children' }) => {
  let loopContext = {}
  const childrenPropName = options.childrenPropName || 'children'

  const loop = (tData, parentItem, ck) => {
    tData.forEach(item => {
      const skipChildren = ck(item, parentItem, loopContext)
      if (skipChildren !== false && item[childrenPropName]) {
        loop(item[childrenPropName], item, ck)
      }
      ck(item, parentItem, loopContext, 'beforeNextSibling')
    })
  }

  loop(treeData, null, callback)
  loopContext = null
}

const buildTree = (flatData, options = { parentPropName: 'parent', childrenPropName: 'children' }) => {

}