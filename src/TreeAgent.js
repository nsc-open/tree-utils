import { walk } from './utils'

class TreeAgent {

  constructor (tree, options = {
    keyPropsName: 'key',
    parentKeyPropName: 'parent',
    childrenPropName: 'children'
    // cascadeFields: []
  }) {    
    this.options = options
    this.tree = tree

    this.nodeMap = this._flatten(tree)  // { [key]: { node, parent, children, level, path } }
    this._preventSync = false
  }

  /* internal functions */

  _flatten (tree) {
    const { options, _key } = this
    const nodeMap = {}

    walk(tree, ({ node, parent, level, path }) => {
      const currentNode = {
        node, level, path,
        parent: null, children: null
      }
      if (parent) {
        const parentNode = nodeMap[_key(parent)]
        currentNode.parent = parentNode
        parentNode.children = parentNode.children || []
        parentNode.children.push(currentNode)  
      }
      nodeMap[_key(node)] = currentNode // node key should be unqiue in the whole tree
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

  _key = (node, ...args) => {
    return this._nodeProp(node, this.options.keyPropsName, ...args)
  }

  _parentKey = (node, ...args) => {
    return this._nodeProp(node, this.options.parentKeyPropName, ...args)
  }

  _children = (node, ...args) => {
    return this._nodeProp(node, this.options.childrenPropName, ...args)
  }

  sync () {
    if (!this._preventSync) {
      this.nodeMap = this._flatten(this.tree)  
    }
  }

  syncWrapper (func) {
    this._preventSync = true
    func()
    this._preventSync = false
    this.sync()
  }

  /* getter functions */

  getTree () {
    return this.tree
  }

  getNode (key) {
    const node = this.nodeMap[key]
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
    // TODO
  }

  /**
   * return level of whole tree or give tree node
   * @param {String} key optional
   */
  getLevel (key) {
    if (arguments.length === 0) {
      const levels = Object.values(this.nodeMap).map(n => n.level)
      return Math.max(...levels) 
    } else {
      const node = this.getNode(key)
      return node ? node.level : null
    }
  }

  /* test functions */

  isTop (key) {
    return this.getLevel(key) === 0
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

    // recalculate nodeMap
    this.sync()
  }

  /**
   * remove node with children
   */
  removeNode (key) {
    const node = this.getNode(key)
    if (!node) {
      return false
    }

    const { _key, _children } = this
    const { parent } = node

    if (parent) {
      _children(
        parent.node,
        _children(parent.node).filter(childNode => _key(childNode) !== key)
      )
    } else {
      this.tree = this.tree.filter(topNode => _key(topNode) !== key)
    }

    this.sync()
    return node
  }

  /**
   * move target node down to a parent node or the top level of the tree
   * @param {String} key 
   * @param {String} parentKey optional
   * @return moved node
   */
  moveNode (key, parentKey) {
    if (this.isChildOf(parentKey, key)) {
      console.warn('cannot move a node into its children node')
      return false
    }

    const moveToTop = !parentKey
    const node = this.getNode(key)
    if (!node) {
      console.warn(`target node ${key} does not exist`)
      return false
    }

    const parentNode = moveToTop ? null : this.getNode(parentKey)
    if (!moveToTop && !parentNode) {
      console.warn(`parent node ${parentKey} does not exist`)
      return false
    }
    
    this.syncWrapper(() => {
      const removedNode = this.removeNode(key)
      this.addNode(parentKey, removedNode.node)
    })
  }

  addChildren (parentKey, children) {
    const parent = this.getNode(parentKey)
    if (!parent) {
      console.warn(`target node ${parentKey} does not exist`)
      return false
    }

    children = Array.isArray(children) ? children : [children]
    this.syncWrapper(() => {
      children.forEach(child => this.addNode(parentKey, child))
    })
  }

  removeChildren (parentKey) {
    const parent = this.getNode(parentKey)
    if (!parent) {
      console.warn(`target node ${parentKey} does not exist`)
      return false
    }

    const { _children, _key } = this
    if (!_children(parent.node) || _children(parent.node).length === 0) {
      return
    }

    this.syncWrapper(() => {
      _children(parent.node).forEach(childNode => this.removeNode(_key(childNode)))
    })
  }

  setChildren (parentKey, children) {
    const parent = this.getNode(parentKey)
    if (!parent) {
      console.warn(`target node ${parentKey} does not exist`)
      return false
    }

    children = Array.isArray(children) ? children : [children]
    this.syncWrapper(() => {
      this.removeChildren(parentKey)
      this.addChildren(parentKey, children)
    })
  } 
}

export default TreeAgent