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
以下API测试数据：[详见](https://github.com/nsc-open/tree-utils/blob/master/mock/index.js) <br>
测试用例：[详见](https://github.com/nsc-open/tree-utils/blob/master/test/unit/tree-agent.js)
##### getTree()
```js
import { TreeAgent } from 'tree-utils'
const treeAgent = new TreeAgent(tree);
// 返回整个tree
treeAgent.getTree();
//expect(treeAgent.getTree()).to.equal(tree)
```

##### getNode(value: Function &vert; key) 获取当前节点
```js
const treeAgent = new TreeAgent(tree);
//获取key为0的节点
const node = treeAgent.getNode('0');
//expect(node.node).to.equal(tree[0])
const node = treeAgent.getNode(node => node.node.name === 'Node 0-1-1-0');
//expect(node.node.key).to.equal('0-1-1-0')
```
##### getChildren(key?, options?) 获取子节点
```js
const treeAgent = new TreeAgent(tree);
const children = treeAgent.getChildren();
// expect(children).to.have.lengthOf(flatTreeData.length)
```
```js
const children = treeAgent.getChildren('1-1');
//expect(children).to.have.lengthOf(3)
const children1 = treeAgent.getChildren('0',{directChildren:true}); // directChildren=true获取直接子级
/*
    children1= [
      { key: '0-0', parent: '0', name: 'Node 0-0',children:null },
      { key: '0-1', parent: '0', name: 'Node 0-1',children:[...] },
      { key: '0-2', parent: '0', name: 'Node 0-2',children:null },
    ]
*/
```

##### getParent(key) 获取父级节点
```js
const treeAgent = new TreeAgent(tree);
const children = treeAgent.getParent(); // null

const children1 = treeAgent.getParent('0-1-1-0'); 
// expect(children1.node.key).to.equal('0-1-1')
```
##### getParents(key) 获取父...父级节点
```js
const treeAgent = new TreeAgent(tree);
const parents = treeAgent.getParent(); // []

const parents1 = treeAgent.getParent('0-1-1-0'); 
//const parentKeys = parents1.map(p => p.node.key);
//expect(parents1).to.have.lengthOf(3);
//expect(parentKeys).to.include('0');
//expect(parentKeys).to.include('0-1');
//expect(parentKeys).to.include('0-1-1');
```
##### getSiblings(key) 获取同级节点
```js
const treeAgent = new TreeAgent(tree);
const siblings = treeAgent.getSiblings(); // []

const siblings1 = treeAgent.getSiblings('0');// [1,2]
//const keys = siblings.map(p => p.node.key)
//expect(siblings1).to.be.an('array').that.have.lengthOf(2)
//expect(keys).to.include('1')
//expect(keys).to.include('2')
```
##### getLeaves(key) 获取当前节点的分支
```js
const treeAgent = new TreeAgent(tree);
const leaves = treeAgent.getLeaves(); // 获取整个tree的分支 ['0','2','0-0','0-1-0','0-1-1-0','0-2','1-0','1-1-0','1-1-1','1-1-2']

const leaves1 = treeAgent.getLeaves('1-1');
//const keys = leaves1.map(n => n.node.key);
//expect(keys).to.include('1-1-0')
//expect(keys).to.include('1-1-1')
//expect(keys).to.include('1-1-2')
//expect(keys).to.not.include('0-1-1')
//expect(keys).to.not.include('1-1')
```
##### getLevel(key) 获取tree的层级
```js
const treeAgent = new TreeAgent(tree);
const level = treeAgent.getLevel(); //返回整个tree的层级 3

const level = treeAgent.getLevel('0'); 
//expect(treeAgent.getLevel("0")).to.equal(0)
```
##### isTop(key) 是否最顶级节点
```js
const treeAgent = new TreeAgent(tree);
treeAgent.isTop('0');
//expect(treeAgent.isTop("0")).to.equal(true);
//expect(treeAgent.isTop("1")).to.equal(true);
```
##### isChildOf(childKey,parentKey,options?) 是否子级
````js
const treeAgent = new TreeAgent(tree);
treeAgent.isChildOf('0-1', '0'); //true
//expect(treeAgent.isChildOf('wrong-key', '0')).to.equal(false)
//expect(treeAgent.isChildOf('0-1', 'wrong-key')).to.equal(false)
//expect(treeAgent.isChildOf('0', '0')).to.equal(false)
//expect(treeAgent.isChildOf('1-1-2', '0')).to.equal(false)
//expect(treeAgent.isChildOf('0-1', '0-2')).to.equal(false)

//expect(treeAgent.isChildOf('0-1', '0')).to.equal(true)
//expect(treeAgent.isChildOf('1-1-2', '1-1')).to.equal(true)
//expect(treeAgent.isChildOf('1-1-2', '1')).to.equal(true)

const options = { directParent: true }; // 是否直接子级 
treeAgent.isChildOf('0', '0-1', options);
//expect(treeAgent.isChildOf('wrong-key', '0', options)).to.equal(false)
//expect(treeAgent.isChildOf('0-1', 'wrong-key', options)).to.equal(false)
//expect(treeAgent.isChildOf('0', '0', options)).to.equal(false)
//expect(treeAgent.isChildOf('1-1-2', '0', options)).to.equal(false)
//expect(treeAgent.isChildOf('0-1', '0-2', options)).to.equal(false)

//expect(treeAgent.isChildOf('0-1', '0', options)).to.equal(true)
//expect(treeAgent.isChildOf('1-1-2', '1-1', options)).to.equal(true)
//expect(treeAgent.isChildOf('1-1-2', '1', options)).to.equal(false)
````
##### isParentOf(parentKey,childKey,options?) 是否父级
```js
const treeAgent = new TreeAgent(tree);
treeAgent.isParentOf('0', '0-1'); //true
//expect(treeAgent.isParentOf('0', 'wrong-key')).to.equal(false)
//(treeAgent.isParentOf('wrong-key', '0-1')).to.equal(false)
//expect(treeAgent.isParentOf('0', '0')).to.equal(false)
//expect(treeAgent.isParentOf('0', '1-1-2')).to.equal(false)
//expect(treeAgent.isParentOf('0-2', '0-1')).to.equal(false)

//expect(treeAgent.isParentOf('0', '0-1')).to.equal(true)
//expect(treeAgent.isParentOf('1-1', '1-1-2')).to.equal(true)
//expect(treeAgent.isParentOf('1', '1-1-2')).to.equal(true)

const options = { directParent: true }; // 是否直接子级 
treeAgent.isParentOf('1-1', '1-1-2', options); //true
//expect(treeAgent.isParentOf('0', 'wrong-key', options)).to.equal(false)
//expect(treeAgent.isParentOf('wrong-key', '0-1', options)).to.equal(false)
//expect(treeAgent.isParentOf('0', '0', options)).to.equal(false)
//expect(treeAgent.isParentOf('0', '1-1-2, options')).to.equal(false)
//expect(treeAgent.isParentOf('0-2', '0-1', options)).to.equal(false)

//expect(treeAgent.isParentOf('0', '0-1', options)).to.equal(true)
//expect(treeAgent.isParentOf('1-1', '1-1-2', options)).to.equal(true)
//expect(treeAgent.isParentOf('1', '1-1-2', options)).to.equal(false)
```
##### traverse(Function) 遍历所有节点
```js
const keys = [];
const treeAgent = new TreeAgent(tree);
treeAgent.traverse(node => {
    if (!keys.includes(node.node.key)) {
        keys.push(node.node.key);
    }
});
```
##### some(key, Function)
```js
const treeAgent = new TreeAgent(tree);
treeAgent.some('0', node => node.node.key === '0-1-1-0') //true;
```

##### every(key,Function)
```js
const treeAgent = new TreeAgent(tree);
treeAgent.every('1', node => node.node.key.startsWith('1-')); //true
```
##### sort(Function)
```js
const treeAgent = new TreeAgent(tree);
treeAgent.sort((a,b) => {
    console.log(a,b);
});
```
##### filter(Function)
```js
const treeAgent = new TreeAgent(tree);
treeAgent.filter(node => node.node.key.startsWith('1-'));
```

##### find(value  &vert; Function) 查找第一个满足条件的节点
```js
const treeAgent = new TreeAgent(tree);
treeAgent.find(node => node.node.path.includes('1-1'));

treeAgent.find('1-1');
```
##### addNode(parentKey,node) 添加节点
```js
const treeAgent = new TreeAgent([]);
const newNode = {
        key: '0',
        name: 'Node 0',
        children: [{
          key: '0-1',
          name: 'Node 0-1'
        }]
      };
treeAgent.addNode(null, newNode);
treeAgent.getTree();// = newNode

```
### 目录

| API  | 描述 |
| :------| :------ | 
| getTree()  | 返回整个tree |
| getNode(value: Function &vert; string) | 获取当前节点 | 
| getChildren(key?, options?) | 获取子节点，options={directChildren:boolean}默认为false,directChildren为true代表是否直接子级 |
| getParent(key) | 获取父级节点 |
| getParents(key) | 获取父...父级节点 |
| getSiblings(key) | 获取同级节点 |
| getLeaves(key) | 获取当前节点的分支，例:（0，0-1-0，0-1-1-0）|
| getLevel(key?) | 返回整个tree的层级或返回当前节点的层级 |
| isTop(key) | 是否最顶级 |
| isChildOf(childKey,parentKey,options?) | 是否子级，options={directChildren:boolean}默认为false,directChildren为true代表是否直接子级 |
| isParentOf(parentKey,childKey,options?) |是否父级，同上是否直接父级 |
| traverse(Function) | 遍历所有节点 |
| some(key, Function) | `some (key, node => log(node))` 这里的node节点是传入的key的所有子节点 |
| every(key, Function) | `every (key, node => log(node)) ` 同上|
| sort(Function) | 排序与原生sort类似 |
| filter(Function) | 返回过滤后的tree |
| find(value  &vert; Function) | 查找第一个满足条件的子节点 |
| addNode(parentKey,node) | 添加节点 |
| removeNode(key) | 删除 |
| moveNode(targetKey,parentKey) | 将目标节点向下移动到父节点或树的顶层 |
| addChildren(parentKey,children:Array<{key:string,parent:string,children:[}>) | 在指定父节点下添加子节点 |
| removeChildren(parentKey) | 删除父节点下的子级 |
| setChildren(parentKey, children) | 替换父节点下的子节点 |
