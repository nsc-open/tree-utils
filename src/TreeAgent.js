import { walk } from './utils'

class TreeAgent {

  constructor (tree, options = {
    keyPropsName: 'key',
    parentKeyPropName: 'parent',
    childrenPropName: 'children',
    leafIndicatorPropName: 'isLeaf',
    // cascadeFields: []
  }) {    
    this.options = options
    this.tree = tree

    this.nodeMap = this._flatten(tree)  // { [key]: { node, parent, children, level, path, isLeaf } }
  }

  /* internal functions */

  _flatten (tree) {
    const { options, _key, _isLeaf } = this
    const nodeMap = {}

    walk(tree, ({ node, parent, level, path }) => {
      const currentNode = {
        node, level, path,
        parent: null, children: null,
        isLeaf: options.leafIndicatorPropName in node
          ? _isLeaf(node)
          : (!node.children || node.children.length === 0)
      }
      if (parent) {
        const parentNode = nodeMap[_key(parent)]
        currentNode.parent = parentNode
        parentNode.children = parentNode.children || []
        parentNode.children.push(currentNode)  
      }
      nodeMap[_key(node)] = currentNode
    }, options)

    return nodeMap
  }

  _nodeProp (node, propName /*, value */) {
    if (arguments.length > 2) {
      return node[propName] = arguments[2]
    } else {
      return node[propName]
    }
  }

  _isLeaf = (node, ...args) => {
    return this._nodeProp(node, this.options.leafIndicatorPropName, ...args)
  }

  _key = (node, ...args) => {
    return this._nodeProp(node, this.options.keyPropsName, ...args)
  }

  _parentKey = (node, ...args) => {
    return this._nodeProp(node, this.options.parentKeyPropName, ...args)
  }

  _children = (node, ...args) => {
    return this._nodeProp(node, this.options.childrenPropName, ...args)
  }

  /* getter functions */

  getTree () {
    return this.tree
  }

  getNode (key) {
    const node = this.nodeMap[key]
    if (!node) {
      console.warn(`'${key} node does not exists`)
    }
    return node || null
  }

  getChildren (key) {
    if (key) {
      return Object.values(this.nodeMap).filter(n => n.path.includes(key))
    } else {
      return Object.values(this.nodeMap)
    }
  }

  getParent (key) {
    const node = this.getNode(key)
    if (!node) {
      return null
    }
    return node.parent || null
  }

  getParents (key) {
    const node = this.getNode(key)
    return node ? node.path.map(key => this.getNode(key)) : []
  }

  getSiblings (key) {
    const level = this.getLevel(key)
    return level === null ? [] : Object.values(this.nodeMap).filter(n => n.level === level && this._key(n.node) !== key)
  }

  /**
   * get leaves of whole tree or given tree node
   * @param {String} key optional
   */
  getLeaves (key) {
    if (key) {
      return this.getChildren(key).filter(n => n.isLeaf)
    } else {
      return this.nodes.filter(n => n.isLeaf)
    }
  }

  /**
   * return level of whole tree or give tree node
   * @param {String} key optional
   */
  getLevel (key) {
    const node = this.getNode(key)
    return node ? node.level : null
  }

  /* test functions */

  isTop (key) {
    return this.getLevel(key) === 0
  }

  isLeaf (key) {
    return this.getNode(key).isLeaf
  }

  isChildOf (childKey, parentKey, options = { directChild: false }) {
    const childNode = this.getNode(childKey)
    if (!childNode) {
      return false
    }

    if (options.directChild) {
      return childNode.parent ? this._key(childNode.parent.node) === parentKey : false
    } else {
      return childNode.path.includes(parentKey)
    }
  }

  isParentOf (parentKey, childKey, options = { directParent: false }) {
    return this.isChildOf(childKey, parentKey, { directChild: options.directParent })
  }

  /* traverse function */

  traverse (handler) {
    // the order would like: ["0", "1", "2", "0-0", "0-1", "0-1-0", "0-1-1", "0-1-1-0", "0-2", "1-0", "1-1", "1-1-0", "1-1-1", "1-1-2"]
    Object.values(this.nodeMap).forEach(handler)
  }

  /* cascade value related query and setting operations */

  some (key, fn) {
    return this.getChildren(key).some(fn)
  }

  every (key, fn) {
    return this.getChildren(key).every(fn)
  }

  /**
   * 
   * @param {String} key 
   * @param {String} fieldName 
   * @param {Any} fieldValue 
   * @param {Boolean} cascade
   */
  /* setFieldValue (key, fieldName, fieldValue, options = { cascade: false, beforeSet: null }) {
    const node = this.getNode(key)
    if (!node) {
      return
    }

    const _setCascadeField = (node, indeterminate) => {
      node.cascadeFields = node.cascadeFields || {}
      node.cascadeFields[fieldName] = { value: fieldValue, indeterminate }
    }

    const { _key } = this
    const { cascade, beforeSet } = options

    node.node[fieldName] = fieldValue
    
    if (cascade) {
      _setCascadeField(node, true)

      // set value for children
      this.getChildren(key).forEach(child => {
        // ignore if beforeSet returns false
        if (beforeSet && beforeSet(child) === false) {
          return
        }

        child.node[fieldName] = fieldValue
        _setCascadeField(child, true)
      })

      // set value for parents
      this.getParents(key).forEach(parent => {
        if (beforeSet && beforeSet(parent) === false) {
          return
        }

        // forEach parents from bottom to top
        // if all direct children have the same value and non-indeterminate,
        // then set parent as non-indeterminate value
        this.getParents(key).reverse().forEach(parent => {
          const indeterminate = !parent.children.every(child => {
            const { value, indeterminate } = this.getFieldValue(_key(child.node), fieldName, true)
            return value === fieldValue && !indeterminate
          })

          _setCascadeField(parent, indeterminate)
        })
      })
    }
  }

  getFieldValue (key, fieldName, cascade = false) {
    const node = this.getNode(key)
    if (!node) {
      return
    }

    const value = node.node[fieldName]

    if (!cascade) {
      return value
    } else {
      node.cascadeFields = node.cascadeFields || {}
      return node.cascadeFields[fieldName]
    }
  } */


  /* operations need to be done by these provided agent functions */
  /* don't modify tree or node directly, it will leads undetermined result */

  addNode (parentKey, node/*, index TODO */) {
    const { _key, _parentKey, _children, options } = this
    const { keyPropsName } = options
    const key = _key(node)
    if (!key) {
      console.warn(`cannot find valid key from node.${keyPropsName}`)
      return false
    }

    const parent = this.getNode(parentKey)
    if (parentKey && !parent) {
      console.warn(`cannot find parent of key: ${parentKey}`)
      return false
    }
    
    // make sure it has parentKey set
    _parentKey(node, parentKey)

    // modify tree
    if (!parent) {
      this.tree.push(node) // add to top level
    } else {
      const children = _children(parent.node)
      if (!children) {
        _children(parent.node, [node])
      } else {
        children.push(node)
      }
    }

    // update nodeMap
    // recalculate nodeMap
    this.nodeMap = this._flatten(this.tree) // this way is easy but less efficiency

    /*
    // [{ node, parent, children, level, path, isLeaf }]
    const subNodeMap = this._flatten([node]) 
    Object.values(subNodeMap).forEach(n => {
      // connect node with parent
      if (_key(n.node) === key) {
        n.parent = parent
        
        // set children of parent in both nodeMap and tree
        if (parent.children) {
          parent.children.push(n)
          _children(parent.node).push(n.node)
        } else {
          parent.children = [n]
          _children(parent.node, [n.node])
        }
      }

      // modify level and path
      n.level += parent.level + 1
      n.path = [...parent.path, ...n.path]

      // add to the main nodeMap
      this.nodeMap[_key(n.node)] = n
    })
    */
  }

  removeNode (key) {
    const node = this.getNode(key)
    if (!node) {
      return
    }

    const { _key, _children } = this

    this.getChildren(key).forEach(child => {
      this.nodeMap[_key(child.node)] = null
    })

    node.children = null
    node.isLeaf = true
    _children(node, null)

    return node
  }

  /**
   * move target node down to a parent node
   * @param {String} key 
   * @param {String} parentKey optional
   */
  moveNode (key, parentKey) {
    const node = this.getNode(key)
    if (!node) {
      return
    }

    this.removeNode(key)
    this.addNode(parentKey, node.node)
  }

  addChildren (parentKey, children) {
    children.forEach(child => this.addNode(parentKey, child))
  }

  removeChildren (parentKey) {
    const parent = this.getNode(parentKey)
    if (!parent || !parent.children || parent.children.length === 0) {
      return
    }

    parent.children.forEach(child => this.removeNode(this._key(child.node)))
  }

  setChildren (parentKey, children) {
    const parent = this.getNode(parentKey)
    if (!parent) {
      return
    }

    this.removeChildren(parentKey)
    this.addChildren(parentKey, children)
  } 
}

export default TreeAgent