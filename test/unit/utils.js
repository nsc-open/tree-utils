const expect = require('chai').expect
const { walk, buildTree } = require('../../src/index')
const {
  flatTreeData, treeData,
  flatTreeData2, treeData2
} = require('../../mock')

describe('utils', function () {
  describe('buildTree()', function () {
    it('should be able to build tree without any options', function () {
      const tree = buildTree(flatTreeData)
      expect(tree).to.deep.equal(treeData)
    })

    it('should be able to build tree with options', function () {
      const tree = buildTree(flatTreeData2, { keyPropName: '_key', parentPropName: '_parent', childrenPropName: '_children' })
      expect(tree).deep.equal(treeData2)
    })
  })

  describe('walk()', function () {
    it('should be able to walk tree without any options', function () {
      const tree = buildTree(flatTreeData)
      let n = 0
      walk(tree, ctx => {
        const level = (ctx.node.key.includes('-') ? ctx.node.key.split('-').length : 1) - 1
        expect(ctx.level).to.equal(level)
        
        if (ctx.parent) {
          expect(ctx.parent.key).to.equal(ctx.node.parent)
        }
        n++
      })

      expect(n).to.equal(flatTreeData.length)
    })

    it('should be able to walk tree with options', function () {
      const tree = buildTree(flatTreeData, { childrenPropName: '_children' })
      let n = 0
      walk(tree, ctx => {
        const level = (ctx.node.key.includes('-') ? ctx.node.key.split('-').length : 1) - 1
        expect(ctx.level).to.equal(level)
        
        if (ctx.parent) {
          expect(ctx.parent.key).to.equal(ctx.node.parent)
        }
        n++
      }, { childrenPropName: '_children' })

      expect(n).to.equal(flatTreeData.length)
    })
  })
})