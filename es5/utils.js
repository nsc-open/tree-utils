"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortTree = exports.mergeTrees = exports.buildTree = exports.walk = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var walk = function walk(tree, callback, options) {
  var _keyPropName$children = _objectSpread({
    keyPropName: 'key',
    childrenPropName: 'children'
  }, options || {}),
      childrenPropName = _keyPropName$children.childrenPropName,
      keyPropName = _keyPropName$children.keyPropName;

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
          path: [].concat(_toConsumableArray(path), [item[keyPropName]]),
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
    childrenPropName: 'children',
    isRoot: options && options.isRoot ? options.isRoot : function (d, PARENT_KEY) {
      return !d[PARENT_KEY];
    }
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
    return opts.isRoot(d, PARENT_KEY);
  }).map(function (d) {
    return Object.assign(Object.create(null), d, _defineProperty({}, CHILDREN_KEY, process(d[KEY])));
  });
};

exports.buildTree = buildTree;

var mergeTrees = function mergeTrees() {// TODO

  var trees = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments.length > 1 ? arguments[1] : undefined;
};

exports.mergeTrees = mergeTrees;

var sortTree = function sortTree() {
  var tree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var sorter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    childrenPropName: 'children'
  };

  var process = function process(nodes) {
    return nodes.map(function (node) {
      var children = node[options.childrenPropName];

      if (children && children.length > 0) {
        node[options.childrenPropName] = process(children);
      }

      return node;
    }).sort(sorter);
  };

  return process(tree);
};

exports.sortTree = sortTree;