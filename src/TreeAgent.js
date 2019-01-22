import { walk } from './utils'

class TreeAgent {

  constructor (tree, options = {
    keyPropsName: 'key',
    parentKeyPropName: 'parentKey',
    childrenPropName: 'children',
    leafIndicatorPropName: 'isLeaf',
    cascadeFields: []
  }) {    
    this.options = options
    this.tree = tree

    this.nodeMap = this._flatten(tree)  // { [key]: { node, parent, children, level, path, isLeaf } }
    this.keyMapping = {}
  }

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

  _isLeaf (node, ...args) {
    return this._nodeProp(node, this.options.leafIndicatorPropName, ...args)
  }

  _key (node, ...args) {
    return this._nodeProp(node, this.options.keyPropsName, ...args)
  }

  _parentKey (node, ...args) {
    return this._nodeProp(node, this.options.parentKeyPropName, ...args)
  }

  _children (node, ...args) {
    return this._nodeProp(node, this.options.childrenPropName, ...args)
  }



  getTree () {
    return this.tree
  }

  getNode (key) {
    const node = this.nodeMap[key]
    if (!node) {
      console.warn(`'${key} node does not exists`)
    }
    return node
  }

  getChildren (key) {
    return Object.values(this.nodeMap).filter(n => n.path.includes(key))
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
    return node.path.map(key => this.getNode(key))
  }

  getSiblings (key) {
    const level = this.getLevel(key)
    return Object.values(this.nodeMap).filter(n => n.level === level && this._key(n.node) !== key)
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
    return this.getNode(key).level
  }

  isTop (key) {
    return this.getLevel(key) === 0
  }

  isLeaf (key) {
    return this.getNode(key).isLeaf
  }

  isChildOf (childKey, parentKey, options = { directChild: false }) {
    if (options.directChild) {
      const childNode = this.getNode(childKey)
      return this._key(childNode.parent) === parentKey
    } else {
      const parentNode = this.getNode(parentKey)
      return parentNode.path.includes(childKey)
    }
  }

  isParentOf (parentKey, childKey, options = { directParent: false }) {
    return this.isChildOf(childKey, parentKey, { directChild: options.directParent })
  }

  


  traverse (handler) {
    Object.values(this.nodeMap).forEach(n => handler(n))
  }

  /* cascade value related query and setting operations */
  
  some (key, fn) {
    return !!this.getChildren(key).find(fn)
  }

  every (key, fn) {
    const children = this.getChildren(key)
    return children.filter(fn).length === children.length
  }

  /**
   * 
   * @param {String} key 
   * @param {String} fieldName 
   * @param {Any} fieldValue 
   * @param {Boolean} cascade
   * 
   */
  setFieldValue (key, fieldName, fieldValue, options = { cascade: false, beforeSet: null }) {
    const node = this.getNode(key)
    if (!node) {
      return
    }

    const { cascade, beforeSet } = options
    node.node[fieldName] = fieldValue

    if (cascade) {
      // set value for children
      this.getChildren(key).forEach(child => {
        // ignore if beforeSet returns false
        if (beforeSet && beforeSet(child) === false) {
          return
        }

        child.node[fieldName] = fieldValue
      })

      // set value for parents
      this.getParents(key).forEach(parent => {
        if (beforeSet && beforeSet(parent) === false) {
          return
        }


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
      return { value, indeterminate: false } 
    }
  }


  /* operations need to be done by these provided agent functions */
  /* don't modify tree or node directly, it will leads undetermined result */

  addNode (parentKey, node, index /* TODO */) {
    const { _key, _parentKey, _children, options } = this
    const { keyPropsName } = options

    const parent = this.getNode(parentKey)
    const key = _key(node)

    if (!key) {
      console.warn(`cannot find valid key from node.${keyPropsName}`)
      return false
    }
    
    // make sure it has parentKey set
    _parentKey(node, parentKey)


    if (!parent) {
      // add to top level
      
    } else {

    }

    

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
      this.nodeMap(_key(n.node)) = n
    })
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