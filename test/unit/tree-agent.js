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
  })

  describe('getLeaves()', function () {
    it('TODO', function () {
      expect(true).to.equal(false)
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

  describe('isLeaf()', function () {
    it('TODO', function () {
      expect(true).to.equal(false)
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
    })
  })



  describe('', function () {
    it('', function () {

    })
  })
})
