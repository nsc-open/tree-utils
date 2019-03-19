export const flatTreeData = [
  { key: '0', parent: null, name: 'Node 0' },
  { key: '0-0', parent: '0', name: 'Node 0-0' },
  { key: '0-1', parent: '0', name: 'Node 0-1' },
  { key: '0-2', parent: '0', name: 'Node 0-2' },
  { key: '0-1-0', parent: '0-1', name: 'Node 0-1-0' },
  { key: '0-1-1', parent: '0-1', name: 'Node 0-1-1' },
  { key: '0-1-1-0', parent: '0-1-1', name: 'Node 0-1-1-0' },
  { key: '1', parent: null, name: 'Node 1' },
  { key: '1-0', parent: '1', name: 'Node 1-0' },
  { key: '1-1', parent: '1', name: 'Node 1-1' },
  { key: '1-1-0', parent: '1-1', name: 'Node 1-1-0' },
  { key: '1-1-1', parent: '1-1', name: 'Node 1-1-1' },
  { key: '1-1-2', parent: '1-1', name: 'Node 1-1-2' },
  { key: '2', parent: null, name: 'Node 2' }
]

export const treeData = [{
  key: '0',
  parent: null,
  name: 'Node 0',
  children: [{
    key: '0-0',
    parent: '0',
    name: 'Node 0-0',
    children: null
  }, {
    key: '0-1',
    parent: '0',
    name: 'Node 0-1',
    children: [{
      key: '0-1-0',
      parent: '0-1',
      name: 'Node 0-1-0',
      children: null
    }, {
      key: '0-1-1',
      parent: '0-1',
      name: 'Node 0-1-1',
      children: [{
        key: '0-1-1-0',
        parent: '0-1-1',
        name: 'Node 0-1-1-0',
        children: null
      }]
    }]
  }, {
    key: '0-2',
    parent: '0',
    name: 'Node 0-2',
    children: null
  }]
}, {
  key: '1',
  parent: null,
  name: 'Node 1',
  children: [{
    key: '1-0',
    parent: '1',
    name: 'Node 1-0',
    children: null
  }, {
    key: '1-1',
    parent: '1',
    name: 'Node 1-1',
    children: [{
      key: '1-1-0',
      parent: '1-1',
      name: 'Node 1-1-0',
      children: null
    }, {
      key: '1-1-1',
      parent: '1-1',
      name: 'Node 1-1-1',
      children: null
    }, {
      key: '1-1-2',
      parent: '1-1',
      name: 'Node 1-1-2',
      children: null
    }]
  }]
}, {
  key: '2',
  parent: null,
  name: 'Node 2',
  children: null
}]

export const flatTreeData2 = [
  { _key: '0', _parent: null, name: 'Node 0' },
  { _key: '0-0', _parent: '0', name: 'Node 0-0' },
  { _key: '0-1', _parent: '0', name: 'Node 0-1' },
  { _key: '0-2', _parent: '0', name: 'Node 0-2' },
  { _key: '0-1-0', _parent: '0-1', name: 'Node 0-1-0' },
  { _key: '0-1-1', _parent: '0-1', name: 'Node 0-1-1' },
  { _key: '0-1-1-0', _parent: '0-1-1', name: 'Node 0-1-1-0' },
  { _key: '1', _parent: null, name: 'Node 1' },
  { _key: '1-0', _parent: '1', name: 'Node 1-0' },
  { _key: '1-1', _parent: '1', name: 'Node 1-1' },
  { _key: '1-1-0', _parent: '1-1', name: 'Node 1-1-0' },
  { _key: '1-1-1', _parent: '1-1', name: 'Node 1-1-1' },
  { _key: '1-1-2', _parent: '1-1', name: 'Node 1-1-2' },
  { _key: '2', _parent: null, name: 'Node 2' }
]

export const treeData2 = [{
  _key: '0',
  _parent: null,
  name: 'Node 0',
  _children: [{
    _key: '0-0',
    _parent: '0',
    name: 'Node 0-0',
    _children: null
  }, {
    _key: '0-1',
    _parent: '0',
    name: 'Node 0-1',
    _children: [{
      _key: '0-1-0',
      _parent: '0-1',
      name: 'Node 0-1-0',
      _children: null
    }, {
      _key: '0-1-1',
      _parent: '0-1',
      name: 'Node 0-1-1',
      _children: [{
        _key: '0-1-1-0',
        _parent: '0-1-1',
        name: 'Node 0-1-1-0',
        _children: null
      }]
    }]
  }, {
    _key: '0-2',
    _parent: '0',
    name: 'Node 0-2',
    _children: null
  }]
}, {
  _key: '1',
  _parent: null,
  name: 'Node 1',
  _children: [{
    _key: '1-0',
    _parent: '1',
    name: 'Node 1-0',
    _children: null
  }, {
    _key: '1-1',
    _parent: '1',
    name: 'Node 1-1',
    _children: [{
      _key: '1-1-0',
      _parent: '1-1',
      name: 'Node 1-1-0',
      _children: null
    }, {
      _key: '1-1-1',
      _parent: '1-1',
      name: 'Node 1-1-1',
      _children: null
    }, {
      _key: '1-1-2',
      _parent: '1-1',
      name: 'Node 1-1-2',
      _children: null
    }]
  }]
}, {
  _key: '2',
  _parent: null,
  name: 'Node 2',
  _children: null
}]