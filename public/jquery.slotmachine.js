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
