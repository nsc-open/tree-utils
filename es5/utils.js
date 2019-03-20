"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTree = exports.walk = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var walk = function walk(tree, callback, options) {
  var _childrenPropName = _objectSpread({
    childrenPropName: 'children'
  }, options || {}),
      childrenPropName = _childrenPropName.childrenPropName;

  var loopContext = {};

  var loop = function loop(_ref) {
    var tree = _ref.tree,
        parent = _ref.parent,
        level = _ref.level,
        path = _ref.path,
        callback = _ref.callback;
    tree.forEach(function (item) {
      var skipChildren = callback({
        node: item,
        parent: parent,
        level: level,
        path: path,
        context: loopContext
      });

      if (skipChildren !== false && item[childrenPropName]) {
        loop({
          tree: item[childrenPropName],
          parent: item,
          level: level + 1,
          path: [].concat(_toConsumableArray(path), [item.key]),
          callback: callback
        });
      }
    });
  };

  loop({
    tree: tree,
    parent: null,
    level: 0,
    path: [],
    callback: callback
  });
  loopContext = null;
};

exports.walk = walk;

var buildTree = function buildTree() {
  var flatData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments.length > 1 ? arguments[1] : undefined;

  var opts = _objectSpread({
    keyPropName: 'key',
    parentPropName: 'parent',
    childrenPropName: 'children'
  }, options || {});

  var KEY = opts.keyPropName;
  var PARENT_KEY = opts.parentPropName;
  var CHILDREN_KEY = opts.childrenPropName;

  var process = function process(value) {
    var children = [];

    for (var i = 0; i < flatData.length; i++) {
      var node = flatData[i];

      if (node[PARENT_KEY] === value) {
        children.push(Object.assign(Object.create(null), node, _defineProperty({}, CHILDREN_KEY, process(node[KEY]))));
      }
    }

    return children.length > 0 ? children : null;
  };

  return flatData.filter(function (d) {
    return !d[PARENT_KEY];
  }).map(function (d) {
    return Object.assign(Object.create(null), d, _defineProperty({}, CHILDREN_KEY, process(d[KEY])));
  });
};

exports.buildTree = buildTree;