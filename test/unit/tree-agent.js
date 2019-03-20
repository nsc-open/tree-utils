const expect = require('chai').expect
const { TreeAgent, buildTree } = require('../../src/index')
const { flatTreeData, treeData } = require('../../mock')

describe('TreeAgent', function () {
  const tree = buildTree(flatTreeData)
  const treeAgent = new TreeAgent(tree)

  describe('getTree()', function () {
    it('should return tree', function () {
      expect(treeAgent.getTree()).to.equal(tree)
    })
  })

  describe('getNode()', function () {
    it('should not get any node with wrong key', function () {
      expect(treeAgent.getNode('wrong-key')).to.be.null
    })

    it('should get node with key "0"', function () {
      const node = treeAgent.getNode('0')
      expect(node.node).to.equal(tree[0])
      expect(node.level).to.equal(0)
      expect(node.parent).to.be.null
      expect(node.children).to.have.lengthOf(tree[0].children.length)
      expect(node.path).to.deep.equal([])
    })

    it('should get node with key "0-1-1"', function () {
      const node = treeAgent.getNode('0-1-1')
      expect(node.node).to.equal(tree[0].children[1].children[1])
      expect(node.level).to.equal(2)
      expect(node.parent.node.key).to.equal('0-1')
      expect(node.children).to.have.lengthOf(tree[0].children[1].children[1].children.length)
      expect(node.path).to.deep.equal(['0', '0-1'])
    })
  })

  describe('getChildren()', function () {
    it('should return all nodes without passing key', function () {
      const children = treeAgent.getChildren()
      expect(children).to.have.lengthOf(flatTreeData.length)
    })

    it('should return children of node with specified key', function () {
      const children = treeAgent.getChildren('1-1')
      expect(children).to.have.lengthOf(3)
      children.forEach((child, index) => {
        expect(child.node.key).to.equal(`1-1-${index}`)
      })
    })
  })

  describe('getParent()', function () {
    it('should return null with wrong key', function () {
      expect(treeAgent.getParent('wrong-key')).to.be.null
    })

    it('should return parent with given node key "0-1-1-0"', function () {
      const parent = treeAgent.getParent('0-1-1-0')
      expect(parent.node.key).to.equal('0-1-1')
    })
  })

  describe('getParents()', function () {
    it('should return [] for wrong key', function () {
      expect(treeAgent.getParents('wrong-key')).to.deep.equal([])
    })

    it('should return 3 parents for node "0-1-1-0"', function () {
      const parents = treeAgent.getParents('0-1-1-0')
      const parentKeys = parents.map(p => p.node.key)
      expect(parents).to.have.lengthOf(3)
      expect(parentKeys).to.include('0')
      expect(parentKeys).to.include('0-1')
      expect(parentKeys).to.include('0-1-1')
    })
  })

  describe('getSiblings()', function () {
    it('should return [] for wrong key', function () {
      expect(treeAgent.getSiblings('wrong-key')).to.be.an('array').that.is.empty
    })

    it('should return siblings for node "0"', function () {
      const siblings = treeAgent.getSiblings('0')
      const keys = siblings.map(p => p.node.key)
      expect(siblings).to.be.an('array').that.have.lengthOf(2)
      expect(keys).to.include('1')
      expect(keys).to.include('2')
    })

    it('should return siblings for node "0-1-1"', function () {
      const siblings = treeAgent.getSiblings('0-1-1')
      const keys = siblings.map(p => p.node.key)
      expect(siblings).to.be.an('array').that.have.lengthOf(4)
      expect(keys).to.include('0-1-0')
      expect(keys).to.include('1-1-0')
      expect(keys).to.include('1-1-1')
      expect(keys).to.include('1-1-2')
    })

    it('should return [] for node "0-1-1-0"', function () {
      const siblings = treeAgent.getSiblings('0-1-1-0')
      expect(siblings).to.be.an('array').that.is.empty
    })
  })

  describe('getLevel()', function () {
    it('should return null for wrong key', function () {
      expect(treeAgent.getLevel('wrong-key')).to.be.null
    })

    it('should return right levels for nodes', function () {
      expect(treeAgent.getLevel("0")).to.equal(0)
      expect(treeAgent.getLevel("0-1")).to.equal(1)
      expect(treeAgent.getLevel("1-1-2")).to.equal(2)
    })

    it('should return tree level for passing no key', function () {
      expect(treeAgent.getLevel()).to.equal(3)
    })
  })

  describe('isTop()', function () {
    it('should work', function () {
      expect(treeAgent.isTop("0")).to.equal(true)
      expect(treeAgent.isTop("1")).to.equal(true)
      expect(treeAgent.isTop("0-1")).to.equal(false)
      expect(treeAgent.isTop("0-1-1-0")).to.equal(false)
      expect(treeAgent.isTop("wrong-key")).to.equal(false)
    })
  })

  describe('isChildOf()', function () {
    it('should work for indirect children case', function () {
      expect(treeAgent.isChildOf('wrong-key', '0')).to.equal(false)
      expect(treeAgent.isChildOf('0-1', 'wrong-key')).to.equal(false)
      expect(treeAgent.isChildOf('0', '0')).to.equal(false)
      expect(treeAgent.isChildOf('1-1-2', '0')).to.equal(false)
      expect(treeAgent.isChildOf('0-1', '0-2')).to.equal(false)

      expect(treeAgent.isChildOf('0-1', '0')).to.equal(true)
      expect(treeAgent.isChildOf('1-1-2', '1-1')).to.equal(true)
      expect(treeAgent.isChildOf('1-1-2', '1')).to.equal(true)
    })

    it('should work for direct children case', function () {
      const options = { directChild: true }
      expect(treeAgent.isChildOf('wrong-key', '0', options)).to.equal(false)
      expect(treeAgent.isChildOf('0-1', 'wrong-key', options)).to.equal(false)
      expect(treeAgent.isChildOf('0', '0', options)).to.equal(false)
      expect(treeAgent.isChildOf('1-1-2', '0', options)).to.equal(false)
      expect(treeAgent.isChildOf('0-1', '0-2', options)).to.equal(false)

      expect(treeAgent.isChildOf('0-1', '0', options)).to.equal(true)
      expect(treeAgent.isChildOf('1-1-2', '1-1', options)).to.equal(true)
      expect(treeAgent.isChildOf('1-1-2', '1', options)).to.equal(false)
    })
  })

  describe('isParentOf()', function () {
    it('should work for indirect parent case', function () {
      expect(treeAgent.isParentOf('0', 'wrong-key')).to.equal(false)
      expect(treeAgent.isParentOf('wrong-key', '0-1')).to.equal(false)
      expect(treeAgent.isParentOf('0', '0')).to.equal(false)
      expect(treeAgent.isParentOf('0', '1-1-2')).to.equal(false)
      expect(treeAgent.isParentOf('0-2', '0-1')).to.equal(false)

      expect(treeAgent.isParentOf('0', '0-1')).to.equal(true)
      expect(treeAgent.isParentOf('1-1', '1-1-2')).to.equal(true)
      expect(treeAgent.isParentOf('1', '1-1-2')).to.equal(true)
    })

    it('should work for direct parent case', function () {
      const options = { directParent: true }
      expect(treeAgent.isParentOf('0', 'wrong-key', options)).to.equal(false)
      expect(treeAgent.isParentOf('wrong-key', '0-1', options)).to.equal(false)
      expect(treeAgent.isParentOf('0', '0', options)).to.equal(false)
      expect(treeAgent.isParentOf('0', '1-1-2, options')).to.equal(false)
      expect(treeAgent.isParentOf('0-2', '0-1', options)).to.equal(false)

      expect(treeAgent.isParentOf('0', '0-1', options)).to.equal(true)
      expect(treeAgent.isParentOf('1-1', '1-1-2', options)).to.equal(true)
      expect(treeAgent.isParentOf('1', '1-1-2', options)).to.equal(false)
    })
  })

  describe('traverse()', function () {
    it('should traverse every node', function () {
      const keys = []
      treeAgent.traverse(node => {
        if (!keys.includes(node.node.key)) {
          keys.push(node.node.key)
        }
      })
      expect(keys).to.have.lengthOf(flatTreeData.length)
    })
  })

  describe('some()', function () {
    it('should work', function () {
      expect(treeAgent.some('0', node => node.node.key === '0-1-1-0')).to.be.true
      expect(treeAgent.some('0', node => node.node.key === '0-2')).to.be.true
      expect(treeAgent.some('0', node => node.node.key === 'wrong-key')).to.be.false
      expect(treeAgent.some('1-1-2', node => node)).to.be.false
    })
  })

  describe('every()', function () {
    it('should work', function () {
      expect(treeAgent.some('1', node => node.node.key.startsWith('1-'))).to.be.true
    })
  })

  describe('addNode()', function () {
    const treeAgent = new TreeAgent([])
    it('add node for an empty tree', function () {
      const newNode = {
        key: '0',
        name: 'Node 0',
        children: [{
          key: '0-1',
          name: 'Node 0-1'
        }]
      }
      treeAgent.addNode(null, newNode)
      expect(treeAgent.getNode('0')).to.be.exist
      expect(treeAgent.getNode('0').level).to.equal(0)
      expect(treeAgent.getNode('0-1')).to.be.exist
      expect(treeAgent.getNode('0-1').level).to.equal(1)
      expect(treeAgent.isChildOf('0-1', '0')).to.be.true
    })

    it('add another top level node', function () {
      const newNode = {
        key: '1',
        name: 'Node 1'
      }
      treeAgent.addNode(null, newNode)
      expect(treeAgent.getNode('1')).to.be.exist
      expect(treeAgent.getNode('1').level).to.equal(0)
    })

    it('add a child under 0-1 node', function () {
      const newNode = {
        key: '0-1-0',
        name: 'Node 0-1-0',
        children: [{
          key: '0-1-0-0',
          name: 'Node 0-1-0-0'
        }]
      }
      treeAgent.addNode('0-1', newNode)
      expect(treeAgent.getNode('0-1-0')).to.be.exist
      expect(treeAgent.getNode('0-1-0').level).to.equal(2)
      expect(treeAgent.getNode('0-1-0-0')).to.be.exist
      expect(treeAgent.getNode('0-1-0-0').level).to.equal(3)
      expect(treeAgent.isChildOf('0-1-0', '0-1')).to.be.true
      expect(treeAgent.isChildOf('0-1-0-0', '0-1')).to.be.true
    })
  })

  describe('removeNode()', function () {
    const tree = buildTree(flatTreeData)
    const treeAgent = new TreeAgent(tree)

    it('remove node with wrong key', function () {
      const node = treeAgent.removeNode('wrong key')
      expect(node).to.be.false
    })

    it('remove leaf node 0-1-1-0', function () {
      const key = '0-1-1-0'
      const node = treeAgent.removeNode(key)
      expect(node.node.key).to.equal(key)
      expect(treeAgent.getNode(key)).to.be.null
      expect(treeAgent.isChildOf(key, '0-1-1')).to.be.false
    })

    it('remove node 0-1 with children', function () {
      const key = '0-1'
      const node = treeAgent.removeNode(key)
      expect(node.node.key).to.equal(key)
      expect(treeAgent.getNode(key)).to.be.null
      expect(treeAgent.getNode('0-1-1-0')).to.be.null
      expect(treeAgent.getLevel()).to.equal(2)
    })
  })

  describe('moveNode()', function () {
    const tree = buildTree(flatTreeData)
    const treeAgent = new TreeAgent(tree)

    it('should not able to move 0 under 0-1-1-0', function () {
      const key = '0'
      const parentKey = '0-1-1-0'
      const result = treeAgent.moveNode(key, parentKey)
      expect(result).to.be.false
    })

    it('move 1 under 0-1-1-0', function () {
      const key = '1'
      const parentKey = '0-1-1-0'
      treeAgent.moveNode(key, parentKey)
      const movedNode = treeAgent.getNode(key)
      expect(movedNode).to.be.exist
      expect(treeAgent.getLevel('1')).to.equal(4)
      expect(treeAgent.getLevel()).to.equal(6)
      expect(treeAgent.isChildOf('1-1-2', '0-1-1-0')).to.be.true
    })

    it('move 0-1-1-0 to the top level', function () {
      const key = '0-1-1-0'
      const movedNode = treeAgent.moveNode(key)
      expect(treeAgent.getLevel(key)).to.equal(0)
      expect(treeAgent.getLevel()).to.equal(3)
      expect(treeAgent.isChildOf(key, '0-1-1')).to.be.false
    })
  })

  describe('addChildren()', function () {
    const tree = buildTree(flatTreeData)
    const treeAgent = new TreeAgent(tree)

    it('not able to add children for wrong key', function () {
      treeAgent.addChildren('wrong-key', { key: '3', parent: null })
      expect(treeAgent.getNode('3')).to.be.null
    })

    it('add children to 0-1-0', function () {
      const children = [{
        key: '0-1-0-0',
        parent: '0-1-0'
      }, {
        key: '0-1-0-1',
        parent: '0-1-0',
        children: [{
          key: '0-1-0-1-0',
          parent: '0-1-0-1'
        }]
      }]
      treeAgent.addChildren('0-1-0', children)
      expect(treeAgent.getLevel()).to.equal(4)
      expect(treeAgent.getNode('0-1-0-1-0')).to.be.exist
      expect(treeAgent.isChildOf('0-1-0-1-0', '0-1-0')).to.be.true
    })
  })

  describe('removeChildren()', function () {
    const tree = buildTree(flatTreeData)
    const treeAgent = new TreeAgent(tree)

    it('no effect to remove children for a node that has no children', function () {
      expect(treeAgent.removeChildren('2')).to.be.undefined
    })
    
    it('remove children of node 0', function () {
      treeAgent.removeChildren('0')
      expect(treeAgent.getNode('0-1')).to.be.null
      expect(treeAgent.getNode('0-1-1-0')).to.be.null
      expect(treeAgent.getChildren('0').length).to.equal(0)
      expect(treeAgent.getLevel()).to.equal(2)
    })
  })

  describe('setChildren()', function () {
    const tree = buildTree(flatTreeData)
    const treeAgent = new TreeAgent(tree)

    it('not able to set children of node that not exist', function () {
      expect(treeAgent.setChildren('wrong-key', [])).to.be.false
    })

    it('set children as []', function () {
      treeAgent.setChildren('0', [])
      expect(treeAgent.getLevel()).to.equal(2)
      expect(treeAgent.getNode('0-1')).to.be.null
    })

    it('set children of node that already has children', function () {
      const children = [{
        key: '0-1-0-0',
        // parent: '0-1-0'
      }, {
        key: '0-1-0-1',
        parent: '0-1-0',
        children: [{
          key: '0-1-0-1-0',
          parent: '0-1-0-1'
        }]
      }]
      treeAgent.setChildren('0', children)
      expect(treeAgent.getLevel()).to.equal(2)
      expect(treeAgent.getNode('0-1')).to.be.null
      expect(treeAgent.getNode('0-1-0-0')).to.be.exist
      expect(treeAgent.isChildOf('0-1-0-0', '0')).to.be.true
      expect(treeAgent.isChildOf('0-1-0-1-0', '0-1-0-1')).to.be.true
    })

    it('set children of node that has no children', function () {
      const children = [{
        key: '2-1',
        // parent: '2'
      }]
      treeAgent.setChildren('2', children)
      expect(treeAgent.getLevel('2-1')).to.equal(1)
      expect(treeAgent.isChildOf('2-1', '2')).to.be.true
    })
  })
})
