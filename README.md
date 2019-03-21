This lib provides some useful functionalities for tree operations. `walk`, `buildTree` and `TreeAgent`

## buildTree

```js
import { buildTree } from 'tree-utils'
const flatData = [
  { key: '0', parent: null },
  { key: '0-1', parent: '0' },
  { key: '0-1-0', parent: '0-1' },
  { key: '1', parent: null }
]
const tree = buildTree(flatData)
```

The tree will be build as:

```js
[{
  key: '0',
  parent: null,
  children: [{
    key: '0-1',
    parent: '0',
    children: [{
      key: '0-1-0',
      parent: '0-1',
      children: null
    }]
  }]
}, {
  key: '1',
  parent: null,
  children: null
}]
```

You don't need to provide your `flatData` with fixed prop name like `key`, `parent` and `children`, you can have your own prop names, and use build options to let `buildTree` knows how to read the connection among nodes.

```js
const flatData = [
  { _k: '0', _p: null },
  { _k: '0-1', _p: '0' },
  { _k: '0-1-0', _p: '0-1' },
  { _k: '1', _p: null }
]
const options = {
  keyPropName: '_k',      // default value is 'key'
  parentPropName: '_p',   // default value is 'parent'
  childrenPropName: '_c'  // default value is 'children'
}
const tree = buildTree(flatData, options)
```

Tree will be build as:

```js
[{
  _k: '0',
  _p: null,
  _c: [{
    _k: '0-1',
    _p: '0',
    _c: [{
      _k: '0-1-0',
      _p: '0-1',
      _c: null
    }]
  }]
}, {
  _k: '1',
  _p: null,
  _c: null
}]
```

## walk

TODO

## TreeAgent

TreeAgent provides plenty of functions to do tree query and manipulation.

```js
import { buildTree, TreeAgent } from 'tree-utils'

const tree = buildTree(yourFlatData)
const treeAgent = new TreeAgent(tree)
```

### TreeAgent API

TODO