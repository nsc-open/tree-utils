import { buildTree } from "./utils";

class TreeAgent {

  constructor (tree, options = {
    keyPropsName: 'key',
    parentKeyPropName: 'parentKey',
    childrenPropName: 'children',
    leafIndicatorPropName: 'isLeaf'
  }) {


    this.nodes = [] // [{ key, node, parentNode, level, path, isLeaf, deepFirstOrder, wideFirstOrder }]
    this.keyMapping = {}
  }

  _flat () {
    const { nodes, options, _key, _isLeaf } = this

    walk(tree, ({ node, parent, level, path }) => {
      this.nodes.push({
        key: _key(node),
        node,
        parentKey: parent ? parent.key : null,
        parentNode: parent,
        level,
        path,
        isLeaf: options.leafIndicatorPropName in node
          ? _isLeaf(node)
          : (!node.children || node.children.length === 0),
        deepFirstOrder: 0,
        wideFirstOrder: 0
      })
    }, this.options)
  }

  _node (nodeOrKey) {
    if (typeof value === 'string') {
      return this.nodes.find(n => n.key === value)
    } else {
      value
    }
  }

  _isLeaf (node) {
    return node[this.options.leafIndicatorPropName]
  }

  _key (node) {
    return node[this.options.keyPropsName]
  }

  _parentKey (node) {
    return node[this.options.parentKeyPropName]
  }

  _children (node) {
    return node[this.options.childrenPropName]
  }

  traverse (handler, options = { deepFirst: true }) {
 
  }

  /**
   * build tree from this.nodes
   */
  getTree () {
    // build tree from this.nodes
    buildTree(this.nodes)
  }

  getNode (key) {
    return this.nodes.find(n => n.key === key)
  }

  getChildren (key, options = { format: 'flat' }) {
    const node = this.getNode(key)
  }

  getParent (key) {
    return this.getNode(key).parentNode
  }

  getParents (key) {

  }

  getSiblings (key) {
    const level = this.getLevel(key)
    return this.nodes.filter(n => n.level === level && n.key !== key)
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
    
  }

  isParentOf (parentKey, childKey, options = { directParent: false }) {
    
  }

  addNode (parentKey, node, index) {

  }

  removeNode (key, options = { cascade: true }) {
    const node = this.getNode(key)

    if (cascade) {

    } else {

    }
  }

  setChildren (parentKey, children) {
    const node = this.getNode(parentKey)
    
  }
  

}