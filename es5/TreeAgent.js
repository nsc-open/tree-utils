"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultOptions = {
  keyPropName: 'key',
  parentPropName: 'parent',
  childrenPropName: 'children',
  // cascade fields related
  // cascade field should have value like: { value: '', indeterminate: false }
  cascadeFields: [],
  // cascade fields are the fields like `checked`, `selected`, the boolean type fields on the tree
  cascadeFilter: function cascadeFilter(cascadeFieldName, node) {
    return true;
  } // if returns false, it will stop cascade downwards

};

var TreeAgent = /*#__PURE__*/function () {
  function TreeAgent(tree, options) {
    var _this = this;

    _classCallCheck(this, TreeAgent);

    _defineProperty(this, "_key", function (node) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return _this._nodeProp.apply(_this, [node, _this.options.keyPropName].concat(args));
    });

    _defineProperty(this, "_parentKey", function (node) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return _this._nodeProp.apply(_this, [node, _this.options.parentPropName].concat(args));
    });

    _defineProperty(this, "_children", function (node) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      return _this._nodeProp.apply(_this, [node, _this.options.childrenPropName].concat(args));
    });

    this.options = _objectSpread(_objectSpread({}, defaultOptions), options || {});
    this.tree = tree;
    this.nodeMap = this._flatten(tree); // { [key]: { node, parent, children, level, path } }

    this._preventSync = false;
  }
  /* internal functions */


  _createClass(TreeAgent, [{
    key: "_flatten",
    value: function _flatten(tree) {
      var options = this.options,
          _key = this._key;
      var nodeMap = {};
      (0, _utils.walk)(tree, function (_ref) {
        var node = _ref.node,
            parent = _ref.parent,
            level = _ref.level,
            path = _ref.path;
        var currentNode = {
          node: node,
          level: level,
          path: path,
          parent: null,
          children: null
        };

        if (parent) {
          var parentNode = nodeMap[_key(parent)];

          currentNode.parent = parentNode;
          parentNode.children = parentNode.children || [];
          parentNode.children.push(currentNode);
        }

        nodeMap[_key(node)] = currentNode; // node key should be unqiue in the whole tree
      }, options);
      return nodeMap;
    }
  }, {
    key: "_nodeProp",
    value: function _nodeProp(node, propName
    /*, value */
    ) {
      if (arguments.length > 2) {
        return node[propName] = arguments[2];
      } else {
        return node[propName];
      }
    }
  }, {
    key: "sync",
    value: function sync() {
      if (!this._preventSync) {
        this.nodeMap = this._flatten(this.tree);
      }
    }
  }, {
    key: "syncWrapper",
    value: function syncWrapper(func) {
      this._preventSync = true;
      func();
      this._preventSync = false;
      this.sync();
    }
    /* getter functions */

  }, {
    key: "getTree",
    value: function getTree() {
      return this.tree;
    }
  }, {
    key: "getNode",
    value: function getNode(value) {
      if (typeof value === 'function') {
        return Object.values(this.nodeMap).find(value);
      } else {
        var node = this.nodeMap[value];
        return node || null;
      }
    }
  }, {
    key: "getChildren",
    value: function getChildren(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        directChildren: false
      };

      if (key) {
        if (!options.directChildren) {
          return Object.values(this.nodeMap).filter(function (n) {
            return n.path.includes(key);
          });
        } else {
          var node = this.getNode(key);
          return node ? node.children : [];
        }
      } else {
        return Object.values(this.nodeMap);
      }
    }
  }, {
    key: "getParent",
    value: function getParent(key) {
      var node = this.getNode(key);

      if (!node) {
        return null;
      }

      return node.parent || null;
    }
  }, {
    key: "getParents",
    value: function getParents(key) {
      var _this2 = this;

      var node = this.getNode(key);
      return node ? node.path.map(function (key) {
        return _this2.getNode(key);
      }) : [];
    }
  }, {
    key: "getSiblings",
    value: function getSiblings(key) {
      var _this3 = this;

      var level = this.getLevel(key);
      return level === null ? [] : Object.values(this.nodeMap).filter(function (n) {
        return n.level === level && _this3._key(n.node) !== key;
      });
    }
    /**
     * get leaves of whole tree or given tree node
     * @param {String} key optional
     */

  }, {
    key: "getLeaves",
    value: function getLeaves(key) {// TODO
    }
    /**
     * return level of whole tree or give tree node
     * @param {String} key optional
     */

  }, {
    key: "getLevel",
    value: function getLevel(key) {
      if (arguments.length === 0) {
        var levels = Object.values(this.nodeMap).map(function (n) {
          return n.level;
        });
        return Math.max.apply(Math, _toConsumableArray(levels));
      } else {
        var node = this.getNode(key);
        return node ? node.level : null;
      }
    }
    /* test functions */

  }, {
    key: "isTop",
    value: function isTop(key) {
      return this.getLevel(key) === 0;
    }
  }, {
    key: "isChildOf",
    value: function isChildOf(childKey, parentKey) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        directChild: false
      };
      var childNode = this.getNode(childKey);

      if (!childNode) {
        return false;
      }

      if (options.directChild) {
        return childNode.parent ? this._key(childNode.parent.node) === parentKey : false;
      } else {
        return childNode.path.includes(parentKey);
      }
    }
  }, {
    key: "isParentOf",
    value: function isParentOf(parentKey, childKey) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        directParent: false
      };
      return this.isChildOf(childKey, parentKey, {
        directChild: options.directParent
      });
    }
    /* traverse function */

  }, {
    key: "traverse",
    value: function traverse(handler) {
      // the order would like: ["0", "1", "2", "0-0", "0-1", "0-1-0", "0-1-1", "0-1-1-0", "0-2", "1-0", "1-1", "1-1-0", "1-1-1", "1-1-2"]
      Object.values(this.nodeMap).forEach(handler);
    }
    /* cascade value related query and setting operations */

  }, {
    key: "some",
    value: function some(key, fn) {
      return this.getChildren(key).some(fn);
    }
  }, {
    key: "every",
    value: function every(key, fn) {
      return this.getChildren(key).every(fn);
    }
  }, {
    key: "sort",
    value: function sort(sorter) {
      this.tree = (0, _utils.sortTree)(this.tree, sorter);
      var oldValue = this._preventSync;
      this._preventSync = false;
      this.sync();
      this._preventSync = oldValue;
    }
  }, {
    key: "map",
    value: function map() {// TODO
    }
    /**
     * return a filtered tree
     * @param {Function} fn 
     * @param {Object} options 
     */

  }, {
    key: "filter",
    value: function filter(fn, options) {
      var _keepParent = _objectSpread({
        keepParent: false
      }, options || {}),
          keepParent = _keepParent.keepParent;

      var nodes = this.getChildren().filter(fn);

      if (true || !keepParent) {
        // if no need to keepParent, then build tree with filtered nodes
        return (0, _utils.buildTree)(nodes.map(function (n) {
          return n.node;
        }), this.options);
      } else {
        // if need to keepParent, then need add parents back to nodes, then build tree
        return []; // TODO
      }
    }
  }, {
    key: "find",
    value: function find(value) {
      return this.getNode(value);
    }
    /**
     * 
     * @param {String} key 
     * @param {String} fieldName 
     * @param {Any} fieldValue 
     * @param {Boolean} cascade
     */

  }, {
    key: "setFieldValue",
    value: function setFieldValue(key, fieldName, fieldValue) {
      var _this4 = this;

      var node = this.getNode(key);

      if (!node) {
        return;
      }

      var cascadeFields = this.options.cascadeFields;

      var cascadeFilter = function cascadeFilter(node) {
        return _this4.options.cascadeFilter(fieldName, node);
      };

      var isCascadeField = cascadeFields.includes(fieldName);

      if (isCascadeField) {
        node.node[fieldName] = {
          value: fieldValue,
          indeterminate: false
        }; // set value for children

        this.getChildren(key).filter(cascadeFilter).forEach(function (child) {
          child.node[fieldName] = {
            value: fieldValue,
            indeterminate: false
          };
        }); // set value for parents

        var parents = this.getParents(key).filter(cascadeFilter); // forEach parents from bottom to top
        // if all direct children have the same value and non-indeterminate,
        // then set parent as non-indeterminate value

        parents.reverse().forEach(function (parent) {
          var determinate = parent.children.every(function (child) {
            var _ref2 = child.node[fieldName] || {},
                value = _ref2.value,
                indeterminate = _ref2.indeterminate;

            return value === fieldValue && !indeterminate;
          });
          parent.node[fieldName] = {
            value: fieldValue,
            indeterminate: !determinate
          };
        });
      } else {
        node.node[fieldName] = fieldValue;
      }
    }
    /* operations need to be done by these provided agent functions */

    /* don't modify tree or node directly, it will leads undetermined result */

  }, {
    key: "addNode",
    value: function addNode(parentKey, node
    /*, index TODO */
    ) {
      var _key = this._key,
          _parentKey = this._parentKey,
          _children = this._children,
          options = this.options;
      var keyPropName = options.keyPropName;

      var key = _key(node);

      if (!key) {
        console.warn("cannot find valid key from node.".concat(keyPropName));
        return false;
      }

      var parent = this.getNode(parentKey);

      if (parentKey && !parent) {
        console.warn("cannot find parent of key: ".concat(parentKey));
        return false;
      } // make sure it has parentKey set


      _parentKey(node, parentKey); // modify tree


      if (!parent) {
        this.tree.push(node); // add to top level
      } else {
        var children = _children(parent.node);

        if (!children) {
          _children(parent.node, [node]);
        } else {
          children.push(node);
        }
      } // recalculate nodeMap


      this.sync();
    }
    /**
     * remove node with children
     */

  }, {
    key: "removeNode",
    value: function removeNode(key) {
      var node = this.getNode(key);

      if (!node) {
        return false;
      }

      var _key = this._key,
          _children = this._children;
      var parent = node.parent;

      if (parent) {
        _children(parent.node, _children(parent.node).filter(function (childNode) {
          return _key(childNode) !== key;
        }));
      } else {
        this.tree = this.tree.filter(function (topNode) {
          return _key(topNode) !== key;
        });
      }

      this.sync();
      return node;
    }
    /**
     * move target node down to a parent node or the top level of the tree
     * @param {String} key 
     * @param {String} parentKey optional
     * @return moved node
     */

  }, {
    key: "moveNode",
    value: function moveNode(key, parentKey) {
      var _this5 = this;

      if (this.isChildOf(parentKey, key)) {
        console.warn('cannot move a node into its children node');
        return false;
      }

      var moveToTop = !parentKey;
      var node = this.getNode(key);

      if (!node) {
        console.warn("target node ".concat(key, " does not exist"));
        return false;
      }

      var parentNode = moveToTop ? null : this.getNode(parentKey);

      if (!moveToTop && !parentNode) {
        console.warn("parent node ".concat(parentKey, " does not exist"));
        return false;
      }

      this.syncWrapper(function () {
        var removedNode = _this5.removeNode(key);

        _this5.addNode(parentKey, removedNode.node);
      });
    }
  }, {
    key: "addChildren",
    value: function addChildren(parentKey, children) {
      var _this6 = this;

      var parent = this.getNode(parentKey);

      if (!parent) {
        console.warn("target node ".concat(parentKey, " does not exist"));
        return false;
      }

      children = Array.isArray(children) ? children : [children];
      this.syncWrapper(function () {
        children.forEach(function (child) {
          return _this6.addNode(parentKey, child);
        });
      });
    }
  }, {
    key: "removeChildren",
    value: function removeChildren(parentKey) {
      var _this7 = this;

      var parent = this.getNode(parentKey);

      if (!parent) {
        console.warn("target node ".concat(parentKey, " does not exist"));
        return false;
      }

      var _children = this._children,
          _key = this._key;

      if (!_children(parent.node) || _children(parent.node).length === 0) {
        return;
      }

      this.syncWrapper(function () {
        _children(parent.node).forEach(function (childNode) {
          return _this7.removeNode(_key(childNode));
        });
      });
    }
  }, {
    key: "setChildren",
    value: function setChildren(parentKey, children) {
      var _this8 = this;

      var parent = this.getNode(parentKey);

      if (!parent) {
        console.warn("target node ".concat(parentKey, " does not exist"));
        return false;
      }

      children = Array.isArray(children) ? children : [children];
      this.syncWrapper(function () {
        _this8.removeChildren(parentKey);

        _this8.addChildren(parentKey, children);
      });
    }
  }]);

  return TreeAgent;
}();

var _default = TreeAgent;
exports["default"] = _default;