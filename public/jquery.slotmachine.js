/*
 * jQuery Slot Machine v4.0.0
 * https://github.com/josex2r/jQuery-SlotMachineundefined
 *
 * Copyright 2014 Jose Luis Represa
 * Released under the MIT license
 */
(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

window.SlotMachine = require('./slot-machine');

},{"./slot-machine":3}],2:[function(require,module,exports){
"use strict";

var _raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

module.exports = function raf(cb) {
  var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  setTimeout(function () {
    return _raf(cb);
  }, timeout);
};

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timer = require('./timer');
var raf = require('./raf');

var defaults = {
  active: 0, // Active element [Number]
  delay: 200, // Animation time [Number]
  auto: false, // Repeat delay [false||Number]
  spins: 5, // Number of spins when auto [Number]
  randomize: null, // Randomize function, must return a number with the selected position
  onComplete: null, // Callback function(result)
  inViewport: true, // Stops animations if the element isn´t visible on the screen
  direction: 'up', // Animation direction ['up'||'down']
  transition: 'ease-in-out'
};
var FX_NO_TRANSITION = 'slotMachineNoTransition';
var FX_FAST = 'slotMachineBlurFast';
var FX_NORMAL = 'slotMachineBlurMedium';
var FX_SLOW = 'slotMachineBlurSlow';
var FX_TURTLE = 'slotMachineBlurTurtle';
var FX_GRADIENT = 'slotMachineGradient';
var FX_STOP = FX_GRADIENT;

var SlotMachine = function () {
  function SlotMachine(element, options) {
    _classCallCheck(this, SlotMachine);

    this.element = element;
    // Slot Machine elements
    this.tiles = [].slice.call(this.element.children);
    // Machine is running?
    this.running = false;
    // Machine is stopping?
    this.stopping = false;
    // Disable overflow
    this.element.style.overflow = 'hidden';
    // Wrap elements inside container
    this._wrapTiles();
    // Set min top offset
    this._minTop = -this._fakeFirstTile.offsetHeight;
    // Set max top offset
    this._maxTop = -this.tiles.reduce(function (acc, tile) {
      return acc + tile.offsetHeight;
    }, 0);
    // Call setters if neccesary
    this.changeSettings(Object.assign({}, defaults, options));
    // Initialize spin direction [up, down]
    this._setBounds();
    // Show active element
    this._resetPosition();
    // Start auto animation
    if (this.auto !== false) {
      this.run();
    }
  }

  _createClass(SlotMachine, [{
    key: 'changeSettings',
    value: function changeSettings(settings) {
      var _this = this;

      Object.keys(settings).forEach(function (key) {
        // Trigger setters
        _this[key] = settings[key];
      });
    }
  }, {
    key: '_wrapTiles',
    value: function _wrapTiles() {
      var _this2 = this;

      this.container = document.createElement('div');
      this.container.classList.add('slotMachineContainer');
      this.container.style.transition = '1s ease-in-out';
      this.element.appendChild(this.container);

      this._fakeFirstTile = this.tiles[this.tiles.length - 1].cloneNode(true);
      this.container.appendChild(this._fakeFirstTile);

      this.tiles.forEach(function (tile) {
        _this2.container.appendChild(tile);
      });

      this._fakeLastTile = this.tiles[0].cloneNode(true);
      this.container.appendChild(this._fakeLastTile);
    }
  }, {
    key: '_setBounds',
    value: function _setBounds() {
      var initial = this.getTileOffset(this.active);
      var first = this.getTileOffset(this.tiles.length);
      var last = this.getTileOffset(this.tiles.length);

      this._bounds = {
        up: {
          key: 'up',
          initial: initial,
          first: 0,
          last: last,
          to: this._maxTop,
          firstToLast: last,
          lastToFirst: 0
        },
        down: {
          key: 'down',
          initial: initial,
          first: first,
          last: 0,
          to: this._minTop,
          firstToLast: last,
          lastToFirst: 0
        }
      };
    }
  }, {
    key: '_changeTransition',
    value: function _changeTransition() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.delay;
      var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.transition;

      this.container.style.transition = delay / 1000 + 's ' + transition;
    }
  }, {
    key: '_changeTransform',
    value: function _changeTransform(margin) {
      this.container.style.transform = 'matrix(1, 0, 0, 1, 0, ' + margin + ')';
    }
  }, {
    key: '_isGoingBackward',
    value: function _isGoingBackward() {
      return this.nextActive > this.active && this.active === 0 && this.nextActive === this.tiles.length - 1;
    }
  }, {
    key: '_isGoingForward',
    value: function _isGoingForward() {
      return this.nextActive <= this.active && this.active === this.tiles.length - 1 && this.nextActive === 0;
    }
  }, {
    key: 'getTileOffset',
    value: function getTileOffset(index) {
      var offset = 0;

      for (var i = 0; i < index; i++) {
        offset += this.tiles[i].offsetHeight;
      }

      return this._minTop - offset;
    }
  }, {
    key: '_resetPosition',
    value: function _resetPosition(margin) {
      this.container.classList.toggle(FX_NO_TRANSITION);
      this._changeTransform(!isNaN(margin) ? margin : this.bounds.initial);
      // Force reflow, flushing the CSS changes
      this.container.offsetHeight;
      this.container.classList.toggle(FX_NO_TRANSITION);
    }
  }, {
    key: 'prev',
    value: function prev() {
      this.nextActive = this.prevIndex;
      this.running = true;
      this.stop();

      return this.nextActive;
    }
  }, {
    key: 'next',
    value: function next() {
      this.nextActive = this.nextIndex;
      this.running = true;
      this.stop();

      return this.nextActive;
    }
  }, {
    key: '_getDelayFromSpins',
    value: function _getDelayFromSpins(spins) {
      var delay = this.delay;
      this.transition = 'linear';

      switch (spins) {
        case 1:
          delay /= 0.5;
          this.transition = 'ease-out';
          this._animationFX = FX_TURTLE;
          break;
        case 2:
          delay /= 0.75;
          this._animationFX = FX_SLOW;
          break;
        case 3:
          delay /= 1;
          this._animationFX = FX_NORMAL;
          break;
        case 4:
          delay /= 1.25;
          this._animationFX = FX_NORMAL;
          break;
        default:
          delay /= 1.5;
          this._animationFX = FX_FAST;
      }

      return delay;
    }
  }, {
    key: 'shuffle',
    value: function shuffle(spins, onComplete) {
      var _this3 = this;

      // Make spins optional
      if (typeof spins === 'function') {
        onComplete = spins;
      }
      this.running = true;
      // Perform animation
      if (!this.visible && this.inViewport === true) {
        this.stop(onComplete);
      } else {
        var delay = this._getDelayFromSpins(spins);
        // this.delay = delay;
        this._changeTransition(delay);
        this._changeTransform(this.bounds.to);
        raf(function () {
          if (!_this3.stopping && _this3.running) {
            var left = spins - 1;

            _this3._resetPosition(_this3.bounds.first);

            if (left > 1) {
              // Repeat animation
              _this3.shuffle(left, onComplete);
            } else {
              _this3.stop(onComplete);
            }
          }
        }, delay);
      }

      return this.nextActive;
    }
  }, {
    key: 'stop',
    value: function stop(onStop) {
      var _this4 = this;

      if (!this.running || this.stopping) {
        return this.nextActive;
      }

      this.running = true;
      this.stopping = true;

      if (!Number.isInteger(this.nextActive)) {
        // Get random or custom element
        this.nextActive = this.custom;
      }

      // Check direction to prevent jumping
      if (this._isGoingBackward()) {
        this._resetPosition(this.bounds.firstToLast);
      } else if (this._isGoingForward()) {
        this._resetPosition(this.bounds.lastToFirst);
      }

      // Update last choosen element index
      this.active = this.nextActive;

      // Perform animation
      var delay = this._getDelayFromSpins(1);
      // this.delay = delay;
      this._changeTransition(delay);
      this._animationFX = FX_STOP;
      this._changeTransform(this.getTileOffset(this.active));
      raf(function () {
        _this4.stopping = false;
        _this4.running = false;
        _this4.nextActive = null;

        if (typeof _this4.onComplete === 'function') {
          _this4.onComplete(_this4.active);
        }

        if (typeof onStop === 'function') {
          onStop.apply(_this4, [_this4.active]);
        }
      }, delay);

      return this.active;
    }
  }, {
    key: 'run',
    value: function run() {
      var _this5 = this;

      if (this.running) {
        return;
      }

      this._timer = new Timer(function () {
        if (!_this5.visible && _this5.inViewport === true) {
          raf(function () {
            _this5._timer.reset();
          }, 500);
        } else {
          _this5.shuffle(_this5.spins, function () {
            _this5._timer.reset();
          });
        }
      }, this.auto);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this6 = this;

      this._fakeFirstTile.remove();
      this._fakeLastTile.remove();
      this.$tiles.unwrap();

      // Unwrap tiles
      this.tiles.forEach(function (tile) {
        _this6.element.appendChild(tile);
      });

      this.container.remove();
    }
  }, {
    key: 'active',
    get: function get() {
      return this._active;
    },
    set: function set(index) {
      index = Number(index);
      if (index < 0 || index >= this.tiles.length || isNaN(index)) {
        index = 0;
      }
      this._active = index;
    }
  }, {
    key: 'direction',
    get: function get() {
      return this._direction;
    },
    set: function set(direction) {
      if (!this.running) {
        this._direction = direction === 'down' ? 'down' : 'up';
      }
    }
  }, {
    key: 'bounds',
    get: function get() {
      return this._bounds[this._direction];
    }
  }, {
    key: 'transition',
    get: function get() {
      return this._transition;
    },
    set: function set(transition) {
      this._transition = transition || 'ease-in-out';
    }
  }, {
    key: 'visibleTile',
    get: function get() {
      var firstTileHeight = this.tiles[0].offsetHeight;
      var rawContainerMargin = this.container.style.transform || '';
      var matrixRegExp = /^matrix\(-?\d+,\s?-?\d+,\s?-?\d+,\s?-?\d+,\s?-?\d+,\s?(-?\d+)\)$/;
      var containerMargin = parseInt(rawContainerMargin.replace(matrixRegExp, '$1'), 10);

      return Math.abs(Math.round(containerMargin / firstTileHeight)) - 1;
    }
  }, {
    key: 'random',
    get: function get() {
      return Math.floor(Math.random() * this.tiles.length);
    }
  }, {
    key: 'custom',
    get: function get() {
      var choosen = void 0;

      if (this.randomize) {
        var index = this.randomize(this.active);
        if (index < 0 || index >= this.tiles.length) {
          index = 0;
        }
        choosen = index;
      } else {
        choosen = this.random;
      }

      return choosen;
    }
  }, {
    key: '_prevIndex',
    get: function get() {
      var prevIndex = this.active - 1;

      return prevIndex < 0 ? this.tiles.length - 1 : prevIndex;
    }
  }, {
    key: '_nextIndex',
    get: function get() {
      var nextIndex = this.active + 1;

      return nextIndex < this.tiles.length ? nextIndex : 0;
    }
  }, {
    key: 'prevIndex',
    get: function get() {
      return this.direction === 'up' ? this._nextIndex : this._prevIndex;
    }
  }, {
    key: 'nextIndex',
    get: function get() {
      return this.direction === 'up' ? this._prevIndex : this._nextIndex;
    }
  }, {
    key: 'visible',
    get: function get() {
      var rect = this.element.getBoundingClientRect();
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      var vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
      var horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

      return vertInView && horInView;
    }
  }, {
    key: '_animationFX',
    set: function set(FX_SPEED) {
      var _this7 = this;

      var delay = this.delay / 4;

      raf(function () {
        [].concat(_toConsumableArray(_this7.tiles), [_this7._fakeLastTile, _this7._fakeFirstTile]).forEach(function (tile) {
          tile.classList.remove(FX_FAST, FX_NORMAL, FX_SLOW, FX_TURTLE);
          if (FX_SPEED !== FX_STOP) {
            tile.classList.add(FX_SPEED);
          }
        });

        if (FX_SPEED === FX_STOP) {
          _this7.container.classList.remove(FX_GRADIENT);
        } else {
          _this7.container.classList.add(FX_GRADIENT);
        }
      }, delay);
    }
  }]);

  return SlotMachine;
}();

module.exports = SlotMachine;

},{"./raf":2,"./timer":4}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Timer(cb, delay) {
    _classCallCheck(this, Timer);

    this.cb = cb;
    this.initialDelay = delay;
    this.delay = delay;
    this.startTime = null;
    this.timer = null;
    this.running = false;

    this.resume();

    return this;
  }

  _createClass(Timer, [{
    key: "_start",
    value: function _start() {
      var _this = this;

      this.timer = setTimeout(function () {
        _this.running = false;
        _this.cb(_this);
      }, this.delay);
    }
  }, {
    key: "cancel",
    value: function cancel() {
      this.running = false;
      clearTimeout(this.timer);
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.running) {
        this.delay -= new Date().getTime() - this.startTime;
        this.cancel();
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      if (!this.running) {
        this.running = true;
        this.startTime = new Date().getTime();

        this._start();
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.cancel();
      this.delay = this.initialDelay;
      this._start();
    }
  }, {
    key: "add",
    value: function add(extraDelay) {
      this.pause();
      this.delay += extraDelay;
      this.resume();
    }
  }]);

  return Timer;
}();

},{}]},{},[1]);

/*
 * jQuery Slot Machine v4.0.0
 * https://github.com/josex2r/jQuery-SlotMachineundefined
 *
 * Copyright 2014 Jose Luis Represa
 * Released under the MIT license
 */
(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable no-undef */

var name = 'slotMachine';

var JQuerySlotMachine = function (_SlotMachine) {
  _inherits(JQuerySlotMachine, _SlotMachine);

  function JQuerySlotMachine() {
    _classCallCheck(this, JQuerySlotMachine);

    return _possibleConstructorReturn(this, (JQuerySlotMachine.__proto__ || Object.getPrototypeOf(JQuerySlotMachine)).apply(this, arguments));
  }

  _createClass(JQuerySlotMachine, [{
    key: 'destroy',
    value: function destroy() {
      _get(JQuerySlotMachine.prototype.__proto__ || Object.getPrototypeOf(JQuerySlotMachine.prototype), 'destroy', this).call(this);
      $.data(this.element[0], 'plugin_' + name, null);
    }
  }]);

  return JQuerySlotMachine;
}(SlotMachine);

/*
 * Create new plugin instance if needed and return it
 */


function _getInstance(element, options) {
  var machine = void 0;
  if (!$.data(element[0], 'plugin_' + name)) {
    machine = new JQuerySlotMachine(element[0], options);
    $.data(element[0], 'plugin_' + name, machine);
  } else {
    machine = $.data(element[0], 'plugin_' + name);
  }
  return machine;
}

/*
 * Chainable instance
 */
$.fn[name] = function initPlugin(options) {
  var instances = void 0;
  if (this.length === 1) {
    instances = _getInstance(this, options);
  } else {
    var $els = this;
    instances = $.map($els, function (el, index) {
      var $el = $els.eq(index);
      return _getInstance($el[0], options);
    });
  }
  return instances;
};

},{}]},{},[1]);
