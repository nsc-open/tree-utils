const should = require('chai').should()
const { walk, buildTree } = require('../../src/index')
const {
  flatTreeData, treeData,
  flatTreeData2, treeData2
} = require('../../mock')

describe('utils', function () {
  describe('buildTree()', function () {
    it('should be able to build tree without any options', function () {
      const tree = buildTree(flatTreeData)
      tree.should.deep.equal(treeData)
    })

    it('should be able to build tree with options', function () {
      const tree = buildTree(flatTreeData2, { keyPropName: '_key', parentPropName: '_parent', childrenPropName: '_children' })
      tree.should.deep.equal(treeData2)
    })
  })

  describe('walk()', function () {
    it('should be able to walk tree without any options', function () {
      const tree = buildTree(flatTreeData)
      let n = 0
      walk(tree, ctx => {
        const level = (ctx.node.key.includes('-') ? ctx.node.key.split('-').length : 1) - 1
        ctx.level.should.equal(level)
        
        if (ctx.parent) {
          ctx.parent.key.should.equal(ctx.node.parent)
        }
        n++
      })

      n.should.equal(flatTreeData.length)
    })

    it('should be able to walk tree with options', function () {
      const tree = buildTree(flatTreeData, { childrenPropName: '_children' })
      let n = 0
      walk(tree, ctx => {
        const level = (ctx.node.key.includes('-') ? ctx.node.key.split('-').length : 1) - 1
        ctx.level.should.equal(level)
        
        if (ctx.parent) {
          ctx.parent.key.should.equal(ctx.node.parent)
        }
        n++
      }, { childrenPropName: '_children' })

      n.should.equal(flatTreeData.length)
    })
  })
})