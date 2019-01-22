const should = require('chai').should
const { flatTreeData } = require('../../mock')

describe('utils', function () {
  describe('buildTree()', function () {
    it('should be able to build tree without any options', function () {
      const tree = buildTree(flatTreeData)
    })

    it('should be able to build tree with options', function () {
      const convertedFlatTreeData = flatTreeData.map(d => ({
        myKey: d.key,
        myParent: d.parent,
        name: d.name
      }))
      const tree = buildTree(convertedFlatTreeData, { keyPropName: 'myKey', parentPropName: 'myParent', childrenPropName: 'myChildren' })
    })
  })

  describe('walk()', function () {
    it('', function () {

    })
  })
  
  
})