(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  /*!
   * GSAP 3.0.2
   * https://greensock.com
   *
   * @license Copyright 2008-2019, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  var _config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: ""
    }
  },
      _defaults = {
    duration: .5,
    overwrite: false,
    delay: 0
  },
      _bigNum = 1e8,
      _tinyNum = 1 / _bigNum,
      _2PI = Math.PI * 2,
      _HALF_PI = _2PI / 4,
      _gsID = 0,
      _sqrt = Math.sqrt,
      _cos = Math.cos,
      _sin = Math.sin,
      _isString = function _isString(value) {
    return typeof value === "string";
  },
      _isFunction = function _isFunction(value) {
    return typeof value === "function";
  },
      _isNumber = function _isNumber(value) {
    return typeof value === "number";
  },
      _isUndefined = function _isUndefined(value) {
    return typeof value === "undefined";
  },
      _isObject = function _isObject(value) {
    return typeof value === "object";
  },
      _isNotFalse = function _isNotFalse(value) {
    return value !== false;
  },
      _windowExists = function _windowExists() {
    return typeof window !== "undefined";
  },
      _isFuncOrString = function _isFuncOrString(value) {
    return _isFunction(value) || _isString(value);
  },
      _isArray = Array.isArray,
      _strictNumExp = /(?:-?\.?\d|\.)+/gi,
      _numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
      _complexStringNumExp = /[-+=\.]*\d+(?:\.|e-|e)*\d*/gi,
      _parenthesesExp = /\(([^()]+)\)/i,
      _relExp = /[\+-]=-?[\.\d]+/,
      _delimitedValueExp = /[#\-+\.]*\b[a-z\d-=+%.]+/gi,
      _globalTimeline,
      _win,
      _coreInitted,
      _doc,
      _globals = {},
      _installScope = {},
      _coreReady,
      _install = function _install(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap;
  },
      _missingPlugin = function _missingPlugin(property, value) {
    return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
  },
      _warn = function _warn(message, suppress) {
    return !suppress && console.warn(message);
  },
      _addGlobal = function _addGlobal(name, obj) {
    return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
  },
      _emptyFunc = function _emptyFunc() {
    return 0;
  },
      _reservedProps = {},
      _lazyTweens = [],
      _lazyLookup = {},
      _plugins = {},
      _effects = {},
      _nextGCFrame = 30,
      _harnessPlugins = [],
      _callbackNames = "onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
      _harness = function _harness(targets) {
    var target = targets[0],
        harnessPlugin,
        i;

    if (!_isObject(target) && !_isFunction(target)) {
      targets = [targets];
    }

    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      i = _harnessPlugins.length;

      while (i-- && !_harnessPlugins[i].targetTest(target)) {}

      harnessPlugin = _harnessPlugins[i];
    }

    i = targets.length;

    while (i--) {
      targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
    }

    return targets;
  },
      _getCache = function _getCache(target) {
    return target._gsap || _harness(toArray(target))[0]._gsap;
  },
      _getProperty = function _getProperty(target, property) {
    var currentValue = target[property];
    return _isFunction(currentValue) ? target[property]() : _isUndefined(currentValue) && target.getAttribute(property) || currentValue;
  },
      _forEachName = function _forEachName(names, func) {
    return (names = names.split(",")).forEach(func) || names;
  },
      _round = function _round(value) {
    return Math.round(value * 10000) / 10000;
  },
      _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
    var l = toFind.length,
        i = 0;

    for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

    return i < l;
  },
      _parseVars = function _parseVars(params, type, parent) {
    var isLegacy = _isNumber(params[1]),
        varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
        vars = params[varsIndex],
        i;

    if (isLegacy) {
      vars.duration = params[1];
    }

    if (type === 1) {
      vars.runBackwards = 1;
      vars.immediateRender = _isNotFalse(vars.immediateRender);
    } else if (type === 2) {
      i = params[varsIndex - 1];
      vars.startAt = i;
      vars.immediateRender = _isNotFalse(vars.immediateRender);
    }

    vars.parent = parent;
    return vars;
  },
      _lazyRender = function _lazyRender() {
    var l = _lazyTweens.length,
        a = _lazyTweens.slice(0),
        i,
        tween;

    _lazyLookup = {};
    _lazyTweens.length = 0;

    for (i = 0; i < l; i++) {
      tween = a[i];

      if (tween && tween._lazy) {
        tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0;
      }
    }
  },
      _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
    if (_lazyTweens.length) {
      _lazyRender();
    }

    animation.render(time, suppressEvents, force);

    if (_lazyTweens.length) {
      _lazyRender();
    }
  },
      _numericIfPossible = function _numericIfPossible(value) {
    var n = parseFloat(value);
    return n || n === 0 ? n : value;
  },
      _passThrough = function _passThrough(p) {
    return p;
  },
      _setDefaults = function _setDefaults(obj, defaults) {
    for (var p in defaults) {
      if (!(p in obj)) {
        obj[p] = defaults[p];
      }
    }

    return obj;
  },
      _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
    for (var p in defaults) {
      if (!(p in obj) && p !== "duration" && p !== "ease") {
        obj[p] = defaults[p];
      }
    }
  },
      _merge = function _merge(base, toMerge) {
    for (var p in toMerge) {
      base[p] = toMerge[p];
    }

    return base;
  },
      _mergeDeep = function _mergeDeep(base, toMerge) {
    for (var p in toMerge) {
      base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p];
    }

    return base;
  },
      _copyExcluding = function _copyExcluding(obj, excluding) {
    var copy = {},
        p;

    for (p in obj) {
      if (!(p in excluding)) {
        copy[p] = obj[p];
      }
    }

    return copy;
  },
      _inheritDefaults = function _inheritDefaults(vars) {
    var parent = vars.parent || _globalTimeline,
        func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;

    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults);
        parent = parent.parent;
      }
    }

    return vars;
  },
      _arraysMatch = function _arraysMatch(a1, a2) {
    var i = a1.length,
        match = i === a2.length;

    while (match && i-- && a1[i] === a2[i]) {}

    return i < 0;
  },
      _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }

    if (lastProp === void 0) {
      lastProp = "_last";
    }

    var prev = parent[lastProp],
        t;

    if (sortBy) {
      t = child[sortBy];

      while (prev && prev[sortBy] > t) {
        prev = prev._prev;
      }
    }

    if (prev) {
      child._next = prev._next;
      prev._next = child;
    } else {
      child._next = parent[firstProp];
      parent[firstProp] = child;
    }

    if (child._next) {
      child._next._prev = child;
    } else {
      parent[lastProp] = child;
    }

    child._prev = prev;
    child.parent = parent;
    return child;
  },
      _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }

    if (lastProp === void 0) {
      lastProp = "_last";
    }

    var prev = child._prev,
        next = child._next;

    if (prev) {
      prev._next = next;
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next;
    }

    if (next) {
      next._prev = prev;
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev;
    }

    child._dp = parent;
    child._next = child._prev = child.parent = null;
  },
      _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
    if (child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren)) {
      child.parent.remove(child);
    }

    child._act = 0;
  },
      _uncache = function _uncache(animation) {
    var a = animation;

    while (a) {
      a._dirty = 1;
      a = a.parent;
    }

    return animation;
  },
      _recacheAncestors = function _recacheAncestors(animation) {
    var parent = animation.parent;

    while (parent && parent.parent) {
      parent._dirty = 1;
      parent.totalDuration();
      parent = parent.parent;
    }

    return animation;
  },
      _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
    return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
  },
      _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
    return animation._repeat ? ~~(animation._tTime / (animation = animation.duration() + animation._rDelay)) * animation : 0;
  },
      _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
    return child._ts > 0 ? (parentTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (parentTime - child._start) * child._ts;
  },
      _addToTimeline = function _addToTimeline(timeline, child, position) {
    child.parent && _removeFromParent(child);
    child._start = position + child._delay;
    child._end = child._start + (child.totalDuration() / child._ts || 0);

    _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

    timeline._recent = child;

    if (child._time || !child._dur && child._initted) {
      var curTime = (timeline.rawTime() - child._start) * child._ts;

      if (!child._dur || _clamp(0, child.totalDuration(), curTime) - child._tTime > _tinyNum) {
        child.render(curTime, true);
      }
    }

    _uncache(timeline);

    if (timeline._dp && timeline._time >= timeline._dur && timeline._ts && timeline._dur < timeline.duration()) {
      var tl = timeline;

      while (tl._dp) {
        tl.totalTime(tl._tTime, true);
        tl = tl._dp;
      }
    }

    return timeline;
  },
      _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
    _initTween(tween, totalTime);

    if (!tween._initted) {
      return 1;
    }

    if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy)) {
      _lazyTweens.push(tween);

      tween._lazy = [totalTime, suppressEvents];
      return 1;
    }
  },
      _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
    var prevRatio = tween._zTime < 0 ? 0 : 1,
        ratio = totalTime < 0 ? 0 : 1,
        repeatDelay = tween._rDelay,
        tTime = 0,
        pt,
        iteration,
        prevIteration;

    if (repeatDelay && tween._repeat) {
      tTime = _clamp(0, tween._tDur, totalTime);
      iteration = ~~(tTime / repeatDelay);

      if (iteration && iteration === tTime / repeatDelay) {
        iteration--;
      }

      prevIteration = ~~(tween._tTime / repeatDelay);

      if (prevIteration && prevIteration === tween._tTime / repeatDelay) {
        prevIteration--;
      }

      if (iteration !== prevIteration) {
        prevRatio = 1 - ratio;

        if (tween.vars.repeatRefresh && tween._initted) {
          tween.invalidate();
        }
      }
    }

    if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
      return;
    }

    if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
      tween.ratio = ratio;

      if (tween._from) {
        ratio = 1 - ratio;
      }

      tween._time = 0;
      tween._tTime = tTime;

      if (!suppressEvents) {
        _callback(tween, "onStart");
      }

      pt = tween._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      if (!ratio && tween._startAt && !tween._onUpdate && tween._start) {
        tween._startAt.render(totalTime, true, force);
      }

      if (tween._onUpdate && !suppressEvents) {
        _callback(tween, "onUpdate");
      }

      if (tTime && tween._repeat && !suppressEvents && tween.parent) {
        _callback(tween, "onRepeat");
      }

      if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
        tween.ratio && _removeFromParent(tween, 1);

        if (!suppressEvents) {
          _callback(tween, tween.ratio ? "onComplete" : "onReverseComplete", true);

          tween._prom && tween._prom();
        }
      }
    }
  },
      _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
    var child;

    if (time > prevTime) {
      child = animation._first;

      while (child && child._start <= time) {
        if (!child._dur && child.data === "isPause" && child._start > prevTime) {
          return child;
        }

        child = child._next;
      }
    } else {
      child = animation._last;

      while (child && child._start >= time) {
        if (!child._dur && child.data === "isPause" && child._start < prevTime) {
          return child;
        }

        child = child._prev;
      }
    }
  },
      _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
    if (animation instanceof Timeline) {
      return _uncache(animation);
    }

    var repeat = animation._repeat;
    animation._tDur = !repeat ? animation._dur : repeat < 0 ? 1e20 : _round(animation._dur * (repeat + 1) + animation._rDelay * repeat);

    _uncache(animation.parent);

    return animation;
  },
      _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc
  },
      _parsePosition = function _parsePosition(animation, position, useBuildFrom) {
    var labels = animation.labels,
        recent = animation._recent || _zeroPosition,
        clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
        i,
        offset;

    if (_isString(position) && (isNaN(position) || position in labels)) {
      i = position.charAt(0);

      if (i === "<" || i === ">") {
        return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
      }

      i = position.indexOf("=");

      if (i < 0) {
        if (!(position in labels)) {
          labels[position] = clippedDuration;
        }

        return labels[position];
      }

      offset = +(position.charAt(i - 1) + position.substr(i + 1));
      return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset;
    }

    return position == null ? clippedDuration : +position;
  },
      _conditionalReturn = function _conditionalReturn(value, func) {
    return value || value === 0 ? func(value) : func;
  },
      _clamp = function _clamp(min, max, value) {
    return value < min ? min : value > max ? max : value;
  },
      getUnit = function getUnit(value) {
    return (value + "").substr((parseFloat(value) + "").length);
  },
      clamp = function clamp(min, max, value) {
    return _conditionalReturn(value, function (v) {
      return _clamp(min, max, v);
    });
  },
      _slice = [].slice,
      _isArrayLike = function _isArrayLike(value) {
    return value && _isObject(value) && "length" in value && value.length - 1 in value && _isObject(value[0]) && !value.nodeType && value !== _win;
  },
      _flatten = function _flatten(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = [];
    }

    return ar.forEach(function (value) {
      var _accumulator;

      return _isString(value) && !leaveStrings || _isArrayLike(value) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
    }) || accumulator;
  },
      toArray = function toArray(value, leaveStrings) {
    return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
  },
      distribute = function distribute(v) {
    if (_isFunction(v)) {
      return v;
    }

    var vars = _isObject(v) ? v : {
      each: v
    },
        ease = _parseEase(vars.ease),
        from = vars.from || 0,
        base = parseFloat(vars.base) || 0,
        cache = {},
        isDecimal = from > 0 && from < 1,
        ratios = isNaN(from) || isDecimal,
        axis = vars.axis,
        ratioX = from,
        ratioY = from;

    if (_isString(from)) {
      ratioX = ratioY = {
        center: .5,
        edges: .5,
        end: 1
      }[from] || 0;
    } else if (!isDecimal && ratios) {
      ratioX = from[0];
      ratioY = from[1];
    }

    return function (i, target, a) {
      var l = (a || vars).length,
          distances = cache[l],
          originX,
          originY,
          x,
          y,
          d,
          j,
          max,
          min,
          wrapAt;

      if (!distances) {
        wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

        if (!wrapAt) {
          max = -_bigNum;

          while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

          wrapAt--;
        }

        distances = cache[l] = [];
        originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
        originY = ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
        max = 0;
        min = _bigNum;

        for (j = 0; j < l; j++) {
          x = j % wrapAt - originX;
          y = originY - (j / wrapAt | 0);
          distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);

          if (d > max) {
            max = d;
          }

          if (d < min) {
            min = d;
          }
        }

        distances.max = max - min;
        distances.min = min;
        distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
        distances.b = l < 0 ? base - l : base;
        distances.u = getUnit(vars.amount || vars.each) || 0;
        ease = ease && l < 0 ? _invertEase(ease) : ease;
      }

      l = (distances[i] - distances.min) / distances.max || 0;
      return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
    };
  },
      _roundModifier = function _roundModifier(v) {
    var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1;
    return function (raw) {
      return ~~(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw));
    };
  },
      snap = function snap(snapTo, value) {
    var isArray = _isArray(snapTo),
        radius,
        is2D;

    if (!isArray && _isObject(snapTo)) {
      radius = isArray = snapTo.radius || _bigNum;
      snapTo = toArray(snapTo.values);

      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius;
      }
    }

    return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : function (raw) {
      var x = parseFloat(is2D ? raw.x : raw),
          y = parseFloat(is2D ? raw.y : 0),
          min = _bigNum,
          closest = 0,
          i = snapTo.length,
          dx,
          dy;

      while (i--) {
        if (is2D) {
          dx = snapTo[i].x - x;
          dy = snapTo[i].y - y;
          dx = dx * dx + dy * dy;
        } else {
          dx = Math.abs(snapTo[i] - x);
        }

        if (dx < min) {
          min = dx;
          closest = i;
        }
      }

      closest = !radius || min <= radius ? snapTo[closest] : raw;
      return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
    });
  },
      random = function random(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(_isArray(min) ? !max : !returnFunction, function () {
      return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && ~~(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
    });
  },
      pipe = function pipe() {
    for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key];
    }

    return function (value) {
      return functions.reduce(function (v, f) {
        return f(v);
      }, value);
    };
  },
      unitize = function unitize(func, unit) {
    return function (value) {
      return func(parseFloat(value)) + (unit || getUnit(value));
    };
  },
      normalize = function normalize(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  },
      _wrapArray = function _wrapArray(a, wrapper, value) {
    return _conditionalReturn(value, function (index) {
      return a[~~wrapper(index)];
    });
  },
      wrap = function wrap(min, max, value) {
    var range = max - min;
    return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
      return (range + (value - min) % range) % range + min;
    });
  },
      wrapYoyo = function wrapYoyo(min, max, value) {
    var range = max - min,
        total = range * 2;
    return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
      value = (total + (value - min) % total) % total;
      return min + (value > range ? total - value : value);
    });
  },
      _replaceRandom = function _replaceRandom(value) {
    var prev = 0,
        s = "",
        i,
        nums,
        end,
        isArray;

    while (~(i = value.indexOf("random(", prev))) {
      end = value.indexOf(")", i);
      isArray = value.charAt(i + 7) === "[";
      nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
      s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], +nums[1], +nums[2] || 1e-5);
      prev = end + 1;
    }

    return s + value.substr(prev, value.length - prev);
  },
      mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
    var inRange = inMax - inMin,
        outRange = outMax - outMin;
    return _conditionalReturn(value, function (value) {
      return outMin + (value - inMin) / inRange * outRange;
    });
  },
      interpolate = function interpolate(start, end, progress, mutate) {
    var func = isNaN(start + end) ? 0 : function (p) {
      return (1 - p) * start + p * end;
    };

    if (!func) {
      var isString = _isString(start),
          master = {},
          p,
          i,
          interpolators,
          l,
          il;

      progress === true && (mutate = 1) && (progress = null);

      if (isString) {
        start = {
          p: start
        };
        end = {
          p: end
        };
      } else if (_isArray(start) && !_isArray(end)) {
        interpolators = [];
        l = start.length;
        il = l - 2;

        for (i = 1; i < l; i++) {
          interpolators.push(interpolate(start[i - 1], start[i]));
        }

        l--;

        func = function func(p) {
          p *= l;
          var i = Math.min(il, ~~p);
          return interpolators[i](p - i);
        };

        progress = end;
      } else if (!mutate) {
        start = _merge(_isArray(start) ? [] : {}, start);
      }

      if (!interpolators) {
        for (p in end) {
          _addPropTween.call(master, start, p, "get", end[p]);
        }

        func = function func(p) {
          return _renderPropTweens(p, master) || (isString ? start.p : start);
        };
      }
    }

    return _conditionalReturn(progress, func);
  },
      _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
    var labels = timeline.labels,
        min = _bigNum,
        p,
        distance,
        label;

    for (p in labels) {
      distance = labels[p] - fromTime;

      if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
        label = p;
        min = distance;
      }
    }

    return label;
  },
      _callback = function _callback(animation, type, executeLazyFirst) {
    var v = animation.vars,
        callback = v[type],
        params,
        scope;

    if (!callback) {
      return;
    }

    params = v[type + "Params"];
    scope = v.callbackScope || animation;

    if (executeLazyFirst && _lazyTweens.length) {
      _lazyRender();
    }

    return params ? callback.apply(scope, params) : callback.call(scope);
  },
      _interrupt = function _interrupt(animation) {
    _removeFromParent(animation);

    if (animation.progress() < 1) {
      _callback(animation, "onInterrupt");
    }

    return animation;
  },
      _quickTween,
      _createPlugin = function _createPlugin(config) {
    config = !config.name && config["default"] || config;

    var name = config.name,
        isFunc = _isFunction(config),
        Plugin = name && !isFunc && config.init ? function () {
      this._props = [];
    } : config,
        instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0
    },
        statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0
    };

    _wake();

    if (config !== Plugin) {
      if (_plugins[name]) {
        return;
      }

      _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics));

      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));

      _plugins[Plugin.prop = name] = Plugin;

      if (config.targetTest) {
        _harnessPlugins.push(Plugin);

        _reservedProps[name] = 1;
      }

      name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
    }

    _addGlobal(name, Plugin);

    if (config.register) {
      config.register(gsap, Plugin, PropTween);
    }
  },
      _255 = 255,
      _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0]
  },
      _hue = function _hue(h, m1, m2) {
    h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
    return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
  },
      splitColor = function splitColor(v, toHSL) {
    var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
        r,
        g,
        b,
        h,
        s,
        l,
        max,
        min,
        d,
        wasHSL;

    if (!a) {
      if (v.substr(-1) === ",") {
        v = v.substr(0, v.length - 1);
      }

      if (_colorLookup[v]) {
        a = _colorLookup[v];
      } else if (v.charAt(0) === "#") {
        if (v.length === 4) {
          r = v.charAt(1);
          g = v.charAt(2);
          b = v.charAt(3);
          v = "#" + r + r + g + g + b + b;
        }

        v = parseInt(v.substr(1), 16);
        a = [v >> 16, v >> 8 & _255, v & _255];
      } else if (v.substr(0, 3) === "hsl") {
        a = wasHSL = v.match(_strictNumExp);

        if (!toHSL) {
          h = +a[0] % 360 / 360;
          s = +a[1] / 100;
          l = +a[2] / 100;
          g = l <= .5 ? l * (s + 1) : l + s - l * s;
          r = l * 2 - g;

          if (a.length > 3) {
            a[3] *= 1;
          }

          a[0] = _hue(h + 1 / 3, r, g);
          a[1] = _hue(h, r, g);
          a[2] = _hue(h - 1 / 3, r, g);
        } else if (~v.indexOf("=")) {
          return v.match(_numExp);
        }
      } else {
        a = v.match(_strictNumExp) || _colorLookup.transparent;
      }

      a = a.map(Number);
    }

    if (toHSL && !wasHSL) {
      r = a[0] / _255;
      g = a[1] / _255;
      b = a[2] / _255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
      }

      a[0] = h + .5 | 0;
      a[1] = s * 100 + .5 | 0;
      a[2] = l * 100 + .5 | 0;
    }

    return a;
  },
      _formatColors = function _formatColors(s, toHSL) {
    var colors = (s + "").match(_colorExp),
        charIndex = 0,
        parsed = "",
        i,
        color,
        temp;

    if (!colors) {
      return s;
    }

    for (i = 0; i < colors.length; i++) {
      color = colors[i];
      temp = s.substr(charIndex, s.indexOf(color, charIndex) - charIndex);
      charIndex += temp.length + color.length;
      color = splitColor(color, toHSL);

      if (color.length === 3) {
        color.push(1);
      }

      parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")";
    }

    return parsed + s.substr(charIndex);
  },
      _colorExp = function () {
    var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b",
        p;

    for (p in _colorLookup) {
      s += "|" + p + "\\b";
    }

    return new RegExp(s + ")", "gi");
  }(),
      _hslExp = /hsl[a]?\(/,
      _colorStringFilter = function _colorStringFilter(a) {
    var combined = a.join(" "),
        toHSL;
    _colorExp.lastIndex = 0;

    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined);
      a[0] = _formatColors(a[0], toHSL);
      a[1] = _formatColors(a[1], toHSL);
    }
  },
      _tickerActive,
      _ticker = function () {
    var _getTime = Date.now,
        _lagThreshold = 500,
        _adjustedLag = 33,
        _startTime = _getTime(),
        _lastUpdate = _startTime,
        _gap = 1 / 60,
        _nextTime = _gap,
        _listeners = [],
        _id,
        _req,
        _raf,
        _self,
        _tick = function _tick(v) {
      var elapsed = _getTime() - _lastUpdate,
          manual = v === true,
          overlap,
          dispatch;

      if (elapsed > _lagThreshold) {
        _startTime += elapsed - _adjustedLag;
      }

      _lastUpdate += elapsed;
      _self.time = (_lastUpdate - _startTime) / 1000;
      overlap = _self.time - _nextTime;

      if (overlap > 0 || manual) {
        _self.frame++;
        _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
        dispatch = 1;
      }

      if (!manual) {
        _id = _req(_tick);
      }

      if (dispatch) {
        _listeners.forEach(function (l) {
          return l(_self.time, elapsed, _self.frame, v);
        });
      }
    };

    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true);
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted && _windowExists()) {
            _win = _coreInitted = window;
            _doc = _win.document || {};
            _globals.gsap = gsap;
            (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

            _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

            _raf = _win.requestAnimationFrame;
          }

          _id && _self.sleep();

          _req = _raf || function (f) {
            return setTimeout(f, (_nextTime - _self.time) * 1000 + 1 | 0);
          };

          _tickerActive = 1;

          _tick(2);
        }
      },
      sleep: function sleep() {
        (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
        _tickerActive = 0;
        _req = _emptyFunc;
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || 1 / _tinyNum;
        _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
      },
      fps: function fps(_fps) {
        _gap = 1 / (_fps || 60);
        _nextTime = _self.time + _gap;
      },
      add: function add(callback) {
        _listeners.indexOf(callback) < 0 && _listeners.push(callback);

        _wake();
      },
      remove: function remove(callback) {
        var i;
        ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1);
      },
      _listeners: _listeners
    };
    return _self;
  }(),
      _wake = function _wake() {
    return !_tickerActive && _ticker.wake();
  },
      _easeMap = {},
      _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
      _quotesExp = /["']/g,
      _parseObjectInString = function _parseObjectInString(value) {
    var obj = {},
        split = value.substr(1, value.length - 3).split(":"),
        key = split[0],
        i = 1,
        l = split.length,
        index,
        val,
        parsedVal;

    for (; i < l; i++) {
      val = split[i];
      index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
      parsedVal = val.substr(0, index);
      obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
      key = val.substr(index + 1).trim();
    }

    return obj;
  },
      _configEaseFromString = function _configEaseFromString(name) {
    var split = (name + "").split("("),
        ease = _easeMap[split[0]];
    return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _parenthesesExp.exec(name)[1].split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
  },
      _invertEase = function _invertEase(ease) {
    return function (p) {
      return 1 - ease(1 - p);
    };
  },
      _parseEase = function _parseEase(ease, defaultEase) {
    return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
  },
      _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut(p) {
        return 1 - easeIn(1 - p);
      };
    }

    if (easeInOut === void 0) {
      easeInOut = function easeInOut(p) {
        return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
      };
    }

    var ease = {
      easeIn: easeIn,
      easeOut: easeOut,
      easeInOut: easeInOut
    },
        lowercaseName;

    _forEachName(names, function (name) {
      _easeMap[name] = _globals[name] = ease;
      _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

      for (var p in ease) {
        _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
      }
    });

    return ease;
  },
      _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
    return function (p) {
      return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
    };
  },
      _configElastic = function _configElastic(type, amplitude, period) {
    var p1 = amplitude >= 1 ? amplitude : 1,
        p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
        p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
        easeOut = function easeOut(p) {
      return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
    },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);

    p2 = _2PI / p2;

    ease.config = function (amplitude, period) {
      return _configElastic(type, amplitude, period);
    };

    return ease;
  },
      _configBack = function _configBack(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158;
    }

    var easeOut = function easeOut(p) {
      return --p * p * ((overshoot + 1) * p + overshoot) + 1;
    },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);

    ease.config = function (overshoot) {
      return _configBack(type, overshoot);
    };

    return ease;
  };

  _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
    var power = i < 5 ? i + 1 : i;

    _insertEase(name + ",Power" + (power - 1), i ? function (p) {
      return Math.pow(p, power);
    } : function (p) {
      return p;
    }, function (p) {
      return 1 - Math.pow(1 - p, power);
    }, function (p) {
      return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
    });
  });

  _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

  _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

  (function (n, c) {
    var n1 = 1 / c,
        n2 = 2 * n1,
        n3 = 2.5 * n1,
        easeOut = function easeOut(p) {
      return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
    };

    _insertEase("Bounce", function (p) {
      return 1 - easeOut(1 - p);
    }, easeOut);
  })(7.5625, 2.75);

  _insertEase("Expo", function (p) {
    return p ? Math.pow(2, 10 * (p - 1)) : 0;
  });

  _insertEase("Circ", function (p) {
    return -(_sqrt(1 - p * p) - 1);
  });

  _insertEase("Sine", function (p) {
    return -_cos(p * _HALF_PI) + 1;
  });

  _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

  _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
    config: function config(steps, immediateStart) {
      if (steps === void 0) {
        steps = 1;
      }

      var p1 = 1 / steps,
          p2 = steps + (immediateStart ? 0 : 1),
          p3 = immediateStart ? 1 : 0,
          max = 1 - _tinyNum;
      return function (p) {
        return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
      };
    }
  };
  _defaults.ease = _easeMap["quad.out"];
  var GSCache = function GSCache(target, harness) {
    this.id = _gsID++;
    target._gsap = this;
    this.target = target;
    this.harness = harness;
    this.get = harness ? harness.get : _getProperty;
    this.set = harness ? harness.getSetter : _getSetter;
  };
  var Animation = function () {
    function Animation(vars, time) {
      var parent = vars.parent || _globalTimeline;
      this.vars = vars;
      this._dur = this._tDur = +vars.duration || 0;
      this._delay = +vars.delay || 0;

      if (this._repeat = vars.repeat || 0) {
        this._rDelay = vars.repeatDelay || 0;
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase;

        _onUpdateTotalDuration(this);
      }

      this._ts = 1;
      this.data = vars.data;

      if (!_tickerActive) {
        _ticker.wake();
      }

      if (parent) {
        _addToTimeline(parent, this, time || time === 0 ? time : parent._time);
      }

      if (vars.reversed) {
        this.reversed(true);
      }

      if (vars.paused) {
        this.paused(true);
      }
    }

    var _proto = Animation.prototype;

    _proto.delay = function delay(value) {
      if (value || value === 0) {
        this._delay = value;
        return this;
      }

      return this._delay;
    };

    _proto.duration = function duration(value) {
      var isSetter = arguments.length,
          repeat = this._repeat,
          repeatCycles = repeat > 0 ? repeat * ((isSetter ? value : this._dur) + this._rDelay) : 0;
      return isSetter ? this.totalDuration(repeat < 0 ? value : value + repeatCycles) : this.totalDuration() && this._dur;
    };

    _proto.totalDuration = function totalDuration(value) {
      if (!arguments.length) {
        return this._tDur;
      }

      var repeat = this._repeat,
          isInfinite = (value || this._rDelay) && repeat < 0;
      this._tDur = isInfinite ? 1e20 : value;
      this._dur = isInfinite ? value : (value - repeat * this._rDelay) / (repeat + 1);
      this._dirty = 0;

      _uncache(this.parent);

      return this;
    };

    _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
      _wake();

      if (!arguments.length) {
        return this._tTime;
      }

      var parent = this.parent || this._dp,
          start;

      if (parent && parent.smoothChildTiming && this._ts) {
        start = this._start;
        this._start = parent._time - (this._ts > 0 ? _totalTime / this._ts : ((this._dirty ? this.totalDuration() : this._tDur) - _totalTime) / -this._ts);
        this._end += this._start - start;

        if (!parent._dirty) {
          _uncache(parent);
        }

        while (parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts > 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, true);
          }

          parent = parent.parent;
        }

        if (!this.parent) {
          _addToTimeline(this._dp, this, this._start - this._delay);
        }
      }

      if (this._tTime !== _totalTime || !this._dur) {
        this._ts || (this._pTime = _totalTime);

        _lazySafeRender(this, _totalTime, suppressEvents);
      }

      return this;
    };

    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime((value + _elapsedCycleDuration(this)) % this.duration() || (value ? this._dur : 0), suppressEvents) : this._time;
    };

    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this._tTime / this.totalDuration();
    };

    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? this._time / this._dur : this.ratio;
    };

    _proto.iteration = function iteration(value, suppressEvents) {
      var cycleDuration = this.duration() + this._rDelay;

      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? ~~(this._tTime / cycleDuration) + 1 : 1;
    };

    _proto.timeScale = function timeScale(value) {
      var prevTS = this._ts;

      if (!arguments.length) {
        return prevTS || this._pauseTS;
      }

      if (!prevTS) {
        this._pauseTS = value;
        return this;
      }

      this._end = this._start + this._tDur / (this._ts = value || _tinyNum);
      return _recacheAncestors(this).totalTime(this._tTime, true);
    };

    _proto.paused = function paused(value) {
      var isPaused = !this._ts;

      if (!arguments.length) {
        return isPaused;
      }

      if (isPaused !== value) {
        if (value) {
          this._pauseTS = this._ts;
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
          this._ts = this._act = 0;
        } else {
          this._ts = this._pauseTS;
          value = this._tTime || this._pTime;

          if (this.progress() === 1) {
            this._tTime -= _tinyNum;
          }

          this.totalTime(value, true);
        }
      }

      return this;
    };

    _proto.startTime = function startTime(value) {
      if (arguments.length) {
        if (this.parent && this.parent._sort) {
          _addToTimeline(this.parent, this, value - this._delay);
        }

        return this;
      }

      return this._start;
    };

    _proto.endTime = function endTime(includeRepeats) {
      return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts);
    };

    _proto.rawTime = function rawTime(wrapRepeats) {
      var parent = this.parent || this._dp;
      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
    };

    _proto.repeat = function repeat(value) {
      if (arguments.length) {
        this._repeat = value;
        return _onUpdateTotalDuration(this);
      }

      return this._repeat;
    };

    _proto.repeatDelay = function repeatDelay(value) {
      if (arguments.length) {
        this._rDelay = value;
        return _onUpdateTotalDuration(this);
      }

      return this._rDelay;
    };

    _proto.yoyo = function yoyo(value) {
      if (arguments.length) {
        this._yoyo = value;
        return this;
      }

      return this._yoyo;
    };

    _proto.seek = function seek(position, suppressEvents) {
      return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
    };

    _proto.restart = function restart(includeDelay, suppressEvents) {
      return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
    };

    _proto.play = function play(from, suppressEvents) {
      if (from != null) {
        this.seek(from, suppressEvents);
      }

      return this.reversed(false).paused(false);
    };

    _proto.reverse = function reverse(from, suppressEvents) {
      if (from != null) {
        this.seek(from || this.totalDuration(), suppressEvents);
      }

      return this.reversed(true).paused(false);
    };

    _proto.pause = function pause(atTime, suppressEvents) {
      if (atTime != null) {
        this.seek(atTime, suppressEvents);
      }

      return this.paused(true);
    };

    _proto.resume = function resume() {
      return this.paused(false);
    };

    _proto.reversed = function reversed(value) {
      var ts = this._ts || this._pauseTS;

      if (arguments.length) {
        if (value !== this.reversed()) {
          this[this._ts ? "_ts" : "_pauseTS"] = Math.abs(ts) * (value ? -1 : 1);
          this.totalTime(this._tTime, true);
        }

        return this;
      }

      return ts < 0;
    };

    _proto.invalidate = function invalidate() {
      this._initted = 0;
      return this;
    };

    _proto.isActive = function isActive(hasStarted) {
      var parent = this.parent || this._dp,
          start = this._start,
          rawTime;
      return !parent || this._ts && (this._initted || !hasStarted) && parent.isActive(hasStarted) && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum;
    };

    _proto.eventCallback = function eventCallback(type, callback, params) {
      var vars = this.vars;

      if (arguments.length > 1) {
        if (!callback) {
          delete vars[type];
        } else {
          vars[type] = callback;

          if (params) {
            vars[type + "Params"] = params;
          }

          if (type === "onUpdate") {
            this._onUpdate = callback;
          }
        }

        return this;
      }

      return vars[type];
    };

    _proto.then = function then(onFulfilled) {
      var _this = this;

      return new Promise(function (resolve) {
        var f = onFulfilled || _passThrough,
            _resolve = function _resolve() {
          var _then = _this.then;
          _this.then = null;
          f = f(_this);

          if (f && (f.then || f === _this)) {
            _this._prom = f;
            _this.then = _then;
          }

          resolve(f);
          _this.then = _then;
        };

        if (_this._initted && _this.totalProgress() === 1 && _this._ts >= 0 || !_this._tTime && _this._ts < 0) {
          _resolve();
        } else {
          _this._prom = _resolve;
        }
      });
    };

    _proto.kill = function kill() {
      _interrupt(this);
    };

    return Animation;
  }();

  _setDefaults(Animation.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: false,
    parent: 0,
    _initted: false,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -_tinyNum,
    _prom: 0
  });

  var Timeline = function (_Animation) {
    _inheritsLoose(Timeline, _Animation);

    function Timeline(vars, time) {
      var _this2;

      if (vars === void 0) {
        vars = {};
      }

      _this2 = _Animation.call(this, vars, time) || this;
      _this2.labels = {};
      _this2.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
      _this2.autoRemoveChildren = !!vars.autoRemoveChildren;
      _this2._sort = _isNotFalse(vars.sortChildren);
      return _this2;
    }

    var _proto2 = Timeline.prototype;

    _proto2.to = function to(targets, vars, position) {
      new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
      return this;
    };

    _proto2.from = function from(targets, vars, position) {
      new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
      return this;
    };

    _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
      new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
      return this;
    };

    _proto2.set = function set(targets, vars, position) {
      vars.duration = 0;
      vars.parent = this;

      if (!vars.repeatDelay) {
        vars.repeat = 0;
      }

      vars.immediateRender = !!vars.immediateRender;
      new Tween(targets, vars, _parsePosition(this, position));
      return this;
    };

    _proto2.call = function call(callback, params, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position));
    };

    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration;
      vars.stagger = vars.stagger || stagger;
      vars.onComplete = onCompleteAll;
      vars.onCompleteParams = onCompleteAllParams;
      vars.parent = this;
      new Tween(targets, vars, _parsePosition(this, position));
      return this;
    };

    _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.runBackwards = 1;
      vars.immediateRender = _isNotFalse(vars.immediateRender);
      return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
    };

    _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
      toVars.startAt = fromVars;
      toVars.immediateRender = _isNotFalse(toVars.immediateRender);
      return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
    };

    _proto2.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
          tDur = this._dirty ? this.totalDuration() : this._tDur,
          dur = this._dur,
          tTime = totalTime > tDur - _tinyNum && totalTime >= 0 && this !== _globalTimeline ? tDur : totalTime < _tinyNum ? 0 : totalTime,
          crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
          time,
          child,
          next,
          iteration,
          cycleDuration,
          prevPaused,
          pauseTween,
          timeScale,
          prevStart,
          prevIteration,
          yoyo;

      if (tTime !== this._tTime || force || crossingStart) {
        if (crossingStart) {
          if (!dur) {
            prevTime = this._zTime;
          }

          if (totalTime || !suppressEvents) {
            this._zTime = totalTime;
          }
        }

        time = tTime;
        prevStart = this._start;
        timeScale = this._ts;
        prevPaused = timeScale === 0;

        if (prevTime !== this._time && dur) {
          time += this._time - prevTime;
        }

        if (this._repeat) {
          yoyo = this._yoyo;
          cycleDuration = dur + this._rDelay;
          time = _round(tTime % cycleDuration);

          if (time > dur || tDur === tTime) {
            time = dur;
          }

          iteration = ~~(tTime / cycleDuration);

          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }

          prevIteration = ~~(this._tTime / cycleDuration);

          if (prevIteration && prevIteration === this._tTime / cycleDuration) {
            prevIteration--;
          }

          if (yoyo && iteration & 1) {
            time = dur - time;
          }

          if (iteration !== prevIteration && !this._lock) {
            var rewinding = yoyo && prevIteration & 1,
                doesWrap = rewinding === (yoyo && iteration & 1);

            if (iteration < prevIteration) {
              rewinding = !rewinding;
            }

            prevTime = rewinding ? 0 : dur;
            this._lock = 1;
            this.render(prevTime, suppressEvents, !dur)._lock = 0;

            if (!suppressEvents && this.parent) {
              _callback(this, "onRepeat");
            }

            if (prevTime !== this._time || prevPaused !== !this._ts) {
              return this;
            }

            if (doesWrap) {
              this._lock = 2;
              prevTime = rewinding ? dur + 0.0001 : -0.0001;
              this.render(prevTime, true);
            }

            this._lock = 0;

            if (!this._ts && !prevPaused) {
              return this;
            }
          }
        }

        if (this._hasPause && !this._forcing && this._lock < 2) {
          pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));

          if (pauseTween) {
            tTime -= time - (time = pauseTween._start);
          }
        }

        this._tTime = tTime;
        this._time = time;
        this._act = !timeScale;

        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate;
          this._initted = 1;
        }

        if (!prevTime && time && !suppressEvents) {
          _callback(this, "onStart");
        }

        if (time >= prevTime && totalTime >= 0) {
          child = this._first;

          while (child) {
            next = child._next;

            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }

              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                break;
              }
            }

            child = next;
          }
        } else {
          child = this._last;
          var adjustedTime = totalTime < 0 ? totalTime : time;

          while (child) {
            next = child._prev;

            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }

              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);

              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                break;
              }
            }

            child = next;
          }
        }

        if (pauseTween && !suppressEvents) {
          this.pause();
          pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

          if (this._ts) {
            this._start = prevStart;
            return this.render(totalTime, suppressEvents, force);
          }
        }

        if (this._onUpdate && !suppressEvents) {
          _callback(this, "onUpdate", true);
        }

        if (tTime === tDur || !tTime && this._ts < 0) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!time || tDur >= this.totalDuration()) {
          (totalTime || !dur) && _removeFromParent(this, 1);

          if (!suppressEvents && !(totalTime < 0 && !prevTime)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

            this._prom && this._prom();
          }
        }
      }

      return this;
    };

    _proto2.add = function add(child, position) {
      var _this3 = this;

      if (!_isNumber(position)) {
        position = _parsePosition(this, position);
      }

      if (!(child instanceof Animation)) {
        if (_isArray(child)) {
          child.forEach(function (obj) {
            return _this3.add(obj, position);
          });
          return _uncache(this);
        }

        if (_isString(child)) {
          return this.addLabel(child, position);
        }

        if (_isFunction(child)) {
          child = Tween.delayedCall(0, child);
        } else {
          return this;
        }
      }

      return this !== child ? _addToTimeline(this, child, position) : this;
    };

    _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
      if (nested === void 0) {
        nested = true;
      }

      if (tweens === void 0) {
        tweens = true;
      }

      if (timelines === void 0) {
        timelines = true;
      }

      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = -_bigNum;
      }

      var a = [],
          child = this._first;

      while (child) {
        if (child._start >= ignoreBeforeTime) {
          if (child instanceof Tween) {
            if (tweens) {
              a.push(child);
            }
          } else {
            if (timelines) {
              a.push(child);
            }

            if (nested) {
              a.push.apply(a, child.getChildren(true, tweens, timelines));
            }
          }
        }

        child = child._next;
      }

      return a;
    };

    _proto2.getById = function getById(id) {
      var animations = this.getChildren(1, 1, 1),
          i = animations.length;

      while (i--) {
        if (animations[i].vars.id === id) {
          return animations[i];
        }
      }
    };

    _proto2.remove = function remove(child) {
      if (_isString(child)) {
        return this.removeLabel(child);
      }

      if (_isFunction(child)) {
        return this.killTweensOf(child);
      }

      _removeLinkedListItem(this, child);

      if (child === this._recent) {
        this._recent = this._last;
      }

      return _uncache(this);
    };

    _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
      if (!arguments.length) {
        return this._tTime;
      }

      this._forcing = 1;

      if (!this.parent && !this._dp && this._ts) {
        this._start = _ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts);
      }

      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

      this._forcing = 0;
      return this;
    };

    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition(this, position);
      return this;
    };

    _proto2.removeLabel = function removeLabel(label) {
      delete this.labels[label];
      return this;
    };

    _proto2.addPause = function addPause(position, callback, params) {
      var t = Tween.delayedCall(0, callback || _emptyFunc, params);
      t.data = "isPause";
      this._hasPause = 1;
      return _addToTimeline(this, t, _parsePosition(this, position));
    };

    _proto2.removePause = function removePause(position) {
      var child = this._first;
      position = _parsePosition(this, position);

      while (child) {
        if (child._start === position && child.data === "isPause") {
          _removeFromParent(child);
        }

        child = child._next;
      }
    };

    _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      var tweens = this.getTweensOf(targets, onlyActive),
          i = tweens.length;

      while (i--) {
        _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
      }

      return this;
    };

    _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
      var a = [],
          parsedTargets = toArray(targets),
          child = this._first,
          children;

      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (!onlyActive || child.isActive(onlyActive === "started"))) {
            a.push(child);
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children);
        }

        child = child._next;
      }

      return a;
    };

    _proto2.tweenTo = function tweenTo(position, vars) {
      var tl = this,
          endTime = _parsePosition(tl, position),
          startAt = vars && vars.startAt,
          tween = Tween.to(tl, _setDefaults({
        ease: "none",
        lazy: false,
        time: endTime,
        duration: Math.abs(endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale() || _tinyNum,
        onStart: function onStart() {
          tl.pause();
          var duration = Math.abs(endTime - tl._time) / tl.timeScale();

          if (tween._dur !== duration) {
            tween._dur = duration;
            tween.render(tween._time, true, true);
          }

          if (vars && vars.onStart) {
            vars.onStart.apply(tween, vars.onStartParams || []);
          }
        }
      }, vars));

      return tween;
    };

    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults({
        startAt: {
          time: _parsePosition(this, fromPosition)
        }
      }, vars));
    };

    _proto2.recent = function recent() {
      return this._recent;
    };

    _proto2.nextLabel = function nextLabel(afterTime) {
      if (afterTime === void 0) {
        afterTime = this._time;
      }

      return _getLabelInDirection(this, _parsePosition(this, afterTime));
    };

    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time;
      }

      return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
    };

    _proto2.currentLabel = function currentLabel(value) {
      return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
    };

    _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = 0;
      }

      var child = this._first,
          labels = this.labels,
          p;

      while (child) {
        if (child._start >= ignoreBeforeTime) {
          child._start += amount;
        }

        child = child._next;
      }

      if (adjustLabels) {
        for (p in labels) {
          if (labels[p] >= ignoreBeforeTime) {
            labels[p] += amount;
          }
        }
      }

      return _uncache(this);
    };

    _proto2.invalidate = function invalidate() {
      var child = this._first;
      this._lock = 0;

      while (child) {
        child.invalidate();
        child = child._next;
      }

      return _Animation.prototype.invalidate.call(this);
    };

    _proto2.clear = function clear(includeLabels) {
      if (includeLabels === void 0) {
        includeLabels = true;
      }

      var child = this._first,
          next;

      while (child) {
        next = child._next;
        this.remove(child);
        child = next;
      }

      this._time = this._tTime = 0;

      if (includeLabels) {
        this.labels = {};
      }

      return _uncache(this);
    };

    _proto2.totalDuration = function totalDuration(value) {
      var max = 0,
          self = this,
          child = self._last,
          prevStart = _bigNum,
          repeat = self._repeat,
          repeatCycles = repeat * self._rDelay || 0,
          isInfinite = repeat < 0,
          prev,
          end;

      if (!arguments.length) {
        if (self._dirty) {
          while (child) {
            prev = child._prev;

            if (child._dirty) {
              child.totalDuration();
            }

            if (child._start > prevStart && self._sort && child._ts && !self._lock) {
              self._lock = 1;

              _addToTimeline(self, child, child._start - child._delay);

              self._lock = 0;
            } else {
              prevStart = child._start;
            }

            if (child._start < 0 && child._ts) {
              max -= child._start;

              if (!self.parent && !self._dp || self.parent && self.parent.smoothChildTiming) {
                self._start += child._start / self._ts;
                self._time -= child._start;
                self._tTime -= child._start;
              }

              self.shiftChildren(-child._start, false, -_bigNum);
              prevStart = 0;
            }

            end = child._end = child._start + child._tDur / Math.abs(child._ts || child._pauseTS);

            if (end > max && child._ts) {
              max = _round(end);
            }

            child = prev;
          }

          self._dur = self === _globalTimeline && self._time > max ? self._time : Math.min(_bigNum, max);
          self._tDur = isInfinite && (self._dur || repeatCycles) ? 1e20 : Math.min(_bigNum, max * (repeat + 1) + repeatCycles);
          self._end = self._start + (self._tDur / Math.abs(self._ts || self._pauseTS) || 0);
          self._dirty = 0;
        }

        return self._tDur;
      }

      return isInfinite ? self : self.timeScale(self.totalDuration() / value);
    };

    Timeline.updateRoot = function updateRoot(time) {
      if (_globalTimeline._ts) {
        _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
      }

      if (_ticker.frame >= _nextGCFrame) {
        _nextGCFrame += _config.autoSleep || 120;
        var child = _globalTimeline._first;
        if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
          while (child && !child._ts) {
            child = child._next;
          }

          if (!child) {
            _ticker.sleep();
          }
        }
      }
    };

    return Timeline;
  }(Animation);

  _setDefaults(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });

  var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
    var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
        index = 0,
        matchIndex = 0,
        result,
        startNums,
        color,
        endNum,
        chunk,
        startNum,
        hasRandom,
        a;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";

    if (hasRandom = ~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (stringFilter) {
      a = [start, end];
      stringFilter(a, target, prop);
      start = a[0];
      end = a[1];
    }

    startNums = start.match(_complexStringNumExp) || [];

    while (result = _complexStringNumExp.exec(end)) {
      endNum = result[0];
      chunk = end.substring(index, result.index);

      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(") {
        color = 1;
      }

      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]);
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          s: startNum,
          c: endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0
        };
        index = _complexStringNumExp.lastIndex;
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : "";
    pt.fp = funcParam;

    if (_relExp.test(end) || hasRandom) {
      pt.e = 0;
    }

    this._pt = pt;
    return pt;
  },
      _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
    if (_isFunction(end)) {
      end = end(index || 0, target, targets);
    }

    var currentValue = target[prop],
        parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
        setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
        pt;

    if (_isString(end)) {
      if (~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }

      if (end.charAt(1) === "=") {
        end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0);
      }
    }

    if (parsedStart !== end) {
      if (!isNaN(parsedStart + end)) {
        pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);

        if (funcParam) {
          pt.fp = funcParam;
        }

        if (modifier) {
          pt.modifier(modifier, this, target);
        }

        return this._pt = pt;
      }

      !currentValue && !(prop in target) && _missingPlugin(prop, end);
      return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
    }
  },
      _processVars = function _processVars(vars, index, target, targets, tween) {
    if (_isFunction(vars)) {
      vars = _parseFuncOrString(vars, tween, index, target, targets);
    }

    if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars)) {
      return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
    }

    var copy = {},
        p;

    for (p in vars) {
      copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
    }

    return copy;
  },
      _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
    var plugin, pt, ptLookup, i;

    if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
      tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
        i = plugin._props.length;

        while (i--) {
          ptLookup[plugin._props[i]] = pt;
        }
      }
    }

    return plugin;
  },
      _overwritingTween,
      _initTween = function _initTween(tween, time) {
    var vars = tween.vars,
        ease = vars.ease,
        startAt = vars.startAt,
        immediateRender = vars.immediateRender,
        lazy = vars.lazy,
        onUpdate = vars.onUpdate,
        onUpdateParams = vars.onUpdateParams,
        callbackScope = vars.callbackScope,
        runBackwards = vars.runBackwards,
        yoyoEase = vars.yoyoEase,
        keyframes = vars.keyframes,
        autoRevert = vars.autoRevert,
        dur = tween._dur,
        prevStartAt = tween._startAt,
        targets = tween._targets,
        parent = tween.parent,
        fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
        autoOverwrite = tween._overwrite === "auto",
        tl = tween.timeline,
        cleanVars,
        i,
        p,
        pt,
        target,
        hasPriority,
        gsData,
        harness,
        plugin,
        ptLookup,
        index,
        harnessVars;

    if (tl && (!keyframes || !ease)) {
      ease = "none";
    }

    tween._ease = _parseEase(ease, _defaults.ease);
    tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

    if (yoyoEase && tween._yoyo && !tween._repeat) {
      yoyoEase = tween._yEase;
      tween._yEase = tween._ease;
      tween._ease = yoyoEase;
    }

    if (!tl) {
      if (prevStartAt) {
        prevStartAt.render(-1, true).kill();
      }

      if (startAt) {
        _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
          data: "isStart",
          overwrite: false,
          parent: parent,
          immediateRender: true,
          lazy: _isNotFalse(lazy),
          startAt: null,
          delay: 0,
          onUpdate: onUpdate,
          onUpdateParams: onUpdateParams,
          callbackScope: callbackScope,
          stagger: 0
        }, startAt)));

        if (immediateRender) {
          if (time > 0) {
            !autoRevert && (tween._startAt = 0);
          } else if (dur) {
            return;
          }
        }
      } else if (runBackwards && dur) {
        if (prevStartAt) {
          !autoRevert && (tween._startAt = 0);
        } else {
          if (time) {
            immediateRender = false;
          }

          _removeFromParent(tween._startAt = Tween.set(targets, _merge(_copyExcluding(vars, _reservedProps), {
            overwrite: false,
            data: "isFromStart",
            lazy: immediateRender && _isNotFalse(lazy),
            immediateRender: immediateRender,
            stagger: 0,
            parent: parent
          })));

          if (!immediateRender) {
            _initTween(tween._startAt, _tinyNum);
          } else if (!time) {
            return;
          }
        }
      }

      cleanVars = _copyExcluding(vars, _reservedProps);
      tween._pt = 0;
      harness = targets[0] ? _getCache(targets[0]).harness : 0;
      harnessVars = harness && vars[harness.prop];
      lazy = dur && _isNotFalse(lazy) || lazy && !dur;

      for (i = 0; i < targets.length; i++) {
        target = targets[i];
        gsData = target._gsap || _harness(targets)[i]._gsap;
        tween._ptLookup[i] = ptLookup = {};

        if (_lazyLookup[gsData.id]) {
          _lazyRender();
        }

        index = fullTargets === targets ? i : fullTargets.indexOf(target);

        if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

          plugin._props.forEach(function (name) {
            ptLookup[name] = pt;
          });

          if (plugin.priority) {
            hasPriority = 1;
          }
        }

        if (!harness || harnessVars) {
          for (p in cleanVars) {
            if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
              if (plugin.priority) {
                hasPriority = 1;
              }
            } else {
              ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
            }
          }
        }

        if (tween._op && tween._op[i]) {
          tween.kill(target, tween._op[i]);
        }

        if (autoOverwrite) {
          _overwritingTween = tween;

          _globalTimeline.killTweensOf(target, ptLookup, "started");

          _overwritingTween = 0;
        }

        if (tween._pt && lazy) {
          _lazyLookup[gsData.id] = 1;
        }
      }

      if (hasPriority) {
        _sortPropTweensByPriority(tween);
      }

      if (tween._onInit) {
        tween._onInit(tween);
      }
    }

    tween._from = !tl && !!vars.runBackwards;
    tween._onUpdate = onUpdate;
    tween._initted = 1;
  },
      _addAliasesToVars = function _addAliasesToVars(targets, vars) {
    var harness = targets[0] ? _getCache(targets[0]).harness : 0,
        propertyAliases = harness && harness.aliases,
        copy,
        p,
        i,
        aliases;

    if (!propertyAliases) {
      return vars;
    }

    copy = _merge({}, vars);

    for (p in propertyAliases) {
      if (p in copy) {
        aliases = propertyAliases[p].split(",");
        i = aliases.length;

        while (i--) {
          copy[aliases[i]] = copy[p];
        }
      }
    }

    return copy;
  },
      _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
    return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
  },
      _staggerTweenProps = _callbackNames + ",repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
      _staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused").split(",");

  var Tween = function (_Animation2) {
    _inheritsLoose(Tween, _Animation2);

    function Tween(targets, vars, time) {
      var _this4;

      if (typeof vars === "number") {
        time.duration = vars;
        vars = time;
        time = null;
      }

      _this4 = _Animation2.call(this, _inheritDefaults(vars), time) || this;
      var _this4$vars = _this4.vars,
          duration = _this4$vars.duration,
          delay = _this4$vars.delay,
          immediateRender = _this4$vars.immediateRender,
          stagger = _this4$vars.stagger,
          overwrite = _this4$vars.overwrite,
          keyframes = _this4$vars.keyframes,
          defaults = _this4$vars.defaults,
          parsedTargets = _isArray(targets) && _isNumber(targets[0]) ? [targets] : toArray(targets),
          tl,
          i,
          copy,
          l,
          p,
          curTarget,
          staggerFunc,
          staggerVarsToMerge;
      _this4._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
      _this4._ptLookup = [];
      _this4._overwrite = overwrite;

      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this4.vars;
        tl = _this4.timeline = new Timeline({
          data: "nested",
          defaults: defaults || {}
        });
        tl.kill();
        tl.parent = _assertThisInitialized(_this4);

        if (keyframes) {
          _setDefaults(tl.vars.defaults, {
            ease: "none"
          });

          keyframes.forEach(function (frame) {
            return tl.to(parsedTargets, frame, ">");
          });
        } else {
          l = parsedTargets.length;
          staggerFunc = stagger ? distribute(stagger) : _emptyFunc;

          if (_isObject(stagger)) {
            for (p in stagger) {
              if (~_staggerTweenProps.indexOf(p)) {
                if (!staggerVarsToMerge) {
                  staggerVarsToMerge = {};
                }

                staggerVarsToMerge[p] = stagger[p];
              }
            }
          }

          for (i = 0; i < l; i++) {
            copy = {};

            for (p in vars) {
              if (_staggerPropsToSkip.indexOf(p) < 0) {
                copy[p] = vars[p];
              }
            }

            copy.stagger = 0;

            if (staggerVarsToMerge) {
              _merge(copy, staggerVarsToMerge);
            }

            if (vars.yoyoEase && !vars.repeat) {
              copy.yoyoEase = vars.yoyoEase;
            }

            curTarget = parsedTargets[i];
            copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this4), i, curTarget, parsedTargets);
            copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this4), i, curTarget, parsedTargets) || 0) - _this4._delay;

            if (!stagger && l === 1 && copy.delay) {
              _this4._delay = delay = copy.delay;
              _this4._start += delay;
              copy.delay = 0;
            }

            tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets));
          }

          duration = delay = 0;
        }

        duration || _this4.duration(duration = tl.duration());
      } else {
        _this4.timeline = 0;
      }

      if (overwrite === true) {
        _overwritingTween = _assertThisInitialized(_this4);

        _globalTimeline.killTweensOf(parsedTargets);

        _overwritingTween = 0;
      }

      if (immediateRender || !duration && !keyframes && _this4._start === _this4.parent._time && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this4)) && _this4.parent.data !== "nested") {
        _this4._tTime = -_tinyNum;

        _this4.render(Math.max(0, -delay));
      }

      return _this4;
    }

    var _proto3 = Tween.prototype;

    _proto3.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
          tDur = this._tDur,
          dur = this._dur,
          tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
          time,
          pt,
          iteration,
          cycleDuration,
          prevIteration,
          isYoyo,
          ratio,
          timeline,
          yoyoEase;

      if (!dur) {
        _renderZeroDurationTween(this, totalTime, suppressEvents, force);
      } else if (tTime !== this._tTime || !totalTime || force || this._startAt && this._zTime < 0 !== totalTime < 0) {
        time = tTime;
        timeline = this.timeline;

        if (this._repeat) {
          cycleDuration = dur + this._rDelay;
          time = _round(tTime % cycleDuration);

          if (time > dur) {
            time = dur;
          }

          iteration = ~~(tTime / cycleDuration);

          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }

          isYoyo = this._yoyo && iteration & 1;

          if (isYoyo) {
            yoyoEase = this._yEase;
            time = dur - time;
          }

          prevIteration = ~~(this._tTime / cycleDuration);

          if (prevIteration && prevIteration === this._tTime / cycleDuration) {
            prevIteration--;
          }

          if (time === prevTime && !force && this._initted) {
            return this;
          }

          if (iteration !== prevIteration) {
            if (this.vars.repeatRefresh && !this._lock) {
              this._lock = force = 1;
              this.render(cycleDuration * iteration, true).invalidate()._lock = 0;
            }
          }
        }

        if (!this._initted && _attemptInitTween(this, time, force, suppressEvents)) {
          return this;
        }

        this._tTime = tTime;
        this._time = time;

        if (!this._act && this._ts) {
          this._act = 1;
          this._lazy = 0;
        }

        this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

        if (this._from) {
          this.ratio = ratio = 1 - ratio;
        }

        if (!prevTime && time && !suppressEvents) {
          _callback(this, "onStart");
        }

        pt = this._pt;

        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }

        timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime);

        if (this._onUpdate && !suppressEvents) {
          if (totalTime < 0 && this._startAt) {
            this._startAt.render(totalTime, true, force);
          }

          _callback(this, "onUpdate");
        }

        if (this._repeat) if (iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent) {
          _callback(this, "onRepeat");
        }

        if ((tTime === tDur || !tTime) && this._tTime === tTime) {
          if (totalTime < 0 && this._startAt && !this._onUpdate) {
            this._startAt.render(totalTime, true, force);
          }

          (totalTime || !dur) && (tTime || this._ts < 0) && _removeFromParent(this, 1);

          if (!suppressEvents && !(totalTime < 0 && !prevTime)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

            this._prom && this._prom();
          }
        }
      }

      return this;
    };

    _proto3.targets = function targets() {
      return this._targets;
    };

    _proto3.invalidate = function invalidate() {
      this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0;
      this._ptLookup = [];

      if (this.timeline) {
        this.timeline.invalidate();
      }

      return _Animation2.prototype.invalidate.call(this);
    };

    _proto3.kill = function kill(targets, vars) {
      if (vars === void 0) {
        vars = "all";
      }

      if (!targets && (!vars || vars === "all")) {
        this._lazy = 0;

        if (this.parent) {
          return _interrupt(this);
        }
      }

      if (this.timeline) {
        this.timeline.killTweensOf(targets, vars, !!_overwritingTween);
        return this;
      }

      var parsedTargets = this._targets,
          killingTargets = targets ? toArray(targets) : parsedTargets,
          propTweenLookup = this._ptLookup,
          firstPT = this._pt,
          overwrittenProps,
          curLookup,
          curOverwriteProps,
          props,
          p,
          pt,
          i;

      if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
        return _interrupt(this);
      }

      overwrittenProps = this._op = this._op || [];

      if (vars !== "all") {
        if (_isString(vars)) {
          p = {};

          _forEachName(vars, function (name) {
            return p[name] = 1;
          });

          vars = p;
        }

        vars = _addAliasesToVars(parsedTargets, vars);
      }

      i = parsedTargets.length;

      while (i--) {
        if (~killingTargets.indexOf(parsedTargets[i])) {
          curLookup = propTweenLookup[i];

          if (vars === "all") {
            overwrittenProps[i] = vars;
            props = curLookup;
            curOverwriteProps = {};
          } else {
            curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
            props = vars;
          }

          for (p in props) {
            pt = curLookup && curLookup[p];

            if (pt) {
              if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                _removeLinkedListItem(this, pt, "_pt");

                delete curLookup[p];
              }
            }

            if (curOverwriteProps !== "all") {
              curOverwriteProps[p] = 1;
            }
          }
        }
      }

      if (this._initted && !this._pt && firstPT) {
        _interrupt(this);
      }

      return this;
    };

    Tween.to = function to(targets, vars) {
      return new Tween(targets, vars, arguments[2]);
    };

    Tween.from = function from(targets, vars) {
      return new Tween(targets, _parseVars(arguments, 1));
    };

    Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
      return new Tween(callback, 0, {
        immediateRender: false,
        lazy: false,
        overwrite: false,
        delay: delay,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params,
        onReverseCompleteParams: params,
        callbackScope: scope
      });
    };

    Tween.fromTo = function fromTo(targets, fromVars, toVars) {
      return new Tween(targets, _parseVars(arguments, 2));
    };

    Tween.set = function set(targets, vars) {
      vars.duration = 0;

      if (!vars.repeatDelay) {
        vars.repeat = 0;
      }

      return new Tween(targets, vars);
    };

    Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      return _globalTimeline.killTweensOf(targets, props, onlyActive);
    };

    return Tween;
  }(Animation);

  _setDefaults(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  });

  _forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
    Tween[name] = function () {
      var tl = new Timeline(),
          params = toArray(arguments);
      params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
      return tl[name].apply(tl, params);
    };
  });

  var _setterPlain = function _setterPlain(target, property, value) {
    return target[property] = value;
  },
      _setterFunc = function _setterFunc(target, property, value) {
    return target[property](value);
  },
      _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
    return target[property](data.fp, value);
  },
      _setterAttribute = function _setterAttribute(target, property, value) {
    return target.setAttribute(property, value);
  },
      _getSetter = function _getSetter(target, property) {
    return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
  },
      _renderPlain = function _renderPlain(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data);
  },
      _renderBoolean = function _renderBoolean(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
  },
      _renderComplexString = function _renderComplexString(ratio, data) {
    var pt = data._pt,
        s = "";

    if (!ratio && data.b) {
      s = data.b;
    } else if (ratio === 1 && data.e) {
      s = data.e;
    } else {
      while (pt) {
        s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s;
        pt = pt._next;
      }

      s += data.c;
    }

    data.set(data.t, data.p, s, data);
  },
      _renderPropTweens = function _renderPropTweens(ratio, data) {
    var pt = data._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
  },
      _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
    var pt = this._pt,
        next;

    while (pt) {
      next = pt._next;

      if (pt.p === property) {
        pt.modifier(modifier, tween, target);
      }

      pt = next;
    }
  },
      _killPropTweensOf = function _killPropTweensOf(property) {
    var pt = this._pt,
        hasNonDependentRemaining,
        next;

    while (pt) {
      next = pt._next;

      if (pt.p === property && !pt.op || pt.op === property) {
        _removeLinkedListItem(this, pt, "_pt");
      } else if (!pt.dep) {
        hasNonDependentRemaining = 1;
      }

      pt = next;
    }

    return !hasNonDependentRemaining;
  },
      _setterWithModifier = function _setterWithModifier(target, property, value, data) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
  },
      _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
    var pt = parent._pt,
        next,
        pt2,
        first,
        last;

    while (pt) {
      next = pt._next;
      pt2 = first;

      while (pt2 && pt2.pr > pt.pr) {
        pt2 = pt2._next;
      }

      if (pt._prev = pt2 ? pt2._prev : last) {
        pt._prev._next = pt;
      } else {
        first = pt;
      }

      if (pt._next = pt2) {
        pt2._prev = pt;
      } else {
        last = pt;
      }

      pt = next;
    }

    parent._pt = first;
  };

  var PropTween = function () {
    function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
      this.t = target;
      this.s = start;
      this.c = change;
      this.p = prop;
      this.r = renderer || _renderPlain;
      this.d = data || this;
      this.set = setter || _setterPlain;
      this.pr = priority || 0;
      this._next = next;

      if (next) {
        next._prev = this;
      }
    }

    var _proto4 = PropTween.prototype;

    _proto4.modifier = function modifier(func, tween, target) {
      this.mSet = this.mSet || this.set;
      this.set = _setterWithModifier;
      this.m = func;
      this.mt = target;
      this.tween = tween;
    };

    return PropTween;
  }();

  _forEachName(_callbackNames + ",parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert", function (name) {
    _reservedProps[name] = 1;
    if (name.substr(0, 2) === "on") _reservedProps[name + "Params"] = 1;
  });

  _globals.TweenMax = _globals.TweenLite = Tween;
  _globals.TimelineLite = _globals.TimelineMax = Timeline;
  _globalTimeline = new Timeline({
    sortChildren: false,
    defaults: _defaults,
    autoRemoveChildren: true,
    id: "root"
  });
  _config.stringFilter = _colorStringFilter;
  var _gsap = {
    registerPlugin: function registerPlugin() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      args.forEach(function (config) {
        return _createPlugin(config);
      });
    },
    timeline: function timeline(vars) {
      return new Timeline(vars);
    },
    getTweensOf: function getTweensOf(targets, onlyActive) {
      return _globalTimeline.getTweensOf(targets, onlyActive);
    },
    getProperty: function getProperty(target, property, unit, uncache) {
      if (_isString(target)) {
        target = toArray(target)[0];
      }

      var getter = _getCache(target || {}).get,
          format = unit ? _passThrough : _numericIfPossible;

      if (unit === "native") {
        unit = "";
      }

      return !target ? target : !property ? function (property, unit, uncache) {
        return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray(target);

      if (target.length > 1) {
        var setters = target.map(function (t) {
          return gsap.quickSetter(t, property, unit);
        }),
            l = setters.length;
        return function (value) {
          var i = l;

          while (i--) {
            setters[i](value);
          }
        };
      }

      target = target[0] || {};

      var Plugin = _plugins[property],
          cache = _getCache(target),
          setter = Plugin ? function (value) {
        var p = new Plugin();
        _quickTween._pt = 0;
        p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
        p.render(1, p);
        _quickTween._pt && _renderPropTweens(1, _quickTween);
      } : cache.set(target, property);

      return Plugin ? setter : function (value) {
        return setter(target, property, unit ? value + unit : value, cache, 1);
      };
    },
    isTweening: function isTweening(targets) {
      return _globalTimeline.getTweensOf(targets, true).length > 0;
    },
    defaults: function defaults(value) {
      if (value && value.ease) {
        value.ease = _parseEase(value.ease, _defaults.ease);
      }

      return _mergeDeep(_defaults, value || {});
    },
    config: function config(value) {
      return _mergeDeep(_config, value || {});
    },
    registerEffect: function registerEffect(_ref) {
      var name = _ref.name,
          effect = _ref.effect,
          plugins = _ref.plugins,
          defaults = _ref.defaults,
          extendTimeline = _ref.extendTimeline;
      (plugins || "").split(",").forEach(function (pluginName) {
        return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
      });

      _effects[name] = function (targets, vars) {
        return effect(toArray(targets), _setDefaults(vars || {}, defaults));
      };

      if (extendTimeline) {
        Timeline.prototype[name] = function (targets, vars, position) {
          return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}), position);
        };
      }
    },
    registerEase: function registerEase(name, ease) {
      _easeMap[name] = _parseEase(ease);
    },
    parseEase: function parseEase(ease, defaultEase) {
      return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
    },
    getById: function getById(id) {
      return _globalTimeline.getById(id);
    },
    exportRoot: function exportRoot(vars, includeDelayedCalls) {
      if (vars === void 0) {
        vars = {};
      }

      var tl = new Timeline(vars),
          child,
          next;
      tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

      _globalTimeline.remove(tl);

      tl._dp = 0;
      tl._time = tl._tTime = _globalTimeline._time;
      child = _globalTimeline._first;

      while (child) {
        next = child._next;

        if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
          _addToTimeline(tl, child, child._start - child._delay);
        }

        child = next;
      }

      _addToTimeline(_globalTimeline, tl, 0);

      return tl;
    },
    utils: {
      wrap: wrap,
      wrapYoyo: wrapYoyo,
      distribute: distribute,
      random: random,
      snap: snap,
      normalize: normalize,
      getUnit: getUnit,
      clamp: clamp,
      splitColor: splitColor,
      toArray: toArray,
      mapRange: mapRange,
      pipe: pipe,
      unitize: unitize,
      interpolate: interpolate
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween: PropTween,
      globals: _addGlobal,
      Tween: Tween,
      Timeline: Timeline,
      Animation: Animation,
      getCache: _getCache
    }
  };

  _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
    return _gsap[name] = Tween[name];
  });

  _ticker.add(Timeline.updateRoot);

  _quickTween = _gsap.to({}, {
    duration: 0
  });

  var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
    var pt = plugin._pt;

    while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
      pt = pt._next;
    }

    return pt;
  },
      _addModifiers = function _addModifiers(tween, modifiers) {
    var targets = tween._targets,
        p,
        i,
        pt;

    for (p in modifiers) {
      i = targets.length;

      while (i--) {
        pt = tween._ptLookup[i][p];

        if (pt && (pt = pt.d)) {
          if (pt._pt) {
            pt = _getPluginPropTween(pt, p);
          }

          pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
        }
      }
    }
  },
      _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
    return {
      name: name,
      rawVars: 1,
      init: function init(target, vars, tween) {
        tween._onInit = function (tween) {
          var temp, p;

          if (_isString(vars)) {
            temp = {};

            _forEachName(vars, function (name) {
              return temp[name] = 1;
            });

            vars = temp;
          }

          if (modifier) {
            temp = {};

            for (p in vars) {
              temp[p] = modifier(vars[p]);
            }

            vars = temp;
          }

          _addModifiers(tween, vars);
        };
      }
    };
  };

  var gsap = _gsap.registerPlugin({
    name: "attr",
    init: function init(target, vars, tween, index, targets) {
      for (var p in vars) {
        this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);

        this._props.push(p);
      }
    }
  }, {
    name: "endArray",
    init: function init(target, value) {
      var i = value.length;

      while (i--) {
        this.add(target, i, target[i] || 0, value[i]);
      }
    }
  }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
  Tween.version = Timeline.version = gsap.version = "3.0.2";
  _coreReady = 1;

  if (_windowExists()) {
    _wake();
  }

  var Power0 = _easeMap.Power0,
      Power1 = _easeMap.Power1,
      Power2 = _easeMap.Power2,
      Power3 = _easeMap.Power3,
      Power4 = _easeMap.Power4,
      Linear = _easeMap.Linear,
      Quad = _easeMap.Quad,
      Cubic = _easeMap.Cubic,
      Quart = _easeMap.Quart,
      Quint = _easeMap.Quint,
      Strong = _easeMap.Strong,
      Elastic = _easeMap.Elastic,
      Back = _easeMap.Back,
      SteppedEase = _easeMap.SteppedEase,
      Bounce = _easeMap.Bounce,
      Sine = _easeMap.Sine,
      Expo = _easeMap.Expo,
      Circ = _easeMap.Circ;

  var _win$1,
      _doc$1,
      _docElement,
      _pluginInitted,
      _tempDiv,
      _tempDivStyler,
      _recentSetterPlugin,
      _windowExists$1 = function _windowExists() {
    return typeof window !== "undefined";
  },
      _transformProps = {},
      _RAD2DEG = 180 / Math.PI,
      _DEG2RAD = Math.PI / 180,
      _atan2 = Math.atan2,
      _bigNum$1 = 1e8,
      _capsExp = /([A-Z])/g,
      _numWithUnitExp = /[-+=\.]*\d+[\.e-]*\d*[a-z%]*/g,
      _horizontalExp = /(?:left|right|width|margin|padding|x)/i,
      _complexExp = /[\s,\(]\S/,
      _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
  },
      _renderCSSProp = function _renderCSSProp(ratio, data) {
    return data.set(data.t, data.p, ~~((data.s + data.c * ratio) * 1000) / 1000 + data.u, data);
  },
      _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : ~~((data.s + data.c * ratio) * 1000) / 1000 + data.u, data);
  },
      _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
    return data.set(data.t, data.p, ratio ? ~~((data.s + data.c * ratio) * 1000) / 1000 + data.u : data.b, data);
  },
      _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
    var value = data.s + data.c * ratio;
    data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
  },
      _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data);
  },
      _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
  },
      _setterCSSStyle = function _setterCSSStyle(target, property, value) {
    return target.style[property] = value;
  },
      _setterCSSProp = function _setterCSSProp(target, property, value) {
    return target.style.setProperty(property, value);
  },
      _setterTransform = function _setterTransform(target, property, value) {
    return target._gsap[property] = value;
  },
      _setterScale = function _setterScale(target, property, value) {
    return target._gsap.scaleX = target._gsap.scaleY = value;
  },
      _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache.scaleX = cache.scaleY = value;
    cache.renderTransform(ratio, cache);
  },
      _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache[property] = value;
    cache.renderTransform(ratio, cache);
  },
      _transformProp = "transform",
      _transformOriginProp = _transformProp + "Origin",
      _supports3D,
      _createElement = function _createElement(type, ns) {
    var e = _doc$1.createElementNS ? _doc$1.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$1.createElement(type);
    return e.style ? e : _doc$1.createElement(type);
  },
      _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
    var cs = getComputedStyle(target);
    return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || "";
  },
      _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
      _checkPropPrefix = function _checkPropPrefix(property, element) {
    var e = element || _tempDiv,
        s = e.style,
        i = 5;

    if (property in s) {
      return property;
    }

    property = property.charAt(0).toUpperCase() + property.substr(1);

    while (i-- && !(_prefixes[i] + property in s)) {}

    return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
  },
      _initCore = function _initCore() {
    if (_windowExists$1()) {
      _win$1 = window;
      _doc$1 = _win$1.document;
      _docElement = _doc$1.documentElement;
      _tempDiv = _createElement("div") || {
        style: {}
      };
      _tempDivStyler = _createElement("div");
      _transformProp = _checkPropPrefix(_transformProp);
      _transformOriginProp = _checkPropPrefix(_transformOriginProp);
      _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
      _supports3D = !!_checkPropPrefix("perspective");
      _pluginInitted = 1;
    }
  },
      _getBBoxHack = function _getBBoxHack(swapIfPossible) {
    var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
        oldParent = this.parentNode,
        oldSibling = this.nextSibling,
        oldCSS = this.style.cssText,
        bbox;

    _docElement.appendChild(svg);

    svg.appendChild(this);
    this.style.display = "block";

    if (swapIfPossible) {
      try {
        bbox = this.getBBox();
        this._gsapBBox = this.getBBox;
        this.getBBox = _getBBoxHack;
      } catch (e) {}
    } else if (this._gsapBBox) {
      bbox = this._gsapBBox();
    }

    if (oldSibling) {
      oldParent.insertBefore(this, oldSibling);
    } else {
      oldParent.appendChild(this);
    }

    _docElement.removeChild(svg);

    this.style.cssText = oldCSS;
    return bbox;
  },
      _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
    var i = attributesArray.length;

    while (i--) {
      if (target.hasAttribute(attributesArray[i])) {
        return target.getAttribute(attributesArray[i]);
      }
    }
  },
      _getBBox = function _getBBox(target) {
    var bounds;

    try {
      bounds = target.getBBox();
    } catch (error) {
      bounds = _getBBoxHack.call(target, true);
    }

    return bounds && !bounds.width && !bounds.x && !bounds.y ? {
      x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
      y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
      width: 0,
      height: 0
    } : bounds;
  },
      _isSVG = function _isSVG(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
  },
      _removeProperty = function _removeProperty(target, property) {
    if (property) {
      var style = target.style;

      if (property in _transformProps) {
        property = _transformProp;
      }

      if (style.removeProperty) {
        if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
          property = "-" + property;
        }

        style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
      } else {
        style.removeAttribute(property);
      }
    }
  },
      _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
    var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
    plugin._pt = pt;
    pt.b = beginning;
    pt.e = end;

    plugin._props.push(property);

    return pt;
  },
      _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1
  },
      _convertToUnit = function _convertToUnit(target, property, value, unit) {
    var curValue = parseFloat(value),
        curUnit = (value + "").substr((curValue + "").length) || "px",
        style = _tempDiv.style,
        horizontal = _horizontalExp.test(property),
        isRootSVG = target.tagName.toLowerCase() === "svg",
        measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
        amount = 100,
        toPixels = unit === "px",
        px,
        parent,
        cache,
        isSVG;

    if (unit === curUnit || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
      return curValue;
    }

    isSVG = target.getCTM && _isSVG(target);

    if (unit === "%" && _transformProps[property]) {
      return _round(curValue / (isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty]) * amount);
    }

    style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
    parent = unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;

    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode;
    }

    if (!parent || parent === _doc$1 || !parent.appendChild) {
      parent = _doc$1.body;
    }

    cache = parent._gsap;

    if (cache && unit === "%" && cache.width && horizontal && cache.time === _ticker.time) {
      px = cache.width * curValue / amount;
    } else {
      parent.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent.removeChild(_tempDiv);

      if (horizontal && unit === "%") {
        cache = _getCache(parent);
        cache.time = _ticker.time;
        cache.width = px / curValue * amount;
      }
    }

    return _round(toPixels ? px * curValue / amount : amount / px * curValue);
  },
      _get = function _get(target, property, unit, uncache) {
    var value;

    if (!_pluginInitted) {
      _initCore();
    }

    if (property in _propertyAliases) {
      property = _propertyAliases[property];

      if (~property.indexOf(",")) {
        property = property.split(",")[0];
      }
    }

    if (_transformProps[property]) {
      value = _parseTransform(target, uncache);
      value = property !== "transformOrigin" ? value[property] : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + value.zOrigin + "px";
    } else {
      value = target.style[property];

      if (!value || value === "auto" || uncache || ~value.indexOf("calc(")) {
        value = _getComputedProperty(target, property) || _getProperty(target, property);
      }
    }

    return unit ? _convertToUnit(target, property, value, unit) + unit : value;
  },
      _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
    var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString),
        index = 0,
        matchIndex = 0,
        a,
        result,
        startValues,
        startNum,
        color,
        startValue,
        endValue,
        endNum,
        chunk,
        endUnit,
        startUnit,
        relative,
        endValues;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";

    if (end === "auto") {
      target.style[prop] = end;
      end = _getComputedProperty(target, prop) || end;
      target.style[prop] = start;
    }

    a = [start, end];

    _colorStringFilter(a);

    start = a[0];
    end = a[1];
    startValues = start.match(_numWithUnitExp) || [];
    endValues = end.match(_numWithUnitExp) || [];

    if (endValues.length) {
      while (result = _numWithUnitExp.exec(end)) {
        endValue = result[0];
        chunk = end.substring(index, result.index);

        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(") {
          color = 1;
        }

        if (endValue !== (startValue = startValues[matchIndex++] || "")) {
          startNum = parseFloat(startValue) || 0;
          startUnit = startValue.substr((startNum + "").length);
          relative = endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

          if (relative) {
            endValue = endValue.substr(2);
          }

          endNum = parseFloat(endValue);
          endUnit = endValue.substr((endNum + "").length);
          index = _numWithUnitExp.lastIndex - endUnit.length;

          if (!endUnit) {
            endUnit = endUnit || _config.units[prop] || startUnit;

            if (index === end.length) {
              end += endUnit;
              pt.e += endUnit;
            }
          }

          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
          }

          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            s: startNum,
            c: relative ? relative * endNum : endNum - startNum,
            m: color && color < 4 ? Math.round : 0
          };
        }
      }

      pt.c = index < end.length ? end.substring(index, end.length) : "";
    } else {
      pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
    }

    if (_relExp.test(end)) {
      pt.e = 0;
    }

    this._pt = pt;
    return pt;
  },
      _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
  },
      _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
    var split = value.split(" "),
        x = split[0],
        y = split[1] || "50%";

    if (x === "top" || x === "bottom" || y === "left" || y === "right") {
      value = x;
      x = y;
      y = value;
    }

    split[0] = _keywordToPercent[x] || x;
    split[1] = _keywordToPercent[y] || y;
    return split.join(" ");
  },
      _renderClearProps = function _renderClearProps(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      var target = data.t,
          style = target.style,
          props = data.u,
          prop,
          clearTransforms,
          i;

      if (props === "all" || props === true) {
        style.cssText = "";
        clearTransforms = 1;
      } else {
        props = props.split(",");
        i = props.length;

        while (--i > -1) {
          prop = props[i];

          if (_transformProps[prop]) {
            clearTransforms = 1;
            prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
          }

          _removeProperty(target, prop);
        }
      }

      if (clearTransforms) {
        _removeProperty(target, _transformProp);

        clearTransforms = target._gsap;

        if (clearTransforms) {
          if (clearTransforms.svg) {
            target.removeAttribute("transform");
          }

          clearTransforms.uncache = 1;
        }
      }
    }
  },
      _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== "isFromStart") {
        var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
        pt.u = endValue;
        pt.pr = -10;
        pt.tween = tween;

        plugin._props.push(property);

        return 1;
      }
    }
  },
      _identity2DMatrix = [1, 0, 0, 1, 0, 0],
      _rotationalProperties = {},
      _isNullTransform = function _isNullTransform(value) {
    return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
  },
      _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
    var matrixString = _getComputedProperty(target, _transformProp);

    return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
  },
      _getMatrix = function _getMatrix(target, force2D) {
    var cache = target._gsap,
        style = target.style,
        matrix = _getComputedTransformMatrixAsArray(target),
        parent,
        nextSibling,
        temp,
        addedToDOM;

    if (cache.svg && target.getAttribute("transform")) {
      temp = target.transform.baseVal.consolidate().matrix;
      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
      return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
    } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
      temp = style.display;
      style.display = "block";
      parent = target.parentNode;

      if (!parent || !target.offsetParent) {
        addedToDOM = 1;
        nextSibling = target.nextSibling;

        _docElement.appendChild(target);
      }

      matrix = _getComputedTransformMatrixAsArray(target);

      if (temp) {
        style.display = temp;
      } else {
        _removeProperty(target, "display");
      }

      if (addedToDOM) {
        if (nextSibling) {
          parent.insertBefore(target, nextSibling);
        } else if (parent) {
          parent.appendChild(target);
        } else {
          _docElement.removeChild(target);
        }
      }
    }

    return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
  },
      _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
    var cache = target._gsap,
        matrix = matrixArray || _getMatrix(target, true),
        xOriginOld = cache.xOrigin || 0,
        yOriginOld = cache.yOrigin || 0,
        xOffsetOld = cache.xOffset || 0,
        yOffsetOld = cache.yOffset || 0,
        a = matrix[0],
        b = matrix[1],
        c = matrix[2],
        d = matrix[3],
        tx = matrix[4],
        ty = matrix[5],
        originSplit = origin.split(" "),
        xOrigin = parseFloat(originSplit[0]) || 0,
        yOrigin = parseFloat(originSplit[1]) || 0,
        bounds,
        determinant,
        x,
        y;

    if (!originIsAbsolute) {
      bounds = _getBBox(target);
      xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
      yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
    } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
      x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
      y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
      xOrigin = x;
      yOrigin = y;
    }

    if (smooth || smooth !== false && cache.smooth) {
      tx = xOrigin - xOriginOld;
      ty = yOrigin - yOriginOld;
      cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
      cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
    } else {
      cache.xOffset = cache.yOffset = 0;
    }

    cache.xOrigin = xOrigin;
    cache.yOrigin = yOrigin;
    cache.smooth = !!smooth;
    cache.origin = origin;
    cache.originIsAbsolute = !!originIsAbsolute;
    target.style[_transformOriginProp] = "0px 0px";

    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
    }
  },
      _parseTransform = function _parseTransform(target, uncache) {
    var cache = target._gsap || new GSCache(target);

    if ("x" in cache && !uncache && !cache.uncache) {
      return cache;
    }

    var style = target.style,
        invertedScaleX = cache.scaleX < 0,
        xOrigin = cache.xOrigin || 0,
        yOrigin = cache.yOrigin || 0,
        px = "px",
        deg = "deg",
        origin = _getComputedProperty(target, _transformOriginProp) || "0",
        x,
        y,
        z,
        scaleX,
        scaleY,
        rotation,
        rotationX,
        rotationY,
        skewX,
        skewY,
        perspective,
        matrix,
        angle,
        cos,
        sin,
        a,
        b,
        c,
        d,
        a12,
        a22,
        t1,
        t2,
        t3,
        a13,
        a23,
        a33,
        a42,
        a43,
        a32;
    x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
    scaleX = scaleY = 1;
    cache.svg = !!(target.getCTM && _isSVG(target));
    matrix = _getMatrix(target, cache.svg);

    if (cache.svg) {
      _applySVGOrigin(target, origin, cache.originIsAbsolute, cache.smooth !== false, matrix);
    }

    if (matrix !== _identity2DMatrix) {
      a = matrix[0];
      b = matrix[1];
      c = matrix[2];
      d = matrix[3];
      x = a12 = matrix[4];
      y = a22 = matrix[5];

      if (matrix.length === 6) {
        scaleX = Math.sqrt(a * a + b * b);
        scaleY = Math.sqrt(d * d + c * c);
        rotation = a || b ? _atan2(b, a) * _RAD2DEG : cache.rotation || 0;
        skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : cache.skewX || 0;

        if (cache.svg) {
          x -= xOrigin - (xOrigin * a + yOrigin * c);
          y -= yOrigin - (xOrigin * b + yOrigin * d);
        }
      } else {
        a32 = matrix[6];
        a42 = matrix[7];
        a13 = matrix[8];
        a23 = matrix[9];
        a33 = matrix[10];
        a43 = matrix[11];
        x = matrix[12];
        y = matrix[13];
        z = matrix[14];
        angle = _atan2(a32, a33);
        rotationX = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a12 * cos + a13 * sin;
          t2 = a22 * cos + a23 * sin;
          t3 = a32 * cos + a33 * sin;
          a13 = a12 * -sin + a13 * cos;
          a23 = a22 * -sin + a23 * cos;
          a33 = a32 * -sin + a33 * cos;
          a43 = a42 * -sin + a43 * cos;
          a12 = t1;
          a22 = t2;
          a32 = t3;
        }

        angle = _atan2(-c, a33);
        rotationY = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a * cos - a13 * sin;
          t2 = b * cos - a23 * sin;
          t3 = c * cos - a33 * sin;
          a43 = d * sin + a43 * cos;
          a = t1;
          b = t2;
          c = t3;
        }

        angle = _atan2(b, a);
        rotation = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(angle);
          sin = Math.sin(angle);
          t1 = a * cos + b * sin;
          t2 = a12 * cos + a22 * sin;
          b = b * cos - a * sin;
          a22 = a22 * cos - a12 * sin;
          a = t1;
          a12 = t2;
        }

        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          rotationX = rotation = 0;
          rotationY = 180 - rotationY;
        }

        scaleX = _round(Math.sqrt(a * a + b * b + c * c));
        scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
        angle = _atan2(a12, a22);
        skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
        perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
      }

      if (cache.svg) {
        matrix = target.getAttribute("transform");
        cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
        matrix && target.setAttribute("transform", matrix);
      }
    }

    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1;
        skewX += rotation <= 0 ? 180 : -180;
        rotation += rotation <= 0 ? 180 : -180;
      } else {
        scaleY *= -1;
        skewX += skewX <= 0 ? 180 : -180;
      }
    }

    cache.x = ((cache.xPercent = x && Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0) ? 0 : x) + px;
    cache.y = ((cache.yPercent = y && Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0) ? 0 : y) + px;
    cache.z = z + px;
    cache.scaleX = _round(scaleX);
    cache.scaleY = _round(scaleY);
    cache.rotation = _round(rotation) + deg;
    cache.rotationX = _round(rotationX) + deg;
    cache.rotationY = _round(rotationY) + deg;
    cache.skewX = skewX + deg;
    cache.skewY = skewY + deg;
    cache.transformPerspective = perspective + px;

    if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
      style[_transformOriginProp] = _firstTwoOnly(origin);
    }

    cache.xOffset = cache.yOffset = 0;
    cache.force3D = _config.force3D;
    cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
    cache.uncache = 0;
    return cache;
  },
      _firstTwoOnly = function _firstTwoOnly(value) {
    return (value = value.split(" "))[0] + " " + value[1];
  },
      _addPxTranslate = function _addPxTranslate(target, start, value) {
    var unit = getUnit(start);
    return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
  },
      _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
    cache.z = "0px";
    cache.rotationY = cache.rotationX = "0deg";
    cache.force3D = 0;

    _renderCSSTransforms(ratio, cache);
  },
      _zeroDeg = "0deg",
      _zeroPx = "0px",
      _endParenthesis = ") ",
      _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
    var _ref = cache || this,
        xPercent = _ref.xPercent,
        yPercent = _ref.yPercent,
        x = _ref.x,
        y = _ref.y,
        z = _ref.z,
        rotation = _ref.rotation,
        rotationY = _ref.rotationY,
        rotationX = _ref.rotationX,
        skewX = _ref.skewX,
        skewY = _ref.skewY,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        transformPerspective = _ref.transformPerspective,
        force3D = _ref.force3D,
        target = _ref.target,
        zOrigin = _ref.zOrigin,
        transforms = "",
        use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;

    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      var angle = parseFloat(rotationY) * _DEG2RAD,
          a13 = Math.sin(angle),
          a33 = Math.cos(angle),
          cos;

      angle = parseFloat(rotationX) * _DEG2RAD;
      cos = Math.cos(angle);
      x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
      y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
      z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
    }

    if (xPercent || yPercent) {
      transforms = "translate(" + xPercent + "%, " + yPercent + "%) ";
    }

    if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
      transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
    }

    if (transformPerspective !== _zeroPx) {
      transforms += "perspective(" + transformPerspective + _endParenthesis;
    }

    if (rotation !== _zeroDeg) {
      transforms += "rotate(" + rotation + _endParenthesis;
    }

    if (rotationY !== _zeroDeg) {
      transforms += "rotateY(" + rotationY + _endParenthesis;
    }

    if (rotationX !== _zeroDeg) {
      transforms += "rotateX(" + rotationX + _endParenthesis;
    }

    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
    }

    if (scaleX !== 1 || scaleY !== 1) {
      transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
    }

    target.style[_transformProp] = transforms || "translate(0, 0)";
  },
      _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
    var _ref2 = cache || this,
        xPercent = _ref2.xPercent,
        yPercent = _ref2.yPercent,
        x = _ref2.x,
        y = _ref2.y,
        rotation = _ref2.rotation,
        skewX = _ref2.skewX,
        skewY = _ref2.skewY,
        scaleX = _ref2.scaleX,
        scaleY = _ref2.scaleY,
        target = _ref2.target,
        xOrigin = _ref2.xOrigin,
        yOrigin = _ref2.yOrigin,
        xOffset = _ref2.xOffset,
        yOffset = _ref2.yOffset,
        forceCSS = _ref2.forceCSS,
        tx = parseFloat(x),
        ty = parseFloat(y),
        a11,
        a21,
        a12,
        a22,
        temp;

    rotation = parseFloat(rotation);
    skewX = parseFloat(skewX);
    skewY = parseFloat(skewY);

    if (skewY) {
      skewY = parseFloat(skewY);
      skewX += skewY;
      rotation += skewY;
    }

    if (rotation || skewX) {
      rotation *= _DEG2RAD;
      skewX *= _DEG2RAD;
      a11 = Math.cos(rotation) * scaleX;
      a21 = Math.sin(rotation) * scaleX;
      a12 = Math.sin(rotation - skewX) * -scaleY;
      a22 = Math.cos(rotation - skewX) * scaleY;

      if (skewX) {
        skewY *= _DEG2RAD;
        temp = Math.tan(skewX - skewY);
        temp = Math.sqrt(1 + temp * temp);
        a12 *= temp;
        a22 *= temp;

        if (skewY) {
          temp = Math.tan(skewY);
          temp = Math.sqrt(1 + temp * temp);
          a11 *= temp;
          a21 *= temp;
        }
      }

      a11 = _round(a11);
      a21 = _round(a21);
      a12 = _round(a12);
      a22 = _round(a22);
    } else {
      a11 = scaleX;
      a22 = scaleY;
      a21 = a12 = 0;
    }

    if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
      tx = _convertToUnit(target, "x", x, "px");
      ty = _convertToUnit(target, "y", y, "px");
    }

    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
      ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
    }

    if (xPercent || yPercent) {
      temp = target.getBBox();
      tx = _round(tx + xPercent / 100 * temp.width);
      ty = _round(ty + yPercent / 100 * temp.height);
    }

    temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
    target.setAttribute("transform", temp);

    if (forceCSS) {
      target.style[_transformProp] = temp;
    }
  },
      _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
    var cap = 360,
        isString = _isString(endValue),
        endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
        change = relative ? endNum * relative : endNum - startNum,
        finalValue = startNum + change + "deg",
        direction,
        pt;

    if (isString) {
      direction = endValue.split("_")[1];

      if (direction === "short") {
        change %= cap;

        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap;
        }
      }

      if (direction === "cw" && change < 0) {
        change = (change + cap * _bigNum$1) % cap - ~~(change / cap) * cap;
      } else if (direction === "ccw" && change > 0) {
        change = (change - cap * _bigNum$1) % cap - ~~(change / cap) * cap;
      }
    }

    plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
    pt.e = finalValue;
    pt.u = "deg";

    plugin._props.push(property);

    return pt;
  },
      _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
    var style = _tempDivStyler.style,
        startCache = target._gsap,
        endCache,
        p,
        startValue,
        endValue,
        startNum,
        endNum,
        startUnit,
        endUnit;
    style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;";
    style[_transformProp] = transforms;

    _doc$1.body.appendChild(_tempDivStyler);

    endCache = _parseTransform(_tempDivStyler, 1);

    for (p in _transformProps) {
      startValue = startCache[p];
      endValue = endCache[p];

      if (startValue !== endValue && p !== "perspective") {
        startUnit = getUnit(startValue);
        endUnit = getUnit(endValue);
        startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
        endNum = parseFloat(endValue);
        plugin._pt = new PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
        plugin._pt.u = endUnit;

        plugin._props.push(p);
      }
    }

    _doc$1.body.removeChild(_tempDivStyler);
  };

  var CSSPlugin = {
    name: "css",
    register: _initCore,
    targetTest: function targetTest(target) {
      return target.style && target.nodeType;
    },
    init: function init(target, vars, tween, index, targets) {
      var props = this._props,
          style = target.style,
          startValue,
          endValue,
          endNum,
          startNum,
          type,
          specialProp,
          p,
          startUnit,
          endUnit,
          relative,
          isTransformRelated,
          transformPropTween,
          cache,
          smooth,
          hasPriority;

      if (!_pluginInitted) {
        _initCore();
      }

      for (p in vars) {
        if (p === "autoRound") {
          continue;
        }

        endValue = vars[p];

        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          continue;
        }

        type = typeof endValue;
        specialProp = _specialProps[p];

        if (type === "function") {
          endValue = endValue.call(tween, index, target, targets);
          type = typeof endValue;
        }

        if (type === "string" && ~endValue.indexOf("random(")) {
          endValue = _replaceRandom(endValue);
        }

        if (specialProp) {
          if (specialProp(this, target, p, endValue, tween)) {
            hasPriority = 1;
          }
        } else if (p.substr(0, 2) === "--") {
          this.add(style, "setProperty", getComputedStyle(target).getPropertyValue(p) + "", endValue + "", index, targets, 0, 0, p);
        } else {
          startValue = _get(target, p);
          startNum = parseFloat(startValue);
          relative = type === "string" && endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

          if (relative) {
            endValue = endValue.substr(2);
          }

          endNum = parseFloat(endValue);

          if (p in _propertyAliases) {
            if (p === "autoAlpha") {
              if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                startNum = 0;
              }

              _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
            }

            if (p !== "scale") {
              p = _propertyAliases[p];

              if (~p.indexOf(",")) {
                p = p.split(",")[0];
              }
            }
          }

          isTransformRelated = p in _transformProps;

          if (isTransformRelated) {
            if (!transformPropTween) {
              cache = target._gsap;
              smooth = vars.smoothOrigin !== false && cache.smooth;
              transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
              transformPropTween.dep = 1;
            }

            if (p === "scale") {
              this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY);
              props.push("scaleY", p);
              p += "X";
            } else if (p === "transformOrigin") {
              endValue = _convertKeywordsToPercentages(endValue);

              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this);
              } else {
                endUnit = parseFloat(endValue.split(" ")[2]);

                if (endUnit !== cache.zOrigin) {
                  _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
                }

                _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
              }

              continue;
            } else if (p === "svgOrigin") {
              _applySVGOrigin(target, endValue, 1, smooth, 0, this);

              continue;
            } else if (p in _rotationalProperties) {
              _addRotationalPropTween(this, cache, p, startNum, endValue, relative);

              continue;
            } else if (p === "smoothOrigin") {
              _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);

              continue;
            } else if (p === "force3D") {
              cache[p] = endValue;
              continue;
            } else if (p === "transform") {
              _addRawTransformPTs(this, endValue, target);

              continue;
            }
          } else if (!(p in style)) {
            p = _checkPropPrefix(p) || p;
          }

          if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
            startUnit = (startValue + "").substr((startNum + "").length);
            endUnit = (endValue + "").substr((endNum + "").length) || (p in _config.units ? _config.units[p] : startUnit);

            if (startUnit !== endUnit) {
              startNum = _convertToUnit(target, p, startValue, endUnit);
            }

            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, endUnit === "px" && vars.autoRound !== false && !isTransformRelated ? _renderRoundedCSSProp : _renderCSSProp);
            this._pt.u = endUnit || 0;

            if (startUnit !== endUnit) {
              this._pt.b = startValue;
              this._pt.r = _renderCSSPropWithBeginning;
            }
          } else if (!(p in style)) {
            if (p in target) {
              this.add(target, p, target[p], endValue, index, targets);
            } else {
              _missingPlugin(p, endValue);

              continue;
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, endValue);
          }

          props.push(p);
        }
      }

      if (hasPriority) {
        _sortPropTweensByPriority(this);
      }
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
    }
  };
  gsap.utils.checkPrefix = _checkPropPrefix;

  (function (positionAndScale, rotation, others, aliases) {
    var all = _forEachName(positionAndScale + "," + rotation + "," + others, function (name) {
      _transformProps[name] = 1;
    });

    _forEachName(rotation, function (name) {
      _config.units[name] = "deg";
      _rotationalProperties[name] = 1;
    });

    _propertyAliases[all[13]] = positionAndScale + "," + rotation;

    _forEachName(aliases, function (name) {
      var split = name.split(":");
      _propertyAliases[split[1]] = all[split[0]];
    });
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,9:rotateX,10:rotateY");

  _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
    _config.units[name] = "px";
  });

  gsap.registerPlugin(CSSPlugin);

  var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap;

  exports.Back = Back;
  exports.Bounce = Bounce;
  exports.CSSPlugin = CSSPlugin;
  exports.Circ = Circ;
  exports.Cubic = Cubic;
  exports.Elastic = Elastic;
  exports.Expo = Expo;
  exports.Linear = Linear;
  exports.Power0 = Power0;
  exports.Power1 = Power1;
  exports.Power2 = Power2;
  exports.Power3 = Power3;
  exports.Power4 = Power4;
  exports.Quad = Quad;
  exports.Quart = Quart;
  exports.Quint = Quint;
  exports.Sine = Sine;
  exports.SteppedEase = SteppedEase;
  exports.Strong = Strong;
  exports.TimelineLite = Timeline;
  exports.TimelineMax = Timeline;
  exports.TweenLite = Tween;
  exports.TweenMax = Tween;
  exports.default = gsapWithCSS;
  exports.gsap = gsapWithCSS;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var gsap_1 = require("gsap");
function hello(compiler) {
    console.log("Hello from " + compiler);
    console.log(gsap_1.TweenLite.to('.ddo', 20, { score: 100 }));
    console.log('okddsssdd');
}
hello('TypeScript');

},{"gsap":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZ3NhcC9kaXN0L2dzYXAuanMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbndKQSxJQUFBLFNBQUEsUUFBQSxNQUFBLENBQUE7QUFFQSxTQUFTLEtBQVQsQ0FBZSxRQUFmLEVBQStCO0FBQzNCLFlBQVEsR0FBUixDQUFZLGdCQUFjLFFBQTFCO0FBQ0EsWUFBUSxHQUFSLENBQVksT0FBQSxTQUFBLENBQVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsRUFBckIsRUFBeUIsRUFBQyxPQUFNLEdBQVAsRUFBekIsQ0FBWjtBQUNBLFlBQVEsR0FBUixDQUFZLFdBQVo7QUFDSDtBQUNELE1BQU0sWUFBTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC53aW5kb3cgPSBnbG9iYWwud2luZG93IHx8IHt9KSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTtcbiAgICBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzcztcbiAgICBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gICAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgLyohXG4gICAqIEdTQVAgMy4wLjJcbiAgICogaHR0cHM6Ly9ncmVlbnNvY2suY29tXG4gICAqXG4gICAqIEBsaWNlbnNlIENvcHlyaWdodCAyMDA4LTIwMTksIEdyZWVuU29jay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAgICogU3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cHM6Ly9ncmVlbnNvY2suY29tL3N0YW5kYXJkLWxpY2Vuc2Ugb3IgZm9yXG4gICAqIENsdWIgR3JlZW5Tb2NrIG1lbWJlcnMsIHRoZSBhZ3JlZW1lbnQgaXNzdWVkIHdpdGggdGhhdCBtZW1iZXJzaGlwLlxuICAgKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiAgKi9cbiAgdmFyIF9jb25maWcgPSB7XG4gICAgYXV0b1NsZWVwOiAxMjAsXG4gICAgZm9yY2UzRDogXCJhdXRvXCIsXG4gICAgbnVsbFRhcmdldFdhcm46IDEsXG4gICAgdW5pdHM6IHtcbiAgICAgIGxpbmVIZWlnaHQ6IFwiXCJcbiAgICB9XG4gIH0sXG4gICAgICBfZGVmYXVsdHMgPSB7XG4gICAgZHVyYXRpb246IC41LFxuICAgIG92ZXJ3cml0ZTogZmFsc2UsXG4gICAgZGVsYXk6IDBcbiAgfSxcbiAgICAgIF9iaWdOdW0gPSAxZTgsXG4gICAgICBfdGlueU51bSA9IDEgLyBfYmlnTnVtLFxuICAgICAgXzJQSSA9IE1hdGguUEkgKiAyLFxuICAgICAgX0hBTEZfUEkgPSBfMlBJIC8gNCxcbiAgICAgIF9nc0lEID0gMCxcbiAgICAgIF9zcXJ0ID0gTWF0aC5zcXJ0LFxuICAgICAgX2NvcyA9IE1hdGguY29zLFxuICAgICAgX3NpbiA9IE1hdGguc2luLFxuICAgICAgX2lzU3RyaW5nID0gZnVuY3Rpb24gX2lzU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIjtcbiAgfSxcbiAgICAgIF9pc0Z1bmN0aW9uID0gZnVuY3Rpb24gX2lzRnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XG4gIH0sXG4gICAgICBfaXNOdW1iZXIgPSBmdW5jdGlvbiBfaXNOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiO1xuICB9LFxuICAgICAgX2lzVW5kZWZpbmVkID0gZnVuY3Rpb24gX2lzVW5kZWZpbmVkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIjtcbiAgfSxcbiAgICAgIF9pc09iamVjdCA9IGZ1bmN0aW9uIF9pc09iamVjdCh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCI7XG4gIH0sXG4gICAgICBfaXNOb3RGYWxzZSA9IGZ1bmN0aW9uIF9pc05vdEZhbHNlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSBmYWxzZTtcbiAgfSxcbiAgICAgIF93aW5kb3dFeGlzdHMgPSBmdW5jdGlvbiBfd2luZG93RXhpc3RzKCkge1xuICAgIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiO1xuICB9LFxuICAgICAgX2lzRnVuY09yU3RyaW5nID0gZnVuY3Rpb24gX2lzRnVuY09yU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIF9pc0Z1bmN0aW9uKHZhbHVlKSB8fCBfaXNTdHJpbmcodmFsdWUpO1xuICB9LFxuICAgICAgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5LFxuICAgICAgX3N0cmljdE51bUV4cCA9IC8oPzotP1xcLj9cXGR8XFwuKSsvZ2ksXG4gICAgICBfbnVtRXhwID0gL1stKz1cXC5dKlxcZCtbXFwuZVxcLVxcK10qXFxkKltlXFwtXFwrXSpcXGQqL2dpLFxuICAgICAgX2NvbXBsZXhTdHJpbmdOdW1FeHAgPSAvWy0rPVxcLl0qXFxkKyg/OlxcLnxlLXxlKSpcXGQqL2dpLFxuICAgICAgX3BhcmVudGhlc2VzRXhwID0gL1xcKChbXigpXSspXFwpL2ksXG4gICAgICBfcmVsRXhwID0gL1tcXCstXT0tP1tcXC5cXGRdKy8sXG4gICAgICBfZGVsaW1pdGVkVmFsdWVFeHAgPSAvWyNcXC0rXFwuXSpcXGJbYS16XFxkLT0rJS5dKy9naSxcbiAgICAgIF9nbG9iYWxUaW1lbGluZSxcbiAgICAgIF93aW4sXG4gICAgICBfY29yZUluaXR0ZWQsXG4gICAgICBfZG9jLFxuICAgICAgX2dsb2JhbHMgPSB7fSxcbiAgICAgIF9pbnN0YWxsU2NvcGUgPSB7fSxcbiAgICAgIF9jb3JlUmVhZHksXG4gICAgICBfaW5zdGFsbCA9IGZ1bmN0aW9uIF9pbnN0YWxsKHNjb3BlKSB7XG4gICAgcmV0dXJuIChfaW5zdGFsbFNjb3BlID0gX21lcmdlKHNjb3BlLCBfZ2xvYmFscykpICYmIGdzYXA7XG4gIH0sXG4gICAgICBfbWlzc2luZ1BsdWdpbiA9IGZ1bmN0aW9uIF9taXNzaW5nUGx1Z2luKHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oXCJJbnZhbGlkIHByb3BlcnR5XCIsIHByb3BlcnR5LCBcInNldCB0b1wiLCB2YWx1ZSwgXCJNaXNzaW5nIHBsdWdpbj8gZ3NhcC5yZWdpc3RlclBsdWdpbigpXCIpO1xuICB9LFxuICAgICAgX3dhcm4gPSBmdW5jdGlvbiBfd2FybihtZXNzYWdlLCBzdXBwcmVzcykge1xuICAgIHJldHVybiAhc3VwcHJlc3MgJiYgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICB9LFxuICAgICAgX2FkZEdsb2JhbCA9IGZ1bmN0aW9uIF9hZGRHbG9iYWwobmFtZSwgb2JqKSB7XG4gICAgcmV0dXJuIG5hbWUgJiYgKF9nbG9iYWxzW25hbWVdID0gb2JqKSAmJiBfaW5zdGFsbFNjb3BlICYmIChfaW5zdGFsbFNjb3BlW25hbWVdID0gb2JqKSB8fCBfZ2xvYmFscztcbiAgfSxcbiAgICAgIF9lbXB0eUZ1bmMgPSBmdW5jdGlvbiBfZW1wdHlGdW5jKCkge1xuICAgIHJldHVybiAwO1xuICB9LFxuICAgICAgX3Jlc2VydmVkUHJvcHMgPSB7fSxcbiAgICAgIF9sYXp5VHdlZW5zID0gW10sXG4gICAgICBfbGF6eUxvb2t1cCA9IHt9LFxuICAgICAgX3BsdWdpbnMgPSB7fSxcbiAgICAgIF9lZmZlY3RzID0ge30sXG4gICAgICBfbmV4dEdDRnJhbWUgPSAzMCxcbiAgICAgIF9oYXJuZXNzUGx1Z2lucyA9IFtdLFxuICAgICAgX2NhbGxiYWNrTmFtZXMgPSBcIm9uQ29tcGxldGUsb25VcGRhdGUsb25TdGFydCxvblJlcGVhdCxvblJldmVyc2VDb21wbGV0ZSxvbkludGVycnVwdFwiLFxuICAgICAgX2hhcm5lc3MgPSBmdW5jdGlvbiBfaGFybmVzcyh0YXJnZXRzKSB7XG4gICAgdmFyIHRhcmdldCA9IHRhcmdldHNbMF0sXG4gICAgICAgIGhhcm5lc3NQbHVnaW4sXG4gICAgICAgIGk7XG5cbiAgICBpZiAoIV9pc09iamVjdCh0YXJnZXQpICYmICFfaXNGdW5jdGlvbih0YXJnZXQpKSB7XG4gICAgICB0YXJnZXRzID0gW3RhcmdldHNdO1xuICAgIH1cblxuICAgIGlmICghKGhhcm5lc3NQbHVnaW4gPSAodGFyZ2V0Ll9nc2FwIHx8IHt9KS5oYXJuZXNzKSkge1xuICAgICAgaSA9IF9oYXJuZXNzUGx1Z2lucy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0gJiYgIV9oYXJuZXNzUGx1Z2luc1tpXS50YXJnZXRUZXN0KHRhcmdldCkpIHt9XG5cbiAgICAgIGhhcm5lc3NQbHVnaW4gPSBfaGFybmVzc1BsdWdpbnNbaV07XG4gICAgfVxuXG4gICAgaSA9IHRhcmdldHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdGFyZ2V0c1tpXSAmJiAodGFyZ2V0c1tpXS5fZ3NhcCB8fCAodGFyZ2V0c1tpXS5fZ3NhcCA9IG5ldyBHU0NhY2hlKHRhcmdldHNbaV0sIGhhcm5lc3NQbHVnaW4pKSkgfHwgdGFyZ2V0cy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldHM7XG4gIH0sXG4gICAgICBfZ2V0Q2FjaGUgPSBmdW5jdGlvbiBfZ2V0Q2FjaGUodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldC5fZ3NhcCB8fCBfaGFybmVzcyh0b0FycmF5KHRhcmdldCkpWzBdLl9nc2FwO1xuICB9LFxuICAgICAgX2dldFByb3BlcnR5ID0gZnVuY3Rpb24gX2dldFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICB2YXIgY3VycmVudFZhbHVlID0gdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICByZXR1cm4gX2lzRnVuY3Rpb24oY3VycmVudFZhbHVlKSA/IHRhcmdldFtwcm9wZXJ0eV0oKSA6IF9pc1VuZGVmaW5lZChjdXJyZW50VmFsdWUpICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUocHJvcGVydHkpIHx8IGN1cnJlbnRWYWx1ZTtcbiAgfSxcbiAgICAgIF9mb3JFYWNoTmFtZSA9IGZ1bmN0aW9uIF9mb3JFYWNoTmFtZShuYW1lcywgZnVuYykge1xuICAgIHJldHVybiAobmFtZXMgPSBuYW1lcy5zcGxpdChcIixcIikpLmZvckVhY2goZnVuYykgfHwgbmFtZXM7XG4gIH0sXG4gICAgICBfcm91bmQgPSBmdW5jdGlvbiBfcm91bmQodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMDAwKSAvIDEwMDAwO1xuICB9LFxuICAgICAgX2FycmF5Q29udGFpbnNBbnkgPSBmdW5jdGlvbiBfYXJyYXlDb250YWluc0FueSh0b1NlYXJjaCwgdG9GaW5kKSB7XG4gICAgdmFyIGwgPSB0b0ZpbmQubGVuZ3RoLFxuICAgICAgICBpID0gMDtcblxuICAgIGZvciAoOyB0b1NlYXJjaC5pbmRleE9mKHRvRmluZFtpXSkgPCAwICYmICsraSA8IGw7KSB7fVxuXG4gICAgcmV0dXJuIGkgPCBsO1xuICB9LFxuICAgICAgX3BhcnNlVmFycyA9IGZ1bmN0aW9uIF9wYXJzZVZhcnMocGFyYW1zLCB0eXBlLCBwYXJlbnQpIHtcbiAgICB2YXIgaXNMZWdhY3kgPSBfaXNOdW1iZXIocGFyYW1zWzFdKSxcbiAgICAgICAgdmFyc0luZGV4ID0gKGlzTGVnYWN5ID8gMiA6IDEpICsgKHR5cGUgPCAyID8gMCA6IDEpLFxuICAgICAgICB2YXJzID0gcGFyYW1zW3ZhcnNJbmRleF0sXG4gICAgICAgIGk7XG5cbiAgICBpZiAoaXNMZWdhY3kpIHtcbiAgICAgIHZhcnMuZHVyYXRpb24gPSBwYXJhbXNbMV07XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09IDEpIHtcbiAgICAgIHZhcnMucnVuQmFja3dhcmRzID0gMTtcbiAgICAgIHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gX2lzTm90RmFsc2UodmFycy5pbW1lZGlhdGVSZW5kZXIpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gMikge1xuICAgICAgaSA9IHBhcmFtc1t2YXJzSW5kZXggLSAxXTtcbiAgICAgIHZhcnMuc3RhcnRBdCA9IGk7XG4gICAgICB2YXJzLmltbWVkaWF0ZVJlbmRlciA9IF9pc05vdEZhbHNlKHZhcnMuaW1tZWRpYXRlUmVuZGVyKTtcbiAgICB9XG5cbiAgICB2YXJzLnBhcmVudCA9IHBhcmVudDtcbiAgICByZXR1cm4gdmFycztcbiAgfSxcbiAgICAgIF9sYXp5UmVuZGVyID0gZnVuY3Rpb24gX2xhenlSZW5kZXIoKSB7XG4gICAgdmFyIGwgPSBfbGF6eVR3ZWVucy5sZW5ndGgsXG4gICAgICAgIGEgPSBfbGF6eVR3ZWVucy5zbGljZSgwKSxcbiAgICAgICAgaSxcbiAgICAgICAgdHdlZW47XG5cbiAgICBfbGF6eUxvb2t1cCA9IHt9O1xuICAgIF9sYXp5VHdlZW5zLmxlbmd0aCA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0d2VlbiA9IGFbaV07XG5cbiAgICAgIGlmICh0d2VlbiAmJiB0d2Vlbi5fbGF6eSkge1xuICAgICAgICB0d2Vlbi5yZW5kZXIodHdlZW4uX2xhenlbMF0sIHR3ZWVuLl9sYXp5WzFdLCB0cnVlKS5fbGF6eSA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAgICAgX2xhenlTYWZlUmVuZGVyID0gZnVuY3Rpb24gX2xhenlTYWZlUmVuZGVyKGFuaW1hdGlvbiwgdGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG4gICAgaWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkge1xuICAgICAgX2xhenlSZW5kZXIoKTtcbiAgICB9XG5cbiAgICBhbmltYXRpb24ucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cbiAgICBpZiAoX2xhenlUd2VlbnMubGVuZ3RoKSB7XG4gICAgICBfbGF6eVJlbmRlcigpO1xuICAgIH1cbiAgfSxcbiAgICAgIF9udW1lcmljSWZQb3NzaWJsZSA9IGZ1bmN0aW9uIF9udW1lcmljSWZQb3NzaWJsZSh2YWx1ZSkge1xuICAgIHZhciBuID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgcmV0dXJuIG4gfHwgbiA9PT0gMCA/IG4gOiB2YWx1ZTtcbiAgfSxcbiAgICAgIF9wYXNzVGhyb3VnaCA9IGZ1bmN0aW9uIF9wYXNzVGhyb3VnaChwKSB7XG4gICAgcmV0dXJuIHA7XG4gIH0sXG4gICAgICBfc2V0RGVmYXVsdHMgPSBmdW5jdGlvbiBfc2V0RGVmYXVsdHMob2JqLCBkZWZhdWx0cykge1xuICAgIGZvciAodmFyIHAgaW4gZGVmYXVsdHMpIHtcbiAgICAgIGlmICghKHAgaW4gb2JqKSkge1xuICAgICAgICBvYmpbcF0gPSBkZWZhdWx0c1twXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9LFxuICAgICAgX3NldEtleWZyYW1lRGVmYXVsdHMgPSBmdW5jdGlvbiBfc2V0S2V5ZnJhbWVEZWZhdWx0cyhvYmosIGRlZmF1bHRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBkZWZhdWx0cykge1xuICAgICAgaWYgKCEocCBpbiBvYmopICYmIHAgIT09IFwiZHVyYXRpb25cIiAmJiBwICE9PSBcImVhc2VcIikge1xuICAgICAgICBvYmpbcF0gPSBkZWZhdWx0c1twXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICAgICBfbWVyZ2UgPSBmdW5jdGlvbiBfbWVyZ2UoYmFzZSwgdG9NZXJnZSkge1xuICAgIGZvciAodmFyIHAgaW4gdG9NZXJnZSkge1xuICAgICAgYmFzZVtwXSA9IHRvTWVyZ2VbcF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2U7XG4gIH0sXG4gICAgICBfbWVyZ2VEZWVwID0gZnVuY3Rpb24gX21lcmdlRGVlcChiYXNlLCB0b01lcmdlKSB7XG4gICAgZm9yICh2YXIgcCBpbiB0b01lcmdlKSB7XG4gICAgICBiYXNlW3BdID0gX2lzT2JqZWN0KHRvTWVyZ2VbcF0pID8gX21lcmdlRGVlcChiYXNlW3BdIHx8IChiYXNlW3BdID0ge30pLCB0b01lcmdlW3BdKSA6IHRvTWVyZ2VbcF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2U7XG4gIH0sXG4gICAgICBfY29weUV4Y2x1ZGluZyA9IGZ1bmN0aW9uIF9jb3B5RXhjbHVkaW5nKG9iaiwgZXhjbHVkaW5nKSB7XG4gICAgdmFyIGNvcHkgPSB7fSxcbiAgICAgICAgcDtcblxuICAgIGZvciAocCBpbiBvYmopIHtcbiAgICAgIGlmICghKHAgaW4gZXhjbHVkaW5nKSkge1xuICAgICAgICBjb3B5W3BdID0gb2JqW3BdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb3B5O1xuICB9LFxuICAgICAgX2luaGVyaXREZWZhdWx0cyA9IGZ1bmN0aW9uIF9pbmhlcml0RGVmYXVsdHModmFycykge1xuICAgIHZhciBwYXJlbnQgPSB2YXJzLnBhcmVudCB8fCBfZ2xvYmFsVGltZWxpbmUsXG4gICAgICAgIGZ1bmMgPSB2YXJzLmtleWZyYW1lcyA/IF9zZXRLZXlmcmFtZURlZmF1bHRzIDogX3NldERlZmF1bHRzO1xuXG4gICAgaWYgKF9pc05vdEZhbHNlKHZhcnMuaW5oZXJpdCkpIHtcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgZnVuYyh2YXJzLCBwYXJlbnQudmFycy5kZWZhdWx0cyk7XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhcnM7XG4gIH0sXG4gICAgICBfYXJyYXlzTWF0Y2ggPSBmdW5jdGlvbiBfYXJyYXlzTWF0Y2goYTEsIGEyKSB7XG4gICAgdmFyIGkgPSBhMS5sZW5ndGgsXG4gICAgICAgIG1hdGNoID0gaSA9PT0gYTIubGVuZ3RoO1xuXG4gICAgd2hpbGUgKG1hdGNoICYmIGktLSAmJiBhMVtpXSA9PT0gYTJbaV0pIHt9XG5cbiAgICByZXR1cm4gaSA8IDA7XG4gIH0sXG4gICAgICBfYWRkTGlua2VkTGlzdEl0ZW0gPSBmdW5jdGlvbiBfYWRkTGlua2VkTGlzdEl0ZW0ocGFyZW50LCBjaGlsZCwgZmlyc3RQcm9wLCBsYXN0UHJvcCwgc29ydEJ5KSB7XG4gICAgaWYgKGZpcnN0UHJvcCA9PT0gdm9pZCAwKSB7XG4gICAgICBmaXJzdFByb3AgPSBcIl9maXJzdFwiO1xuICAgIH1cblxuICAgIGlmIChsYXN0UHJvcCA9PT0gdm9pZCAwKSB7XG4gICAgICBsYXN0UHJvcCA9IFwiX2xhc3RcIjtcbiAgICB9XG5cbiAgICB2YXIgcHJldiA9IHBhcmVudFtsYXN0UHJvcF0sXG4gICAgICAgIHQ7XG5cbiAgICBpZiAoc29ydEJ5KSB7XG4gICAgICB0ID0gY2hpbGRbc29ydEJ5XTtcblxuICAgICAgd2hpbGUgKHByZXYgJiYgcHJldltzb3J0QnldID4gdCkge1xuICAgICAgICBwcmV2ID0gcHJldi5fcHJldjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJldikge1xuICAgICAgY2hpbGQuX25leHQgPSBwcmV2Ll9uZXh0O1xuICAgICAgcHJldi5fbmV4dCA9IGNoaWxkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZC5fbmV4dCA9IHBhcmVudFtmaXJzdFByb3BdO1xuICAgICAgcGFyZW50W2ZpcnN0UHJvcF0gPSBjaGlsZDtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuX25leHQpIHtcbiAgICAgIGNoaWxkLl9uZXh0Ll9wcmV2ID0gY2hpbGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudFtsYXN0UHJvcF0gPSBjaGlsZDtcbiAgICB9XG5cbiAgICBjaGlsZC5fcHJldiA9IHByZXY7XG4gICAgY2hpbGQucGFyZW50ID0gcGFyZW50O1xuICAgIHJldHVybiBjaGlsZDtcbiAgfSxcbiAgICAgIF9yZW1vdmVMaW5rZWRMaXN0SXRlbSA9IGZ1bmN0aW9uIF9yZW1vdmVMaW5rZWRMaXN0SXRlbShwYXJlbnQsIGNoaWxkLCBmaXJzdFByb3AsIGxhc3RQcm9wKSB7XG4gICAgaWYgKGZpcnN0UHJvcCA9PT0gdm9pZCAwKSB7XG4gICAgICBmaXJzdFByb3AgPSBcIl9maXJzdFwiO1xuICAgIH1cblxuICAgIGlmIChsYXN0UHJvcCA9PT0gdm9pZCAwKSB7XG4gICAgICBsYXN0UHJvcCA9IFwiX2xhc3RcIjtcbiAgICB9XG5cbiAgICB2YXIgcHJldiA9IGNoaWxkLl9wcmV2LFxuICAgICAgICBuZXh0ID0gY2hpbGQuX25leHQ7XG5cbiAgICBpZiAocHJldikge1xuICAgICAgcHJldi5fbmV4dCA9IG5leHQ7XG4gICAgfSBlbHNlIGlmIChwYXJlbnRbZmlyc3RQcm9wXSA9PT0gY2hpbGQpIHtcbiAgICAgIHBhcmVudFtmaXJzdFByb3BdID0gbmV4dDtcbiAgICB9XG5cbiAgICBpZiAobmV4dCkge1xuICAgICAgbmV4dC5fcHJldiA9IHByZXY7XG4gICAgfSBlbHNlIGlmIChwYXJlbnRbbGFzdFByb3BdID09PSBjaGlsZCkge1xuICAgICAgcGFyZW50W2xhc3RQcm9wXSA9IHByZXY7XG4gICAgfVxuXG4gICAgY2hpbGQuX2RwID0gcGFyZW50O1xuICAgIGNoaWxkLl9uZXh0ID0gY2hpbGQuX3ByZXYgPSBjaGlsZC5wYXJlbnQgPSBudWxsO1xuICB9LFxuICAgICAgX3JlbW92ZUZyb21QYXJlbnQgPSBmdW5jdGlvbiBfcmVtb3ZlRnJvbVBhcmVudChjaGlsZCwgb25seUlmUGFyZW50SGFzQXV0b1JlbW92ZSkge1xuICAgIGlmIChjaGlsZC5wYXJlbnQgJiYgKCFvbmx5SWZQYXJlbnRIYXNBdXRvUmVtb3ZlIHx8IGNoaWxkLnBhcmVudC5hdXRvUmVtb3ZlQ2hpbGRyZW4pKSB7XG4gICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlKGNoaWxkKTtcbiAgICB9XG5cbiAgICBjaGlsZC5fYWN0ID0gMDtcbiAgfSxcbiAgICAgIF91bmNhY2hlID0gZnVuY3Rpb24gX3VuY2FjaGUoYW5pbWF0aW9uKSB7XG4gICAgdmFyIGEgPSBhbmltYXRpb247XG5cbiAgICB3aGlsZSAoYSkge1xuICAgICAgYS5fZGlydHkgPSAxO1xuICAgICAgYSA9IGEucGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiBhbmltYXRpb247XG4gIH0sXG4gICAgICBfcmVjYWNoZUFuY2VzdG9ycyA9IGZ1bmN0aW9uIF9yZWNhY2hlQW5jZXN0b3JzKGFuaW1hdGlvbikge1xuICAgIHZhciBwYXJlbnQgPSBhbmltYXRpb24ucGFyZW50O1xuXG4gICAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQucGFyZW50KSB7XG4gICAgICBwYXJlbnQuX2RpcnR5ID0gMTtcbiAgICAgIHBhcmVudC50b3RhbER1cmF0aW9uKCk7XG4gICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiBhbmltYXRpb247XG4gIH0sXG4gICAgICBfaGFzTm9QYXVzZWRBbmNlc3RvcnMgPSBmdW5jdGlvbiBfaGFzTm9QYXVzZWRBbmNlc3RvcnMoYW5pbWF0aW9uKSB7XG4gICAgcmV0dXJuICFhbmltYXRpb24gfHwgYW5pbWF0aW9uLl90cyAmJiBfaGFzTm9QYXVzZWRBbmNlc3RvcnMoYW5pbWF0aW9uLnBhcmVudCk7XG4gIH0sXG4gICAgICBfZWxhcHNlZEN5Y2xlRHVyYXRpb24gPSBmdW5jdGlvbiBfZWxhcHNlZEN5Y2xlRHVyYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgcmV0dXJuIGFuaW1hdGlvbi5fcmVwZWF0ID8gfn4oYW5pbWF0aW9uLl90VGltZSAvIChhbmltYXRpb24gPSBhbmltYXRpb24uZHVyYXRpb24oKSArIGFuaW1hdGlvbi5fckRlbGF5KSkgKiBhbmltYXRpb24gOiAwO1xuICB9LFxuICAgICAgX3BhcmVudFRvQ2hpbGRUb3RhbFRpbWUgPSBmdW5jdGlvbiBfcGFyZW50VG9DaGlsZFRvdGFsVGltZShwYXJlbnRUaW1lLCBjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZC5fdHMgPiAwID8gKHBhcmVudFRpbWUgLSBjaGlsZC5fc3RhcnQpICogY2hpbGQuX3RzIDogKGNoaWxkLl9kaXJ0eSA/IGNoaWxkLnRvdGFsRHVyYXRpb24oKSA6IGNoaWxkLl90RHVyKSArIChwYXJlbnRUaW1lIC0gY2hpbGQuX3N0YXJ0KSAqIGNoaWxkLl90cztcbiAgfSxcbiAgICAgIF9hZGRUb1RpbWVsaW5lID0gZnVuY3Rpb24gX2FkZFRvVGltZWxpbmUodGltZWxpbmUsIGNoaWxkLCBwb3NpdGlvbikge1xuICAgIGNoaWxkLnBhcmVudCAmJiBfcmVtb3ZlRnJvbVBhcmVudChjaGlsZCk7XG4gICAgY2hpbGQuX3N0YXJ0ID0gcG9zaXRpb24gKyBjaGlsZC5fZGVsYXk7XG4gICAgY2hpbGQuX2VuZCA9IGNoaWxkLl9zdGFydCArIChjaGlsZC50b3RhbER1cmF0aW9uKCkgLyBjaGlsZC5fdHMgfHwgMCk7XG5cbiAgICBfYWRkTGlua2VkTGlzdEl0ZW0odGltZWxpbmUsIGNoaWxkLCBcIl9maXJzdFwiLCBcIl9sYXN0XCIsIHRpbWVsaW5lLl9zb3J0ID8gXCJfc3RhcnRcIiA6IDApO1xuXG4gICAgdGltZWxpbmUuX3JlY2VudCA9IGNoaWxkO1xuXG4gICAgaWYgKGNoaWxkLl90aW1lIHx8ICFjaGlsZC5fZHVyICYmIGNoaWxkLl9pbml0dGVkKSB7XG4gICAgICB2YXIgY3VyVGltZSA9ICh0aW1lbGluZS5yYXdUaW1lKCkgLSBjaGlsZC5fc3RhcnQpICogY2hpbGQuX3RzO1xuXG4gICAgICBpZiAoIWNoaWxkLl9kdXIgfHwgX2NsYW1wKDAsIGNoaWxkLnRvdGFsRHVyYXRpb24oKSwgY3VyVGltZSkgLSBjaGlsZC5fdFRpbWUgPiBfdGlueU51bSkge1xuICAgICAgICBjaGlsZC5yZW5kZXIoY3VyVGltZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3VuY2FjaGUodGltZWxpbmUpO1xuXG4gICAgaWYgKHRpbWVsaW5lLl9kcCAmJiB0aW1lbGluZS5fdGltZSA+PSB0aW1lbGluZS5fZHVyICYmIHRpbWVsaW5lLl90cyAmJiB0aW1lbGluZS5fZHVyIDwgdGltZWxpbmUuZHVyYXRpb24oKSkge1xuICAgICAgdmFyIHRsID0gdGltZWxpbmU7XG5cbiAgICAgIHdoaWxlICh0bC5fZHApIHtcbiAgICAgICAgdGwudG90YWxUaW1lKHRsLl90VGltZSwgdHJ1ZSk7XG4gICAgICAgIHRsID0gdGwuX2RwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aW1lbGluZTtcbiAgfSxcbiAgICAgIF9hdHRlbXB0SW5pdFR3ZWVuID0gZnVuY3Rpb24gX2F0dGVtcHRJbml0VHdlZW4odHdlZW4sIHRvdGFsVGltZSwgZm9yY2UsIHN1cHByZXNzRXZlbnRzKSB7XG4gICAgX2luaXRUd2Vlbih0d2VlbiwgdG90YWxUaW1lKTtcblxuICAgIGlmICghdHdlZW4uX2luaXR0ZWQpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGlmICghZm9yY2UgJiYgdHdlZW4uX3B0ICYmICh0d2Vlbi5fZHVyICYmIHR3ZWVuLnZhcnMubGF6eSAhPT0gZmFsc2UgfHwgIXR3ZWVuLl9kdXIgJiYgdHdlZW4udmFycy5sYXp5KSkge1xuICAgICAgX2xhenlUd2VlbnMucHVzaCh0d2Vlbik7XG5cbiAgICAgIHR3ZWVuLl9sYXp5ID0gW3RvdGFsVGltZSwgc3VwcHJlc3NFdmVudHNdO1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9LFxuICAgICAgX3JlbmRlclplcm9EdXJhdGlvblR3ZWVuID0gZnVuY3Rpb24gX3JlbmRlclplcm9EdXJhdGlvblR3ZWVuKHR3ZWVuLCB0b3RhbFRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuICAgIHZhciBwcmV2UmF0aW8gPSB0d2Vlbi5felRpbWUgPCAwID8gMCA6IDEsXG4gICAgICAgIHJhdGlvID0gdG90YWxUaW1lIDwgMCA/IDAgOiAxLFxuICAgICAgICByZXBlYXREZWxheSA9IHR3ZWVuLl9yRGVsYXksXG4gICAgICAgIHRUaW1lID0gMCxcbiAgICAgICAgcHQsXG4gICAgICAgIGl0ZXJhdGlvbixcbiAgICAgICAgcHJldkl0ZXJhdGlvbjtcblxuICAgIGlmIChyZXBlYXREZWxheSAmJiB0d2Vlbi5fcmVwZWF0KSB7XG4gICAgICB0VGltZSA9IF9jbGFtcCgwLCB0d2Vlbi5fdER1ciwgdG90YWxUaW1lKTtcbiAgICAgIGl0ZXJhdGlvbiA9IH5+KHRUaW1lIC8gcmVwZWF0RGVsYXkpO1xuXG4gICAgICBpZiAoaXRlcmF0aW9uICYmIGl0ZXJhdGlvbiA9PT0gdFRpbWUgLyByZXBlYXREZWxheSkge1xuICAgICAgICBpdGVyYXRpb24tLTtcbiAgICAgIH1cblxuICAgICAgcHJldkl0ZXJhdGlvbiA9IH5+KHR3ZWVuLl90VGltZSAvIHJlcGVhdERlbGF5KTtcblxuICAgICAgaWYgKHByZXZJdGVyYXRpb24gJiYgcHJldkl0ZXJhdGlvbiA9PT0gdHdlZW4uX3RUaW1lIC8gcmVwZWF0RGVsYXkpIHtcbiAgICAgICAgcHJldkl0ZXJhdGlvbi0tO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlcmF0aW9uICE9PSBwcmV2SXRlcmF0aW9uKSB7XG4gICAgICAgIHByZXZSYXRpbyA9IDEgLSByYXRpbztcblxuICAgICAgICBpZiAodHdlZW4udmFycy5yZXBlYXRSZWZyZXNoICYmIHR3ZWVuLl9pbml0dGVkKSB7XG4gICAgICAgICAgdHdlZW4uaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0d2Vlbi5faW5pdHRlZCAmJiBfYXR0ZW1wdEluaXRUd2Vlbih0d2VlbiwgdG90YWxUaW1lLCBmb3JjZSwgc3VwcHJlc3NFdmVudHMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHJhdGlvICE9PSBwcmV2UmF0aW8gfHwgZm9yY2UgfHwgdHdlZW4uX3pUaW1lID09PSBfdGlueU51bSB8fCAhdG90YWxUaW1lICYmIHR3ZWVuLl96VGltZSkge1xuICAgICAgdHdlZW4uX3pUaW1lID0gdG90YWxUaW1lIHx8IChzdXBwcmVzc0V2ZW50cyA/IF90aW55TnVtIDogMCk7XG4gICAgICB0d2Vlbi5yYXRpbyA9IHJhdGlvO1xuXG4gICAgICBpZiAodHdlZW4uX2Zyb20pIHtcbiAgICAgICAgcmF0aW8gPSAxIC0gcmF0aW87XG4gICAgICB9XG5cbiAgICAgIHR3ZWVuLl90aW1lID0gMDtcbiAgICAgIHR3ZWVuLl90VGltZSA9IHRUaW1lO1xuXG4gICAgICBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG4gICAgICAgIF9jYWxsYmFjayh0d2VlbiwgXCJvblN0YXJ0XCIpO1xuICAgICAgfVxuXG4gICAgICBwdCA9IHR3ZWVuLl9wdDtcblxuICAgICAgd2hpbGUgKHB0KSB7XG4gICAgICAgIHB0LnIocmF0aW8sIHB0LmQpO1xuICAgICAgICBwdCA9IHB0Ll9uZXh0O1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJhdGlvICYmIHR3ZWVuLl9zdGFydEF0ICYmICF0d2Vlbi5fb25VcGRhdGUgJiYgdHdlZW4uX3N0YXJ0KSB7XG4gICAgICAgIHR3ZWVuLl9zdGFydEF0LnJlbmRlcih0b3RhbFRpbWUsIHRydWUsIGZvcmNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR3ZWVuLl9vblVwZGF0ZSAmJiAhc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgICAgX2NhbGxiYWNrKHR3ZWVuLCBcIm9uVXBkYXRlXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodFRpbWUgJiYgdHdlZW4uX3JlcGVhdCAmJiAhc3VwcHJlc3NFdmVudHMgJiYgdHdlZW4ucGFyZW50KSB7XG4gICAgICAgIF9jYWxsYmFjayh0d2VlbiwgXCJvblJlcGVhdFwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCh0b3RhbFRpbWUgPj0gdHdlZW4uX3REdXIgfHwgdG90YWxUaW1lIDwgMCkgJiYgdHdlZW4ucmF0aW8gPT09IHJhdGlvKSB7XG4gICAgICAgIHR3ZWVuLnJhdGlvICYmIF9yZW1vdmVGcm9tUGFyZW50KHR3ZWVuLCAxKTtcblxuICAgICAgICBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG4gICAgICAgICAgX2NhbGxiYWNrKHR3ZWVuLCB0d2Vlbi5yYXRpbyA/IFwib25Db21wbGV0ZVwiIDogXCJvblJldmVyc2VDb21wbGV0ZVwiLCB0cnVlKTtcblxuICAgICAgICAgIHR3ZWVuLl9wcm9tICYmIHR3ZWVuLl9wcm9tKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICAgICBfZmluZE5leHRQYXVzZVR3ZWVuID0gZnVuY3Rpb24gX2ZpbmROZXh0UGF1c2VUd2VlbihhbmltYXRpb24sIHByZXZUaW1lLCB0aW1lKSB7XG4gICAgdmFyIGNoaWxkO1xuXG4gICAgaWYgKHRpbWUgPiBwcmV2VGltZSkge1xuICAgICAgY2hpbGQgPSBhbmltYXRpb24uX2ZpcnN0O1xuXG4gICAgICB3aGlsZSAoY2hpbGQgJiYgY2hpbGQuX3N0YXJ0IDw9IHRpbWUpIHtcbiAgICAgICAgaWYgKCFjaGlsZC5fZHVyICYmIGNoaWxkLmRhdGEgPT09IFwiaXNQYXVzZVwiICYmIGNoaWxkLl9zdGFydCA+IHByZXZUaW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGQgPSBhbmltYXRpb24uX2xhc3Q7XG5cbiAgICAgIHdoaWxlIChjaGlsZCAmJiBjaGlsZC5fc3RhcnQgPj0gdGltZSkge1xuICAgICAgICBpZiAoIWNoaWxkLl9kdXIgJiYgY2hpbGQuZGF0YSA9PT0gXCJpc1BhdXNlXCIgJiYgY2hpbGQuX3N0YXJ0IDwgcHJldlRpbWUpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZCA9IGNoaWxkLl9wcmV2O1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgICAgIF9vblVwZGF0ZVRvdGFsRHVyYXRpb24gPSBmdW5jdGlvbiBfb25VcGRhdGVUb3RhbER1cmF0aW9uKGFuaW1hdGlvbikge1xuICAgIGlmIChhbmltYXRpb24gaW5zdGFuY2VvZiBUaW1lbGluZSkge1xuICAgICAgcmV0dXJuIF91bmNhY2hlKGFuaW1hdGlvbik7XG4gICAgfVxuXG4gICAgdmFyIHJlcGVhdCA9IGFuaW1hdGlvbi5fcmVwZWF0O1xuICAgIGFuaW1hdGlvbi5fdER1ciA9ICFyZXBlYXQgPyBhbmltYXRpb24uX2R1ciA6IHJlcGVhdCA8IDAgPyAxZTIwIDogX3JvdW5kKGFuaW1hdGlvbi5fZHVyICogKHJlcGVhdCArIDEpICsgYW5pbWF0aW9uLl9yRGVsYXkgKiByZXBlYXQpO1xuXG4gICAgX3VuY2FjaGUoYW5pbWF0aW9uLnBhcmVudCk7XG5cbiAgICByZXR1cm4gYW5pbWF0aW9uO1xuICB9LFxuICAgICAgX3plcm9Qb3NpdGlvbiA9IHtcbiAgICBfc3RhcnQ6IDAsXG4gICAgZW5kVGltZTogX2VtcHR5RnVuY1xuICB9LFxuICAgICAgX3BhcnNlUG9zaXRpb24gPSBmdW5jdGlvbiBfcGFyc2VQb3NpdGlvbihhbmltYXRpb24sIHBvc2l0aW9uLCB1c2VCdWlsZEZyb20pIHtcbiAgICB2YXIgbGFiZWxzID0gYW5pbWF0aW9uLmxhYmVscyxcbiAgICAgICAgcmVjZW50ID0gYW5pbWF0aW9uLl9yZWNlbnQgfHwgX3plcm9Qb3NpdGlvbixcbiAgICAgICAgY2xpcHBlZER1cmF0aW9uID0gYW5pbWF0aW9uLmR1cmF0aW9uKCkgPj0gX2JpZ051bSA/IHJlY2VudC5lbmRUaW1lKGZhbHNlKSA6IGFuaW1hdGlvbi5fZHVyLFxuICAgICAgICBpLFxuICAgICAgICBvZmZzZXQ7XG5cbiAgICBpZiAoX2lzU3RyaW5nKHBvc2l0aW9uKSAmJiAoaXNOYU4ocG9zaXRpb24pIHx8IHBvc2l0aW9uIGluIGxhYmVscykpIHtcbiAgICAgIGkgPSBwb3NpdGlvbi5jaGFyQXQoMCk7XG5cbiAgICAgIGlmIChpID09PSBcIjxcIiB8fCBpID09PSBcIj5cIikge1xuICAgICAgICByZXR1cm4gKGkgPT09IFwiPFwiID8gcmVjZW50Ll9zdGFydCA6IHJlY2VudC5lbmRUaW1lKHJlY2VudC5fcmVwZWF0ID49IDApKSArIChwYXJzZUZsb2F0KHBvc2l0aW9uLnN1YnN0cigxKSkgfHwgMCk7XG4gICAgICB9XG5cbiAgICAgIGkgPSBwb3NpdGlvbi5pbmRleE9mKFwiPVwiKTtcblxuICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgIGlmICghKHBvc2l0aW9uIGluIGxhYmVscykpIHtcbiAgICAgICAgICBsYWJlbHNbcG9zaXRpb25dID0gY2xpcHBlZER1cmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhYmVsc1twb3NpdGlvbl07XG4gICAgICB9XG5cbiAgICAgIG9mZnNldCA9ICsocG9zaXRpb24uY2hhckF0KGkgLSAxKSArIHBvc2l0aW9uLnN1YnN0cihpICsgMSkpO1xuICAgICAgcmV0dXJuIGkgPiAxID8gX3BhcnNlUG9zaXRpb24oYW5pbWF0aW9uLCBwb3NpdGlvbi5zdWJzdHIoMCwgaSAtIDEpKSArIG9mZnNldCA6IGNsaXBwZWREdXJhdGlvbiArIG9mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zaXRpb24gPT0gbnVsbCA/IGNsaXBwZWREdXJhdGlvbiA6ICtwb3NpdGlvbjtcbiAgfSxcbiAgICAgIF9jb25kaXRpb25hbFJldHVybiA9IGZ1bmN0aW9uIF9jb25kaXRpb25hbFJldHVybih2YWx1ZSwgZnVuYykge1xuICAgIHJldHVybiB2YWx1ZSB8fCB2YWx1ZSA9PT0gMCA/IGZ1bmModmFsdWUpIDogZnVuYztcbiAgfSxcbiAgICAgIF9jbGFtcCA9IGZ1bmN0aW9uIF9jbGFtcChtaW4sIG1heCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPCBtaW4gPyBtaW4gOiB2YWx1ZSA+IG1heCA/IG1heCA6IHZhbHVlO1xuICB9LFxuICAgICAgZ2V0VW5pdCA9IGZ1bmN0aW9uIGdldFVuaXQodmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlICsgXCJcIikuc3Vic3RyKChwYXJzZUZsb2F0KHZhbHVlKSArIFwiXCIpLmxlbmd0aCk7XG4gIH0sXG4gICAgICBjbGFtcCA9IGZ1bmN0aW9uIGNsYW1wKG1pbiwgbWF4LCB2YWx1ZSkge1xuICAgIHJldHVybiBfY29uZGl0aW9uYWxSZXR1cm4odmFsdWUsIGZ1bmN0aW9uICh2KSB7XG4gICAgICByZXR1cm4gX2NsYW1wKG1pbiwgbWF4LCB2KTtcbiAgICB9KTtcbiAgfSxcbiAgICAgIF9zbGljZSA9IFtdLnNsaWNlLFxuICAgICAgX2lzQXJyYXlMaWtlID0gZnVuY3Rpb24gX2lzQXJyYXlMaWtlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIF9pc09iamVjdCh2YWx1ZSkgJiYgXCJsZW5ndGhcIiBpbiB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggLSAxIGluIHZhbHVlICYmIF9pc09iamVjdCh2YWx1ZVswXSkgJiYgIXZhbHVlLm5vZGVUeXBlICYmIHZhbHVlICE9PSBfd2luO1xuICB9LFxuICAgICAgX2ZsYXR0ZW4gPSBmdW5jdGlvbiBfZmxhdHRlbihhciwgbGVhdmVTdHJpbmdzLCBhY2N1bXVsYXRvcikge1xuICAgIGlmIChhY2N1bXVsYXRvciA9PT0gdm9pZCAwKSB7XG4gICAgICBhY2N1bXVsYXRvciA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiBhci5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdmFyIF9hY2N1bXVsYXRvcjtcblxuICAgICAgcmV0dXJuIF9pc1N0cmluZyh2YWx1ZSkgJiYgIWxlYXZlU3RyaW5ncyB8fCBfaXNBcnJheUxpa2UodmFsdWUpID8gKF9hY2N1bXVsYXRvciA9IGFjY3VtdWxhdG9yKS5wdXNoLmFwcGx5KF9hY2N1bXVsYXRvciwgdG9BcnJheSh2YWx1ZSkpIDogYWNjdW11bGF0b3IucHVzaCh2YWx1ZSk7XG4gICAgfSkgfHwgYWNjdW11bGF0b3I7XG4gIH0sXG4gICAgICB0b0FycmF5ID0gZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSwgbGVhdmVTdHJpbmdzKSB7XG4gICAgcmV0dXJuIF9pc1N0cmluZyh2YWx1ZSkgJiYgIWxlYXZlU3RyaW5ncyAmJiAoX2NvcmVJbml0dGVkIHx8ICFfd2FrZSgpKSA/IF9zbGljZS5jYWxsKF9kb2MucXVlcnlTZWxlY3RvckFsbCh2YWx1ZSksIDApIDogX2lzQXJyYXkodmFsdWUpID8gX2ZsYXR0ZW4odmFsdWUsIGxlYXZlU3RyaW5ncykgOiBfaXNBcnJheUxpa2UodmFsdWUpID8gX3NsaWNlLmNhbGwodmFsdWUsIDApIDogdmFsdWUgPyBbdmFsdWVdIDogW107XG4gIH0sXG4gICAgICBkaXN0cmlidXRlID0gZnVuY3Rpb24gZGlzdHJpYnV0ZSh2KSB7XG4gICAgaWYgKF9pc0Z1bmN0aW9uKHYpKSB7XG4gICAgICByZXR1cm4gdjtcbiAgICB9XG5cbiAgICB2YXIgdmFycyA9IF9pc09iamVjdCh2KSA/IHYgOiB7XG4gICAgICBlYWNoOiB2XG4gICAgfSxcbiAgICAgICAgZWFzZSA9IF9wYXJzZUVhc2UodmFycy5lYXNlKSxcbiAgICAgICAgZnJvbSA9IHZhcnMuZnJvbSB8fCAwLFxuICAgICAgICBiYXNlID0gcGFyc2VGbG9hdCh2YXJzLmJhc2UpIHx8IDAsXG4gICAgICAgIGNhY2hlID0ge30sXG4gICAgICAgIGlzRGVjaW1hbCA9IGZyb20gPiAwICYmIGZyb20gPCAxLFxuICAgICAgICByYXRpb3MgPSBpc05hTihmcm9tKSB8fCBpc0RlY2ltYWwsXG4gICAgICAgIGF4aXMgPSB2YXJzLmF4aXMsXG4gICAgICAgIHJhdGlvWCA9IGZyb20sXG4gICAgICAgIHJhdGlvWSA9IGZyb207XG5cbiAgICBpZiAoX2lzU3RyaW5nKGZyb20pKSB7XG4gICAgICByYXRpb1ggPSByYXRpb1kgPSB7XG4gICAgICAgIGNlbnRlcjogLjUsXG4gICAgICAgIGVkZ2VzOiAuNSxcbiAgICAgICAgZW5kOiAxXG4gICAgICB9W2Zyb21dIHx8IDA7XG4gICAgfSBlbHNlIGlmICghaXNEZWNpbWFsICYmIHJhdGlvcykge1xuICAgICAgcmF0aW9YID0gZnJvbVswXTtcbiAgICAgIHJhdGlvWSA9IGZyb21bMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpLCB0YXJnZXQsIGEpIHtcbiAgICAgIHZhciBsID0gKGEgfHwgdmFycykubGVuZ3RoLFxuICAgICAgICAgIGRpc3RhbmNlcyA9IGNhY2hlW2xdLFxuICAgICAgICAgIG9yaWdpblgsXG4gICAgICAgICAgb3JpZ2luWSxcbiAgICAgICAgICB4LFxuICAgICAgICAgIHksXG4gICAgICAgICAgZCxcbiAgICAgICAgICBqLFxuICAgICAgICAgIG1heCxcbiAgICAgICAgICBtaW4sXG4gICAgICAgICAgd3JhcEF0O1xuXG4gICAgICBpZiAoIWRpc3RhbmNlcykge1xuICAgICAgICB3cmFwQXQgPSB2YXJzLmdyaWQgPT09IFwiYXV0b1wiID8gMCA6ICh2YXJzLmdyaWQgfHwgWzEsIF9iaWdOdW1dKVsxXTtcblxuICAgICAgICBpZiAoIXdyYXBBdCkge1xuICAgICAgICAgIG1heCA9IC1fYmlnTnVtO1xuXG4gICAgICAgICAgd2hpbGUgKG1heCA8IChtYXggPSBhW3dyYXBBdCsrXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSAmJiB3cmFwQXQgPCBsKSB7fVxuXG4gICAgICAgICAgd3JhcEF0LS07XG4gICAgICAgIH1cblxuICAgICAgICBkaXN0YW5jZXMgPSBjYWNoZVtsXSA9IFtdO1xuICAgICAgICBvcmlnaW5YID0gcmF0aW9zID8gTWF0aC5taW4od3JhcEF0LCBsKSAqIHJhdGlvWCAtIC41IDogZnJvbSAlIHdyYXBBdDtcbiAgICAgICAgb3JpZ2luWSA9IHJhdGlvcyA/IGwgKiByYXRpb1kgLyB3cmFwQXQgLSAuNSA6IGZyb20gLyB3cmFwQXQgfCAwO1xuICAgICAgICBtYXggPSAwO1xuICAgICAgICBtaW4gPSBfYmlnTnVtO1xuXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICB4ID0gaiAlIHdyYXBBdCAtIG9yaWdpblg7XG4gICAgICAgICAgeSA9IG9yaWdpblkgLSAoaiAvIHdyYXBBdCB8IDApO1xuICAgICAgICAgIGRpc3RhbmNlc1tqXSA9IGQgPSAhYXhpcyA/IF9zcXJ0KHggKiB4ICsgeSAqIHkpIDogTWF0aC5hYnMoYXhpcyA9PT0gXCJ5XCIgPyB5IDogeCk7XG5cbiAgICAgICAgICBpZiAoZCA+IG1heCkge1xuICAgICAgICAgICAgbWF4ID0gZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZCA8IG1pbikge1xuICAgICAgICAgICAgbWluID0gZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkaXN0YW5jZXMubWF4ID0gbWF4IC0gbWluO1xuICAgICAgICBkaXN0YW5jZXMubWluID0gbWluO1xuICAgICAgICBkaXN0YW5jZXMudiA9IGwgPSAocGFyc2VGbG9hdCh2YXJzLmFtb3VudCkgfHwgcGFyc2VGbG9hdCh2YXJzLmVhY2gpICogKHdyYXBBdCA+IGwgPyBsIC0gMSA6ICFheGlzID8gTWF0aC5tYXgod3JhcEF0LCBsIC8gd3JhcEF0KSA6IGF4aXMgPT09IFwieVwiID8gbCAvIHdyYXBBdCA6IHdyYXBBdCkgfHwgMCkgKiAoZnJvbSA9PT0gXCJlZGdlc1wiID8gLTEgOiAxKTtcbiAgICAgICAgZGlzdGFuY2VzLmIgPSBsIDwgMCA/IGJhc2UgLSBsIDogYmFzZTtcbiAgICAgICAgZGlzdGFuY2VzLnUgPSBnZXRVbml0KHZhcnMuYW1vdW50IHx8IHZhcnMuZWFjaCkgfHwgMDtcbiAgICAgICAgZWFzZSA9IGVhc2UgJiYgbCA8IDAgPyBfaW52ZXJ0RWFzZShlYXNlKSA6IGVhc2U7XG4gICAgICB9XG5cbiAgICAgIGwgPSAoZGlzdGFuY2VzW2ldIC0gZGlzdGFuY2VzLm1pbikgLyBkaXN0YW5jZXMubWF4IHx8IDA7XG4gICAgICByZXR1cm4gX3JvdW5kKGRpc3RhbmNlcy5iICsgKGVhc2UgPyBlYXNlKGwpIDogbCkgKiBkaXN0YW5jZXMudikgKyBkaXN0YW5jZXMudTtcbiAgICB9O1xuICB9LFxuICAgICAgX3JvdW5kTW9kaWZpZXIgPSBmdW5jdGlvbiBfcm91bmRNb2RpZmllcih2KSB7XG4gICAgdmFyIHAgPSB2IDwgMSA/IE1hdGgucG93KDEwLCAodiArIFwiXCIpLmxlbmd0aCAtIDIpIDogMTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJhdykge1xuICAgICAgcmV0dXJuIH5+KE1hdGgucm91bmQocGFyc2VGbG9hdChyYXcpIC8gdikgKiB2ICogcCkgLyBwICsgKF9pc051bWJlcihyYXcpID8gMCA6IGdldFVuaXQocmF3KSk7XG4gICAgfTtcbiAgfSxcbiAgICAgIHNuYXAgPSBmdW5jdGlvbiBzbmFwKHNuYXBUbywgdmFsdWUpIHtcbiAgICB2YXIgaXNBcnJheSA9IF9pc0FycmF5KHNuYXBUbyksXG4gICAgICAgIHJhZGl1cyxcbiAgICAgICAgaXMyRDtcblxuICAgIGlmICghaXNBcnJheSAmJiBfaXNPYmplY3Qoc25hcFRvKSkge1xuICAgICAgcmFkaXVzID0gaXNBcnJheSA9IHNuYXBUby5yYWRpdXMgfHwgX2JpZ051bTtcbiAgICAgIHNuYXBUbyA9IHRvQXJyYXkoc25hcFRvLnZhbHVlcyk7XG5cbiAgICAgIGlmIChpczJEID0gIV9pc051bWJlcihzbmFwVG9bMF0pKSB7XG4gICAgICAgIHJhZGl1cyAqPSByYWRpdXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9jb25kaXRpb25hbFJldHVybih2YWx1ZSwgIWlzQXJyYXkgPyBfcm91bmRNb2RpZmllcihzbmFwVG8pIDogZnVuY3Rpb24gKHJhdykge1xuICAgICAgdmFyIHggPSBwYXJzZUZsb2F0KGlzMkQgPyByYXcueCA6IHJhdyksXG4gICAgICAgICAgeSA9IHBhcnNlRmxvYXQoaXMyRCA/IHJhdy55IDogMCksXG4gICAgICAgICAgbWluID0gX2JpZ051bSxcbiAgICAgICAgICBjbG9zZXN0ID0gMCxcbiAgICAgICAgICBpID0gc25hcFRvLmxlbmd0aCxcbiAgICAgICAgICBkeCxcbiAgICAgICAgICBkeTtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBpZiAoaXMyRCkge1xuICAgICAgICAgIGR4ID0gc25hcFRvW2ldLnggLSB4O1xuICAgICAgICAgIGR5ID0gc25hcFRvW2ldLnkgLSB5O1xuICAgICAgICAgIGR4ID0gZHggKiBkeCArIGR5ICogZHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZHggPSBNYXRoLmFicyhzbmFwVG9baV0gLSB4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkeCA8IG1pbikge1xuICAgICAgICAgIG1pbiA9IGR4O1xuICAgICAgICAgIGNsb3Nlc3QgPSBpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNsb3Nlc3QgPSAhcmFkaXVzIHx8IG1pbiA8PSByYWRpdXMgPyBzbmFwVG9bY2xvc2VzdF0gOiByYXc7XG4gICAgICByZXR1cm4gaXMyRCB8fCBjbG9zZXN0ID09PSByYXcgfHwgX2lzTnVtYmVyKHJhdykgPyBjbG9zZXN0IDogY2xvc2VzdCArIGdldFVuaXQocmF3KTtcbiAgICB9KTtcbiAgfSxcbiAgICAgIHJhbmRvbSA9IGZ1bmN0aW9uIHJhbmRvbShtaW4sIG1heCwgcm91bmRpbmdJbmNyZW1lbnQsIHJldHVybkZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIF9jb25kaXRpb25hbFJldHVybihfaXNBcnJheShtaW4pID8gIW1heCA6ICFyZXR1cm5GdW5jdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF9pc0FycmF5KG1pbikgPyBtaW5bfn4oTWF0aC5yYW5kb20oKSAqIG1pbi5sZW5ndGgpXSA6IChyb3VuZGluZ0luY3JlbWVudCA9IHJvdW5kaW5nSW5jcmVtZW50IHx8IDFlLTUpICYmIChyZXR1cm5GdW5jdGlvbiA9IHJvdW5kaW5nSW5jcmVtZW50IDwgMSA/IE1hdGgucG93KDEwLCAocm91bmRpbmdJbmNyZW1lbnQgKyBcIlwiKS5sZW5ndGggLSAyKSA6IDEpICYmIH5+KE1hdGgucm91bmQoKG1pbiArIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgLyByb3VuZGluZ0luY3JlbWVudCkgKiByb3VuZGluZ0luY3JlbWVudCAqIHJldHVybkZ1bmN0aW9uKSAvIHJldHVybkZ1bmN0aW9uO1xuICAgIH0pO1xuICB9LFxuICAgICAgcGlwZSA9IGZ1bmN0aW9uIHBpcGUoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZ1bmN0aW9ucyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGZ1bmN0aW9uc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAodiwgZikge1xuICAgICAgICByZXR1cm4gZih2KTtcbiAgICAgIH0sIHZhbHVlKTtcbiAgICB9O1xuICB9LFxuICAgICAgdW5pdGl6ZSA9IGZ1bmN0aW9uIHVuaXRpemUoZnVuYywgdW5pdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBmdW5jKHBhcnNlRmxvYXQodmFsdWUpKSArICh1bml0IHx8IGdldFVuaXQodmFsdWUpKTtcbiAgICB9O1xuICB9LFxuICAgICAgbm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKG1pbiwgbWF4LCB2YWx1ZSkge1xuICAgIHJldHVybiBtYXBSYW5nZShtaW4sIG1heCwgMCwgMSwgdmFsdWUpO1xuICB9LFxuICAgICAgX3dyYXBBcnJheSA9IGZ1bmN0aW9uIF93cmFwQXJyYXkoYSwgd3JhcHBlciwgdmFsdWUpIHtcbiAgICByZXR1cm4gX2NvbmRpdGlvbmFsUmV0dXJuKHZhbHVlLCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHJldHVybiBhW35+d3JhcHBlcihpbmRleCldO1xuICAgIH0pO1xuICB9LFxuICAgICAgd3JhcCA9IGZ1bmN0aW9uIHdyYXAobWluLCBtYXgsIHZhbHVlKSB7XG4gICAgdmFyIHJhbmdlID0gbWF4IC0gbWluO1xuICAgIHJldHVybiBfaXNBcnJheShtaW4pID8gX3dyYXBBcnJheShtaW4sIHdyYXAoMCwgbWluLmxlbmd0aCksIG1heCkgOiBfY29uZGl0aW9uYWxSZXR1cm4odmFsdWUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIChyYW5nZSArICh2YWx1ZSAtIG1pbikgJSByYW5nZSkgJSByYW5nZSArIG1pbjtcbiAgICB9KTtcbiAgfSxcbiAgICAgIHdyYXBZb3lvID0gZnVuY3Rpb24gd3JhcFlveW8obWluLCBtYXgsIHZhbHVlKSB7XG4gICAgdmFyIHJhbmdlID0gbWF4IC0gbWluLFxuICAgICAgICB0b3RhbCA9IHJhbmdlICogMjtcbiAgICByZXR1cm4gX2lzQXJyYXkobWluKSA/IF93cmFwQXJyYXkobWluLCB3cmFwWW95bygwLCBtaW4ubGVuZ3RoIC0gMSksIG1heCkgOiBfY29uZGl0aW9uYWxSZXR1cm4odmFsdWUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdmFsdWUgPSAodG90YWwgKyAodmFsdWUgLSBtaW4pICUgdG90YWwpICUgdG90YWw7XG4gICAgICByZXR1cm4gbWluICsgKHZhbHVlID4gcmFuZ2UgPyB0b3RhbCAtIHZhbHVlIDogdmFsdWUpO1xuICAgIH0pO1xuICB9LFxuICAgICAgX3JlcGxhY2VSYW5kb20gPSBmdW5jdGlvbiBfcmVwbGFjZVJhbmRvbSh2YWx1ZSkge1xuICAgIHZhciBwcmV2ID0gMCxcbiAgICAgICAgcyA9IFwiXCIsXG4gICAgICAgIGksXG4gICAgICAgIG51bXMsXG4gICAgICAgIGVuZCxcbiAgICAgICAgaXNBcnJheTtcblxuICAgIHdoaWxlICh+KGkgPSB2YWx1ZS5pbmRleE9mKFwicmFuZG9tKFwiLCBwcmV2KSkpIHtcbiAgICAgIGVuZCA9IHZhbHVlLmluZGV4T2YoXCIpXCIsIGkpO1xuICAgICAgaXNBcnJheSA9IHZhbHVlLmNoYXJBdChpICsgNykgPT09IFwiW1wiO1xuICAgICAgbnVtcyA9IHZhbHVlLnN1YnN0cihpICsgNywgZW5kIC0gaSAtIDcpLm1hdGNoKGlzQXJyYXkgPyBfZGVsaW1pdGVkVmFsdWVFeHAgOiBfc3RyaWN0TnVtRXhwKTtcbiAgICAgIHMgKz0gdmFsdWUuc3Vic3RyKHByZXYsIGkgLSBwcmV2KSArIHJhbmRvbShpc0FycmF5ID8gbnVtcyA6ICtudW1zWzBdLCArbnVtc1sxXSwgK251bXNbMl0gfHwgMWUtNSk7XG4gICAgICBwcmV2ID0gZW5kICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gcyArIHZhbHVlLnN1YnN0cihwcmV2LCB2YWx1ZS5sZW5ndGggLSBwcmV2KTtcbiAgfSxcbiAgICAgIG1hcFJhbmdlID0gZnVuY3Rpb24gbWFwUmFuZ2UoaW5NaW4sIGluTWF4LCBvdXRNaW4sIG91dE1heCwgdmFsdWUpIHtcbiAgICB2YXIgaW5SYW5nZSA9IGluTWF4IC0gaW5NaW4sXG4gICAgICAgIG91dFJhbmdlID0gb3V0TWF4IC0gb3V0TWluO1xuICAgIHJldHVybiBfY29uZGl0aW9uYWxSZXR1cm4odmFsdWUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIG91dE1pbiArICh2YWx1ZSAtIGluTWluKSAvIGluUmFuZ2UgKiBvdXRSYW5nZTtcbiAgICB9KTtcbiAgfSxcbiAgICAgIGludGVycG9sYXRlID0gZnVuY3Rpb24gaW50ZXJwb2xhdGUoc3RhcnQsIGVuZCwgcHJvZ3Jlc3MsIG11dGF0ZSkge1xuICAgIHZhciBmdW5jID0gaXNOYU4oc3RhcnQgKyBlbmQpID8gMCA6IGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gKDEgLSBwKSAqIHN0YXJ0ICsgcCAqIGVuZDtcbiAgICB9O1xuXG4gICAgaWYgKCFmdW5jKSB7XG4gICAgICB2YXIgaXNTdHJpbmcgPSBfaXNTdHJpbmcoc3RhcnQpLFxuICAgICAgICAgIG1hc3RlciA9IHt9LFxuICAgICAgICAgIHAsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBpbnRlcnBvbGF0b3JzLFxuICAgICAgICAgIGwsXG4gICAgICAgICAgaWw7XG5cbiAgICAgIHByb2dyZXNzID09PSB0cnVlICYmIChtdXRhdGUgPSAxKSAmJiAocHJvZ3Jlc3MgPSBudWxsKTtcblxuICAgICAgaWYgKGlzU3RyaW5nKSB7XG4gICAgICAgIHN0YXJ0ID0ge1xuICAgICAgICAgIHA6IHN0YXJ0XG4gICAgICAgIH07XG4gICAgICAgIGVuZCA9IHtcbiAgICAgICAgICBwOiBlbmRcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoX2lzQXJyYXkoc3RhcnQpICYmICFfaXNBcnJheShlbmQpKSB7XG4gICAgICAgIGludGVycG9sYXRvcnMgPSBbXTtcbiAgICAgICAgbCA9IHN0YXJ0Lmxlbmd0aDtcbiAgICAgICAgaWwgPSBsIC0gMjtcblxuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaW50ZXJwb2xhdG9ycy5wdXNoKGludGVycG9sYXRlKHN0YXJ0W2kgLSAxXSwgc3RhcnRbaV0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGwtLTtcblxuICAgICAgICBmdW5jID0gZnVuY3Rpb24gZnVuYyhwKSB7XG4gICAgICAgICAgcCAqPSBsO1xuICAgICAgICAgIHZhciBpID0gTWF0aC5taW4oaWwsIH5+cCk7XG4gICAgICAgICAgcmV0dXJuIGludGVycG9sYXRvcnNbaV0ocCAtIGkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHByb2dyZXNzID0gZW5kO1xuICAgICAgfSBlbHNlIGlmICghbXV0YXRlKSB7XG4gICAgICAgIHN0YXJ0ID0gX21lcmdlKF9pc0FycmF5KHN0YXJ0KSA/IFtdIDoge30sIHN0YXJ0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpbnRlcnBvbGF0b3JzKSB7XG4gICAgICAgIGZvciAocCBpbiBlbmQpIHtcbiAgICAgICAgICBfYWRkUHJvcFR3ZWVuLmNhbGwobWFzdGVyLCBzdGFydCwgcCwgXCJnZXRcIiwgZW5kW3BdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmMgPSBmdW5jdGlvbiBmdW5jKHApIHtcbiAgICAgICAgICByZXR1cm4gX3JlbmRlclByb3BUd2VlbnMocCwgbWFzdGVyKSB8fCAoaXNTdHJpbmcgPyBzdGFydC5wIDogc3RhcnQpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfY29uZGl0aW9uYWxSZXR1cm4ocHJvZ3Jlc3MsIGZ1bmMpO1xuICB9LFxuICAgICAgX2dldExhYmVsSW5EaXJlY3Rpb24gPSBmdW5jdGlvbiBfZ2V0TGFiZWxJbkRpcmVjdGlvbih0aW1lbGluZSwgZnJvbVRpbWUsIGJhY2t3YXJkKSB7XG4gICAgdmFyIGxhYmVscyA9IHRpbWVsaW5lLmxhYmVscyxcbiAgICAgICAgbWluID0gX2JpZ051bSxcbiAgICAgICAgcCxcbiAgICAgICAgZGlzdGFuY2UsXG4gICAgICAgIGxhYmVsO1xuXG4gICAgZm9yIChwIGluIGxhYmVscykge1xuICAgICAgZGlzdGFuY2UgPSBsYWJlbHNbcF0gLSBmcm9tVGltZTtcblxuICAgICAgaWYgKGRpc3RhbmNlIDwgMCA9PT0gISFiYWNrd2FyZCAmJiBkaXN0YW5jZSAmJiBtaW4gPiAoZGlzdGFuY2UgPSBNYXRoLmFicyhkaXN0YW5jZSkpKSB7XG4gICAgICAgIGxhYmVsID0gcDtcbiAgICAgICAgbWluID0gZGlzdGFuY2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhYmVsO1xuICB9LFxuICAgICAgX2NhbGxiYWNrID0gZnVuY3Rpb24gX2NhbGxiYWNrKGFuaW1hdGlvbiwgdHlwZSwgZXhlY3V0ZUxhenlGaXJzdCkge1xuICAgIHZhciB2ID0gYW5pbWF0aW9uLnZhcnMsXG4gICAgICAgIGNhbGxiYWNrID0gdlt0eXBlXSxcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICBzY29wZTtcblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwYXJhbXMgPSB2W3R5cGUgKyBcIlBhcmFtc1wiXTtcbiAgICBzY29wZSA9IHYuY2FsbGJhY2tTY29wZSB8fCBhbmltYXRpb247XG5cbiAgICBpZiAoZXhlY3V0ZUxhenlGaXJzdCAmJiBfbGF6eVR3ZWVucy5sZW5ndGgpIHtcbiAgICAgIF9sYXp5UmVuZGVyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtcyA/IGNhbGxiYWNrLmFwcGx5KHNjb3BlLCBwYXJhbXMpIDogY2FsbGJhY2suY2FsbChzY29wZSk7XG4gIH0sXG4gICAgICBfaW50ZXJydXB0ID0gZnVuY3Rpb24gX2ludGVycnVwdChhbmltYXRpb24pIHtcbiAgICBfcmVtb3ZlRnJvbVBhcmVudChhbmltYXRpb24pO1xuXG4gICAgaWYgKGFuaW1hdGlvbi5wcm9ncmVzcygpIDwgMSkge1xuICAgICAgX2NhbGxiYWNrKGFuaW1hdGlvbiwgXCJvbkludGVycnVwdFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYW5pbWF0aW9uO1xuICB9LFxuICAgICAgX3F1aWNrVHdlZW4sXG4gICAgICBfY3JlYXRlUGx1Z2luID0gZnVuY3Rpb24gX2NyZWF0ZVBsdWdpbihjb25maWcpIHtcbiAgICBjb25maWcgPSAhY29uZmlnLm5hbWUgJiYgY29uZmlnW1wiZGVmYXVsdFwiXSB8fCBjb25maWc7XG5cbiAgICB2YXIgbmFtZSA9IGNvbmZpZy5uYW1lLFxuICAgICAgICBpc0Z1bmMgPSBfaXNGdW5jdGlvbihjb25maWcpLFxuICAgICAgICBQbHVnaW4gPSBuYW1lICYmICFpc0Z1bmMgJiYgY29uZmlnLmluaXQgPyBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9wcm9wcyA9IFtdO1xuICAgIH0gOiBjb25maWcsXG4gICAgICAgIGluc3RhbmNlRGVmYXVsdHMgPSB7XG4gICAgICBpbml0OiBfZW1wdHlGdW5jLFxuICAgICAgcmVuZGVyOiBfcmVuZGVyUHJvcFR3ZWVucyxcbiAgICAgIGFkZDogX2FkZFByb3BUd2VlbixcbiAgICAgIGtpbGw6IF9raWxsUHJvcFR3ZWVuc09mLFxuICAgICAgbW9kaWZpZXI6IF9hZGRQbHVnaW5Nb2RpZmllcixcbiAgICAgIHJhd1ZhcnM6IDBcbiAgICB9LFxuICAgICAgICBzdGF0aWNzID0ge1xuICAgICAgdGFyZ2V0VGVzdDogMCxcbiAgICAgIGdldDogMCxcbiAgICAgIGdldFNldHRlcjogX2dldFNldHRlcixcbiAgICAgIGFsaWFzZXM6IHt9LFxuICAgICAgcmVnaXN0ZXI6IDBcbiAgICB9O1xuXG4gICAgX3dha2UoKTtcblxuICAgIGlmIChjb25maWcgIT09IFBsdWdpbikge1xuICAgICAgaWYgKF9wbHVnaW5zW25hbWVdKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3NldERlZmF1bHRzKFBsdWdpbiwgX3NldERlZmF1bHRzKF9jb3B5RXhjbHVkaW5nKGNvbmZpZywgaW5zdGFuY2VEZWZhdWx0cyksIHN0YXRpY3MpKTtcblxuICAgICAgX21lcmdlKFBsdWdpbi5wcm90b3R5cGUsIF9tZXJnZShpbnN0YW5jZURlZmF1bHRzLCBfY29weUV4Y2x1ZGluZyhjb25maWcsIHN0YXRpY3MpKSk7XG5cbiAgICAgIF9wbHVnaW5zW1BsdWdpbi5wcm9wID0gbmFtZV0gPSBQbHVnaW47XG5cbiAgICAgIGlmIChjb25maWcudGFyZ2V0VGVzdCkge1xuICAgICAgICBfaGFybmVzc1BsdWdpbnMucHVzaChQbHVnaW4pO1xuXG4gICAgICAgIF9yZXNlcnZlZFByb3BzW25hbWVdID0gMTtcbiAgICAgIH1cblxuICAgICAgbmFtZSA9IChuYW1lID09PSBcImNzc1wiID8gXCJDU1NcIiA6IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cigxKSkgKyBcIlBsdWdpblwiO1xuICAgIH1cblxuICAgIF9hZGRHbG9iYWwobmFtZSwgUGx1Z2luKTtcblxuICAgIGlmIChjb25maWcucmVnaXN0ZXIpIHtcbiAgICAgIGNvbmZpZy5yZWdpc3Rlcihnc2FwLCBQbHVnaW4sIFByb3BUd2Vlbik7XG4gICAgfVxuICB9LFxuICAgICAgXzI1NSA9IDI1NSxcbiAgICAgIF9jb2xvckxvb2t1cCA9IHtcbiAgICBhcXVhOiBbMCwgXzI1NSwgXzI1NV0sXG4gICAgbGltZTogWzAsIF8yNTUsIDBdLFxuICAgIHNpbHZlcjogWzE5MiwgMTkyLCAxOTJdLFxuICAgIGJsYWNrOiBbMCwgMCwgMF0sXG4gICAgbWFyb29uOiBbMTI4LCAwLCAwXSxcbiAgICB0ZWFsOiBbMCwgMTI4LCAxMjhdLFxuICAgIGJsdWU6IFswLCAwLCBfMjU1XSxcbiAgICBuYXZ5OiBbMCwgMCwgMTI4XSxcbiAgICB3aGl0ZTogW18yNTUsIF8yNTUsIF8yNTVdLFxuICAgIG9saXZlOiBbMTI4LCAxMjgsIDBdLFxuICAgIHllbGxvdzogW18yNTUsIF8yNTUsIDBdLFxuICAgIG9yYW5nZTogW18yNTUsIDE2NSwgMF0sXG4gICAgZ3JheTogWzEyOCwgMTI4LCAxMjhdLFxuICAgIHB1cnBsZTogWzEyOCwgMCwgMTI4XSxcbiAgICBncmVlbjogWzAsIDEyOCwgMF0sXG4gICAgcmVkOiBbXzI1NSwgMCwgMF0sXG4gICAgcGluazogW18yNTUsIDE5MiwgMjAzXSxcbiAgICBjeWFuOiBbMCwgXzI1NSwgXzI1NV0sXG4gICAgdHJhbnNwYXJlbnQ6IFtfMjU1LCBfMjU1LCBfMjU1LCAwXVxuICB9LFxuICAgICAgX2h1ZSA9IGZ1bmN0aW9uIF9odWUoaCwgbTEsIG0yKSB7XG4gICAgaCA9IGggPCAwID8gaCArIDEgOiBoID4gMSA/IGggLSAxIDogaDtcbiAgICByZXR1cm4gKGggKiA2IDwgMSA/IG0xICsgKG0yIC0gbTEpICogaCAqIDYgOiBoIDwgLjUgPyBtMiA6IGggKiAzIDwgMiA/IG0xICsgKG0yIC0gbTEpICogKDIgLyAzIC0gaCkgKiA2IDogbTEpICogXzI1NSArIC41IHwgMDtcbiAgfSxcbiAgICAgIHNwbGl0Q29sb3IgPSBmdW5jdGlvbiBzcGxpdENvbG9yKHYsIHRvSFNMKSB7XG4gICAgdmFyIGEgPSAhdiA/IF9jb2xvckxvb2t1cC5ibGFjayA6IF9pc051bWJlcih2KSA/IFt2ID4+IDE2LCB2ID4+IDggJiBfMjU1LCB2ICYgXzI1NV0gOiAwLFxuICAgICAgICByLFxuICAgICAgICBnLFxuICAgICAgICBiLFxuICAgICAgICBoLFxuICAgICAgICBzLFxuICAgICAgICBsLFxuICAgICAgICBtYXgsXG4gICAgICAgIG1pbixcbiAgICAgICAgZCxcbiAgICAgICAgd2FzSFNMO1xuXG4gICAgaWYgKCFhKSB7XG4gICAgICBpZiAodi5zdWJzdHIoLTEpID09PSBcIixcIikge1xuICAgICAgICB2ID0gdi5zdWJzdHIoMCwgdi5sZW5ndGggLSAxKTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9jb2xvckxvb2t1cFt2XSkge1xuICAgICAgICBhID0gX2NvbG9yTG9va3VwW3ZdO1xuICAgICAgfSBlbHNlIGlmICh2LmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgaWYgKHYubGVuZ3RoID09PSA0KSB7XG4gICAgICAgICAgciA9IHYuY2hhckF0KDEpO1xuICAgICAgICAgIGcgPSB2LmNoYXJBdCgyKTtcbiAgICAgICAgICBiID0gdi5jaGFyQXQoMyk7XG4gICAgICAgICAgdiA9IFwiI1wiICsgciArIHIgKyBnICsgZyArIGIgKyBiO1xuICAgICAgICB9XG5cbiAgICAgICAgdiA9IHBhcnNlSW50KHYuc3Vic3RyKDEpLCAxNik7XG4gICAgICAgIGEgPSBbdiA+PiAxNiwgdiA+PiA4ICYgXzI1NSwgdiAmIF8yNTVdO1xuICAgICAgfSBlbHNlIGlmICh2LnN1YnN0cigwLCAzKSA9PT0gXCJoc2xcIikge1xuICAgICAgICBhID0gd2FzSFNMID0gdi5tYXRjaChfc3RyaWN0TnVtRXhwKTtcblxuICAgICAgICBpZiAoIXRvSFNMKSB7XG4gICAgICAgICAgaCA9ICthWzBdICUgMzYwIC8gMzYwO1xuICAgICAgICAgIHMgPSArYVsxXSAvIDEwMDtcbiAgICAgICAgICBsID0gK2FbMl0gLyAxMDA7XG4gICAgICAgICAgZyA9IGwgPD0gLjUgPyBsICogKHMgKyAxKSA6IGwgKyBzIC0gbCAqIHM7XG4gICAgICAgICAgciA9IGwgKiAyIC0gZztcblxuICAgICAgICAgIGlmIChhLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIGFbM10gKj0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhWzBdID0gX2h1ZShoICsgMSAvIDMsIHIsIGcpO1xuICAgICAgICAgIGFbMV0gPSBfaHVlKGgsIHIsIGcpO1xuICAgICAgICAgIGFbMl0gPSBfaHVlKGggLSAxIC8gMywgciwgZyk7XG4gICAgICAgIH0gZWxzZSBpZiAofnYuaW5kZXhPZihcIj1cIikpIHtcbiAgICAgICAgICByZXR1cm4gdi5tYXRjaChfbnVtRXhwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYSA9IHYubWF0Y2goX3N0cmljdE51bUV4cCkgfHwgX2NvbG9yTG9va3VwLnRyYW5zcGFyZW50O1xuICAgICAgfVxuXG4gICAgICBhID0gYS5tYXAoTnVtYmVyKTtcbiAgICB9XG5cbiAgICBpZiAodG9IU0wgJiYgIXdhc0hTTCkge1xuICAgICAgciA9IGFbMF0gLyBfMjU1O1xuICAgICAgZyA9IGFbMV0gLyBfMjU1O1xuICAgICAgYiA9IGFbMl0gLyBfMjU1O1xuICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICAgIGwgPSAobWF4ICsgbWluKSAvIDI7XG5cbiAgICAgIGlmIChtYXggPT09IG1pbikge1xuICAgICAgICBoID0gcyA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkID0gbWF4IC0gbWluO1xuICAgICAgICBzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG4gICAgICAgIGggPSBtYXggPT09IHIgPyAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKSA6IG1heCA9PT0gZyA/IChiIC0gcikgLyBkICsgMiA6IChyIC0gZykgLyBkICsgNDtcbiAgICAgICAgaCAqPSA2MDtcbiAgICAgIH1cblxuICAgICAgYVswXSA9IGggKyAuNSB8IDA7XG4gICAgICBhWzFdID0gcyAqIDEwMCArIC41IHwgMDtcbiAgICAgIGFbMl0gPSBsICogMTAwICsgLjUgfCAwO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9LFxuICAgICAgX2Zvcm1hdENvbG9ycyA9IGZ1bmN0aW9uIF9mb3JtYXRDb2xvcnMocywgdG9IU0wpIHtcbiAgICB2YXIgY29sb3JzID0gKHMgKyBcIlwiKS5tYXRjaChfY29sb3JFeHApLFxuICAgICAgICBjaGFySW5kZXggPSAwLFxuICAgICAgICBwYXJzZWQgPSBcIlwiLFxuICAgICAgICBpLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgdGVtcDtcblxuICAgIGlmICghY29sb3JzKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29sb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb2xvciA9IGNvbG9yc1tpXTtcbiAgICAgIHRlbXAgPSBzLnN1YnN0cihjaGFySW5kZXgsIHMuaW5kZXhPZihjb2xvciwgY2hhckluZGV4KSAtIGNoYXJJbmRleCk7XG4gICAgICBjaGFySW5kZXggKz0gdGVtcC5sZW5ndGggKyBjb2xvci5sZW5ndGg7XG4gICAgICBjb2xvciA9IHNwbGl0Q29sb3IoY29sb3IsIHRvSFNMKTtcblxuICAgICAgaWYgKGNvbG9yLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBjb2xvci5wdXNoKDEpO1xuICAgICAgfVxuXG4gICAgICBwYXJzZWQgKz0gdGVtcCArICh0b0hTTCA/IFwiaHNsYShcIiArIGNvbG9yWzBdICsgXCIsXCIgKyBjb2xvclsxXSArIFwiJSxcIiArIGNvbG9yWzJdICsgXCIlLFwiICsgY29sb3JbM10gOiBcInJnYmEoXCIgKyBjb2xvci5qb2luKFwiLFwiKSkgKyBcIilcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkICsgcy5zdWJzdHIoY2hhckluZGV4KTtcbiAgfSxcbiAgICAgIF9jb2xvckV4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcyA9IFwiKD86XFxcXGIoPzooPzpyZ2J8cmdiYXxoc2x8aHNsYSlcXFxcKC4rP1xcXFwpKXxcXFxcQiMoPzpbMC05YS1mXXszfSl7MSwyfVxcXFxiXCIsXG4gICAgICAgIHA7XG5cbiAgICBmb3IgKHAgaW4gX2NvbG9yTG9va3VwKSB7XG4gICAgICBzICs9IFwifFwiICsgcCArIFwiXFxcXGJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChzICsgXCIpXCIsIFwiZ2lcIik7XG4gIH0oKSxcbiAgICAgIF9oc2xFeHAgPSAvaHNsW2FdP1xcKC8sXG4gICAgICBfY29sb3JTdHJpbmdGaWx0ZXIgPSBmdW5jdGlvbiBfY29sb3JTdHJpbmdGaWx0ZXIoYSkge1xuICAgIHZhciBjb21iaW5lZCA9IGEuam9pbihcIiBcIiksXG4gICAgICAgIHRvSFNMO1xuICAgIF9jb2xvckV4cC5sYXN0SW5kZXggPSAwO1xuXG4gICAgaWYgKF9jb2xvckV4cC50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgdG9IU0wgPSBfaHNsRXhwLnRlc3QoY29tYmluZWQpO1xuICAgICAgYVswXSA9IF9mb3JtYXRDb2xvcnMoYVswXSwgdG9IU0wpO1xuICAgICAgYVsxXSA9IF9mb3JtYXRDb2xvcnMoYVsxXSwgdG9IU0wpO1xuICAgIH1cbiAgfSxcbiAgICAgIF90aWNrZXJBY3RpdmUsXG4gICAgICBfdGlja2VyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfZ2V0VGltZSA9IERhdGUubm93LFxuICAgICAgICBfbGFnVGhyZXNob2xkID0gNTAwLFxuICAgICAgICBfYWRqdXN0ZWRMYWcgPSAzMyxcbiAgICAgICAgX3N0YXJ0VGltZSA9IF9nZXRUaW1lKCksXG4gICAgICAgIF9sYXN0VXBkYXRlID0gX3N0YXJ0VGltZSxcbiAgICAgICAgX2dhcCA9IDEgLyA2MCxcbiAgICAgICAgX25leHRUaW1lID0gX2dhcCxcbiAgICAgICAgX2xpc3RlbmVycyA9IFtdLFxuICAgICAgICBfaWQsXG4gICAgICAgIF9yZXEsXG4gICAgICAgIF9yYWYsXG4gICAgICAgIF9zZWxmLFxuICAgICAgICBfdGljayA9IGZ1bmN0aW9uIF90aWNrKHYpIHtcbiAgICAgIHZhciBlbGFwc2VkID0gX2dldFRpbWUoKSAtIF9sYXN0VXBkYXRlLFxuICAgICAgICAgIG1hbnVhbCA9IHYgPT09IHRydWUsXG4gICAgICAgICAgb3ZlcmxhcCxcbiAgICAgICAgICBkaXNwYXRjaDtcblxuICAgICAgaWYgKGVsYXBzZWQgPiBfbGFnVGhyZXNob2xkKSB7XG4gICAgICAgIF9zdGFydFRpbWUgKz0gZWxhcHNlZCAtIF9hZGp1c3RlZExhZztcbiAgICAgIH1cblxuICAgICAgX2xhc3RVcGRhdGUgKz0gZWxhcHNlZDtcbiAgICAgIF9zZWxmLnRpbWUgPSAoX2xhc3RVcGRhdGUgLSBfc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICBvdmVybGFwID0gX3NlbGYudGltZSAtIF9uZXh0VGltZTtcblxuICAgICAgaWYgKG92ZXJsYXAgPiAwIHx8IG1hbnVhbCkge1xuICAgICAgICBfc2VsZi5mcmFtZSsrO1xuICAgICAgICBfbmV4dFRpbWUgKz0gb3ZlcmxhcCArIChvdmVybGFwID49IF9nYXAgPyAwLjAwNCA6IF9nYXAgLSBvdmVybGFwKTtcbiAgICAgICAgZGlzcGF0Y2ggPSAxO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW1hbnVhbCkge1xuICAgICAgICBfaWQgPSBfcmVxKF90aWNrKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpc3BhdGNoKSB7XG4gICAgICAgIF9saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobCkge1xuICAgICAgICAgIHJldHVybiBsKF9zZWxmLnRpbWUsIGVsYXBzZWQsIF9zZWxmLmZyYW1lLCB2KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9zZWxmID0ge1xuICAgICAgdGltZTogMCxcbiAgICAgIGZyYW1lOiAwLFxuICAgICAgdGljazogZnVuY3Rpb24gdGljaygpIHtcbiAgICAgICAgX3RpY2sodHJ1ZSk7XG4gICAgICB9LFxuICAgICAgd2FrZTogZnVuY3Rpb24gd2FrZSgpIHtcbiAgICAgICAgaWYgKF9jb3JlUmVhZHkpIHtcbiAgICAgICAgICBpZiAoIV9jb3JlSW5pdHRlZCAmJiBfd2luZG93RXhpc3RzKCkpIHtcbiAgICAgICAgICAgIF93aW4gPSBfY29yZUluaXR0ZWQgPSB3aW5kb3c7XG4gICAgICAgICAgICBfZG9jID0gX3dpbi5kb2N1bWVudCB8fCB7fTtcbiAgICAgICAgICAgIF9nbG9iYWxzLmdzYXAgPSBnc2FwO1xuICAgICAgICAgICAgKF93aW4uZ3NhcFZlcnNpb25zIHx8IChfd2luLmdzYXBWZXJzaW9ucyA9IFtdKSkucHVzaChnc2FwLnZlcnNpb24pO1xuXG4gICAgICAgICAgICBfaW5zdGFsbChfaW5zdGFsbFNjb3BlIHx8IF93aW4uR3JlZW5Tb2NrR2xvYmFscyB8fCAhX3dpbi5nc2FwICYmIF93aW4gfHwge30pO1xuXG4gICAgICAgICAgICBfcmFmID0gX3dpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX2lkICYmIF9zZWxmLnNsZWVwKCk7XG5cbiAgICAgICAgICBfcmVxID0gX3JhZiB8fCBmdW5jdGlvbiAoZikge1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZiwgKF9uZXh0VGltZSAtIF9zZWxmLnRpbWUpICogMTAwMCArIDEgfCAwKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgX3RpY2tlckFjdGl2ZSA9IDE7XG5cbiAgICAgICAgICBfdGljaygyKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNsZWVwOiBmdW5jdGlvbiBzbGVlcCgpIHtcbiAgICAgICAgKF9yYWYgPyBfd2luLmNhbmNlbEFuaW1hdGlvbkZyYW1lIDogY2xlYXJUaW1lb3V0KShfaWQpO1xuICAgICAgICBfdGlja2VyQWN0aXZlID0gMDtcbiAgICAgICAgX3JlcSA9IF9lbXB0eUZ1bmM7XG4gICAgICB9LFxuICAgICAgbGFnU21vb3RoaW5nOiBmdW5jdGlvbiBsYWdTbW9vdGhpbmcodGhyZXNob2xkLCBhZGp1c3RlZExhZykge1xuICAgICAgICBfbGFnVGhyZXNob2xkID0gdGhyZXNob2xkIHx8IDEgLyBfdGlueU51bTtcbiAgICAgICAgX2FkanVzdGVkTGFnID0gTWF0aC5taW4oYWRqdXN0ZWRMYWcsIF9sYWdUaHJlc2hvbGQsIDApO1xuICAgICAgfSxcbiAgICAgIGZwczogZnVuY3Rpb24gZnBzKF9mcHMpIHtcbiAgICAgICAgX2dhcCA9IDEgLyAoX2ZwcyB8fCA2MCk7XG4gICAgICAgIF9uZXh0VGltZSA9IF9zZWxmLnRpbWUgKyBfZ2FwO1xuICAgICAgfSxcbiAgICAgIGFkZDogZnVuY3Rpb24gYWRkKGNhbGxiYWNrKSB7XG4gICAgICAgIF9saXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykgPCAwICYmIF9saXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG5cbiAgICAgICAgX3dha2UoKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShjYWxsYmFjaykge1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgfihpID0gX2xpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgJiYgX2xpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9LFxuICAgICAgX2xpc3RlbmVyczogX2xpc3RlbmVyc1xuICAgIH07XG4gICAgcmV0dXJuIF9zZWxmO1xuICB9KCksXG4gICAgICBfd2FrZSA9IGZ1bmN0aW9uIF93YWtlKCkge1xuICAgIHJldHVybiAhX3RpY2tlckFjdGl2ZSAmJiBfdGlja2VyLndha2UoKTtcbiAgfSxcbiAgICAgIF9lYXNlTWFwID0ge30sXG4gICAgICBfY3VzdG9tRWFzZUV4cCA9IC9eW1xcZC5cXC1NXVtcXGQuXFwtLFxcc10vLFxuICAgICAgX3F1b3Rlc0V4cCA9IC9bXCInXS9nLFxuICAgICAgX3BhcnNlT2JqZWN0SW5TdHJpbmcgPSBmdW5jdGlvbiBfcGFyc2VPYmplY3RJblN0cmluZyh2YWx1ZSkge1xuICAgIHZhciBvYmogPSB7fSxcbiAgICAgICAgc3BsaXQgPSB2YWx1ZS5zdWJzdHIoMSwgdmFsdWUubGVuZ3RoIC0gMykuc3BsaXQoXCI6XCIpLFxuICAgICAgICBrZXkgPSBzcGxpdFswXSxcbiAgICAgICAgaSA9IDEsXG4gICAgICAgIGwgPSBzcGxpdC5sZW5ndGgsXG4gICAgICAgIGluZGV4LFxuICAgICAgICB2YWwsXG4gICAgICAgIHBhcnNlZFZhbDtcblxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YWwgPSBzcGxpdFtpXTtcbiAgICAgIGluZGV4ID0gaSAhPT0gbCAtIDEgPyB2YWwubGFzdEluZGV4T2YoXCIsXCIpIDogdmFsLmxlbmd0aDtcbiAgICAgIHBhcnNlZFZhbCA9IHZhbC5zdWJzdHIoMCwgaW5kZXgpO1xuICAgICAgb2JqW2tleV0gPSBpc05hTihwYXJzZWRWYWwpID8gcGFyc2VkVmFsLnJlcGxhY2UoX3F1b3Rlc0V4cCwgXCJcIikudHJpbSgpIDogK3BhcnNlZFZhbDtcbiAgICAgIGtleSA9IHZhbC5zdWJzdHIoaW5kZXggKyAxKS50cmltKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfSxcbiAgICAgIF9jb25maWdFYXNlRnJvbVN0cmluZyA9IGZ1bmN0aW9uIF9jb25maWdFYXNlRnJvbVN0cmluZyhuYW1lKSB7XG4gICAgdmFyIHNwbGl0ID0gKG5hbWUgKyBcIlwiKS5zcGxpdChcIihcIiksXG4gICAgICAgIGVhc2UgPSBfZWFzZU1hcFtzcGxpdFswXV07XG4gICAgcmV0dXJuIGVhc2UgJiYgc3BsaXQubGVuZ3RoID4gMSAmJiBlYXNlLmNvbmZpZyA/IGVhc2UuY29uZmlnLmFwcGx5KG51bGwsIH5uYW1lLmluZGV4T2YoXCJ7XCIpID8gW19wYXJzZU9iamVjdEluU3RyaW5nKHNwbGl0WzFdKV0gOiBfcGFyZW50aGVzZXNFeHAuZXhlYyhuYW1lKVsxXS5zcGxpdChcIixcIikubWFwKF9udW1lcmljSWZQb3NzaWJsZSkpIDogX2Vhc2VNYXAuX0NFICYmIF9jdXN0b21FYXNlRXhwLnRlc3QobmFtZSkgPyBfZWFzZU1hcC5fQ0UoXCJcIiwgbmFtZSkgOiBlYXNlO1xuICB9LFxuICAgICAgX2ludmVydEVhc2UgPSBmdW5jdGlvbiBfaW52ZXJ0RWFzZShlYXNlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gMSAtIGVhc2UoMSAtIHApO1xuICAgIH07XG4gIH0sXG4gICAgICBfcGFyc2VFYXNlID0gZnVuY3Rpb24gX3BhcnNlRWFzZShlYXNlLCBkZWZhdWx0RWFzZSkge1xuICAgIHJldHVybiAhZWFzZSA/IGRlZmF1bHRFYXNlIDogKF9pc0Z1bmN0aW9uKGVhc2UpID8gZWFzZSA6IF9lYXNlTWFwW2Vhc2VdIHx8IF9jb25maWdFYXNlRnJvbVN0cmluZyhlYXNlKSkgfHwgZGVmYXVsdEVhc2U7XG4gIH0sXG4gICAgICBfaW5zZXJ0RWFzZSA9IGZ1bmN0aW9uIF9pbnNlcnRFYXNlKG5hbWVzLCBlYXNlSW4sIGVhc2VPdXQsIGVhc2VJbk91dCkge1xuICAgIGlmIChlYXNlT3V0ID09PSB2b2lkIDApIHtcbiAgICAgIGVhc2VPdXQgPSBmdW5jdGlvbiBlYXNlT3V0KHApIHtcbiAgICAgICAgcmV0dXJuIDEgLSBlYXNlSW4oMSAtIHApO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoZWFzZUluT3V0ID09PSB2b2lkIDApIHtcbiAgICAgIGVhc2VJbk91dCA9IGZ1bmN0aW9uIGVhc2VJbk91dChwKSB7XG4gICAgICAgIHJldHVybiBwIDwgLjUgPyBlYXNlSW4ocCAqIDIpIC8gMiA6IDEgLSBlYXNlSW4oKDEgLSBwKSAqIDIpIC8gMjtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGVhc2UgPSB7XG4gICAgICBlYXNlSW46IGVhc2VJbixcbiAgICAgIGVhc2VPdXQ6IGVhc2VPdXQsXG4gICAgICBlYXNlSW5PdXQ6IGVhc2VJbk91dFxuICAgIH0sXG4gICAgICAgIGxvd2VyY2FzZU5hbWU7XG5cbiAgICBfZm9yRWFjaE5hbWUobmFtZXMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBfZWFzZU1hcFtuYW1lXSA9IF9nbG9iYWxzW25hbWVdID0gZWFzZTtcbiAgICAgIF9lYXNlTWFwW2xvd2VyY2FzZU5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCldID0gZWFzZU91dDtcblxuICAgICAgZm9yICh2YXIgcCBpbiBlYXNlKSB7XG4gICAgICAgIF9lYXNlTWFwW2xvd2VyY2FzZU5hbWUgKyAocCA9PT0gXCJlYXNlSW5cIiA/IFwiLmluXCIgOiBwID09PSBcImVhc2VPdXRcIiA/IFwiLm91dFwiIDogXCIuaW5PdXRcIildID0gX2Vhc2VNYXBbbmFtZSArIFwiLlwiICsgcF0gPSBlYXNlW3BdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVhc2U7XG4gIH0sXG4gICAgICBfZWFzZUluT3V0RnJvbU91dCA9IGZ1bmN0aW9uIF9lYXNlSW5PdXRGcm9tT3V0KGVhc2VPdXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwIDwgLjUgPyAoMSAtIGVhc2VPdXQoMSAtIHAgKiAyKSkgLyAyIDogLjUgKyBlYXNlT3V0KChwIC0gLjUpICogMikgLyAyO1xuICAgIH07XG4gIH0sXG4gICAgICBfY29uZmlnRWxhc3RpYyA9IGZ1bmN0aW9uIF9jb25maWdFbGFzdGljKHR5cGUsIGFtcGxpdHVkZSwgcGVyaW9kKSB7XG4gICAgdmFyIHAxID0gYW1wbGl0dWRlID49IDEgPyBhbXBsaXR1ZGUgOiAxLFxuICAgICAgICBwMiA9IChwZXJpb2QgfHwgKHR5cGUgPyAuMyA6IC40NSkpIC8gKGFtcGxpdHVkZSA8IDEgPyBhbXBsaXR1ZGUgOiAxKSxcbiAgICAgICAgcDMgPSBwMiAvIF8yUEkgKiAoTWF0aC5hc2luKDEgLyBwMSkgfHwgMCksXG4gICAgICAgIGVhc2VPdXQgPSBmdW5jdGlvbiBlYXNlT3V0KHApIHtcbiAgICAgIHJldHVybiBwID09PSAxID8gMSA6IHAxICogTWF0aC5wb3coMiwgLTEwICogcCkgKiBfc2luKChwIC0gcDMpICogcDIpICsgMTtcbiAgICB9LFxuICAgICAgICBlYXNlID0gdHlwZSA9PT0gXCJvdXRcIiA/IGVhc2VPdXQgOiB0eXBlID09PSBcImluXCIgPyBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIDEgLSBlYXNlT3V0KDEgLSBwKTtcbiAgICB9IDogX2Vhc2VJbk91dEZyb21PdXQoZWFzZU91dCk7XG5cbiAgICBwMiA9IF8yUEkgLyBwMjtcblxuICAgIGVhc2UuY29uZmlnID0gZnVuY3Rpb24gKGFtcGxpdHVkZSwgcGVyaW9kKSB7XG4gICAgICByZXR1cm4gX2NvbmZpZ0VsYXN0aWModHlwZSwgYW1wbGl0dWRlLCBwZXJpb2QpO1xuICAgIH07XG5cbiAgICByZXR1cm4gZWFzZTtcbiAgfSxcbiAgICAgIF9jb25maWdCYWNrID0gZnVuY3Rpb24gX2NvbmZpZ0JhY2sodHlwZSwgb3ZlcnNob290KSB7XG4gICAgaWYgKG92ZXJzaG9vdCA9PT0gdm9pZCAwKSB7XG4gICAgICBvdmVyc2hvb3QgPSAxLjcwMTU4O1xuICAgIH1cblxuICAgIHZhciBlYXNlT3V0ID0gZnVuY3Rpb24gZWFzZU91dChwKSB7XG4gICAgICByZXR1cm4gLS1wICogcCAqICgob3ZlcnNob290ICsgMSkgKiBwICsgb3ZlcnNob290KSArIDE7XG4gICAgfSxcbiAgICAgICAgZWFzZSA9IHR5cGUgPT09IFwib3V0XCIgPyBlYXNlT3V0IDogdHlwZSA9PT0gXCJpblwiID8gZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiAxIC0gZWFzZU91dCgxIC0gcCk7XG4gICAgfSA6IF9lYXNlSW5PdXRGcm9tT3V0KGVhc2VPdXQpO1xuXG4gICAgZWFzZS5jb25maWcgPSBmdW5jdGlvbiAob3ZlcnNob290KSB7XG4gICAgICByZXR1cm4gX2NvbmZpZ0JhY2sodHlwZSwgb3ZlcnNob290KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGVhc2U7XG4gIH07XG5cbiAgX2ZvckVhY2hOYW1lKFwiTGluZWFyLFF1YWQsQ3ViaWMsUXVhcnQsUXVpbnQsU3Ryb25nXCIsIGZ1bmN0aW9uIChuYW1lLCBpKSB7XG4gICAgdmFyIHBvd2VyID0gaSA8IDUgPyBpICsgMSA6IGk7XG5cbiAgICBfaW5zZXJ0RWFzZShuYW1lICsgXCIsUG93ZXJcIiArIChwb3dlciAtIDEpLCBpID8gZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwLCBwb3dlcik7XG4gICAgfSA6IGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcDtcbiAgICB9LCBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0gcCwgcG93ZXIpO1xuICAgIH0sIGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcCA8IC41ID8gTWF0aC5wb3cocCAqIDIsIHBvd2VyKSAvIDIgOiAxIC0gTWF0aC5wb3coKDEgLSBwKSAqIDIsIHBvd2VyKSAvIDI7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9lYXNlTWFwLkxpbmVhci5lYXNlTm9uZSA9IF9lYXNlTWFwLm5vbmUgPSBfZWFzZU1hcC5MaW5lYXIuZWFzZUluO1xuXG4gIF9pbnNlcnRFYXNlKFwiRWxhc3RpY1wiLCBfY29uZmlnRWxhc3RpYyhcImluXCIpLCBfY29uZmlnRWxhc3RpYyhcIm91dFwiKSwgX2NvbmZpZ0VsYXN0aWMoKSk7XG5cbiAgKGZ1bmN0aW9uIChuLCBjKSB7XG4gICAgdmFyIG4xID0gMSAvIGMsXG4gICAgICAgIG4yID0gMiAqIG4xLFxuICAgICAgICBuMyA9IDIuNSAqIG4xLFxuICAgICAgICBlYXNlT3V0ID0gZnVuY3Rpb24gZWFzZU91dChwKSB7XG4gICAgICByZXR1cm4gcCA8IG4xID8gbiAqIHAgKiBwIDogcCA8IG4yID8gbiAqIE1hdGgucG93KHAgLSAxLjUgLyBjLCAyKSArIC43NSA6IHAgPCBuMyA/IG4gKiAocCAtPSAyLjI1IC8gYykgKiBwICsgLjkzNzUgOiBuICogTWF0aC5wb3cocCAtIDIuNjI1IC8gYywgMikgKyAuOTg0Mzc1O1xuICAgIH07XG5cbiAgICBfaW5zZXJ0RWFzZShcIkJvdW5jZVwiLCBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIDEgLSBlYXNlT3V0KDEgLSBwKTtcbiAgICB9LCBlYXNlT3V0KTtcbiAgfSkoNy41NjI1LCAyLjc1KTtcblxuICBfaW5zZXJ0RWFzZShcIkV4cG9cIiwgZnVuY3Rpb24gKHApIHtcbiAgICByZXR1cm4gcCA/IE1hdGgucG93KDIsIDEwICogKHAgLSAxKSkgOiAwO1xuICB9KTtcblxuICBfaW5zZXJ0RWFzZShcIkNpcmNcIiwgZnVuY3Rpb24gKHApIHtcbiAgICByZXR1cm4gLShfc3FydCgxIC0gcCAqIHApIC0gMSk7XG4gIH0pO1xuXG4gIF9pbnNlcnRFYXNlKFwiU2luZVwiLCBmdW5jdGlvbiAocCkge1xuICAgIHJldHVybiAtX2NvcyhwICogX0hBTEZfUEkpICsgMTtcbiAgfSk7XG5cbiAgX2luc2VydEVhc2UoXCJCYWNrXCIsIF9jb25maWdCYWNrKFwiaW5cIiksIF9jb25maWdCYWNrKFwib3V0XCIpLCBfY29uZmlnQmFjaygpKTtcblxuICBfZWFzZU1hcC5TdGVwcGVkRWFzZSA9IF9lYXNlTWFwLnN0ZXBzID0gX2dsb2JhbHMuU3RlcHBlZEVhc2UgPSB7XG4gICAgY29uZmlnOiBmdW5jdGlvbiBjb25maWcoc3RlcHMsIGltbWVkaWF0ZVN0YXJ0KSB7XG4gICAgICBpZiAoc3RlcHMgPT09IHZvaWQgMCkge1xuICAgICAgICBzdGVwcyA9IDE7XG4gICAgICB9XG5cbiAgICAgIHZhciBwMSA9IDEgLyBzdGVwcyxcbiAgICAgICAgICBwMiA9IHN0ZXBzICsgKGltbWVkaWF0ZVN0YXJ0ID8gMCA6IDEpLFxuICAgICAgICAgIHAzID0gaW1tZWRpYXRlU3RhcnQgPyAxIDogMCxcbiAgICAgICAgICBtYXggPSAxIC0gX3RpbnlOdW07XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuICgocDIgKiBfY2xhbXAoMCwgbWF4LCBwKSB8IDApICsgcDMpICogcDE7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbiAgX2RlZmF1bHRzLmVhc2UgPSBfZWFzZU1hcFtcInF1YWQub3V0XCJdO1xuICB2YXIgR1NDYWNoZSA9IGZ1bmN0aW9uIEdTQ2FjaGUodGFyZ2V0LCBoYXJuZXNzKSB7XG4gICAgdGhpcy5pZCA9IF9nc0lEKys7XG4gICAgdGFyZ2V0Ll9nc2FwID0gdGhpcztcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLmhhcm5lc3MgPSBoYXJuZXNzO1xuICAgIHRoaXMuZ2V0ID0gaGFybmVzcyA/IGhhcm5lc3MuZ2V0IDogX2dldFByb3BlcnR5O1xuICAgIHRoaXMuc2V0ID0gaGFybmVzcyA/IGhhcm5lc3MuZ2V0U2V0dGVyIDogX2dldFNldHRlcjtcbiAgfTtcbiAgdmFyIEFuaW1hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBbmltYXRpb24odmFycywgdGltZSkge1xuICAgICAgdmFyIHBhcmVudCA9IHZhcnMucGFyZW50IHx8IF9nbG9iYWxUaW1lbGluZTtcbiAgICAgIHRoaXMudmFycyA9IHZhcnM7XG4gICAgICB0aGlzLl9kdXIgPSB0aGlzLl90RHVyID0gK3ZhcnMuZHVyYXRpb24gfHwgMDtcbiAgICAgIHRoaXMuX2RlbGF5ID0gK3ZhcnMuZGVsYXkgfHwgMDtcblxuICAgICAgaWYgKHRoaXMuX3JlcGVhdCA9IHZhcnMucmVwZWF0IHx8IDApIHtcbiAgICAgICAgdGhpcy5fckRlbGF5ID0gdmFycy5yZXBlYXREZWxheSB8fCAwO1xuICAgICAgICB0aGlzLl95b3lvID0gISF2YXJzLnlveW8gfHwgISF2YXJzLnlveW9FYXNlO1xuXG4gICAgICAgIF9vblVwZGF0ZVRvdGFsRHVyYXRpb24odGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RzID0gMTtcbiAgICAgIHRoaXMuZGF0YSA9IHZhcnMuZGF0YTtcblxuICAgICAgaWYgKCFfdGlja2VyQWN0aXZlKSB7XG4gICAgICAgIF90aWNrZXIud2FrZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIF9hZGRUb1RpbWVsaW5lKHBhcmVudCwgdGhpcywgdGltZSB8fCB0aW1lID09PSAwID8gdGltZSA6IHBhcmVudC5fdGltZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YXJzLnJldmVyc2VkKSB7XG4gICAgICAgIHRoaXMucmV2ZXJzZWQodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YXJzLnBhdXNlZCkge1xuICAgICAgICB0aGlzLnBhdXNlZCh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgX3Byb3RvID0gQW5pbWF0aW9uLnByb3RvdHlwZTtcblxuICAgIF9wcm90by5kZWxheSA9IGZ1bmN0aW9uIGRlbGF5KHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgfHwgdmFsdWUgPT09IDApIHtcbiAgICAgICAgdGhpcy5fZGVsYXkgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9kZWxheTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmR1cmF0aW9uID0gZnVuY3Rpb24gZHVyYXRpb24odmFsdWUpIHtcbiAgICAgIHZhciBpc1NldHRlciA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgICAgcmVwZWF0ID0gdGhpcy5fcmVwZWF0LFxuICAgICAgICAgIHJlcGVhdEN5Y2xlcyA9IHJlcGVhdCA+IDAgPyByZXBlYXQgKiAoKGlzU2V0dGVyID8gdmFsdWUgOiB0aGlzLl9kdXIpICsgdGhpcy5fckRlbGF5KSA6IDA7XG4gICAgICByZXR1cm4gaXNTZXR0ZXIgPyB0aGlzLnRvdGFsRHVyYXRpb24ocmVwZWF0IDwgMCA/IHZhbHVlIDogdmFsdWUgKyByZXBlYXRDeWNsZXMpIDogdGhpcy50b3RhbER1cmF0aW9uKCkgJiYgdGhpcy5fZHVyO1xuICAgIH07XG5cbiAgICBfcHJvdG8udG90YWxEdXJhdGlvbiA9IGZ1bmN0aW9uIHRvdGFsRHVyYXRpb24odmFsdWUpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdER1cjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcGVhdCA9IHRoaXMuX3JlcGVhdCxcbiAgICAgICAgICBpc0luZmluaXRlID0gKHZhbHVlIHx8IHRoaXMuX3JEZWxheSkgJiYgcmVwZWF0IDwgMDtcbiAgICAgIHRoaXMuX3REdXIgPSBpc0luZmluaXRlID8gMWUyMCA6IHZhbHVlO1xuICAgICAgdGhpcy5fZHVyID0gaXNJbmZpbml0ZSA/IHZhbHVlIDogKHZhbHVlIC0gcmVwZWF0ICogdGhpcy5fckRlbGF5KSAvIChyZXBlYXQgKyAxKTtcbiAgICAgIHRoaXMuX2RpcnR5ID0gMDtcblxuICAgICAgX3VuY2FjaGUodGhpcy5wYXJlbnQpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnRvdGFsVGltZSA9IGZ1bmN0aW9uIHRvdGFsVGltZShfdG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50cykge1xuICAgICAgX3dha2UoKTtcblxuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90VGltZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXMuX2RwLFxuICAgICAgICAgIHN0YXJ0O1xuXG4gICAgICBpZiAocGFyZW50ICYmIHBhcmVudC5zbW9vdGhDaGlsZFRpbWluZyAmJiB0aGlzLl90cykge1xuICAgICAgICBzdGFydCA9IHRoaXMuX3N0YXJ0O1xuICAgICAgICB0aGlzLl9zdGFydCA9IHBhcmVudC5fdGltZSAtICh0aGlzLl90cyA+IDAgPyBfdG90YWxUaW1lIC8gdGhpcy5fdHMgOiAoKHRoaXMuX2RpcnR5ID8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLl90RHVyKSAtIF90b3RhbFRpbWUpIC8gLXRoaXMuX3RzKTtcbiAgICAgICAgdGhpcy5fZW5kICs9IHRoaXMuX3N0YXJ0IC0gc3RhcnQ7XG5cbiAgICAgICAgaWYgKCFwYXJlbnQuX2RpcnR5KSB7XG4gICAgICAgICAgX3VuY2FjaGUocGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChwYXJlbnQucGFyZW50KSB7XG4gICAgICAgICAgaWYgKHBhcmVudC5wYXJlbnQuX3RpbWUgIT09IHBhcmVudC5fc3RhcnQgKyAocGFyZW50Ll90cyA+IDAgPyBwYXJlbnQuX3RUaW1lIC8gcGFyZW50Ll90cyA6IChwYXJlbnQudG90YWxEdXJhdGlvbigpIC0gcGFyZW50Ll90VGltZSkgLyAtcGFyZW50Ll90cykpIHtcbiAgICAgICAgICAgIHBhcmVudC50b3RhbFRpbWUocGFyZW50Ll90VGltZSwgdHJ1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICBfYWRkVG9UaW1lbGluZSh0aGlzLl9kcCwgdGhpcywgdGhpcy5fc3RhcnQgLSB0aGlzLl9kZWxheSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3RUaW1lICE9PSBfdG90YWxUaW1lIHx8ICF0aGlzLl9kdXIpIHtcbiAgICAgICAgdGhpcy5fdHMgfHwgKHRoaXMuX3BUaW1lID0gX3RvdGFsVGltZSk7XG5cbiAgICAgICAgX2xhenlTYWZlUmVuZGVyKHRoaXMsIF90b3RhbFRpbWUsIHN1cHByZXNzRXZlbnRzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90by50aW1lID0gZnVuY3Rpb24gdGltZSh2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gdGhpcy50b3RhbFRpbWUoKHZhbHVlICsgX2VsYXBzZWRDeWNsZUR1cmF0aW9uKHRoaXMpKSAlIHRoaXMuZHVyYXRpb24oKSB8fCAodmFsdWUgPyB0aGlzLl9kdXIgOiAwKSwgc3VwcHJlc3NFdmVudHMpIDogdGhpcy5fdGltZTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnRvdGFsUHJvZ3Jlc3MgPSBmdW5jdGlvbiB0b3RhbFByb2dyZXNzKHZhbHVlLCBzdXBwcmVzc0V2ZW50cykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnRvdGFsVGltZSh0aGlzLnRvdGFsRHVyYXRpb24oKSAqIHZhbHVlLCBzdXBwcmVzc0V2ZW50cykgOiB0aGlzLl90VGltZSAvIHRoaXMudG90YWxEdXJhdGlvbigpO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBwcm9ncmVzcyh2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gdGhpcy50b3RhbFRpbWUodGhpcy5kdXJhdGlvbigpICogKHRoaXMuX3lveW8gJiYgISh0aGlzLml0ZXJhdGlvbigpICYgMSkgPyAxIC0gdmFsdWUgOiB2YWx1ZSkgKyBfZWxhcHNlZEN5Y2xlRHVyYXRpb24odGhpcyksIHN1cHByZXNzRXZlbnRzKSA6IHRoaXMuZHVyYXRpb24oKSA/IHRoaXMuX3RpbWUgLyB0aGlzLl9kdXIgOiB0aGlzLnJhdGlvO1xuICAgIH07XG5cbiAgICBfcHJvdG8uaXRlcmF0aW9uID0gZnVuY3Rpb24gaXRlcmF0aW9uKHZhbHVlLCBzdXBwcmVzc0V2ZW50cykge1xuICAgICAgdmFyIGN5Y2xlRHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uKCkgKyB0aGlzLl9yRGVsYXk7XG5cbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gdGhpcy50b3RhbFRpbWUodGhpcy5fdGltZSArICh2YWx1ZSAtIDEpICogY3ljbGVEdXJhdGlvbiwgc3VwcHJlc3NFdmVudHMpIDogdGhpcy5fcmVwZWF0ID8gfn4odGhpcy5fdFRpbWUgLyBjeWNsZUR1cmF0aW9uKSArIDEgOiAxO1xuICAgIH07XG5cbiAgICBfcHJvdG8udGltZVNjYWxlID0gZnVuY3Rpb24gdGltZVNjYWxlKHZhbHVlKSB7XG4gICAgICB2YXIgcHJldlRTID0gdGhpcy5fdHM7XG5cbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcHJldlRTIHx8IHRoaXMuX3BhdXNlVFM7XG4gICAgICB9XG5cbiAgICAgIGlmICghcHJldlRTKSB7XG4gICAgICAgIHRoaXMuX3BhdXNlVFMgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2VuZCA9IHRoaXMuX3N0YXJ0ICsgdGhpcy5fdER1ciAvICh0aGlzLl90cyA9IHZhbHVlIHx8IF90aW55TnVtKTtcbiAgICAgIHJldHVybiBfcmVjYWNoZUFuY2VzdG9ycyh0aGlzKS50b3RhbFRpbWUodGhpcy5fdFRpbWUsIHRydWUpO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucGF1c2VkID0gZnVuY3Rpb24gcGF1c2VkKHZhbHVlKSB7XG4gICAgICB2YXIgaXNQYXVzZWQgPSAhdGhpcy5fdHM7XG5cbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaXNQYXVzZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1BhdXNlZCAhPT0gdmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5fcGF1c2VUUyA9IHRoaXMuX3RzO1xuICAgICAgICAgIHRoaXMuX3BUaW1lID0gdGhpcy5fdFRpbWUgfHwgTWF0aC5tYXgoLXRoaXMuX2RlbGF5LCB0aGlzLnJhd1RpbWUoKSk7XG4gICAgICAgICAgdGhpcy5fdHMgPSB0aGlzLl9hY3QgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3RzID0gdGhpcy5fcGF1c2VUUztcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuX3RUaW1lIHx8IHRoaXMuX3BUaW1lO1xuXG4gICAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3MoKSA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fdFRpbWUgLT0gX3RpbnlOdW07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy50b3RhbFRpbWUodmFsdWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfcHJvdG8uc3RhcnRUaW1lID0gZnVuY3Rpb24gc3RhcnRUaW1lKHZhbHVlKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuX3NvcnQpIHtcbiAgICAgICAgICBfYWRkVG9UaW1lbGluZSh0aGlzLnBhcmVudCwgdGhpcywgdmFsdWUgLSB0aGlzLl9kZWxheSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0O1xuICAgIH07XG5cbiAgICBfcHJvdG8uZW5kVGltZSA9IGZ1bmN0aW9uIGVuZFRpbWUoaW5jbHVkZVJlcGVhdHMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGFydCArIChfaXNOb3RGYWxzZShpbmNsdWRlUmVwZWF0cykgPyB0aGlzLnRvdGFsRHVyYXRpb24oKSA6IHRoaXMuZHVyYXRpb24oKSkgLyBNYXRoLmFicyh0aGlzLl90cyk7XG4gICAgfTtcblxuICAgIF9wcm90by5yYXdUaW1lID0gZnVuY3Rpb24gcmF3VGltZSh3cmFwUmVwZWF0cykge1xuICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXMuX2RwO1xuICAgICAgcmV0dXJuICFwYXJlbnQgPyB0aGlzLl90VGltZSA6IHdyYXBSZXBlYXRzICYmICghdGhpcy5fdHMgfHwgdGhpcy5fcmVwZWF0ICYmIHRoaXMuX3RpbWUgJiYgdGhpcy50b3RhbFByb2dyZXNzKCkgPCAxKSA/IHRoaXMuX3RUaW1lICUgKHRoaXMuX2R1ciArIHRoaXMuX3JEZWxheSkgOiAhdGhpcy5fdHMgPyB0aGlzLl90VGltZSA6IF9wYXJlbnRUb0NoaWxkVG90YWxUaW1lKHBhcmVudC5yYXdUaW1lKHdyYXBSZXBlYXRzKSwgdGhpcyk7XG4gICAgfTtcblxuICAgIF9wcm90by5yZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQodmFsdWUpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3JlcGVhdCA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gX29uVXBkYXRlVG90YWxEdXJhdGlvbih0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3JlcGVhdDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnJlcGVhdERlbGF5ID0gZnVuY3Rpb24gcmVwZWF0RGVsYXkodmFsdWUpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3JEZWxheSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gX29uVXBkYXRlVG90YWxEdXJhdGlvbih0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3JEZWxheTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnlveW8gPSBmdW5jdGlvbiB5b3lvKHZhbHVlKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl95b3lvID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5feW95bztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnNlZWsgPSBmdW5jdGlvbiBzZWVrKHBvc2l0aW9uLCBzdXBwcmVzc0V2ZW50cykge1xuICAgICAgcmV0dXJuIHRoaXMudG90YWxUaW1lKF9wYXJzZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKSwgX2lzTm90RmFsc2Uoc3VwcHJlc3NFdmVudHMpKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnJlc3RhcnQgPSBmdW5jdGlvbiByZXN0YXJ0KGluY2x1ZGVEZWxheSwgc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYXkoKS50b3RhbFRpbWUoaW5jbHVkZURlbGF5ID8gLXRoaXMuX2RlbGF5IDogMCwgX2lzTm90RmFsc2Uoc3VwcHJlc3NFdmVudHMpKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnBsYXkgPSBmdW5jdGlvbiBwbGF5KGZyb20sIHN1cHByZXNzRXZlbnRzKSB7XG4gICAgICBpZiAoZnJvbSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2Vlayhmcm9tLCBzdXBwcmVzc0V2ZW50cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJldmVyc2VkKGZhbHNlKS5wYXVzZWQoZmFsc2UpO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2UoZnJvbSwgc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgIGlmIChmcm9tICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZWVrKGZyb20gfHwgdGhpcy50b3RhbER1cmF0aW9uKCksIHN1cHByZXNzRXZlbnRzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZWQodHJ1ZSkucGF1c2VkKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnBhdXNlID0gZnVuY3Rpb24gcGF1c2UoYXRUaW1lLCBzdXBwcmVzc0V2ZW50cykge1xuICAgICAgaWYgKGF0VGltZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2VlayhhdFRpbWUsIHN1cHByZXNzRXZlbnRzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucGF1c2VkKHRydWUpO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucmVzdW1lID0gZnVuY3Rpb24gcmVzdW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGF1c2VkKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnJldmVyc2VkID0gZnVuY3Rpb24gcmV2ZXJzZWQodmFsdWUpIHtcbiAgICAgIHZhciB0cyA9IHRoaXMuX3RzIHx8IHRoaXMuX3BhdXNlVFM7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5yZXZlcnNlZCgpKSB7XG4gICAgICAgICAgdGhpc1t0aGlzLl90cyA/IFwiX3RzXCIgOiBcIl9wYXVzZVRTXCJdID0gTWF0aC5hYnModHMpICogKHZhbHVlID8gLTEgOiAxKTtcbiAgICAgICAgICB0aGlzLnRvdGFsVGltZSh0aGlzLl90VGltZSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRzIDwgMDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmludmFsaWRhdGUgPSBmdW5jdGlvbiBpbnZhbGlkYXRlKCkge1xuICAgICAgdGhpcy5faW5pdHRlZCA9IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmlzQWN0aXZlID0gZnVuY3Rpb24gaXNBY3RpdmUoaGFzU3RhcnRlZCkge1xuICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXMuX2RwLFxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5fc3RhcnQsXG4gICAgICAgICAgcmF3VGltZTtcbiAgICAgIHJldHVybiAhcGFyZW50IHx8IHRoaXMuX3RzICYmICh0aGlzLl9pbml0dGVkIHx8ICFoYXNTdGFydGVkKSAmJiBwYXJlbnQuaXNBY3RpdmUoaGFzU3RhcnRlZCkgJiYgKHJhd1RpbWUgPSBwYXJlbnQucmF3VGltZSh0cnVlKSkgPj0gc3RhcnQgJiYgcmF3VGltZSA8IHRoaXMuZW5kVGltZSh0cnVlKSAtIF90aW55TnVtO1xuICAgIH07XG5cbiAgICBfcHJvdG8uZXZlbnRDYWxsYmFjayA9IGZ1bmN0aW9uIGV2ZW50Q2FsbGJhY2sodHlwZSwgY2FsbGJhY2ssIHBhcmFtcykge1xuICAgICAgdmFyIHZhcnMgPSB0aGlzLnZhcnM7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgZGVsZXRlIHZhcnNbdHlwZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyc1t0eXBlXSA9IGNhbGxiYWNrO1xuXG4gICAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgdmFyc1t0eXBlICsgXCJQYXJhbXNcIl0gPSBwYXJhbXM7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGUgPT09IFwib25VcGRhdGVcIikge1xuICAgICAgICAgICAgdGhpcy5fb25VcGRhdGUgPSBjYWxsYmFjaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhcnNbdHlwZV07XG4gICAgfTtcblxuICAgIF9wcm90by50aGVuID0gZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHZhciBmID0gb25GdWxmaWxsZWQgfHwgX3Bhc3NUaHJvdWdoLFxuICAgICAgICAgICAgX3Jlc29sdmUgPSBmdW5jdGlvbiBfcmVzb2x2ZSgpIHtcbiAgICAgICAgICB2YXIgX3RoZW4gPSBfdGhpcy50aGVuO1xuICAgICAgICAgIF90aGlzLnRoZW4gPSBudWxsO1xuICAgICAgICAgIGYgPSBmKF90aGlzKTtcblxuICAgICAgICAgIGlmIChmICYmIChmLnRoZW4gfHwgZiA9PT0gX3RoaXMpKSB7XG4gICAgICAgICAgICBfdGhpcy5fcHJvbSA9IGY7XG4gICAgICAgICAgICBfdGhpcy50aGVuID0gX3RoZW47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZShmKTtcbiAgICAgICAgICBfdGhpcy50aGVuID0gX3RoZW47XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKF90aGlzLl9pbml0dGVkICYmIF90aGlzLnRvdGFsUHJvZ3Jlc3MoKSA9PT0gMSAmJiBfdGhpcy5fdHMgPj0gMCB8fCAhX3RoaXMuX3RUaW1lICYmIF90aGlzLl90cyA8IDApIHtcbiAgICAgICAgICBfcmVzb2x2ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLl9wcm9tID0gX3Jlc29sdmU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBfcHJvdG8ua2lsbCA9IGZ1bmN0aW9uIGtpbGwoKSB7XG4gICAgICBfaW50ZXJydXB0KHRoaXMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQW5pbWF0aW9uO1xuICB9KCk7XG5cbiAgX3NldERlZmF1bHRzKEFuaW1hdGlvbi5wcm90b3R5cGUsIHtcbiAgICBfdGltZTogMCxcbiAgICBfc3RhcnQ6IDAsXG4gICAgX2VuZDogMCxcbiAgICBfdFRpbWU6IDAsXG4gICAgX3REdXI6IDAsXG4gICAgX2RpcnR5OiAwLFxuICAgIF9yZXBlYXQ6IDAsXG4gICAgX3lveW86IGZhbHNlLFxuICAgIHBhcmVudDogMCxcbiAgICBfaW5pdHRlZDogZmFsc2UsXG4gICAgX3JEZWxheTogMCxcbiAgICBfdHM6IDEsXG4gICAgX2RwOiAwLFxuICAgIHJhdGlvOiAwLFxuICAgIF96VGltZTogLV90aW55TnVtLFxuICAgIF9wcm9tOiAwXG4gIH0pO1xuXG4gIHZhciBUaW1lbGluZSA9IGZ1bmN0aW9uIChfQW5pbWF0aW9uKSB7XG4gICAgX2luaGVyaXRzTG9vc2UoVGltZWxpbmUsIF9BbmltYXRpb24pO1xuXG4gICAgZnVuY3Rpb24gVGltZWxpbmUodmFycywgdGltZSkge1xuICAgICAgdmFyIF90aGlzMjtcblxuICAgICAgaWYgKHZhcnMgPT09IHZvaWQgMCkge1xuICAgICAgICB2YXJzID0ge307XG4gICAgICB9XG5cbiAgICAgIF90aGlzMiA9IF9BbmltYXRpb24uY2FsbCh0aGlzLCB2YXJzLCB0aW1lKSB8fCB0aGlzO1xuICAgICAgX3RoaXMyLmxhYmVscyA9IHt9O1xuICAgICAgX3RoaXMyLnNtb290aENoaWxkVGltaW5nID0gX2lzTm90RmFsc2UodmFycy5zbW9vdGhDaGlsZFRpbWluZyk7XG4gICAgICBfdGhpczIuYXV0b1JlbW92ZUNoaWxkcmVuID0gISF2YXJzLmF1dG9SZW1vdmVDaGlsZHJlbjtcbiAgICAgIF90aGlzMi5fc29ydCA9IF9pc05vdEZhbHNlKHZhcnMuc29ydENoaWxkcmVuKTtcbiAgICAgIHJldHVybiBfdGhpczI7XG4gICAgfVxuXG4gICAgdmFyIF9wcm90bzIgPSBUaW1lbGluZS5wcm90b3R5cGU7XG5cbiAgICBfcHJvdG8yLnRvID0gZnVuY3Rpb24gdG8odGFyZ2V0cywgdmFycywgcG9zaXRpb24pIHtcbiAgICAgIG5ldyBUd2Vlbih0YXJnZXRzLCBfcGFyc2VWYXJzKGFyZ3VtZW50cywgMCwgdGhpcyksIF9wYXJzZVBvc2l0aW9uKHRoaXMsIF9pc051bWJlcih2YXJzKSA/IGFyZ3VtZW50c1szXSA6IHBvc2l0aW9uKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5mcm9tID0gZnVuY3Rpb24gZnJvbSh0YXJnZXRzLCB2YXJzLCBwb3NpdGlvbikge1xuICAgICAgbmV3IFR3ZWVuKHRhcmdldHMsIF9wYXJzZVZhcnMoYXJndW1lbnRzLCAxLCB0aGlzKSwgX3BhcnNlUG9zaXRpb24odGhpcywgX2lzTnVtYmVyKHZhcnMpID8gYXJndW1lbnRzWzNdIDogcG9zaXRpb24pKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLmZyb21UbyA9IGZ1bmN0aW9uIGZyb21Ubyh0YXJnZXRzLCBmcm9tVmFycywgdG9WYXJzLCBwb3NpdGlvbikge1xuICAgICAgbmV3IFR3ZWVuKHRhcmdldHMsIF9wYXJzZVZhcnMoYXJndW1lbnRzLCAyLCB0aGlzKSwgX3BhcnNlUG9zaXRpb24odGhpcywgX2lzTnVtYmVyKGZyb21WYXJzKSA/IGFyZ3VtZW50c1s0XSA6IHBvc2l0aW9uKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5zZXQgPSBmdW5jdGlvbiBzZXQodGFyZ2V0cywgdmFycywgcG9zaXRpb24pIHtcbiAgICAgIHZhcnMuZHVyYXRpb24gPSAwO1xuICAgICAgdmFycy5wYXJlbnQgPSB0aGlzO1xuXG4gICAgICBpZiAoIXZhcnMucmVwZWF0RGVsYXkpIHtcbiAgICAgICAgdmFycy5yZXBlYXQgPSAwO1xuICAgICAgfVxuXG4gICAgICB2YXJzLmltbWVkaWF0ZVJlbmRlciA9ICEhdmFycy5pbW1lZGlhdGVSZW5kZXI7XG4gICAgICBuZXcgVHdlZW4odGFyZ2V0cywgdmFycywgX3BhcnNlUG9zaXRpb24odGhpcywgcG9zaXRpb24pKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLmNhbGwgPSBmdW5jdGlvbiBjYWxsKGNhbGxiYWNrLCBwYXJhbXMsIHBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gX2FkZFRvVGltZWxpbmUodGhpcywgVHdlZW4uZGVsYXllZENhbGwoMCwgY2FsbGJhY2ssIHBhcmFtcyksIF9wYXJzZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKSk7XG4gICAgfTtcblxuICAgIF9wcm90bzIuc3RhZ2dlclRvID0gZnVuY3Rpb24gc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcykge1xuICAgICAgdmFycy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgdmFycy5zdGFnZ2VyID0gdmFycy5zdGFnZ2VyIHx8IHN0YWdnZXI7XG4gICAgICB2YXJzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlQWxsO1xuICAgICAgdmFycy5vbkNvbXBsZXRlUGFyYW1zID0gb25Db21wbGV0ZUFsbFBhcmFtcztcbiAgICAgIHZhcnMucGFyZW50ID0gdGhpcztcbiAgICAgIG5ldyBUd2Vlbih0YXJnZXRzLCB2YXJzLCBfcGFyc2VQb3NpdGlvbih0aGlzLCBwb3NpdGlvbikpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90bzIuc3RhZ2dlckZyb20gPSBmdW5jdGlvbiBzdGFnZ2VyRnJvbSh0YXJnZXRzLCBkdXJhdGlvbiwgdmFycywgc3RhZ2dlciwgcG9zaXRpb24sIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMpIHtcbiAgICAgIHZhcnMucnVuQmFja3dhcmRzID0gMTtcbiAgICAgIHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gX2lzTm90RmFsc2UodmFycy5pbW1lZGlhdGVSZW5kZXIpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcyk7XG4gICAgfTtcblxuICAgIF9wcm90bzIuc3RhZ2dlckZyb21UbyA9IGZ1bmN0aW9uIHN0YWdnZXJGcm9tVG8odGFyZ2V0cywgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zKSB7XG4gICAgICB0b1ZhcnMuc3RhcnRBdCA9IGZyb21WYXJzO1xuICAgICAgdG9WYXJzLmltbWVkaWF0ZVJlbmRlciA9IF9pc05vdEZhbHNlKHRvVmFycy5pbW1lZGlhdGVSZW5kZXIpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB0b1ZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIodG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHtcbiAgICAgIHZhciBwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG4gICAgICAgICAgdER1ciA9IHRoaXMuX2RpcnR5ID8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLl90RHVyLFxuICAgICAgICAgIGR1ciA9IHRoaXMuX2R1cixcbiAgICAgICAgICB0VGltZSA9IHRvdGFsVGltZSA+IHREdXIgLSBfdGlueU51bSAmJiB0b3RhbFRpbWUgPj0gMCAmJiB0aGlzICE9PSBfZ2xvYmFsVGltZWxpbmUgPyB0RHVyIDogdG90YWxUaW1lIDwgX3RpbnlOdW0gPyAwIDogdG90YWxUaW1lLFxuICAgICAgICAgIGNyb3NzaW5nU3RhcnQgPSB0aGlzLl96VGltZSA8IDAgIT09IHRvdGFsVGltZSA8IDAgJiYgKHRoaXMuX2luaXR0ZWQgfHwgIWR1ciksXG4gICAgICAgICAgdGltZSxcbiAgICAgICAgICBjaGlsZCxcbiAgICAgICAgICBuZXh0LFxuICAgICAgICAgIGl0ZXJhdGlvbixcbiAgICAgICAgICBjeWNsZUR1cmF0aW9uLFxuICAgICAgICAgIHByZXZQYXVzZWQsXG4gICAgICAgICAgcGF1c2VUd2VlbixcbiAgICAgICAgICB0aW1lU2NhbGUsXG4gICAgICAgICAgcHJldlN0YXJ0LFxuICAgICAgICAgIHByZXZJdGVyYXRpb24sXG4gICAgICAgICAgeW95bztcblxuICAgICAgaWYgKHRUaW1lICE9PSB0aGlzLl90VGltZSB8fCBmb3JjZSB8fCBjcm9zc2luZ1N0YXJ0KSB7XG4gICAgICAgIGlmIChjcm9zc2luZ1N0YXJ0KSB7XG4gICAgICAgICAgaWYgKCFkdXIpIHtcbiAgICAgICAgICAgIHByZXZUaW1lID0gdGhpcy5felRpbWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRvdGFsVGltZSB8fCAhc3VwcHJlc3NFdmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3pUaW1lID0gdG90YWxUaW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWUgPSB0VGltZTtcbiAgICAgICAgcHJldlN0YXJ0ID0gdGhpcy5fc3RhcnQ7XG4gICAgICAgIHRpbWVTY2FsZSA9IHRoaXMuX3RzO1xuICAgICAgICBwcmV2UGF1c2VkID0gdGltZVNjYWxlID09PSAwO1xuXG4gICAgICAgIGlmIChwcmV2VGltZSAhPT0gdGhpcy5fdGltZSAmJiBkdXIpIHtcbiAgICAgICAgICB0aW1lICs9IHRoaXMuX3RpbWUgLSBwcmV2VGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZXBlYXQpIHtcbiAgICAgICAgICB5b3lvID0gdGhpcy5feW95bztcbiAgICAgICAgICBjeWNsZUR1cmF0aW9uID0gZHVyICsgdGhpcy5fckRlbGF5O1xuICAgICAgICAgIHRpbWUgPSBfcm91bmQodFRpbWUgJSBjeWNsZUR1cmF0aW9uKTtcblxuICAgICAgICAgIGlmICh0aW1lID4gZHVyIHx8IHREdXIgPT09IHRUaW1lKSB7XG4gICAgICAgICAgICB0aW1lID0gZHVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGl0ZXJhdGlvbiA9IH5+KHRUaW1lIC8gY3ljbGVEdXJhdGlvbik7XG5cbiAgICAgICAgICBpZiAoaXRlcmF0aW9uICYmIGl0ZXJhdGlvbiA9PT0gdFRpbWUgLyBjeWNsZUR1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aW1lID0gZHVyO1xuICAgICAgICAgICAgaXRlcmF0aW9uLS07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJldkl0ZXJhdGlvbiA9IH5+KHRoaXMuX3RUaW1lIC8gY3ljbGVEdXJhdGlvbik7XG5cbiAgICAgICAgICBpZiAocHJldkl0ZXJhdGlvbiAmJiBwcmV2SXRlcmF0aW9uID09PSB0aGlzLl90VGltZSAvIGN5Y2xlRHVyYXRpb24pIHtcbiAgICAgICAgICAgIHByZXZJdGVyYXRpb24tLTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoeW95byAmJiBpdGVyYXRpb24gJiAxKSB7XG4gICAgICAgICAgICB0aW1lID0gZHVyIC0gdGltZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXRlcmF0aW9uICE9PSBwcmV2SXRlcmF0aW9uICYmICF0aGlzLl9sb2NrKSB7XG4gICAgICAgICAgICB2YXIgcmV3aW5kaW5nID0geW95byAmJiBwcmV2SXRlcmF0aW9uICYgMSxcbiAgICAgICAgICAgICAgICBkb2VzV3JhcCA9IHJld2luZGluZyA9PT0gKHlveW8gJiYgaXRlcmF0aW9uICYgMSk7XG5cbiAgICAgICAgICAgIGlmIChpdGVyYXRpb24gPCBwcmV2SXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgIHJld2luZGluZyA9ICFyZXdpbmRpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZXZUaW1lID0gcmV3aW5kaW5nID8gMCA6IGR1cjtcbiAgICAgICAgICAgIHRoaXMuX2xvY2sgPSAxO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIocHJldlRpbWUsIHN1cHByZXNzRXZlbnRzLCAhZHVyKS5fbG9jayA9IDA7XG5cbiAgICAgICAgICAgIGlmICghc3VwcHJlc3NFdmVudHMgJiYgdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgX2NhbGxiYWNrKHRoaXMsIFwib25SZXBlYXRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcmV2VGltZSAhPT0gdGhpcy5fdGltZSB8fCBwcmV2UGF1c2VkICE9PSAhdGhpcy5fdHMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkb2VzV3JhcCkge1xuICAgICAgICAgICAgICB0aGlzLl9sb2NrID0gMjtcbiAgICAgICAgICAgICAgcHJldlRpbWUgPSByZXdpbmRpbmcgPyBkdXIgKyAwLjAwMDEgOiAtMC4wMDAxO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcihwcmV2VGltZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvY2sgPSAwO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3RzICYmICFwcmV2UGF1c2VkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9oYXNQYXVzZSAmJiAhdGhpcy5fZm9yY2luZyAmJiB0aGlzLl9sb2NrIDwgMikge1xuICAgICAgICAgIHBhdXNlVHdlZW4gPSBfZmluZE5leHRQYXVzZVR3ZWVuKHRoaXMsIF9yb3VuZChwcmV2VGltZSksIF9yb3VuZCh0aW1lKSk7XG5cbiAgICAgICAgICBpZiAocGF1c2VUd2Vlbikge1xuICAgICAgICAgICAgdFRpbWUgLT0gdGltZSAtICh0aW1lID0gcGF1c2VUd2Vlbi5fc3RhcnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RUaW1lID0gdFRpbWU7XG4gICAgICAgIHRoaXMuX3RpbWUgPSB0aW1lO1xuICAgICAgICB0aGlzLl9hY3QgPSAhdGltZVNjYWxlO1xuXG4gICAgICAgIGlmICghdGhpcy5faW5pdHRlZCkge1xuICAgICAgICAgIHRoaXMuX29uVXBkYXRlID0gdGhpcy52YXJzLm9uVXBkYXRlO1xuICAgICAgICAgIHRoaXMuX2luaXR0ZWQgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwcmV2VGltZSAmJiB0aW1lICYmICFzdXBwcmVzc0V2ZW50cykge1xuICAgICAgICAgIF9jYWxsYmFjayh0aGlzLCBcIm9uU3RhcnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGltZSA+PSBwcmV2VGltZSAmJiB0b3RhbFRpbWUgPj0gMCkge1xuICAgICAgICAgIGNoaWxkID0gdGhpcy5fZmlyc3Q7XG5cbiAgICAgICAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgICAgICAgIG5leHQgPSBjaGlsZC5fbmV4dDtcblxuICAgICAgICAgICAgaWYgKChjaGlsZC5fYWN0IHx8IHRpbWUgPj0gY2hpbGQuX3N0YXJ0KSAmJiBjaGlsZC5fdHMgJiYgcGF1c2VUd2VlbiAhPT0gY2hpbGQpIHtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCAhPT0gdGhpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcih0b3RhbFRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjaGlsZC5yZW5kZXIoY2hpbGQuX3RzID4gMCA/ICh0aW1lIC0gY2hpbGQuX3N0YXJ0KSAqIGNoaWxkLl90cyA6IChjaGlsZC5fZGlydHkgPyBjaGlsZC50b3RhbER1cmF0aW9uKCkgOiBjaGlsZC5fdER1cikgKyAodGltZSAtIGNoaWxkLl9zdGFydCkgKiBjaGlsZC5fdHMsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cbiAgICAgICAgICAgICAgaWYgKHRpbWUgIT09IHRoaXMuX3RpbWUgfHwgIXRoaXMuX3RzICYmICFwcmV2UGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgcGF1c2VUd2VlbiA9IDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hpbGQgPSBuZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZCA9IHRoaXMuX2xhc3Q7XG4gICAgICAgICAgdmFyIGFkanVzdGVkVGltZSA9IHRvdGFsVGltZSA8IDAgPyB0b3RhbFRpbWUgOiB0aW1lO1xuXG4gICAgICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgICAgICBuZXh0ID0gY2hpbGQuX3ByZXY7XG5cbiAgICAgICAgICAgIGlmICgoY2hpbGQuX2FjdCB8fCBhZGp1c3RlZFRpbWUgPD0gY2hpbGQuX2VuZCkgJiYgY2hpbGQuX3RzICYmIHBhdXNlVHdlZW4gIT09IGNoaWxkKSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZC5wYXJlbnQgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIodG90YWxUaW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY2hpbGQucmVuZGVyKGNoaWxkLl90cyA+IDAgPyAoYWRqdXN0ZWRUaW1lIC0gY2hpbGQuX3N0YXJ0KSAqIGNoaWxkLl90cyA6IChjaGlsZC5fZGlydHkgPyBjaGlsZC50b3RhbER1cmF0aW9uKCkgOiBjaGlsZC5fdER1cikgKyAoYWRqdXN0ZWRUaW1lIC0gY2hpbGQuX3N0YXJ0KSAqIGNoaWxkLl90cywgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblxuICAgICAgICAgICAgICBpZiAodGltZSAhPT0gdGhpcy5fdGltZSB8fCAhdGhpcy5fdHMgJiYgIXByZXZQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICBwYXVzZVR3ZWVuID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZCA9IG5leHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhdXNlVHdlZW4gJiYgIXN1cHByZXNzRXZlbnRzKSB7XG4gICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgIHBhdXNlVHdlZW4ucmVuZGVyKHRpbWUgPj0gcHJldlRpbWUgPyAwIDogLV90aW55TnVtKS5felRpbWUgPSB0aW1lID49IHByZXZUaW1lID8gMSA6IC0xO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX3RzKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydCA9IHByZXZTdGFydDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcih0b3RhbFRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX29uVXBkYXRlICYmICFzdXBwcmVzc0V2ZW50cykge1xuICAgICAgICAgIF9jYWxsYmFjayh0aGlzLCBcIm9uVXBkYXRlXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRUaW1lID09PSB0RHVyIHx8ICF0VGltZSAmJiB0aGlzLl90cyA8IDApIGlmIChwcmV2U3RhcnQgPT09IHRoaXMuX3N0YXJ0IHx8IE1hdGguYWJzKHRpbWVTY2FsZSkgIT09IE1hdGguYWJzKHRoaXMuX3RzKSkgaWYgKCF0aW1lIHx8IHREdXIgPj0gdGhpcy50b3RhbER1cmF0aW9uKCkpIHtcbiAgICAgICAgICAodG90YWxUaW1lIHx8ICFkdXIpICYmIF9yZW1vdmVGcm9tUGFyZW50KHRoaXMsIDEpO1xuXG4gICAgICAgICAgaWYgKCFzdXBwcmVzc0V2ZW50cyAmJiAhKHRvdGFsVGltZSA8IDAgJiYgIXByZXZUaW1lKSkge1xuICAgICAgICAgICAgX2NhbGxiYWNrKHRoaXMsIHRUaW1lID09PSB0RHVyID8gXCJvbkNvbXBsZXRlXCIgOiBcIm9uUmV2ZXJzZUNvbXBsZXRlXCIsIHRydWUpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9tICYmIHRoaXMuX3Byb20oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90bzIuYWRkID0gZnVuY3Rpb24gYWRkKGNoaWxkLCBwb3NpdGlvbikge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIGlmICghX2lzTnVtYmVyKHBvc2l0aW9uKSkge1xuICAgICAgICBwb3NpdGlvbiA9IF9wYXJzZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEoY2hpbGQgaW5zdGFuY2VvZiBBbmltYXRpb24pKSB7XG4gICAgICAgIGlmIChfaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgICBjaGlsZC5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuYWRkKG9iaiwgcG9zaXRpb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBfdW5jYWNoZSh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfaXNTdHJpbmcoY2hpbGQpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYWRkTGFiZWwoY2hpbGQsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfaXNGdW5jdGlvbihjaGlsZCkpIHtcbiAgICAgICAgICBjaGlsZCA9IFR3ZWVuLmRlbGF5ZWRDYWxsKDAsIGNoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcyAhPT0gY2hpbGQgPyBfYWRkVG9UaW1lbGluZSh0aGlzLCBjaGlsZCwgcG9zaXRpb24pIDogdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5nZXRDaGlsZHJlbiA9IGZ1bmN0aW9uIGdldENoaWxkcmVuKG5lc3RlZCwgdHdlZW5zLCB0aW1lbGluZXMsIGlnbm9yZUJlZm9yZVRpbWUpIHtcbiAgICAgIGlmIChuZXN0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICBuZXN0ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHdlZW5zID09PSB2b2lkIDApIHtcbiAgICAgICAgdHdlZW5zID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRpbWVsaW5lcyA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHRpbWVsaW5lcyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpZ25vcmVCZWZvcmVUaW1lID09PSB2b2lkIDApIHtcbiAgICAgICAgaWdub3JlQmVmb3JlVGltZSA9IC1fYmlnTnVtO1xuICAgICAgfVxuXG4gICAgICB2YXIgYSA9IFtdLFxuICAgICAgICAgIGNoaWxkID0gdGhpcy5fZmlyc3Q7XG5cbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQuX3N0YXJ0ID49IGlnbm9yZUJlZm9yZVRpbWUpIHtcbiAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUd2Vlbikge1xuICAgICAgICAgICAgaWYgKHR3ZWVucykge1xuICAgICAgICAgICAgICBhLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGltZWxpbmVzKSB7XG4gICAgICAgICAgICAgIGEucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuZXN0ZWQpIHtcbiAgICAgICAgICAgICAgYS5wdXNoLmFwcGx5KGEsIGNoaWxkLmdldENoaWxkcmVuKHRydWUsIHR3ZWVucywgdGltZWxpbmVzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIF9wcm90bzIuZ2V0QnlJZCA9IGZ1bmN0aW9uIGdldEJ5SWQoaWQpIHtcbiAgICAgIHZhciBhbmltYXRpb25zID0gdGhpcy5nZXRDaGlsZHJlbigxLCAxLCAxKSxcbiAgICAgICAgICBpID0gYW5pbWF0aW9ucy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbnNbaV0udmFycy5pZCA9PT0gaWQpIHtcbiAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8yLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShjaGlsZCkge1xuICAgICAgaWYgKF9pc1N0cmluZyhjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGFiZWwoY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2lzRnVuY3Rpb24oY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmtpbGxUd2VlbnNPZihjaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIF9yZW1vdmVMaW5rZWRMaXN0SXRlbSh0aGlzLCBjaGlsZCk7XG5cbiAgICAgIGlmIChjaGlsZCA9PT0gdGhpcy5fcmVjZW50KSB7XG4gICAgICAgIHRoaXMuX3JlY2VudCA9IHRoaXMuX2xhc3Q7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfdW5jYWNoZSh0aGlzKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvMi50b3RhbFRpbWUgPSBmdW5jdGlvbiB0b3RhbFRpbWUoX3RvdGFsVGltZTIsIHN1cHByZXNzRXZlbnRzKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RUaW1lO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9mb3JjaW5nID0gMTtcblxuICAgICAgaWYgKCF0aGlzLnBhcmVudCAmJiAhdGhpcy5fZHAgJiYgdGhpcy5fdHMpIHtcbiAgICAgICAgdGhpcy5fc3RhcnQgPSBfdGlja2VyLnRpbWUgLSAodGhpcy5fdHMgPiAwID8gX3RvdGFsVGltZTIgLyB0aGlzLl90cyA6ICh0aGlzLnRvdGFsRHVyYXRpb24oKSAtIF90b3RhbFRpbWUyKSAvIC10aGlzLl90cyk7XG4gICAgICB9XG5cbiAgICAgIF9BbmltYXRpb24ucHJvdG90eXBlLnRvdGFsVGltZS5jYWxsKHRoaXMsIF90b3RhbFRpbWUyLCBzdXBwcmVzc0V2ZW50cyk7XG5cbiAgICAgIHRoaXMuX2ZvcmNpbmcgPSAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90bzIuYWRkTGFiZWwgPSBmdW5jdGlvbiBhZGRMYWJlbChsYWJlbCwgcG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFiZWxzW2xhYmVsXSA9IF9wYXJzZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLnJlbW92ZUxhYmVsID0gZnVuY3Rpb24gcmVtb3ZlTGFiZWwobGFiZWwpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmxhYmVsc1tsYWJlbF07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5hZGRQYXVzZSA9IGZ1bmN0aW9uIGFkZFBhdXNlKHBvc2l0aW9uLCBjYWxsYmFjaywgcGFyYW1zKSB7XG4gICAgICB2YXIgdCA9IFR3ZWVuLmRlbGF5ZWRDYWxsKDAsIGNhbGxiYWNrIHx8IF9lbXB0eUZ1bmMsIHBhcmFtcyk7XG4gICAgICB0LmRhdGEgPSBcImlzUGF1c2VcIjtcbiAgICAgIHRoaXMuX2hhc1BhdXNlID0gMTtcbiAgICAgIHJldHVybiBfYWRkVG9UaW1lbGluZSh0aGlzLCB0LCBfcGFyc2VQb3NpdGlvbih0aGlzLCBwb3NpdGlvbikpO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLnJlbW92ZVBhdXNlID0gZnVuY3Rpb24gcmVtb3ZlUGF1c2UocG9zaXRpb24pIHtcbiAgICAgIHZhciBjaGlsZCA9IHRoaXMuX2ZpcnN0O1xuICAgICAgcG9zaXRpb24gPSBfcGFyc2VQb3NpdGlvbih0aGlzLCBwb3NpdGlvbik7XG5cbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQuX3N0YXJ0ID09PSBwb3NpdGlvbiAmJiBjaGlsZC5kYXRhID09PSBcImlzUGF1c2VcIikge1xuICAgICAgICAgIF9yZW1vdmVGcm9tUGFyZW50KGNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkID0gY2hpbGQuX25leHQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90bzIua2lsbFR3ZWVuc09mID0gZnVuY3Rpb24ga2lsbFR3ZWVuc09mKHRhcmdldHMsIHByb3BzLCBvbmx5QWN0aXZlKSB7XG4gICAgICB2YXIgdHdlZW5zID0gdGhpcy5nZXRUd2VlbnNPZih0YXJnZXRzLCBvbmx5QWN0aXZlKSxcbiAgICAgICAgICBpID0gdHdlZW5zLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBfb3ZlcndyaXRpbmdUd2VlbiAhPT0gdHdlZW5zW2ldICYmIHR3ZWVuc1tpXS5raWxsKHRhcmdldHMsIHByb3BzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9wcm90bzIuZ2V0VHdlZW5zT2YgPSBmdW5jdGlvbiBnZXRUd2VlbnNPZih0YXJnZXRzLCBvbmx5QWN0aXZlKSB7XG4gICAgICB2YXIgYSA9IFtdLFxuICAgICAgICAgIHBhcnNlZFRhcmdldHMgPSB0b0FycmF5KHRhcmdldHMpLFxuICAgICAgICAgIGNoaWxkID0gdGhpcy5fZmlyc3QsXG4gICAgICAgICAgY2hpbGRyZW47XG5cbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUd2Vlbikge1xuICAgICAgICAgIGlmIChfYXJyYXlDb250YWluc0FueShjaGlsZC5fdGFyZ2V0cywgcGFyc2VkVGFyZ2V0cykgJiYgKCFvbmx5QWN0aXZlIHx8IGNoaWxkLmlzQWN0aXZlKG9ubHlBY3RpdmUgPT09IFwic3RhcnRlZFwiKSkpIHtcbiAgICAgICAgICAgIGEucHVzaChjaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKChjaGlsZHJlbiA9IGNoaWxkLmdldFR3ZWVuc09mKHBhcnNlZFRhcmdldHMsIG9ubHlBY3RpdmUpKS5sZW5ndGgpIHtcbiAgICAgICAgICBhLnB1c2guYXBwbHkoYSwgY2hpbGRyZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIF9wcm90bzIudHdlZW5UbyA9IGZ1bmN0aW9uIHR3ZWVuVG8ocG9zaXRpb24sIHZhcnMpIHtcbiAgICAgIHZhciB0bCA9IHRoaXMsXG4gICAgICAgICAgZW5kVGltZSA9IF9wYXJzZVBvc2l0aW9uKHRsLCBwb3NpdGlvbiksXG4gICAgICAgICAgc3RhcnRBdCA9IHZhcnMgJiYgdmFycy5zdGFydEF0LFxuICAgICAgICAgIHR3ZWVuID0gVHdlZW4udG8odGwsIF9zZXREZWZhdWx0cyh7XG4gICAgICAgIGVhc2U6IFwibm9uZVwiLFxuICAgICAgICBsYXp5OiBmYWxzZSxcbiAgICAgICAgdGltZTogZW5kVGltZSxcbiAgICAgICAgZHVyYXRpb246IE1hdGguYWJzKGVuZFRpbWUgLSAoc3RhcnRBdCAmJiBcInRpbWVcIiBpbiBzdGFydEF0ID8gc3RhcnRBdC50aW1lIDogdGwuX3RpbWUpKSAvIHRsLnRpbWVTY2FsZSgpIHx8IF90aW55TnVtLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbiBvblN0YXJ0KCkge1xuICAgICAgICAgIHRsLnBhdXNlKCk7XG4gICAgICAgICAgdmFyIGR1cmF0aW9uID0gTWF0aC5hYnMoZW5kVGltZSAtIHRsLl90aW1lKSAvIHRsLnRpbWVTY2FsZSgpO1xuXG4gICAgICAgICAgaWYgKHR3ZWVuLl9kdXIgIT09IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICB0d2Vlbi5fZHVyID0gZHVyYXRpb247XG4gICAgICAgICAgICB0d2Vlbi5yZW5kZXIodHdlZW4uX3RpbWUsIHRydWUsIHRydWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh2YXJzICYmIHZhcnMub25TdGFydCkge1xuICAgICAgICAgICAgdmFycy5vblN0YXJ0LmFwcGx5KHR3ZWVuLCB2YXJzLm9uU3RhcnRQYXJhbXMgfHwgW10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdmFycykpO1xuXG4gICAgICByZXR1cm4gdHdlZW47XG4gICAgfTtcblxuICAgIF9wcm90bzIudHdlZW5Gcm9tVG8gPSBmdW5jdGlvbiB0d2VlbkZyb21Ubyhmcm9tUG9zaXRpb24sIHRvUG9zaXRpb24sIHZhcnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnR3ZWVuVG8odG9Qb3NpdGlvbiwgX3NldERlZmF1bHRzKHtcbiAgICAgICAgc3RhcnRBdDoge1xuICAgICAgICAgIHRpbWU6IF9wYXJzZVBvc2l0aW9uKHRoaXMsIGZyb21Qb3NpdGlvbilcbiAgICAgICAgfVxuICAgICAgfSwgdmFycykpO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLnJlY2VudCA9IGZ1bmN0aW9uIHJlY2VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZWNlbnQ7XG4gICAgfTtcblxuICAgIF9wcm90bzIubmV4dExhYmVsID0gZnVuY3Rpb24gbmV4dExhYmVsKGFmdGVyVGltZSkge1xuICAgICAgaWYgKGFmdGVyVGltZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGFmdGVyVGltZSA9IHRoaXMuX3RpbWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfZ2V0TGFiZWxJbkRpcmVjdGlvbih0aGlzLCBfcGFyc2VQb3NpdGlvbih0aGlzLCBhZnRlclRpbWUpKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvMi5wcmV2aW91c0xhYmVsID0gZnVuY3Rpb24gcHJldmlvdXNMYWJlbChiZWZvcmVUaW1lKSB7XG4gICAgICBpZiAoYmVmb3JlVGltZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGJlZm9yZVRpbWUgPSB0aGlzLl90aW1lO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2dldExhYmVsSW5EaXJlY3Rpb24odGhpcywgX3BhcnNlUG9zaXRpb24odGhpcywgYmVmb3JlVGltZSksIDEpO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLmN1cnJlbnRMYWJlbCA9IGZ1bmN0aW9uIGN1cnJlbnRMYWJlbCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnNlZWsodmFsdWUsIHRydWUpIDogdGhpcy5wcmV2aW91c0xhYmVsKHRoaXMuX3RpbWUgKyBfdGlueU51bSk7XG4gICAgfTtcblxuICAgIF9wcm90bzIuc2hpZnRDaGlsZHJlbiA9IGZ1bmN0aW9uIHNoaWZ0Q2hpbGRyZW4oYW1vdW50LCBhZGp1c3RMYWJlbHMsIGlnbm9yZUJlZm9yZVRpbWUpIHtcbiAgICAgIGlmIChpZ25vcmVCZWZvcmVUaW1lID09PSB2b2lkIDApIHtcbiAgICAgICAgaWdub3JlQmVmb3JlVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGlsZCA9IHRoaXMuX2ZpcnN0LFxuICAgICAgICAgIGxhYmVscyA9IHRoaXMubGFiZWxzLFxuICAgICAgICAgIHA7XG5cbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQuX3N0YXJ0ID49IGlnbm9yZUJlZm9yZVRpbWUpIHtcbiAgICAgICAgICBjaGlsZC5fc3RhcnQgKz0gYW1vdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgaWYgKGFkanVzdExhYmVscykge1xuICAgICAgICBmb3IgKHAgaW4gbGFiZWxzKSB7XG4gICAgICAgICAgaWYgKGxhYmVsc1twXSA+PSBpZ25vcmVCZWZvcmVUaW1lKSB7XG4gICAgICAgICAgICBsYWJlbHNbcF0gKz0gYW1vdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gX3VuY2FjaGUodGhpcyk7XG4gICAgfTtcblxuICAgIF9wcm90bzIuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uIGludmFsaWRhdGUoKSB7XG4gICAgICB2YXIgY2hpbGQgPSB0aGlzLl9maXJzdDtcbiAgICAgIHRoaXMuX2xvY2sgPSAwO1xuXG4gICAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgICAgY2hpbGQuaW52YWxpZGF0ZSgpO1xuICAgICAgICBjaGlsZCA9IGNoaWxkLl9uZXh0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX0FuaW1hdGlvbi5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpO1xuICAgIH07XG5cbiAgICBfcHJvdG8yLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIoaW5jbHVkZUxhYmVscykge1xuICAgICAgaWYgKGluY2x1ZGVMYWJlbHMgPT09IHZvaWQgMCkge1xuICAgICAgICBpbmNsdWRlTGFiZWxzID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoaWxkID0gdGhpcy5fZmlyc3QsXG4gICAgICAgICAgbmV4dDtcblxuICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgIG5leHQgPSBjaGlsZC5fbmV4dDtcbiAgICAgICAgdGhpcy5yZW1vdmUoY2hpbGQpO1xuICAgICAgICBjaGlsZCA9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl90VGltZSA9IDA7XG5cbiAgICAgIGlmIChpbmNsdWRlTGFiZWxzKSB7XG4gICAgICAgIHRoaXMubGFiZWxzID0ge307XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfdW5jYWNoZSh0aGlzKTtcbiAgICB9O1xuXG4gICAgX3Byb3RvMi50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24gdG90YWxEdXJhdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIG1heCA9IDAsXG4gICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgY2hpbGQgPSBzZWxmLl9sYXN0LFxuICAgICAgICAgIHByZXZTdGFydCA9IF9iaWdOdW0sXG4gICAgICAgICAgcmVwZWF0ID0gc2VsZi5fcmVwZWF0LFxuICAgICAgICAgIHJlcGVhdEN5Y2xlcyA9IHJlcGVhdCAqIHNlbGYuX3JEZWxheSB8fCAwLFxuICAgICAgICAgIGlzSW5maW5pdGUgPSByZXBlYXQgPCAwLFxuICAgICAgICAgIHByZXYsXG4gICAgICAgICAgZW5kO1xuXG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHNlbGYuX2RpcnR5KSB7XG4gICAgICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgICAgICBwcmV2ID0gY2hpbGQuX3ByZXY7XG5cbiAgICAgICAgICAgIGlmIChjaGlsZC5fZGlydHkpIHtcbiAgICAgICAgICAgICAgY2hpbGQudG90YWxEdXJhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2hpbGQuX3N0YXJ0ID4gcHJldlN0YXJ0ICYmIHNlbGYuX3NvcnQgJiYgY2hpbGQuX3RzICYmICFzZWxmLl9sb2NrKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2xvY2sgPSAxO1xuXG4gICAgICAgICAgICAgIF9hZGRUb1RpbWVsaW5lKHNlbGYsIGNoaWxkLCBjaGlsZC5fc3RhcnQgLSBjaGlsZC5fZGVsYXkpO1xuXG4gICAgICAgICAgICAgIHNlbGYuX2xvY2sgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcHJldlN0YXJ0ID0gY2hpbGQuX3N0YXJ0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2hpbGQuX3N0YXJ0IDwgMCAmJiBjaGlsZC5fdHMpIHtcbiAgICAgICAgICAgICAgbWF4IC09IGNoaWxkLl9zdGFydDtcblxuICAgICAgICAgICAgICBpZiAoIXNlbGYucGFyZW50ICYmICFzZWxmLl9kcCB8fCBzZWxmLnBhcmVudCAmJiBzZWxmLnBhcmVudC5zbW9vdGhDaGlsZFRpbWluZykge1xuICAgICAgICAgICAgICAgIHNlbGYuX3N0YXJ0ICs9IGNoaWxkLl9zdGFydCAvIHNlbGYuX3RzO1xuICAgICAgICAgICAgICAgIHNlbGYuX3RpbWUgLT0gY2hpbGQuX3N0YXJ0O1xuICAgICAgICAgICAgICAgIHNlbGYuX3RUaW1lIC09IGNoaWxkLl9zdGFydDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHNlbGYuc2hpZnRDaGlsZHJlbigtY2hpbGQuX3N0YXJ0LCBmYWxzZSwgLV9iaWdOdW0pO1xuICAgICAgICAgICAgICBwcmV2U3RhcnQgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbmQgPSBjaGlsZC5fZW5kID0gY2hpbGQuX3N0YXJ0ICsgY2hpbGQuX3REdXIgLyBNYXRoLmFicyhjaGlsZC5fdHMgfHwgY2hpbGQuX3BhdXNlVFMpO1xuXG4gICAgICAgICAgICBpZiAoZW5kID4gbWF4ICYmIGNoaWxkLl90cykge1xuICAgICAgICAgICAgICBtYXggPSBfcm91bmQoZW5kKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hpbGQgPSBwcmV2O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlbGYuX2R1ciA9IHNlbGYgPT09IF9nbG9iYWxUaW1lbGluZSAmJiBzZWxmLl90aW1lID4gbWF4ID8gc2VsZi5fdGltZSA6IE1hdGgubWluKF9iaWdOdW0sIG1heCk7XG4gICAgICAgICAgc2VsZi5fdER1ciA9IGlzSW5maW5pdGUgJiYgKHNlbGYuX2R1ciB8fCByZXBlYXRDeWNsZXMpID8gMWUyMCA6IE1hdGgubWluKF9iaWdOdW0sIG1heCAqIChyZXBlYXQgKyAxKSArIHJlcGVhdEN5Y2xlcyk7XG4gICAgICAgICAgc2VsZi5fZW5kID0gc2VsZi5fc3RhcnQgKyAoc2VsZi5fdER1ciAvIE1hdGguYWJzKHNlbGYuX3RzIHx8IHNlbGYuX3BhdXNlVFMpIHx8IDApO1xuICAgICAgICAgIHNlbGYuX2RpcnR5ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLl90RHVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNJbmZpbml0ZSA/IHNlbGYgOiBzZWxmLnRpbWVTY2FsZShzZWxmLnRvdGFsRHVyYXRpb24oKSAvIHZhbHVlKTtcbiAgICB9O1xuXG4gICAgVGltZWxpbmUudXBkYXRlUm9vdCA9IGZ1bmN0aW9uIHVwZGF0ZVJvb3QodGltZSkge1xuICAgICAgaWYgKF9nbG9iYWxUaW1lbGluZS5fdHMpIHtcbiAgICAgICAgX2xhenlTYWZlUmVuZGVyKF9nbG9iYWxUaW1lbGluZSwgX3BhcmVudFRvQ2hpbGRUb3RhbFRpbWUodGltZSwgX2dsb2JhbFRpbWVsaW5lKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGlja2VyLmZyYW1lID49IF9uZXh0R0NGcmFtZSkge1xuICAgICAgICBfbmV4dEdDRnJhbWUgKz0gX2NvbmZpZy5hdXRvU2xlZXAgfHwgMTIwO1xuICAgICAgICB2YXIgY2hpbGQgPSBfZ2xvYmFsVGltZWxpbmUuX2ZpcnN0O1xuICAgICAgICBpZiAoIWNoaWxkIHx8ICFjaGlsZC5fdHMpIGlmIChfY29uZmlnLmF1dG9TbGVlcCAmJiBfdGlja2VyLl9saXN0ZW5lcnMubGVuZ3RoIDwgMikge1xuICAgICAgICAgIHdoaWxlIChjaGlsZCAmJiAhY2hpbGQuX3RzKSB7XG4gICAgICAgICAgICBjaGlsZCA9IGNoaWxkLl9uZXh0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghY2hpbGQpIHtcbiAgICAgICAgICAgIF90aWNrZXIuc2xlZXAoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFRpbWVsaW5lO1xuICB9KEFuaW1hdGlvbik7XG5cbiAgX3NldERlZmF1bHRzKFRpbWVsaW5lLnByb3RvdHlwZSwge1xuICAgIF9sb2NrOiAwLFxuICAgIF9oYXNQYXVzZTogMCxcbiAgICBfZm9yY2luZzogMFxuICB9KTtcblxuICB2YXIgX2FkZENvbXBsZXhTdHJpbmdQcm9wVHdlZW4gPSBmdW5jdGlvbiBfYWRkQ29tcGxleFN0cmluZ1Byb3BUd2Vlbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIHNldHRlciwgc3RyaW5nRmlsdGVyLCBmdW5jUGFyYW0pIHtcbiAgICB2YXIgcHQgPSBuZXcgUHJvcFR3ZWVuKHRoaXMuX3B0LCB0YXJnZXQsIHByb3AsIDAsIDEsIF9yZW5kZXJDb21wbGV4U3RyaW5nLCBudWxsLCBzZXR0ZXIpLFxuICAgICAgICBpbmRleCA9IDAsXG4gICAgICAgIG1hdGNoSW5kZXggPSAwLFxuICAgICAgICByZXN1bHQsXG4gICAgICAgIHN0YXJ0TnVtcyxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIGVuZE51bSxcbiAgICAgICAgY2h1bmssXG4gICAgICAgIHN0YXJ0TnVtLFxuICAgICAgICBoYXNSYW5kb20sXG4gICAgICAgIGE7XG4gICAgcHQuYiA9IHN0YXJ0O1xuICAgIHB0LmUgPSBlbmQ7XG4gICAgc3RhcnQgKz0gXCJcIjtcbiAgICBlbmQgKz0gXCJcIjtcblxuICAgIGlmIChoYXNSYW5kb20gPSB+ZW5kLmluZGV4T2YoXCJyYW5kb20oXCIpKSB7XG4gICAgICBlbmQgPSBfcmVwbGFjZVJhbmRvbShlbmQpO1xuICAgIH1cblxuICAgIGlmIChzdHJpbmdGaWx0ZXIpIHtcbiAgICAgIGEgPSBbc3RhcnQsIGVuZF07XG4gICAgICBzdHJpbmdGaWx0ZXIoYSwgdGFyZ2V0LCBwcm9wKTtcbiAgICAgIHN0YXJ0ID0gYVswXTtcbiAgICAgIGVuZCA9IGFbMV07XG4gICAgfVxuXG4gICAgc3RhcnROdW1zID0gc3RhcnQubWF0Y2goX2NvbXBsZXhTdHJpbmdOdW1FeHApIHx8IFtdO1xuXG4gICAgd2hpbGUgKHJlc3VsdCA9IF9jb21wbGV4U3RyaW5nTnVtRXhwLmV4ZWMoZW5kKSkge1xuICAgICAgZW5kTnVtID0gcmVzdWx0WzBdO1xuICAgICAgY2h1bmsgPSBlbmQuc3Vic3RyaW5nKGluZGV4LCByZXN1bHQuaW5kZXgpO1xuXG4gICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSAoY29sb3IgKyAxKSAlIDU7XG4gICAgICB9IGVsc2UgaWYgKGNodW5rLnN1YnN0cigtNSkgPT09IFwicmdiYShcIikge1xuICAgICAgICBjb2xvciA9IDE7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmROdW0gIT09IHN0YXJ0TnVtc1ttYXRjaEluZGV4KytdKSB7XG4gICAgICAgIHN0YXJ0TnVtID0gcGFyc2VGbG9hdChzdGFydE51bXNbbWF0Y2hJbmRleCAtIDFdKTtcbiAgICAgICAgcHQuX3B0ID0ge1xuICAgICAgICAgIF9uZXh0OiBwdC5fcHQsXG4gICAgICAgICAgcDogY2h1bmsgfHwgbWF0Y2hJbmRleCA9PT0gMSA/IGNodW5rIDogXCIsXCIsXG4gICAgICAgICAgczogc3RhcnROdW0sXG4gICAgICAgICAgYzogZW5kTnVtLmNoYXJBdCgxKSA9PT0gXCI9XCIgPyBwYXJzZUZsb2F0KGVuZE51bS5zdWJzdHIoMikpICogKGVuZE51bS5jaGFyQXQoMCkgPT09IFwiLVwiID8gLTEgOiAxKSA6IHBhcnNlRmxvYXQoZW5kTnVtKSAtIHN0YXJ0TnVtLFxuICAgICAgICAgIG06IGNvbG9yICYmIGNvbG9yIDwgNCA/IE1hdGgucm91bmQgOiAwXG4gICAgICAgIH07XG4gICAgICAgIGluZGV4ID0gX2NvbXBsZXhTdHJpbmdOdW1FeHAubGFzdEluZGV4O1xuICAgICAgfVxuICAgIH1cblxuICAgIHB0LmMgPSBpbmRleCA8IGVuZC5sZW5ndGggPyBlbmQuc3Vic3RyaW5nKGluZGV4LCBlbmQubGVuZ3RoKSA6IFwiXCI7XG4gICAgcHQuZnAgPSBmdW5jUGFyYW07XG5cbiAgICBpZiAoX3JlbEV4cC50ZXN0KGVuZCkgfHwgaGFzUmFuZG9tKSB7XG4gICAgICBwdC5lID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLl9wdCA9IHB0O1xuICAgIHJldHVybiBwdDtcbiAgfSxcbiAgICAgIF9hZGRQcm9wVHdlZW4gPSBmdW5jdGlvbiBfYWRkUHJvcFR3ZWVuKHRhcmdldCwgcHJvcCwgc3RhcnQsIGVuZCwgaW5kZXgsIHRhcmdldHMsIG1vZGlmaWVyLCBzdHJpbmdGaWx0ZXIsIGZ1bmNQYXJhbSkge1xuICAgIGlmIChfaXNGdW5jdGlvbihlbmQpKSB7XG4gICAgICBlbmQgPSBlbmQoaW5kZXggfHwgMCwgdGFyZ2V0LCB0YXJnZXRzKTtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFZhbHVlID0gdGFyZ2V0W3Byb3BdLFxuICAgICAgICBwYXJzZWRTdGFydCA9IHN0YXJ0ICE9PSBcImdldFwiID8gc3RhcnQgOiAhX2lzRnVuY3Rpb24oY3VycmVudFZhbHVlKSA/IGN1cnJlbnRWYWx1ZSA6IGZ1bmNQYXJhbSA/IHRhcmdldFtwcm9wLmluZGV4T2YoXCJzZXRcIikgfHwgIV9pc0Z1bmN0aW9uKHRhcmdldFtcImdldFwiICsgcHJvcC5zdWJzdHIoMyldKSA/IHByb3AgOiBcImdldFwiICsgcHJvcC5zdWJzdHIoMyldKGZ1bmNQYXJhbSkgOiB0YXJnZXRbcHJvcF0oKSxcbiAgICAgICAgc2V0dGVyID0gIV9pc0Z1bmN0aW9uKGN1cnJlbnRWYWx1ZSkgPyBfc2V0dGVyUGxhaW4gOiBmdW5jUGFyYW0gPyBfc2V0dGVyRnVuY1dpdGhQYXJhbSA6IF9zZXR0ZXJGdW5jLFxuICAgICAgICBwdDtcblxuICAgIGlmIChfaXNTdHJpbmcoZW5kKSkge1xuICAgICAgaWYgKH5lbmQuaW5kZXhPZihcInJhbmRvbShcIikpIHtcbiAgICAgICAgZW5kID0gX3JlcGxhY2VSYW5kb20oZW5kKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVuZC5jaGFyQXQoMSkgPT09IFwiPVwiKSB7XG4gICAgICAgIGVuZCA9IHBhcnNlRmxvYXQocGFyc2VkU3RhcnQpICsgcGFyc2VGbG9hdChlbmQuc3Vic3RyKDIpKSAqIChlbmQuY2hhckF0KDApID09PSBcIi1cIiA/IC0xIDogMSkgKyAoZ2V0VW5pdChwYXJzZWRTdGFydCkgfHwgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZFN0YXJ0ICE9PSBlbmQpIHtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VkU3RhcnQgKyBlbmQpKSB7XG4gICAgICAgIHB0ID0gbmV3IFByb3BUd2Vlbih0aGlzLl9wdCwgdGFyZ2V0LCBwcm9wLCArcGFyc2VkU3RhcnQgfHwgMCwgZW5kIC0gKHBhcnNlZFN0YXJ0IHx8IDApLCB0eXBlb2YgY3VycmVudFZhbHVlID09PSBcImJvb2xlYW5cIiA/IF9yZW5kZXJCb29sZWFuIDogX3JlbmRlclBsYWluLCAwLCBzZXR0ZXIpO1xuXG4gICAgICAgIGlmIChmdW5jUGFyYW0pIHtcbiAgICAgICAgICBwdC5mcCA9IGZ1bmNQYXJhbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb2RpZmllcikge1xuICAgICAgICAgIHB0Lm1vZGlmaWVyKG1vZGlmaWVyLCB0aGlzLCB0YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3B0ID0gcHQ7XG4gICAgICB9XG5cbiAgICAgICFjdXJyZW50VmFsdWUgJiYgIShwcm9wIGluIHRhcmdldCkgJiYgX21pc3NpbmdQbHVnaW4ocHJvcCwgZW5kKTtcbiAgICAgIHJldHVybiBfYWRkQ29tcGxleFN0cmluZ1Byb3BUd2Vlbi5jYWxsKHRoaXMsIHRhcmdldCwgcHJvcCwgcGFyc2VkU3RhcnQsIGVuZCwgc2V0dGVyLCBzdHJpbmdGaWx0ZXIgfHwgX2NvbmZpZy5zdHJpbmdGaWx0ZXIsIGZ1bmNQYXJhbSk7XG4gICAgfVxuICB9LFxuICAgICAgX3Byb2Nlc3NWYXJzID0gZnVuY3Rpb24gX3Byb2Nlc3NWYXJzKHZhcnMsIGluZGV4LCB0YXJnZXQsIHRhcmdldHMsIHR3ZWVuKSB7XG4gICAgaWYgKF9pc0Z1bmN0aW9uKHZhcnMpKSB7XG4gICAgICB2YXJzID0gX3BhcnNlRnVuY09yU3RyaW5nKHZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0LCB0YXJnZXRzKTtcbiAgICB9XG5cbiAgICBpZiAoIV9pc09iamVjdCh2YXJzKSB8fCB2YXJzLnN0eWxlICYmIHZhcnMubm9kZVR5cGUgfHwgX2lzQXJyYXkodmFycykpIHtcbiAgICAgIHJldHVybiBfaXNTdHJpbmcodmFycykgPyBfcGFyc2VGdW5jT3JTdHJpbmcodmFycywgdHdlZW4sIGluZGV4LCB0YXJnZXQsIHRhcmdldHMpIDogdmFycztcbiAgICB9XG5cbiAgICB2YXIgY29weSA9IHt9LFxuICAgICAgICBwO1xuXG4gICAgZm9yIChwIGluIHZhcnMpIHtcbiAgICAgIGNvcHlbcF0gPSBfcGFyc2VGdW5jT3JTdHJpbmcodmFyc1twXSwgdHdlZW4sIGluZGV4LCB0YXJnZXQsIHRhcmdldHMpO1xuICAgIH1cblxuICAgIHJldHVybiBjb3B5O1xuICB9LFxuICAgICAgX2NoZWNrUGx1Z2luID0gZnVuY3Rpb24gX2NoZWNrUGx1Z2luKHByb3BlcnR5LCB2YXJzLCB0d2VlbiwgaW5kZXgsIHRhcmdldCwgdGFyZ2V0cykge1xuICAgIHZhciBwbHVnaW4sIHB0LCBwdExvb2t1cCwgaTtcblxuICAgIGlmIChfcGx1Z2luc1twcm9wZXJ0eV0gJiYgKHBsdWdpbiA9IG5ldyBfcGx1Z2luc1twcm9wZXJ0eV0oKSkuaW5pdCh0YXJnZXQsIHBsdWdpbi5yYXdWYXJzID8gdmFyc1twcm9wZXJ0eV0gOiBfcHJvY2Vzc1ZhcnModmFyc1twcm9wZXJ0eV0sIGluZGV4LCB0YXJnZXQsIHRhcmdldHMsIHR3ZWVuKSwgdHdlZW4sIGluZGV4LCB0YXJnZXRzKSAhPT0gZmFsc2UpIHtcbiAgICAgIHR3ZWVuLl9wdCA9IHB0ID0gbmV3IFByb3BUd2Vlbih0d2Vlbi5fcHQsIHRhcmdldCwgcHJvcGVydHksIDAsIDEsIHBsdWdpbi5yZW5kZXIsIHBsdWdpbiwgMCwgcGx1Z2luLnByaW9yaXR5KTtcblxuICAgICAgaWYgKHR3ZWVuICE9PSBfcXVpY2tUd2Vlbikge1xuICAgICAgICBwdExvb2t1cCA9IHR3ZWVuLl9wdExvb2t1cFt0d2Vlbi5fdGFyZ2V0cy5pbmRleE9mKHRhcmdldCldO1xuICAgICAgICBpID0gcGx1Z2luLl9wcm9wcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgIHB0TG9va3VwW3BsdWdpbi5fcHJvcHNbaV1dID0gcHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGx1Z2luO1xuICB9LFxuICAgICAgX292ZXJ3cml0aW5nVHdlZW4sXG4gICAgICBfaW5pdFR3ZWVuID0gZnVuY3Rpb24gX2luaXRUd2Vlbih0d2VlbiwgdGltZSkge1xuICAgIHZhciB2YXJzID0gdHdlZW4udmFycyxcbiAgICAgICAgZWFzZSA9IHZhcnMuZWFzZSxcbiAgICAgICAgc3RhcnRBdCA9IHZhcnMuc3RhcnRBdCxcbiAgICAgICAgaW1tZWRpYXRlUmVuZGVyID0gdmFycy5pbW1lZGlhdGVSZW5kZXIsXG4gICAgICAgIGxhenkgPSB2YXJzLmxhenksXG4gICAgICAgIG9uVXBkYXRlID0gdmFycy5vblVwZGF0ZSxcbiAgICAgICAgb25VcGRhdGVQYXJhbXMgPSB2YXJzLm9uVXBkYXRlUGFyYW1zLFxuICAgICAgICBjYWxsYmFja1Njb3BlID0gdmFycy5jYWxsYmFja1Njb3BlLFxuICAgICAgICBydW5CYWNrd2FyZHMgPSB2YXJzLnJ1bkJhY2t3YXJkcyxcbiAgICAgICAgeW95b0Vhc2UgPSB2YXJzLnlveW9FYXNlLFxuICAgICAgICBrZXlmcmFtZXMgPSB2YXJzLmtleWZyYW1lcyxcbiAgICAgICAgYXV0b1JldmVydCA9IHZhcnMuYXV0b1JldmVydCxcbiAgICAgICAgZHVyID0gdHdlZW4uX2R1cixcbiAgICAgICAgcHJldlN0YXJ0QXQgPSB0d2Vlbi5fc3RhcnRBdCxcbiAgICAgICAgdGFyZ2V0cyA9IHR3ZWVuLl90YXJnZXRzLFxuICAgICAgICBwYXJlbnQgPSB0d2Vlbi5wYXJlbnQsXG4gICAgICAgIGZ1bGxUYXJnZXRzID0gcGFyZW50ICYmIHBhcmVudC5kYXRhID09PSBcIm5lc3RlZFwiID8gcGFyZW50LnBhcmVudC5fdGFyZ2V0cyA6IHRhcmdldHMsXG4gICAgICAgIGF1dG9PdmVyd3JpdGUgPSB0d2Vlbi5fb3ZlcndyaXRlID09PSBcImF1dG9cIixcbiAgICAgICAgdGwgPSB0d2Vlbi50aW1lbGluZSxcbiAgICAgICAgY2xlYW5WYXJzLFxuICAgICAgICBpLFxuICAgICAgICBwLFxuICAgICAgICBwdCxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICBoYXNQcmlvcml0eSxcbiAgICAgICAgZ3NEYXRhLFxuICAgICAgICBoYXJuZXNzLFxuICAgICAgICBwbHVnaW4sXG4gICAgICAgIHB0TG9va3VwLFxuICAgICAgICBpbmRleCxcbiAgICAgICAgaGFybmVzc1ZhcnM7XG5cbiAgICBpZiAodGwgJiYgKCFrZXlmcmFtZXMgfHwgIWVhc2UpKSB7XG4gICAgICBlYXNlID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgdHdlZW4uX2Vhc2UgPSBfcGFyc2VFYXNlKGVhc2UsIF9kZWZhdWx0cy5lYXNlKTtcbiAgICB0d2Vlbi5feUVhc2UgPSB5b3lvRWFzZSA/IF9pbnZlcnRFYXNlKF9wYXJzZUVhc2UoeW95b0Vhc2UgPT09IHRydWUgPyBlYXNlIDogeW95b0Vhc2UsIF9kZWZhdWx0cy5lYXNlKSkgOiAwO1xuXG4gICAgaWYgKHlveW9FYXNlICYmIHR3ZWVuLl95b3lvICYmICF0d2Vlbi5fcmVwZWF0KSB7XG4gICAgICB5b3lvRWFzZSA9IHR3ZWVuLl95RWFzZTtcbiAgICAgIHR3ZWVuLl95RWFzZSA9IHR3ZWVuLl9lYXNlO1xuICAgICAgdHdlZW4uX2Vhc2UgPSB5b3lvRWFzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRsKSB7XG4gICAgICBpZiAocHJldlN0YXJ0QXQpIHtcbiAgICAgICAgcHJldlN0YXJ0QXQucmVuZGVyKC0xLCB0cnVlKS5raWxsKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGFydEF0KSB7XG4gICAgICAgIF9yZW1vdmVGcm9tUGFyZW50KHR3ZWVuLl9zdGFydEF0ID0gVHdlZW4uc2V0KHRhcmdldHMsIF9zZXREZWZhdWx0cyh7XG4gICAgICAgICAgZGF0YTogXCJpc1N0YXJ0XCIsXG4gICAgICAgICAgb3ZlcndyaXRlOiBmYWxzZSxcbiAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICBpbW1lZGlhdGVSZW5kZXI6IHRydWUsXG4gICAgICAgICAgbGF6eTogX2lzTm90RmFsc2UobGF6eSksXG4gICAgICAgICAgc3RhcnRBdDogbnVsbCxcbiAgICAgICAgICBkZWxheTogMCxcbiAgICAgICAgICBvblVwZGF0ZTogb25VcGRhdGUsXG4gICAgICAgICAgb25VcGRhdGVQYXJhbXM6IG9uVXBkYXRlUGFyYW1zLFxuICAgICAgICAgIGNhbGxiYWNrU2NvcGU6IGNhbGxiYWNrU2NvcGUsXG4gICAgICAgICAgc3RhZ2dlcjogMFxuICAgICAgICB9LCBzdGFydEF0KSkpO1xuXG4gICAgICAgIGlmIChpbW1lZGlhdGVSZW5kZXIpIHtcbiAgICAgICAgICBpZiAodGltZSA+IDApIHtcbiAgICAgICAgICAgICFhdXRvUmV2ZXJ0ICYmICh0d2Vlbi5fc3RhcnRBdCA9IDApO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZHVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHJ1bkJhY2t3YXJkcyAmJiBkdXIpIHtcbiAgICAgICAgaWYgKHByZXZTdGFydEF0KSB7XG4gICAgICAgICAgIWF1dG9SZXZlcnQgJiYgKHR3ZWVuLl9zdGFydEF0ID0gMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRpbWUpIHtcbiAgICAgICAgICAgIGltbWVkaWF0ZVJlbmRlciA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9yZW1vdmVGcm9tUGFyZW50KHR3ZWVuLl9zdGFydEF0ID0gVHdlZW4uc2V0KHRhcmdldHMsIF9tZXJnZShfY29weUV4Y2x1ZGluZyh2YXJzLCBfcmVzZXJ2ZWRQcm9wcyksIHtcbiAgICAgICAgICAgIG92ZXJ3cml0ZTogZmFsc2UsXG4gICAgICAgICAgICBkYXRhOiBcImlzRnJvbVN0YXJ0XCIsXG4gICAgICAgICAgICBsYXp5OiBpbW1lZGlhdGVSZW5kZXIgJiYgX2lzTm90RmFsc2UobGF6eSksXG4gICAgICAgICAgICBpbW1lZGlhdGVSZW5kZXI6IGltbWVkaWF0ZVJlbmRlcixcbiAgICAgICAgICAgIHN0YWdnZXI6IDAsXG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudFxuICAgICAgICAgIH0pKSk7XG5cbiAgICAgICAgICBpZiAoIWltbWVkaWF0ZVJlbmRlcikge1xuICAgICAgICAgICAgX2luaXRUd2Vlbih0d2Vlbi5fc3RhcnRBdCwgX3RpbnlOdW0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXRpbWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2xlYW5WYXJzID0gX2NvcHlFeGNsdWRpbmcodmFycywgX3Jlc2VydmVkUHJvcHMpO1xuICAgICAgdHdlZW4uX3B0ID0gMDtcbiAgICAgIGhhcm5lc3MgPSB0YXJnZXRzWzBdID8gX2dldENhY2hlKHRhcmdldHNbMF0pLmhhcm5lc3MgOiAwO1xuICAgICAgaGFybmVzc1ZhcnMgPSBoYXJuZXNzICYmIHZhcnNbaGFybmVzcy5wcm9wXTtcbiAgICAgIGxhenkgPSBkdXIgJiYgX2lzTm90RmFsc2UobGF6eSkgfHwgbGF6eSAmJiAhZHVyO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXRzW2ldO1xuICAgICAgICBnc0RhdGEgPSB0YXJnZXQuX2dzYXAgfHwgX2hhcm5lc3ModGFyZ2V0cylbaV0uX2dzYXA7XG4gICAgICAgIHR3ZWVuLl9wdExvb2t1cFtpXSA9IHB0TG9va3VwID0ge307XG5cbiAgICAgICAgaWYgKF9sYXp5TG9va3VwW2dzRGF0YS5pZF0pIHtcbiAgICAgICAgICBfbGF6eVJlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5kZXggPSBmdWxsVGFyZ2V0cyA9PT0gdGFyZ2V0cyA/IGkgOiBmdWxsVGFyZ2V0cy5pbmRleE9mKHRhcmdldCk7XG5cbiAgICAgICAgaWYgKGhhcm5lc3MgJiYgKHBsdWdpbiA9IG5ldyBoYXJuZXNzKCkpLmluaXQodGFyZ2V0LCBoYXJuZXNzVmFycyB8fCBjbGVhblZhcnMsIHR3ZWVuLCBpbmRleCwgZnVsbFRhcmdldHMpICE9PSBmYWxzZSkge1xuICAgICAgICAgIHR3ZWVuLl9wdCA9IHB0ID0gbmV3IFByb3BUd2Vlbih0d2Vlbi5fcHQsIHRhcmdldCwgcGx1Z2luLm5hbWUsIDAsIDEsIHBsdWdpbi5yZW5kZXIsIHBsdWdpbiwgMCwgcGx1Z2luLnByaW9yaXR5KTtcblxuICAgICAgICAgIHBsdWdpbi5fcHJvcHMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcHRMb29rdXBbbmFtZV0gPSBwdDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChwbHVnaW4ucHJpb3JpdHkpIHtcbiAgICAgICAgICAgIGhhc1ByaW9yaXR5ID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhcm5lc3MgfHwgaGFybmVzc1ZhcnMpIHtcbiAgICAgICAgICBmb3IgKHAgaW4gY2xlYW5WYXJzKSB7XG4gICAgICAgICAgICBpZiAoX3BsdWdpbnNbcF0gJiYgKHBsdWdpbiA9IF9jaGVja1BsdWdpbihwLCBjbGVhblZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0LCBmdWxsVGFyZ2V0cykpKSB7XG4gICAgICAgICAgICAgIGlmIChwbHVnaW4ucHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICBoYXNQcmlvcml0eSA9IDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHB0TG9va3VwW3BdID0gcHQgPSBfYWRkUHJvcFR3ZWVuLmNhbGwodHdlZW4sIHRhcmdldCwgcCwgXCJnZXRcIiwgY2xlYW5WYXJzW3BdLCBpbmRleCwgZnVsbFRhcmdldHMsIDAsIHZhcnMuc3RyaW5nRmlsdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHdlZW4uX29wICYmIHR3ZWVuLl9vcFtpXSkge1xuICAgICAgICAgIHR3ZWVuLmtpbGwodGFyZ2V0LCB0d2Vlbi5fb3BbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF1dG9PdmVyd3JpdGUpIHtcbiAgICAgICAgICBfb3ZlcndyaXRpbmdUd2VlbiA9IHR3ZWVuO1xuXG4gICAgICAgICAgX2dsb2JhbFRpbWVsaW5lLmtpbGxUd2VlbnNPZih0YXJnZXQsIHB0TG9va3VwLCBcInN0YXJ0ZWRcIik7XG5cbiAgICAgICAgICBfb3ZlcndyaXRpbmdUd2VlbiA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHdlZW4uX3B0ICYmIGxhenkpIHtcbiAgICAgICAgICBfbGF6eUxvb2t1cFtnc0RhdGEuaWRdID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaGFzUHJpb3JpdHkpIHtcbiAgICAgICAgX3NvcnRQcm9wVHdlZW5zQnlQcmlvcml0eSh0d2Vlbik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0d2Vlbi5fb25Jbml0KSB7XG4gICAgICAgIHR3ZWVuLl9vbkluaXQodHdlZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHR3ZWVuLl9mcm9tID0gIXRsICYmICEhdmFycy5ydW5CYWNrd2FyZHM7XG4gICAgdHdlZW4uX29uVXBkYXRlID0gb25VcGRhdGU7XG4gICAgdHdlZW4uX2luaXR0ZWQgPSAxO1xuICB9LFxuICAgICAgX2FkZEFsaWFzZXNUb1ZhcnMgPSBmdW5jdGlvbiBfYWRkQWxpYXNlc1RvVmFycyh0YXJnZXRzLCB2YXJzKSB7XG4gICAgdmFyIGhhcm5lc3MgPSB0YXJnZXRzWzBdID8gX2dldENhY2hlKHRhcmdldHNbMF0pLmhhcm5lc3MgOiAwLFxuICAgICAgICBwcm9wZXJ0eUFsaWFzZXMgPSBoYXJuZXNzICYmIGhhcm5lc3MuYWxpYXNlcyxcbiAgICAgICAgY29weSxcbiAgICAgICAgcCxcbiAgICAgICAgaSxcbiAgICAgICAgYWxpYXNlcztcblxuICAgIGlmICghcHJvcGVydHlBbGlhc2VzKSB7XG4gICAgICByZXR1cm4gdmFycztcbiAgICB9XG5cbiAgICBjb3B5ID0gX21lcmdlKHt9LCB2YXJzKTtcblxuICAgIGZvciAocCBpbiBwcm9wZXJ0eUFsaWFzZXMpIHtcbiAgICAgIGlmIChwIGluIGNvcHkpIHtcbiAgICAgICAgYWxpYXNlcyA9IHByb3BlcnR5QWxpYXNlc1twXS5zcGxpdChcIixcIik7XG4gICAgICAgIGkgPSBhbGlhc2VzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgY29weVthbGlhc2VzW2ldXSA9IGNvcHlbcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29weTtcbiAgfSxcbiAgICAgIF9wYXJzZUZ1bmNPclN0cmluZyA9IGZ1bmN0aW9uIF9wYXJzZUZ1bmNPclN0cmluZyh2YWx1ZSwgdHdlZW4sIGksIHRhcmdldCwgdGFyZ2V0cykge1xuICAgIHJldHVybiBfaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKHR3ZWVuLCBpLCB0YXJnZXQsIHRhcmdldHMpIDogX2lzU3RyaW5nKHZhbHVlKSAmJiB+dmFsdWUuaW5kZXhPZihcInJhbmRvbShcIikgPyBfcmVwbGFjZVJhbmRvbSh2YWx1ZSkgOiB2YWx1ZTtcbiAgfSxcbiAgICAgIF9zdGFnZ2VyVHdlZW5Qcm9wcyA9IF9jYWxsYmFja05hbWVzICsgXCIscmVwZWF0LHJlcGVhdERlbGF5LHlveW8scmVwZWF0UmVmcmVzaCx5b3lvRWFzZVwiLFxuICAgICAgX3N0YWdnZXJQcm9wc1RvU2tpcCA9IChfc3RhZ2dlclR3ZWVuUHJvcHMgKyBcIixpZCxzdGFnZ2VyLGRlbGF5LGR1cmF0aW9uLHBhdXNlZFwiKS5zcGxpdChcIixcIik7XG5cbiAgdmFyIFR3ZWVuID0gZnVuY3Rpb24gKF9BbmltYXRpb24yKSB7XG4gICAgX2luaGVyaXRzTG9vc2UoVHdlZW4sIF9BbmltYXRpb24yKTtcblxuICAgIGZ1bmN0aW9uIFR3ZWVuKHRhcmdldHMsIHZhcnMsIHRpbWUpIHtcbiAgICAgIHZhciBfdGhpczQ7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFycyA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICB0aW1lLmR1cmF0aW9uID0gdmFycztcbiAgICAgICAgdmFycyA9IHRpbWU7XG4gICAgICAgIHRpbWUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBfdGhpczQgPSBfQW5pbWF0aW9uMi5jYWxsKHRoaXMsIF9pbmhlcml0RGVmYXVsdHModmFycyksIHRpbWUpIHx8IHRoaXM7XG4gICAgICB2YXIgX3RoaXM0JHZhcnMgPSBfdGhpczQudmFycyxcbiAgICAgICAgICBkdXJhdGlvbiA9IF90aGlzNCR2YXJzLmR1cmF0aW9uLFxuICAgICAgICAgIGRlbGF5ID0gX3RoaXM0JHZhcnMuZGVsYXksXG4gICAgICAgICAgaW1tZWRpYXRlUmVuZGVyID0gX3RoaXM0JHZhcnMuaW1tZWRpYXRlUmVuZGVyLFxuICAgICAgICAgIHN0YWdnZXIgPSBfdGhpczQkdmFycy5zdGFnZ2VyLFxuICAgICAgICAgIG92ZXJ3cml0ZSA9IF90aGlzNCR2YXJzLm92ZXJ3cml0ZSxcbiAgICAgICAgICBrZXlmcmFtZXMgPSBfdGhpczQkdmFycy5rZXlmcmFtZXMsXG4gICAgICAgICAgZGVmYXVsdHMgPSBfdGhpczQkdmFycy5kZWZhdWx0cyxcbiAgICAgICAgICBwYXJzZWRUYXJnZXRzID0gX2lzQXJyYXkodGFyZ2V0cykgJiYgX2lzTnVtYmVyKHRhcmdldHNbMF0pID8gW3RhcmdldHNdIDogdG9BcnJheSh0YXJnZXRzKSxcbiAgICAgICAgICB0bCxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGNvcHksXG4gICAgICAgICAgbCxcbiAgICAgICAgICBwLFxuICAgICAgICAgIGN1clRhcmdldCxcbiAgICAgICAgICBzdGFnZ2VyRnVuYyxcbiAgICAgICAgICBzdGFnZ2VyVmFyc1RvTWVyZ2U7XG4gICAgICBfdGhpczQuX3RhcmdldHMgPSBwYXJzZWRUYXJnZXRzLmxlbmd0aCA/IF9oYXJuZXNzKHBhcnNlZFRhcmdldHMpIDogX3dhcm4oXCJHU0FQIHRhcmdldCBcIiArIHRhcmdldHMgKyBcIiBub3QgZm91bmQuIGh0dHBzOi8vZ3JlZW5zb2NrLmNvbVwiLCAhX2NvbmZpZy5udWxsVGFyZ2V0V2FybikgfHwgW107XG4gICAgICBfdGhpczQuX3B0TG9va3VwID0gW107XG4gICAgICBfdGhpczQuX292ZXJ3cml0ZSA9IG92ZXJ3cml0ZTtcblxuICAgICAgaWYgKGtleWZyYW1lcyB8fCBzdGFnZ2VyIHx8IF9pc0Z1bmNPclN0cmluZyhkdXJhdGlvbikgfHwgX2lzRnVuY09yU3RyaW5nKGRlbGF5KSkge1xuICAgICAgICB2YXJzID0gX3RoaXM0LnZhcnM7XG4gICAgICAgIHRsID0gX3RoaXM0LnRpbWVsaW5lID0gbmV3IFRpbWVsaW5lKHtcbiAgICAgICAgICBkYXRhOiBcIm5lc3RlZFwiLFxuICAgICAgICAgIGRlZmF1bHRzOiBkZWZhdWx0cyB8fCB7fVxuICAgICAgICB9KTtcbiAgICAgICAgdGwua2lsbCgpO1xuICAgICAgICB0bC5wYXJlbnQgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzNCk7XG5cbiAgICAgICAgaWYgKGtleWZyYW1lcykge1xuICAgICAgICAgIF9zZXREZWZhdWx0cyh0bC52YXJzLmRlZmF1bHRzLCB7XG4gICAgICAgICAgICBlYXNlOiBcIm5vbmVcIlxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAga2V5ZnJhbWVzLmZvckVhY2goZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGwudG8ocGFyc2VkVGFyZ2V0cywgZnJhbWUsIFwiPlwiKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsID0gcGFyc2VkVGFyZ2V0cy5sZW5ndGg7XG4gICAgICAgICAgc3RhZ2dlckZ1bmMgPSBzdGFnZ2VyID8gZGlzdHJpYnV0ZShzdGFnZ2VyKSA6IF9lbXB0eUZ1bmM7XG5cbiAgICAgICAgICBpZiAoX2lzT2JqZWN0KHN0YWdnZXIpKSB7XG4gICAgICAgICAgICBmb3IgKHAgaW4gc3RhZ2dlcikge1xuICAgICAgICAgICAgICBpZiAofl9zdGFnZ2VyVHdlZW5Qcm9wcy5pbmRleE9mKHApKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdGFnZ2VyVmFyc1RvTWVyZ2UpIHtcbiAgICAgICAgICAgICAgICAgIHN0YWdnZXJWYXJzVG9NZXJnZSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0YWdnZXJWYXJzVG9NZXJnZVtwXSA9IHN0YWdnZXJbcF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBjb3B5ID0ge307XG5cbiAgICAgICAgICAgIGZvciAocCBpbiB2YXJzKSB7XG4gICAgICAgICAgICAgIGlmIChfc3RhZ2dlclByb3BzVG9Ta2lwLmluZGV4T2YocCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgY29weVtwXSA9IHZhcnNbcF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29weS5zdGFnZ2VyID0gMDtcblxuICAgICAgICAgICAgaWYgKHN0YWdnZXJWYXJzVG9NZXJnZSkge1xuICAgICAgICAgICAgICBfbWVyZ2UoY29weSwgc3RhZ2dlclZhcnNUb01lcmdlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhcnMueW95b0Vhc2UgJiYgIXZhcnMucmVwZWF0KSB7XG4gICAgICAgICAgICAgIGNvcHkueW95b0Vhc2UgPSB2YXJzLnlveW9FYXNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJUYXJnZXQgPSBwYXJzZWRUYXJnZXRzW2ldO1xuICAgICAgICAgICAgY29weS5kdXJhdGlvbiA9ICtfcGFyc2VGdW5jT3JTdHJpbmcoZHVyYXRpb24sIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXM0KSwgaSwgY3VyVGFyZ2V0LCBwYXJzZWRUYXJnZXRzKTtcbiAgICAgICAgICAgIGNvcHkuZGVsYXkgPSAoK19wYXJzZUZ1bmNPclN0cmluZyhkZWxheSwgX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpczQpLCBpLCBjdXJUYXJnZXQsIHBhcnNlZFRhcmdldHMpIHx8IDApIC0gX3RoaXM0Ll9kZWxheTtcblxuICAgICAgICAgICAgaWYgKCFzdGFnZ2VyICYmIGwgPT09IDEgJiYgY29weS5kZWxheSkge1xuICAgICAgICAgICAgICBfdGhpczQuX2RlbGF5ID0gZGVsYXkgPSBjb3B5LmRlbGF5O1xuICAgICAgICAgICAgICBfdGhpczQuX3N0YXJ0ICs9IGRlbGF5O1xuICAgICAgICAgICAgICBjb3B5LmRlbGF5ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGwudG8oY3VyVGFyZ2V0LCBjb3B5LCBzdGFnZ2VyRnVuYyhpLCBjdXJUYXJnZXQsIHBhcnNlZFRhcmdldHMpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkdXJhdGlvbiA9IGRlbGF5ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGR1cmF0aW9uIHx8IF90aGlzNC5kdXJhdGlvbihkdXJhdGlvbiA9IHRsLmR1cmF0aW9uKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXM0LnRpbWVsaW5lID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKG92ZXJ3cml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICBfb3ZlcndyaXRpbmdUd2VlbiA9IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXM0KTtcblxuICAgICAgICBfZ2xvYmFsVGltZWxpbmUua2lsbFR3ZWVuc09mKHBhcnNlZFRhcmdldHMpO1xuXG4gICAgICAgIF9vdmVyd3JpdGluZ1R3ZWVuID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGltbWVkaWF0ZVJlbmRlciB8fCAhZHVyYXRpb24gJiYgIWtleWZyYW1lcyAmJiBfdGhpczQuX3N0YXJ0ID09PSBfdGhpczQucGFyZW50Ll90aW1lICYmIF9pc05vdEZhbHNlKGltbWVkaWF0ZVJlbmRlcikgJiYgX2hhc05vUGF1c2VkQW5jZXN0b3JzKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXM0KSkgJiYgX3RoaXM0LnBhcmVudC5kYXRhICE9PSBcIm5lc3RlZFwiKSB7XG4gICAgICAgIF90aGlzNC5fdFRpbWUgPSAtX3RpbnlOdW07XG5cbiAgICAgICAgX3RoaXM0LnJlbmRlcihNYXRoLm1heCgwLCAtZGVsYXkpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF90aGlzNDtcbiAgICB9XG5cbiAgICB2YXIgX3Byb3RvMyA9IFR3ZWVuLnByb3RvdHlwZTtcblxuICAgIF9wcm90bzMucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKHRvdGFsVGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG4gICAgICB2YXIgcHJldlRpbWUgPSB0aGlzLl90aW1lLFxuICAgICAgICAgIHREdXIgPSB0aGlzLl90RHVyLFxuICAgICAgICAgIGR1ciA9IHRoaXMuX2R1cixcbiAgICAgICAgICB0VGltZSA9IHRvdGFsVGltZSA+IHREdXIgLSBfdGlueU51bSAmJiB0b3RhbFRpbWUgPj0gMCA/IHREdXIgOiB0b3RhbFRpbWUgPCBfdGlueU51bSA/IDAgOiB0b3RhbFRpbWUsXG4gICAgICAgICAgdGltZSxcbiAgICAgICAgICBwdCxcbiAgICAgICAgICBpdGVyYXRpb24sXG4gICAgICAgICAgY3ljbGVEdXJhdGlvbixcbiAgICAgICAgICBwcmV2SXRlcmF0aW9uLFxuICAgICAgICAgIGlzWW95byxcbiAgICAgICAgICByYXRpbyxcbiAgICAgICAgICB0aW1lbGluZSxcbiAgICAgICAgICB5b3lvRWFzZTtcblxuICAgICAgaWYgKCFkdXIpIHtcbiAgICAgICAgX3JlbmRlclplcm9EdXJhdGlvblR3ZWVuKHRoaXMsIHRvdGFsVGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcbiAgICAgIH0gZWxzZSBpZiAodFRpbWUgIT09IHRoaXMuX3RUaW1lIHx8ICF0b3RhbFRpbWUgfHwgZm9yY2UgfHwgdGhpcy5fc3RhcnRBdCAmJiB0aGlzLl96VGltZSA8IDAgIT09IHRvdGFsVGltZSA8IDApIHtcbiAgICAgICAgdGltZSA9IHRUaW1lO1xuICAgICAgICB0aW1lbGluZSA9IHRoaXMudGltZWxpbmU7XG5cbiAgICAgICAgaWYgKHRoaXMuX3JlcGVhdCkge1xuICAgICAgICAgIGN5Y2xlRHVyYXRpb24gPSBkdXIgKyB0aGlzLl9yRGVsYXk7XG4gICAgICAgICAgdGltZSA9IF9yb3VuZCh0VGltZSAlIGN5Y2xlRHVyYXRpb24pO1xuXG4gICAgICAgICAgaWYgKHRpbWUgPiBkdXIpIHtcbiAgICAgICAgICAgIHRpbWUgPSBkdXI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaXRlcmF0aW9uID0gfn4odFRpbWUgLyBjeWNsZUR1cmF0aW9uKTtcblxuICAgICAgICAgIGlmIChpdGVyYXRpb24gJiYgaXRlcmF0aW9uID09PSB0VGltZSAvIGN5Y2xlRHVyYXRpb24pIHtcbiAgICAgICAgICAgIHRpbWUgPSBkdXI7XG4gICAgICAgICAgICBpdGVyYXRpb24tLTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpc1lveW8gPSB0aGlzLl95b3lvICYmIGl0ZXJhdGlvbiAmIDE7XG5cbiAgICAgICAgICBpZiAoaXNZb3lvKSB7XG4gICAgICAgICAgICB5b3lvRWFzZSA9IHRoaXMuX3lFYXNlO1xuICAgICAgICAgICAgdGltZSA9IGR1ciAtIHRpbWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJldkl0ZXJhdGlvbiA9IH5+KHRoaXMuX3RUaW1lIC8gY3ljbGVEdXJhdGlvbik7XG5cbiAgICAgICAgICBpZiAocHJldkl0ZXJhdGlvbiAmJiBwcmV2SXRlcmF0aW9uID09PSB0aGlzLl90VGltZSAvIGN5Y2xlRHVyYXRpb24pIHtcbiAgICAgICAgICAgIHByZXZJdGVyYXRpb24tLTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGltZSA9PT0gcHJldlRpbWUgJiYgIWZvcmNlICYmIHRoaXMuX2luaXR0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpdGVyYXRpb24gIT09IHByZXZJdGVyYXRpb24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnZhcnMucmVwZWF0UmVmcmVzaCAmJiAhdGhpcy5fbG9jaykge1xuICAgICAgICAgICAgICB0aGlzLl9sb2NrID0gZm9yY2UgPSAxO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcihjeWNsZUR1cmF0aW9uICogaXRlcmF0aW9uLCB0cnVlKS5pbnZhbGlkYXRlKCkuX2xvY2sgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5faW5pdHRlZCAmJiBfYXR0ZW1wdEluaXRUd2Vlbih0aGlzLCB0aW1lLCBmb3JjZSwgc3VwcHJlc3NFdmVudHMpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90VGltZSA9IHRUaW1lO1xuICAgICAgICB0aGlzLl90aW1lID0gdGltZTtcblxuICAgICAgICBpZiAoIXRoaXMuX2FjdCAmJiB0aGlzLl90cykge1xuICAgICAgICAgIHRoaXMuX2FjdCA9IDE7XG4gICAgICAgICAgdGhpcy5fbGF6eSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJhdGlvID0gcmF0aW8gPSAoeW95b0Vhc2UgfHwgdGhpcy5fZWFzZSkodGltZSAvIGR1cik7XG5cbiAgICAgICAgaWYgKHRoaXMuX2Zyb20pIHtcbiAgICAgICAgICB0aGlzLnJhdGlvID0gcmF0aW8gPSAxIC0gcmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXByZXZUaW1lICYmIHRpbWUgJiYgIXN1cHByZXNzRXZlbnRzKSB7XG4gICAgICAgICAgX2NhbGxiYWNrKHRoaXMsIFwib25TdGFydFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB0ID0gdGhpcy5fcHQ7XG5cbiAgICAgICAgd2hpbGUgKHB0KSB7XG4gICAgICAgICAgcHQucihyYXRpbywgcHQuZCk7XG4gICAgICAgICAgcHQgPSBwdC5fbmV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVsaW5lICYmIHRpbWVsaW5lLnJlbmRlcih0b3RhbFRpbWUgPCAwID8gdG90YWxUaW1lIDogIXRpbWUgJiYgaXNZb3lvID8gLV90aW55TnVtIDogdGltZWxpbmUuX2R1ciAqIHJhdGlvLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHx8IHRoaXMuX3N0YXJ0QXQgJiYgKHRoaXMuX3pUaW1lID0gdG90YWxUaW1lKTtcblxuICAgICAgICBpZiAodGhpcy5fb25VcGRhdGUgJiYgIXN1cHByZXNzRXZlbnRzKSB7XG4gICAgICAgICAgaWYgKHRvdGFsVGltZSA8IDAgJiYgdGhpcy5fc3RhcnRBdCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdC5yZW5kZXIodG90YWxUaW1lLCB0cnVlLCBmb3JjZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX2NhbGxiYWNrKHRoaXMsIFwib25VcGRhdGVcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcmVwZWF0KSBpZiAoaXRlcmF0aW9uICE9PSBwcmV2SXRlcmF0aW9uICYmIHRoaXMudmFycy5vblJlcGVhdCAmJiAhc3VwcHJlc3NFdmVudHMgJiYgdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICBfY2FsbGJhY2sodGhpcywgXCJvblJlcGVhdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgodFRpbWUgPT09IHREdXIgfHwgIXRUaW1lKSAmJiB0aGlzLl90VGltZSA9PT0gdFRpbWUpIHtcbiAgICAgICAgICBpZiAodG90YWxUaW1lIDwgMCAmJiB0aGlzLl9zdGFydEF0ICYmICF0aGlzLl9vblVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdC5yZW5kZXIodG90YWxUaW1lLCB0cnVlLCBmb3JjZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgKHRvdGFsVGltZSB8fCAhZHVyKSAmJiAodFRpbWUgfHwgdGhpcy5fdHMgPCAwKSAmJiBfcmVtb3ZlRnJvbVBhcmVudCh0aGlzLCAxKTtcblxuICAgICAgICAgIGlmICghc3VwcHJlc3NFdmVudHMgJiYgISh0b3RhbFRpbWUgPCAwICYmICFwcmV2VGltZSkpIHtcbiAgICAgICAgICAgIF9jYWxsYmFjayh0aGlzLCB0VGltZSA9PT0gdER1ciA/IFwib25Db21wbGV0ZVwiIDogXCJvblJldmVyc2VDb21wbGV0ZVwiLCB0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvbSAmJiB0aGlzLl9wcm9tKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfcHJvdG8zLnRhcmdldHMgPSBmdW5jdGlvbiB0YXJnZXRzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3RhcmdldHM7XG4gICAgfTtcblxuICAgIF9wcm90bzMuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uIGludmFsaWRhdGUoKSB7XG4gICAgICB0aGlzLl9wdCA9IHRoaXMuX29wID0gdGhpcy5fc3RhcnRBdCA9IHRoaXMuX29uVXBkYXRlID0gdGhpcy5fYWN0ID0gdGhpcy5fbGF6eSA9IDA7XG4gICAgICB0aGlzLl9wdExvb2t1cCA9IFtdO1xuXG4gICAgICBpZiAodGhpcy50aW1lbGluZSkge1xuICAgICAgICB0aGlzLnRpbWVsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9BbmltYXRpb24yLnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyk7XG4gICAgfTtcblxuICAgIF9wcm90bzMua2lsbCA9IGZ1bmN0aW9uIGtpbGwodGFyZ2V0cywgdmFycykge1xuICAgICAgaWYgKHZhcnMgPT09IHZvaWQgMCkge1xuICAgICAgICB2YXJzID0gXCJhbGxcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0YXJnZXRzICYmICghdmFycyB8fCB2YXJzID09PSBcImFsbFwiKSkge1xuICAgICAgICB0aGlzLl9sYXp5ID0gMDtcblxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm4gX2ludGVycnVwdCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50aW1lbGluZSkge1xuICAgICAgICB0aGlzLnRpbWVsaW5lLmtpbGxUd2VlbnNPZih0YXJnZXRzLCB2YXJzLCAhIV9vdmVyd3JpdGluZ1R3ZWVuKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJzZWRUYXJnZXRzID0gdGhpcy5fdGFyZ2V0cyxcbiAgICAgICAgICBraWxsaW5nVGFyZ2V0cyA9IHRhcmdldHMgPyB0b0FycmF5KHRhcmdldHMpIDogcGFyc2VkVGFyZ2V0cyxcbiAgICAgICAgICBwcm9wVHdlZW5Mb29rdXAgPSB0aGlzLl9wdExvb2t1cCxcbiAgICAgICAgICBmaXJzdFBUID0gdGhpcy5fcHQsXG4gICAgICAgICAgb3ZlcndyaXR0ZW5Qcm9wcyxcbiAgICAgICAgICBjdXJMb29rdXAsXG4gICAgICAgICAgY3VyT3ZlcndyaXRlUHJvcHMsXG4gICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgcCxcbiAgICAgICAgICBwdCxcbiAgICAgICAgICBpO1xuXG4gICAgICBpZiAoKCF2YXJzIHx8IHZhcnMgPT09IFwiYWxsXCIpICYmIF9hcnJheXNNYXRjaChwYXJzZWRUYXJnZXRzLCBraWxsaW5nVGFyZ2V0cykpIHtcbiAgICAgICAgcmV0dXJuIF9pbnRlcnJ1cHQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIG92ZXJ3cml0dGVuUHJvcHMgPSB0aGlzLl9vcCA9IHRoaXMuX29wIHx8IFtdO1xuXG4gICAgICBpZiAodmFycyAhPT0gXCJhbGxcIikge1xuICAgICAgICBpZiAoX2lzU3RyaW5nKHZhcnMpKSB7XG4gICAgICAgICAgcCA9IHt9O1xuXG4gICAgICAgICAgX2ZvckVhY2hOYW1lKHZhcnMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gcFtuYW1lXSA9IDE7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXJzID0gcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhcnMgPSBfYWRkQWxpYXNlc1RvVmFycyhwYXJzZWRUYXJnZXRzLCB2YXJzKTtcbiAgICAgIH1cblxuICAgICAgaSA9IHBhcnNlZFRhcmdldHMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGlmICh+a2lsbGluZ1RhcmdldHMuaW5kZXhPZihwYXJzZWRUYXJnZXRzW2ldKSkge1xuICAgICAgICAgIGN1ckxvb2t1cCA9IHByb3BUd2Vlbkxvb2t1cFtpXTtcblxuICAgICAgICAgIGlmICh2YXJzID09PSBcImFsbFwiKSB7XG4gICAgICAgICAgICBvdmVyd3JpdHRlblByb3BzW2ldID0gdmFycztcbiAgICAgICAgICAgIHByb3BzID0gY3VyTG9va3VwO1xuICAgICAgICAgICAgY3VyT3ZlcndyaXRlUHJvcHMgPSB7fTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyT3ZlcndyaXRlUHJvcHMgPSBvdmVyd3JpdHRlblByb3BzW2ldID0gb3ZlcndyaXR0ZW5Qcm9wc1tpXSB8fCB7fTtcbiAgICAgICAgICAgIHByb3BzID0gdmFycztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHAgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIHB0ID0gY3VyTG9va3VwICYmIGN1ckxvb2t1cFtwXTtcblxuICAgICAgICAgICAgaWYgKHB0KSB7XG4gICAgICAgICAgICAgIGlmICghKFwia2lsbFwiIGluIHB0LmQpIHx8IHB0LmQua2lsbChwKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF9yZW1vdmVMaW5rZWRMaXN0SXRlbSh0aGlzLCBwdCwgXCJfcHRcIik7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgY3VyTG9va3VwW3BdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJPdmVyd3JpdGVQcm9wcyAhPT0gXCJhbGxcIikge1xuICAgICAgICAgICAgICBjdXJPdmVyd3JpdGVQcm9wc1twXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9pbml0dGVkICYmICF0aGlzLl9wdCAmJiBmaXJzdFBUKSB7XG4gICAgICAgIF9pbnRlcnJ1cHQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBUd2Vlbi50byA9IGZ1bmN0aW9uIHRvKHRhcmdldHMsIHZhcnMpIHtcbiAgICAgIHJldHVybiBuZXcgVHdlZW4odGFyZ2V0cywgdmFycywgYXJndW1lbnRzWzJdKTtcbiAgICB9O1xuXG4gICAgVHdlZW4uZnJvbSA9IGZ1bmN0aW9uIGZyb20odGFyZ2V0cywgdmFycykge1xuICAgICAgcmV0dXJuIG5ldyBUd2Vlbih0YXJnZXRzLCBfcGFyc2VWYXJzKGFyZ3VtZW50cywgMSkpO1xuICAgIH07XG5cbiAgICBUd2Vlbi5kZWxheWVkQ2FsbCA9IGZ1bmN0aW9uIGRlbGF5ZWRDYWxsKGRlbGF5LCBjYWxsYmFjaywgcGFyYW1zLCBzY29wZSkge1xuICAgICAgcmV0dXJuIG5ldyBUd2VlbihjYWxsYmFjaywgMCwge1xuICAgICAgICBpbW1lZGlhdGVSZW5kZXI6IGZhbHNlLFxuICAgICAgICBsYXp5OiBmYWxzZSxcbiAgICAgICAgb3ZlcndyaXRlOiBmYWxzZSxcbiAgICAgICAgZGVsYXk6IGRlbGF5LFxuICAgICAgICBvbkNvbXBsZXRlOiBjYWxsYmFjayxcbiAgICAgICAgb25SZXZlcnNlQ29tcGxldGU6IGNhbGxiYWNrLFxuICAgICAgICBvbkNvbXBsZXRlUGFyYW1zOiBwYXJhbXMsXG4gICAgICAgIG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOiBwYXJhbXMsXG4gICAgICAgIGNhbGxiYWNrU2NvcGU6IHNjb3BlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgVHdlZW4uZnJvbVRvID0gZnVuY3Rpb24gZnJvbVRvKHRhcmdldHMsIGZyb21WYXJzLCB0b1ZhcnMpIHtcbiAgICAgIHJldHVybiBuZXcgVHdlZW4odGFyZ2V0cywgX3BhcnNlVmFycyhhcmd1bWVudHMsIDIpKTtcbiAgICB9O1xuXG4gICAgVHdlZW4uc2V0ID0gZnVuY3Rpb24gc2V0KHRhcmdldHMsIHZhcnMpIHtcbiAgICAgIHZhcnMuZHVyYXRpb24gPSAwO1xuXG4gICAgICBpZiAoIXZhcnMucmVwZWF0RGVsYXkpIHtcbiAgICAgICAgdmFycy5yZXBlYXQgPSAwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldHMsIHZhcnMpO1xuICAgIH07XG5cbiAgICBUd2Vlbi5raWxsVHdlZW5zT2YgPSBmdW5jdGlvbiBraWxsVHdlZW5zT2YodGFyZ2V0cywgcHJvcHMsIG9ubHlBY3RpdmUpIHtcbiAgICAgIHJldHVybiBfZ2xvYmFsVGltZWxpbmUua2lsbFR3ZWVuc09mKHRhcmdldHMsIHByb3BzLCBvbmx5QWN0aXZlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3ZWVuO1xuICB9KEFuaW1hdGlvbik7XG5cbiAgX3NldERlZmF1bHRzKFR3ZWVuLnByb3RvdHlwZSwge1xuICAgIF90YXJnZXRzOiBbXSxcbiAgICBfbGF6eTogMCxcbiAgICBfc3RhcnRBdDogMCxcbiAgICBfb3A6IDAsXG4gICAgX29uSW5pdDogMFxuICB9KTtcblxuICBfZm9yRWFjaE5hbWUoXCJzdGFnZ2VyVG8sc3RhZ2dlckZyb20sc3RhZ2dlckZyb21Ub1wiLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIFR3ZWVuW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRsID0gbmV3IFRpbWVsaW5lKCksXG4gICAgICAgICAgcGFyYW1zID0gdG9BcnJheShhcmd1bWVudHMpO1xuICAgICAgcGFyYW1zLnNwbGljZShuYW1lID09PSBcInN0YWdnZXJGcm9tVG9cIiA/IDUgOiA0LCAwLCAwKTtcbiAgICAgIHJldHVybiB0bFtuYW1lXS5hcHBseSh0bCwgcGFyYW1zKTtcbiAgICB9O1xuICB9KTtcblxuICB2YXIgX3NldHRlclBsYWluID0gZnVuY3Rpb24gX3NldHRlclBsYWluKHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgfSxcbiAgICAgIF9zZXR0ZXJGdW5jID0gZnVuY3Rpb24gX3NldHRlckZ1bmModGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XSh2YWx1ZSk7XG4gIH0sXG4gICAgICBfc2V0dGVyRnVuY1dpdGhQYXJhbSA9IGZ1bmN0aW9uIF9zZXR0ZXJGdW5jV2l0aFBhcmFtKHRhcmdldCwgcHJvcGVydHksIHZhbHVlLCBkYXRhKSB7XG4gICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV0oZGF0YS5mcCwgdmFsdWUpO1xuICB9LFxuICAgICAgX3NldHRlckF0dHJpYnV0ZSA9IGZ1bmN0aW9uIF9zZXR0ZXJBdHRyaWJ1dGUodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGFyZ2V0LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgdmFsdWUpO1xuICB9LFxuICAgICAgX2dldFNldHRlciA9IGZ1bmN0aW9uIF9nZXRTZXR0ZXIodGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgIHJldHVybiBfaXNGdW5jdGlvbih0YXJnZXRbcHJvcGVydHldKSA/IF9zZXR0ZXJGdW5jIDogX2lzVW5kZWZpbmVkKHRhcmdldFtwcm9wZXJ0eV0pICYmIHRhcmdldC5zZXRBdHRyaWJ1dGUgPyBfc2V0dGVyQXR0cmlidXRlIDogX3NldHRlclBsYWluO1xuICB9LFxuICAgICAgX3JlbmRlclBsYWluID0gZnVuY3Rpb24gX3JlbmRlclBsYWluKHJhdGlvLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCBNYXRoLnJvdW5kKChkYXRhLnMgKyBkYXRhLmMgKiByYXRpbykgKiAxMDAwMCkgLyAxMDAwMCwgZGF0YSk7XG4gIH0sXG4gICAgICBfcmVuZGVyQm9vbGVhbiA9IGZ1bmN0aW9uIF9yZW5kZXJCb29sZWFuKHJhdGlvLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCAhIShkYXRhLnMgKyBkYXRhLmMgKiByYXRpbyksIGRhdGEpO1xuICB9LFxuICAgICAgX3JlbmRlckNvbXBsZXhTdHJpbmcgPSBmdW5jdGlvbiBfcmVuZGVyQ29tcGxleFN0cmluZyhyYXRpbywgZGF0YSkge1xuICAgIHZhciBwdCA9IGRhdGEuX3B0LFxuICAgICAgICBzID0gXCJcIjtcblxuICAgIGlmICghcmF0aW8gJiYgZGF0YS5iKSB7XG4gICAgICBzID0gZGF0YS5iO1xuICAgIH0gZWxzZSBpZiAocmF0aW8gPT09IDEgJiYgZGF0YS5lKSB7XG4gICAgICBzID0gZGF0YS5lO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAocHQpIHtcbiAgICAgICAgcyA9IHB0LnAgKyAocHQubSA/IHB0Lm0ocHQucyArIHB0LmMgKiByYXRpbykgOiBNYXRoLnJvdW5kKChwdC5zICsgcHQuYyAqIHJhdGlvKSAqIDEwMDAwKSAvIDEwMDAwKSArIHM7XG4gICAgICAgIHB0ID0gcHQuX25leHQ7XG4gICAgICB9XG5cbiAgICAgIHMgKz0gZGF0YS5jO1xuICAgIH1cblxuICAgIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCBzLCBkYXRhKTtcbiAgfSxcbiAgICAgIF9yZW5kZXJQcm9wVHdlZW5zID0gZnVuY3Rpb24gX3JlbmRlclByb3BUd2VlbnMocmF0aW8sIGRhdGEpIHtcbiAgICB2YXIgcHQgPSBkYXRhLl9wdDtcblxuICAgIHdoaWxlIChwdCkge1xuICAgICAgcHQucihyYXRpbywgcHQuZCk7XG4gICAgICBwdCA9IHB0Ll9uZXh0O1xuICAgIH1cbiAgfSxcbiAgICAgIF9hZGRQbHVnaW5Nb2RpZmllciA9IGZ1bmN0aW9uIF9hZGRQbHVnaW5Nb2RpZmllcihtb2RpZmllciwgdHdlZW4sIHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICB2YXIgcHQgPSB0aGlzLl9wdCxcbiAgICAgICAgbmV4dDtcblxuICAgIHdoaWxlIChwdCkge1xuICAgICAgbmV4dCA9IHB0Ll9uZXh0O1xuXG4gICAgICBpZiAocHQucCA9PT0gcHJvcGVydHkpIHtcbiAgICAgICAgcHQubW9kaWZpZXIobW9kaWZpZXIsIHR3ZWVuLCB0YXJnZXQpO1xuICAgICAgfVxuXG4gICAgICBwdCA9IG5leHQ7XG4gICAgfVxuICB9LFxuICAgICAgX2tpbGxQcm9wVHdlZW5zT2YgPSBmdW5jdGlvbiBfa2lsbFByb3BUd2VlbnNPZihwcm9wZXJ0eSkge1xuICAgIHZhciBwdCA9IHRoaXMuX3B0LFxuICAgICAgICBoYXNOb25EZXBlbmRlbnRSZW1haW5pbmcsXG4gICAgICAgIG5leHQ7XG5cbiAgICB3aGlsZSAocHQpIHtcbiAgICAgIG5leHQgPSBwdC5fbmV4dDtcblxuICAgICAgaWYgKHB0LnAgPT09IHByb3BlcnR5ICYmICFwdC5vcCB8fCBwdC5vcCA9PT0gcHJvcGVydHkpIHtcbiAgICAgICAgX3JlbW92ZUxpbmtlZExpc3RJdGVtKHRoaXMsIHB0LCBcIl9wdFwiKTtcbiAgICAgIH0gZWxzZSBpZiAoIXB0LmRlcCkge1xuICAgICAgICBoYXNOb25EZXBlbmRlbnRSZW1haW5pbmcgPSAxO1xuICAgICAgfVxuXG4gICAgICBwdCA9IG5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuICFoYXNOb25EZXBlbmRlbnRSZW1haW5pbmc7XG4gIH0sXG4gICAgICBfc2V0dGVyV2l0aE1vZGlmaWVyID0gZnVuY3Rpb24gX3NldHRlcldpdGhNb2RpZmllcih0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSwgZGF0YSkge1xuICAgIGRhdGEubVNldCh0YXJnZXQsIHByb3BlcnR5LCBkYXRhLm0uY2FsbChkYXRhLnR3ZWVuLCB2YWx1ZSwgZGF0YS5tdCksIGRhdGEpO1xuICB9LFxuICAgICAgX3NvcnRQcm9wVHdlZW5zQnlQcmlvcml0eSA9IGZ1bmN0aW9uIF9zb3J0UHJvcFR3ZWVuc0J5UHJpb3JpdHkocGFyZW50KSB7XG4gICAgdmFyIHB0ID0gcGFyZW50Ll9wdCxcbiAgICAgICAgbmV4dCxcbiAgICAgICAgcHQyLFxuICAgICAgICBmaXJzdCxcbiAgICAgICAgbGFzdDtcblxuICAgIHdoaWxlIChwdCkge1xuICAgICAgbmV4dCA9IHB0Ll9uZXh0O1xuICAgICAgcHQyID0gZmlyc3Q7XG5cbiAgICAgIHdoaWxlIChwdDIgJiYgcHQyLnByID4gcHQucHIpIHtcbiAgICAgICAgcHQyID0gcHQyLl9uZXh0O1xuICAgICAgfVxuXG4gICAgICBpZiAocHQuX3ByZXYgPSBwdDIgPyBwdDIuX3ByZXYgOiBsYXN0KSB7XG4gICAgICAgIHB0Ll9wcmV2Ll9uZXh0ID0gcHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXJzdCA9IHB0O1xuICAgICAgfVxuXG4gICAgICBpZiAocHQuX25leHQgPSBwdDIpIHtcbiAgICAgICAgcHQyLl9wcmV2ID0gcHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXN0ID0gcHQ7XG4gICAgICB9XG5cbiAgICAgIHB0ID0gbmV4dDtcbiAgICB9XG5cbiAgICBwYXJlbnQuX3B0ID0gZmlyc3Q7XG4gIH07XG5cbiAgdmFyIFByb3BUd2VlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQcm9wVHdlZW4obmV4dCwgdGFyZ2V0LCBwcm9wLCBzdGFydCwgY2hhbmdlLCByZW5kZXJlciwgZGF0YSwgc2V0dGVyLCBwcmlvcml0eSkge1xuICAgICAgdGhpcy50ID0gdGFyZ2V0O1xuICAgICAgdGhpcy5zID0gc3RhcnQ7XG4gICAgICB0aGlzLmMgPSBjaGFuZ2U7XG4gICAgICB0aGlzLnAgPSBwcm9wO1xuICAgICAgdGhpcy5yID0gcmVuZGVyZXIgfHwgX3JlbmRlclBsYWluO1xuICAgICAgdGhpcy5kID0gZGF0YSB8fCB0aGlzO1xuICAgICAgdGhpcy5zZXQgPSBzZXR0ZXIgfHwgX3NldHRlclBsYWluO1xuICAgICAgdGhpcy5wciA9IHByaW9yaXR5IHx8IDA7XG4gICAgICB0aGlzLl9uZXh0ID0gbmV4dDtcblxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgbmV4dC5fcHJldiA9IHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIF9wcm90bzQgPSBQcm9wVHdlZW4ucHJvdG90eXBlO1xuXG4gICAgX3Byb3RvNC5tb2RpZmllciA9IGZ1bmN0aW9uIG1vZGlmaWVyKGZ1bmMsIHR3ZWVuLCB0YXJnZXQpIHtcbiAgICAgIHRoaXMubVNldCA9IHRoaXMubVNldCB8fCB0aGlzLnNldDtcbiAgICAgIHRoaXMuc2V0ID0gX3NldHRlcldpdGhNb2RpZmllcjtcbiAgICAgIHRoaXMubSA9IGZ1bmM7XG4gICAgICB0aGlzLm10ID0gdGFyZ2V0O1xuICAgICAgdGhpcy50d2VlbiA9IHR3ZWVuO1xuICAgIH07XG5cbiAgICByZXR1cm4gUHJvcFR3ZWVuO1xuICB9KCk7XG5cbiAgX2ZvckVhY2hOYW1lKF9jYWxsYmFja05hbWVzICsgXCIscGFyZW50LGR1cmF0aW9uLGVhc2UsZGVsYXksb3ZlcndyaXRlLHJ1bkJhY2t3YXJkcyxzdGFydEF0LHlveW8saW1tZWRpYXRlUmVuZGVyLHJlcGVhdCxyZXBlYXREZWxheSxkYXRhLHBhdXNlZCxyZXZlcnNlZCxsYXp5LGNhbGxiYWNrU2NvcGUsc3RyaW5nRmlsdGVyLGlkLHlveW9FYXNlLHN0YWdnZXIsaW5oZXJpdCxyZXBlYXRSZWZyZXNoLGtleWZyYW1lcyxhdXRvUmV2ZXJ0XCIsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgX3Jlc2VydmVkUHJvcHNbbmFtZV0gPSAxO1xuICAgIGlmIChuYW1lLnN1YnN0cigwLCAyKSA9PT0gXCJvblwiKSBfcmVzZXJ2ZWRQcm9wc1tuYW1lICsgXCJQYXJhbXNcIl0gPSAxO1xuICB9KTtcblxuICBfZ2xvYmFscy5Ud2Vlbk1heCA9IF9nbG9iYWxzLlR3ZWVuTGl0ZSA9IFR3ZWVuO1xuICBfZ2xvYmFscy5UaW1lbGluZUxpdGUgPSBfZ2xvYmFscy5UaW1lbGluZU1heCA9IFRpbWVsaW5lO1xuICBfZ2xvYmFsVGltZWxpbmUgPSBuZXcgVGltZWxpbmUoe1xuICAgIHNvcnRDaGlsZHJlbjogZmFsc2UsXG4gICAgZGVmYXVsdHM6IF9kZWZhdWx0cyxcbiAgICBhdXRvUmVtb3ZlQ2hpbGRyZW46IHRydWUsXG4gICAgaWQ6IFwicm9vdFwiXG4gIH0pO1xuICBfY29uZmlnLnN0cmluZ0ZpbHRlciA9IF9jb2xvclN0cmluZ0ZpbHRlcjtcbiAgdmFyIF9nc2FwID0ge1xuICAgIHJlZ2lzdGVyUGx1Z2luOiBmdW5jdGlvbiByZWdpc3RlclBsdWdpbigpIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHJldHVybiBfY3JlYXRlUGx1Z2luKGNvbmZpZyk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHRpbWVsaW5lOiBmdW5jdGlvbiB0aW1lbGluZSh2YXJzKSB7XG4gICAgICByZXR1cm4gbmV3IFRpbWVsaW5lKHZhcnMpO1xuICAgIH0sXG4gICAgZ2V0VHdlZW5zT2Y6IGZ1bmN0aW9uIGdldFR3ZWVuc09mKHRhcmdldHMsIG9ubHlBY3RpdmUpIHtcbiAgICAgIHJldHVybiBfZ2xvYmFsVGltZWxpbmUuZ2V0VHdlZW5zT2YodGFyZ2V0cywgb25seUFjdGl2ZSk7XG4gICAgfSxcbiAgICBnZXRQcm9wZXJ0eTogZnVuY3Rpb24gZ2V0UHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwgdW5pdCwgdW5jYWNoZSkge1xuICAgICAgaWYgKF9pc1N0cmluZyh0YXJnZXQpKSB7XG4gICAgICAgIHRhcmdldCA9IHRvQXJyYXkodGFyZ2V0KVswXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGdldHRlciA9IF9nZXRDYWNoZSh0YXJnZXQgfHwge30pLmdldCxcbiAgICAgICAgICBmb3JtYXQgPSB1bml0ID8gX3Bhc3NUaHJvdWdoIDogX251bWVyaWNJZlBvc3NpYmxlO1xuXG4gICAgICBpZiAodW5pdCA9PT0gXCJuYXRpdmVcIikge1xuICAgICAgICB1bml0ID0gXCJcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICF0YXJnZXQgPyB0YXJnZXQgOiAhcHJvcGVydHkgPyBmdW5jdGlvbiAocHJvcGVydHksIHVuaXQsIHVuY2FjaGUpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdCgoX3BsdWdpbnNbcHJvcGVydHldICYmIF9wbHVnaW5zW3Byb3BlcnR5XS5nZXQgfHwgZ2V0dGVyKSh0YXJnZXQsIHByb3BlcnR5LCB1bml0LCB1bmNhY2hlKSk7XG4gICAgICB9IDogZm9ybWF0KChfcGx1Z2luc1twcm9wZXJ0eV0gJiYgX3BsdWdpbnNbcHJvcGVydHldLmdldCB8fCBnZXR0ZXIpKHRhcmdldCwgcHJvcGVydHksIHVuaXQsIHVuY2FjaGUpKTtcbiAgICB9LFxuICAgIHF1aWNrU2V0dGVyOiBmdW5jdGlvbiBxdWlja1NldHRlcih0YXJnZXQsIHByb3BlcnR5LCB1bml0KSB7XG4gICAgICB0YXJnZXQgPSB0b0FycmF5KHRhcmdldCk7XG5cbiAgICAgIGlmICh0YXJnZXQubGVuZ3RoID4gMSkge1xuICAgICAgICB2YXIgc2V0dGVycyA9IHRhcmdldC5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICByZXR1cm4gZ3NhcC5xdWlja1NldHRlcih0LCBwcm9wZXJ0eSwgdW5pdCk7XG4gICAgICAgIH0pLFxuICAgICAgICAgICAgbCA9IHNldHRlcnMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgdmFyIGkgPSBsO1xuXG4gICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgc2V0dGVyc1tpXSh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICB0YXJnZXQgPSB0YXJnZXRbMF0gfHwge307XG5cbiAgICAgIHZhciBQbHVnaW4gPSBfcGx1Z2luc1twcm9wZXJ0eV0sXG4gICAgICAgICAgY2FjaGUgPSBfZ2V0Q2FjaGUodGFyZ2V0KSxcbiAgICAgICAgICBzZXR0ZXIgPSBQbHVnaW4gPyBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHAgPSBuZXcgUGx1Z2luKCk7XG4gICAgICAgIF9xdWlja1R3ZWVuLl9wdCA9IDA7XG4gICAgICAgIHAuaW5pdCh0YXJnZXQsIHVuaXQgPyB2YWx1ZSArIHVuaXQgOiB2YWx1ZSwgX3F1aWNrVHdlZW4sIDAsIFt0YXJnZXRdKTtcbiAgICAgICAgcC5yZW5kZXIoMSwgcCk7XG4gICAgICAgIF9xdWlja1R3ZWVuLl9wdCAmJiBfcmVuZGVyUHJvcFR3ZWVucygxLCBfcXVpY2tUd2Vlbik7XG4gICAgICB9IDogY2FjaGUuc2V0KHRhcmdldCwgcHJvcGVydHkpO1xuXG4gICAgICByZXR1cm4gUGx1Z2luID8gc2V0dGVyIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBzZXR0ZXIodGFyZ2V0LCBwcm9wZXJ0eSwgdW5pdCA/IHZhbHVlICsgdW5pdCA6IHZhbHVlLCBjYWNoZSwgMSk7XG4gICAgICB9O1xuICAgIH0sXG4gICAgaXNUd2VlbmluZzogZnVuY3Rpb24gaXNUd2VlbmluZyh0YXJnZXRzKSB7XG4gICAgICByZXR1cm4gX2dsb2JhbFRpbWVsaW5lLmdldFR3ZWVuc09mKHRhcmdldHMsIHRydWUpLmxlbmd0aCA+IDA7XG4gICAgfSxcbiAgICBkZWZhdWx0czogZnVuY3Rpb24gZGVmYXVsdHModmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5lYXNlKSB7XG4gICAgICAgIHZhbHVlLmVhc2UgPSBfcGFyc2VFYXNlKHZhbHVlLmVhc2UsIF9kZWZhdWx0cy5lYXNlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9tZXJnZURlZXAoX2RlZmF1bHRzLCB2YWx1ZSB8fCB7fSk7XG4gICAgfSxcbiAgICBjb25maWc6IGZ1bmN0aW9uIGNvbmZpZyh2YWx1ZSkge1xuICAgICAgcmV0dXJuIF9tZXJnZURlZXAoX2NvbmZpZywgdmFsdWUgfHwge30pO1xuICAgIH0sXG4gICAgcmVnaXN0ZXJFZmZlY3Q6IGZ1bmN0aW9uIHJlZ2lzdGVyRWZmZWN0KF9yZWYpIHtcbiAgICAgIHZhciBuYW1lID0gX3JlZi5uYW1lLFxuICAgICAgICAgIGVmZmVjdCA9IF9yZWYuZWZmZWN0LFxuICAgICAgICAgIHBsdWdpbnMgPSBfcmVmLnBsdWdpbnMsXG4gICAgICAgICAgZGVmYXVsdHMgPSBfcmVmLmRlZmF1bHRzLFxuICAgICAgICAgIGV4dGVuZFRpbWVsaW5lID0gX3JlZi5leHRlbmRUaW1lbGluZTtcbiAgICAgIChwbHVnaW5zIHx8IFwiXCIpLnNwbGl0KFwiLFwiKS5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW5OYW1lKSB7XG4gICAgICAgIHJldHVybiBwbHVnaW5OYW1lICYmICFfcGx1Z2luc1twbHVnaW5OYW1lXSAmJiAhX2dsb2JhbHNbcGx1Z2luTmFtZV0gJiYgX3dhcm4obmFtZSArIFwiIGVmZmVjdCByZXF1aXJlcyBcIiArIHBsdWdpbk5hbWUgKyBcIiBwbHVnaW4uXCIpO1xuICAgICAgfSk7XG5cbiAgICAgIF9lZmZlY3RzW25hbWVdID0gZnVuY3Rpb24gKHRhcmdldHMsIHZhcnMpIHtcbiAgICAgICAgcmV0dXJuIGVmZmVjdCh0b0FycmF5KHRhcmdldHMpLCBfc2V0RGVmYXVsdHModmFycyB8fCB7fSwgZGVmYXVsdHMpKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChleHRlbmRUaW1lbGluZSkge1xuICAgICAgICBUaW1lbGluZS5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbiAodGFyZ2V0cywgdmFycywgcG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoX2VmZmVjdHNbbmFtZV0odGFyZ2V0cywgX2lzT2JqZWN0KHZhcnMpID8gdmFycyA6IChwb3NpdGlvbiA9IHZhcnMpICYmIHt9KSwgcG9zaXRpb24pO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVnaXN0ZXJFYXNlOiBmdW5jdGlvbiByZWdpc3RlckVhc2UobmFtZSwgZWFzZSkge1xuICAgICAgX2Vhc2VNYXBbbmFtZV0gPSBfcGFyc2VFYXNlKGVhc2UpO1xuICAgIH0sXG4gICAgcGFyc2VFYXNlOiBmdW5jdGlvbiBwYXJzZUVhc2UoZWFzZSwgZGVmYXVsdEVhc2UpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gX3BhcnNlRWFzZShlYXNlLCBkZWZhdWx0RWFzZSkgOiBfZWFzZU1hcDtcbiAgICB9LFxuICAgIGdldEJ5SWQ6IGZ1bmN0aW9uIGdldEJ5SWQoaWQpIHtcbiAgICAgIHJldHVybiBfZ2xvYmFsVGltZWxpbmUuZ2V0QnlJZChpZCk7XG4gICAgfSxcbiAgICBleHBvcnRSb290OiBmdW5jdGlvbiBleHBvcnRSb290KHZhcnMsIGluY2x1ZGVEZWxheWVkQ2FsbHMpIHtcbiAgICAgIGlmICh2YXJzID09PSB2b2lkIDApIHtcbiAgICAgICAgdmFycyA9IHt9O1xuICAgICAgfVxuXG4gICAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmUodmFycyksXG4gICAgICAgICAgY2hpbGQsXG4gICAgICAgICAgbmV4dDtcbiAgICAgIHRsLnNtb290aENoaWxkVGltaW5nID0gX2lzTm90RmFsc2UodmFycy5zbW9vdGhDaGlsZFRpbWluZyk7XG5cbiAgICAgIF9nbG9iYWxUaW1lbGluZS5yZW1vdmUodGwpO1xuXG4gICAgICB0bC5fZHAgPSAwO1xuICAgICAgdGwuX3RpbWUgPSB0bC5fdFRpbWUgPSBfZ2xvYmFsVGltZWxpbmUuX3RpbWU7XG4gICAgICBjaGlsZCA9IF9nbG9iYWxUaW1lbGluZS5fZmlyc3Q7XG5cbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICBuZXh0ID0gY2hpbGQuX25leHQ7XG5cbiAgICAgICAgaWYgKGluY2x1ZGVEZWxheWVkQ2FsbHMgfHwgISghY2hpbGQuX2R1ciAmJiBjaGlsZCBpbnN0YW5jZW9mIFR3ZWVuICYmIGNoaWxkLnZhcnMub25Db21wbGV0ZSA9PT0gY2hpbGQuX3RhcmdldHNbMF0pKSB7XG4gICAgICAgICAgX2FkZFRvVGltZWxpbmUodGwsIGNoaWxkLCBjaGlsZC5fc3RhcnQgLSBjaGlsZC5fZGVsYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQgPSBuZXh0O1xuICAgICAgfVxuXG4gICAgICBfYWRkVG9UaW1lbGluZShfZ2xvYmFsVGltZWxpbmUsIHRsLCAwKTtcblxuICAgICAgcmV0dXJuIHRsO1xuICAgIH0sXG4gICAgdXRpbHM6IHtcbiAgICAgIHdyYXA6IHdyYXAsXG4gICAgICB3cmFwWW95bzogd3JhcFlveW8sXG4gICAgICBkaXN0cmlidXRlOiBkaXN0cmlidXRlLFxuICAgICAgcmFuZG9tOiByYW5kb20sXG4gICAgICBzbmFwOiBzbmFwLFxuICAgICAgbm9ybWFsaXplOiBub3JtYWxpemUsXG4gICAgICBnZXRVbml0OiBnZXRVbml0LFxuICAgICAgY2xhbXA6IGNsYW1wLFxuICAgICAgc3BsaXRDb2xvcjogc3BsaXRDb2xvcixcbiAgICAgIHRvQXJyYXk6IHRvQXJyYXksXG4gICAgICBtYXBSYW5nZTogbWFwUmFuZ2UsXG4gICAgICBwaXBlOiBwaXBlLFxuICAgICAgdW5pdGl6ZTogdW5pdGl6ZSxcbiAgICAgIGludGVycG9sYXRlOiBpbnRlcnBvbGF0ZVxuICAgIH0sXG4gICAgaW5zdGFsbDogX2luc3RhbGwsXG4gICAgZWZmZWN0czogX2VmZmVjdHMsXG4gICAgdGlja2VyOiBfdGlja2VyLFxuICAgIHVwZGF0ZVJvb3Q6IFRpbWVsaW5lLnVwZGF0ZVJvb3QsXG4gICAgcGx1Z2luczogX3BsdWdpbnMsXG4gICAgZ2xvYmFsVGltZWxpbmU6IF9nbG9iYWxUaW1lbGluZSxcbiAgICBjb3JlOiB7XG4gICAgICBQcm9wVHdlZW46IFByb3BUd2VlbixcbiAgICAgIGdsb2JhbHM6IF9hZGRHbG9iYWwsXG4gICAgICBUd2VlbjogVHdlZW4sXG4gICAgICBUaW1lbGluZTogVGltZWxpbmUsXG4gICAgICBBbmltYXRpb246IEFuaW1hdGlvbixcbiAgICAgIGdldENhY2hlOiBfZ2V0Q2FjaGVcbiAgICB9XG4gIH07XG5cbiAgX2ZvckVhY2hOYW1lKFwidG8sZnJvbSxmcm9tVG8sZGVsYXllZENhbGwsc2V0LGtpbGxUd2VlbnNPZlwiLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBfZ3NhcFtuYW1lXSA9IFR3ZWVuW25hbWVdO1xuICB9KTtcblxuICBfdGlja2VyLmFkZChUaW1lbGluZS51cGRhdGVSb290KTtcblxuICBfcXVpY2tUd2VlbiA9IF9nc2FwLnRvKHt9LCB7XG4gICAgZHVyYXRpb246IDBcbiAgfSk7XG5cbiAgdmFyIF9nZXRQbHVnaW5Qcm9wVHdlZW4gPSBmdW5jdGlvbiBfZ2V0UGx1Z2luUHJvcFR3ZWVuKHBsdWdpbiwgcHJvcCkge1xuICAgIHZhciBwdCA9IHBsdWdpbi5fcHQ7XG5cbiAgICB3aGlsZSAocHQgJiYgcHQucCAhPT0gcHJvcCAmJiBwdC5vcCAhPT0gcHJvcCAmJiBwdC5mcCAhPT0gcHJvcCkge1xuICAgICAgcHQgPSBwdC5fbmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHQ7XG4gIH0sXG4gICAgICBfYWRkTW9kaWZpZXJzID0gZnVuY3Rpb24gX2FkZE1vZGlmaWVycyh0d2VlbiwgbW9kaWZpZXJzKSB7XG4gICAgdmFyIHRhcmdldHMgPSB0d2Vlbi5fdGFyZ2V0cyxcbiAgICAgICAgcCxcbiAgICAgICAgaSxcbiAgICAgICAgcHQ7XG5cbiAgICBmb3IgKHAgaW4gbW9kaWZpZXJzKSB7XG4gICAgICBpID0gdGFyZ2V0cy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgcHQgPSB0d2Vlbi5fcHRMb29rdXBbaV1bcF07XG5cbiAgICAgICAgaWYgKHB0ICYmIChwdCA9IHB0LmQpKSB7XG4gICAgICAgICAgaWYgKHB0Ll9wdCkge1xuICAgICAgICAgICAgcHQgPSBfZ2V0UGx1Z2luUHJvcFR3ZWVuKHB0LCBwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwdCAmJiBwdC5tb2RpZmllciAmJiBwdC5tb2RpZmllcihtb2RpZmllcnNbcF0sIHR3ZWVuLCB0YXJnZXRzW2ldLCBwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgICAgIF9idWlsZE1vZGlmaWVyUGx1Z2luID0gZnVuY3Rpb24gX2J1aWxkTW9kaWZpZXJQbHVnaW4obmFtZSwgbW9kaWZpZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHJhd1ZhcnM6IDEsXG4gICAgICBpbml0OiBmdW5jdGlvbiBpbml0KHRhcmdldCwgdmFycywgdHdlZW4pIHtcbiAgICAgICAgdHdlZW4uX29uSW5pdCA9IGZ1bmN0aW9uICh0d2Vlbikge1xuICAgICAgICAgIHZhciB0ZW1wLCBwO1xuXG4gICAgICAgICAgaWYgKF9pc1N0cmluZyh2YXJzKSkge1xuICAgICAgICAgICAgdGVtcCA9IHt9O1xuXG4gICAgICAgICAgICBfZm9yRWFjaE5hbWUodmFycywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRlbXBbbmFtZV0gPSAxO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhcnMgPSB0ZW1wO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChtb2RpZmllcikge1xuICAgICAgICAgICAgdGVtcCA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKHAgaW4gdmFycykge1xuICAgICAgICAgICAgICB0ZW1wW3BdID0gbW9kaWZpZXIodmFyc1twXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhcnMgPSB0ZW1wO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9hZGRNb2RpZmllcnModHdlZW4sIHZhcnMpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgdmFyIGdzYXAgPSBfZ3NhcC5yZWdpc3RlclBsdWdpbih7XG4gICAgbmFtZTogXCJhdHRyXCIsXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCh0YXJnZXQsIHZhcnMsIHR3ZWVuLCBpbmRleCwgdGFyZ2V0cykge1xuICAgICAgZm9yICh2YXIgcCBpbiB2YXJzKSB7XG4gICAgICAgIHRoaXMuYWRkKHRhcmdldCwgXCJzZXRBdHRyaWJ1dGVcIiwgKHRhcmdldC5nZXRBdHRyaWJ1dGUocCkgfHwgMCkgKyBcIlwiLCB2YXJzW3BdLCBpbmRleCwgdGFyZ2V0cywgMCwgMCwgcCk7XG5cbiAgICAgICAgdGhpcy5fcHJvcHMucHVzaChwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBuYW1lOiBcImVuZEFycmF5XCIsXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCh0YXJnZXQsIHZhbHVlKSB7XG4gICAgICB2YXIgaSA9IHZhbHVlLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICB0aGlzLmFkZCh0YXJnZXQsIGksIHRhcmdldFtpXSB8fCAwLCB2YWx1ZVtpXSk7XG4gICAgICB9XG4gICAgfVxuICB9LCBfYnVpbGRNb2RpZmllclBsdWdpbihcInJvdW5kUHJvcHNcIiwgX3JvdW5kTW9kaWZpZXIpLCBfYnVpbGRNb2RpZmllclBsdWdpbihcIm1vZGlmaWVyc1wiKSwgX2J1aWxkTW9kaWZpZXJQbHVnaW4oXCJzbmFwXCIsIHNuYXApKSB8fCBfZ3NhcDtcbiAgVHdlZW4udmVyc2lvbiA9IFRpbWVsaW5lLnZlcnNpb24gPSBnc2FwLnZlcnNpb24gPSBcIjMuMC4yXCI7XG4gIF9jb3JlUmVhZHkgPSAxO1xuXG4gIGlmIChfd2luZG93RXhpc3RzKCkpIHtcbiAgICBfd2FrZSgpO1xuICB9XG5cbiAgdmFyIFBvd2VyMCA9IF9lYXNlTWFwLlBvd2VyMCxcbiAgICAgIFBvd2VyMSA9IF9lYXNlTWFwLlBvd2VyMSxcbiAgICAgIFBvd2VyMiA9IF9lYXNlTWFwLlBvd2VyMixcbiAgICAgIFBvd2VyMyA9IF9lYXNlTWFwLlBvd2VyMyxcbiAgICAgIFBvd2VyNCA9IF9lYXNlTWFwLlBvd2VyNCxcbiAgICAgIExpbmVhciA9IF9lYXNlTWFwLkxpbmVhcixcbiAgICAgIFF1YWQgPSBfZWFzZU1hcC5RdWFkLFxuICAgICAgQ3ViaWMgPSBfZWFzZU1hcC5DdWJpYyxcbiAgICAgIFF1YXJ0ID0gX2Vhc2VNYXAuUXVhcnQsXG4gICAgICBRdWludCA9IF9lYXNlTWFwLlF1aW50LFxuICAgICAgU3Ryb25nID0gX2Vhc2VNYXAuU3Ryb25nLFxuICAgICAgRWxhc3RpYyA9IF9lYXNlTWFwLkVsYXN0aWMsXG4gICAgICBCYWNrID0gX2Vhc2VNYXAuQmFjayxcbiAgICAgIFN0ZXBwZWRFYXNlID0gX2Vhc2VNYXAuU3RlcHBlZEVhc2UsXG4gICAgICBCb3VuY2UgPSBfZWFzZU1hcC5Cb3VuY2UsXG4gICAgICBTaW5lID0gX2Vhc2VNYXAuU2luZSxcbiAgICAgIEV4cG8gPSBfZWFzZU1hcC5FeHBvLFxuICAgICAgQ2lyYyA9IF9lYXNlTWFwLkNpcmM7XG5cbiAgdmFyIF93aW4kMSxcbiAgICAgIF9kb2MkMSxcbiAgICAgIF9kb2NFbGVtZW50LFxuICAgICAgX3BsdWdpbkluaXR0ZWQsXG4gICAgICBfdGVtcERpdixcbiAgICAgIF90ZW1wRGl2U3R5bGVyLFxuICAgICAgX3JlY2VudFNldHRlclBsdWdpbixcbiAgICAgIF93aW5kb3dFeGlzdHMkMSA9IGZ1bmN0aW9uIF93aW5kb3dFeGlzdHMoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI7XG4gIH0sXG4gICAgICBfdHJhbnNmb3JtUHJvcHMgPSB7fSxcbiAgICAgIF9SQUQyREVHID0gMTgwIC8gTWF0aC5QSSxcbiAgICAgIF9ERUcyUkFEID0gTWF0aC5QSSAvIDE4MCxcbiAgICAgIF9hdGFuMiA9IE1hdGguYXRhbjIsXG4gICAgICBfYmlnTnVtJDEgPSAxZTgsXG4gICAgICBfY2Fwc0V4cCA9IC8oW0EtWl0pL2csXG4gICAgICBfbnVtV2l0aFVuaXRFeHAgPSAvWy0rPVxcLl0qXFxkK1tcXC5lLV0qXFxkKlthLXolXSovZyxcbiAgICAgIF9ob3Jpem9udGFsRXhwID0gLyg/OmxlZnR8cmlnaHR8d2lkdGh8bWFyZ2lufHBhZGRpbmd8eCkvaSxcbiAgICAgIF9jb21wbGV4RXhwID0gL1tcXHMsXFwoXVxcUy8sXG4gICAgICBfcHJvcGVydHlBbGlhc2VzID0ge1xuICAgIGF1dG9BbHBoYTogXCJvcGFjaXR5LHZpc2liaWxpdHlcIixcbiAgICBzY2FsZTogXCJzY2FsZVgsc2NhbGVZXCIsXG4gICAgYWxwaGE6IFwib3BhY2l0eVwiXG4gIH0sXG4gICAgICBfcmVuZGVyQ1NTUHJvcCA9IGZ1bmN0aW9uIF9yZW5kZXJDU1NQcm9wKHJhdGlvLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCB+figoZGF0YS5zICsgZGF0YS5jICogcmF0aW8pICogMTAwMCkgLyAxMDAwICsgZGF0YS51LCBkYXRhKTtcbiAgfSxcbiAgICAgIF9yZW5kZXJQcm9wV2l0aEVuZCA9IGZ1bmN0aW9uIF9yZW5kZXJQcm9wV2l0aEVuZChyYXRpbywgZGF0YSkge1xuICAgIHJldHVybiBkYXRhLnNldChkYXRhLnQsIGRhdGEucCwgcmF0aW8gPT09IDEgPyBkYXRhLmUgOiB+figoZGF0YS5zICsgZGF0YS5jICogcmF0aW8pICogMTAwMCkgLyAxMDAwICsgZGF0YS51LCBkYXRhKTtcbiAgfSxcbiAgICAgIF9yZW5kZXJDU1NQcm9wV2l0aEJlZ2lubmluZyA9IGZ1bmN0aW9uIF9yZW5kZXJDU1NQcm9wV2l0aEJlZ2lubmluZyhyYXRpbywgZGF0YSkge1xuICAgIHJldHVybiBkYXRhLnNldChkYXRhLnQsIGRhdGEucCwgcmF0aW8gPyB+figoZGF0YS5zICsgZGF0YS5jICogcmF0aW8pICogMTAwMCkgLyAxMDAwICsgZGF0YS51IDogZGF0YS5iLCBkYXRhKTtcbiAgfSxcbiAgICAgIF9yZW5kZXJSb3VuZGVkQ1NTUHJvcCA9IGZ1bmN0aW9uIF9yZW5kZXJSb3VuZGVkQ1NTUHJvcChyYXRpbywgZGF0YSkge1xuICAgIHZhciB2YWx1ZSA9IGRhdGEucyArIGRhdGEuYyAqIHJhdGlvO1xuICAgIGRhdGEuc2V0KGRhdGEudCwgZGF0YS5wLCB+fih2YWx1ZSArICh2YWx1ZSA8IDAgPyAtLjUgOiAuNSkpICsgZGF0YS51LCBkYXRhKTtcbiAgfSxcbiAgICAgIF9yZW5kZXJOb25Ud2VlbmluZ1ZhbHVlID0gZnVuY3Rpb24gX3JlbmRlck5vblR3ZWVuaW5nVmFsdWUocmF0aW8sIGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5zZXQoZGF0YS50LCBkYXRhLnAsIHJhdGlvID8gZGF0YS5lIDogZGF0YS5iLCBkYXRhKTtcbiAgfSxcbiAgICAgIF9yZW5kZXJOb25Ud2VlbmluZ1ZhbHVlT25seUF0RW5kID0gZnVuY3Rpb24gX3JlbmRlck5vblR3ZWVuaW5nVmFsdWVPbmx5QXRFbmQocmF0aW8sIGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5zZXQoZGF0YS50LCBkYXRhLnAsIHJhdGlvICE9PSAxID8gZGF0YS5iIDogZGF0YS5lLCBkYXRhKTtcbiAgfSxcbiAgICAgIF9zZXR0ZXJDU1NTdHlsZSA9IGZ1bmN0aW9uIF9zZXR0ZXJDU1NTdHlsZSh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0YXJnZXQuc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XG4gIH0sXG4gICAgICBfc2V0dGVyQ1NTUHJvcCA9IGZ1bmN0aW9uIF9zZXR0ZXJDU1NQcm9wKHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRhcmdldC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgdmFsdWUpO1xuICB9LFxuICAgICAgX3NldHRlclRyYW5zZm9ybSA9IGZ1bmN0aW9uIF9zZXR0ZXJUcmFuc2Zvcm0odGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGFyZ2V0Ll9nc2FwW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9LFxuICAgICAgX3NldHRlclNjYWxlID0gZnVuY3Rpb24gX3NldHRlclNjYWxlKHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRhcmdldC5fZ3NhcC5zY2FsZVggPSB0YXJnZXQuX2dzYXAuc2NhbGVZID0gdmFsdWU7XG4gIH0sXG4gICAgICBfc2V0dGVyU2NhbGVXaXRoUmVuZGVyID0gZnVuY3Rpb24gX3NldHRlclNjYWxlV2l0aFJlbmRlcih0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSwgZGF0YSwgcmF0aW8pIHtcbiAgICB2YXIgY2FjaGUgPSB0YXJnZXQuX2dzYXA7XG4gICAgY2FjaGUuc2NhbGVYID0gY2FjaGUuc2NhbGVZID0gdmFsdWU7XG4gICAgY2FjaGUucmVuZGVyVHJhbnNmb3JtKHJhdGlvLCBjYWNoZSk7XG4gIH0sXG4gICAgICBfc2V0dGVyVHJhbnNmb3JtV2l0aFJlbmRlciA9IGZ1bmN0aW9uIF9zZXR0ZXJUcmFuc2Zvcm1XaXRoUmVuZGVyKHRhcmdldCwgcHJvcGVydHksIHZhbHVlLCBkYXRhLCByYXRpbykge1xuICAgIHZhciBjYWNoZSA9IHRhcmdldC5fZ3NhcDtcbiAgICBjYWNoZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICBjYWNoZS5yZW5kZXJUcmFuc2Zvcm0ocmF0aW8sIGNhY2hlKTtcbiAgfSxcbiAgICAgIF90cmFuc2Zvcm1Qcm9wID0gXCJ0cmFuc2Zvcm1cIixcbiAgICAgIF90cmFuc2Zvcm1PcmlnaW5Qcm9wID0gX3RyYW5zZm9ybVByb3AgKyBcIk9yaWdpblwiLFxuICAgICAgX3N1cHBvcnRzM0QsXG4gICAgICBfY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIF9jcmVhdGVFbGVtZW50KHR5cGUsIG5zKSB7XG4gICAgdmFyIGUgPSBfZG9jJDEuY3JlYXRlRWxlbWVudE5TID8gX2RvYyQxLmNyZWF0ZUVsZW1lbnROUygobnMgfHwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIpLnJlcGxhY2UoL15odHRwcy8sIFwiaHR0cFwiKSwgdHlwZSkgOiBfZG9jJDEuY3JlYXRlRWxlbWVudCh0eXBlKTtcbiAgICByZXR1cm4gZS5zdHlsZSA/IGUgOiBfZG9jJDEuY3JlYXRlRWxlbWVudCh0eXBlKTtcbiAgfSxcbiAgICAgIF9nZXRDb21wdXRlZFByb3BlcnR5ID0gZnVuY3Rpb24gX2dldENvbXB1dGVkUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwgc2tpcFByZWZpeEZhbGxiYWNrKSB7XG4gICAgdmFyIGNzID0gZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpO1xuICAgIHJldHVybiBjc1twcm9wZXJ0eV0gfHwgY3MuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eS5yZXBsYWNlKF9jYXBzRXhwLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKSB8fCBjcy5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KSB8fCAhc2tpcFByZWZpeEZhbGxiYWNrICYmIF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgX2NoZWNrUHJvcFByZWZpeChwcm9wZXJ0eSkgfHwgcHJvcGVydHksIDEpIHx8IFwiXCI7XG4gIH0sXG4gICAgICBfcHJlZml4ZXMgPSBcIk8sTW96LG1zLE1zLFdlYmtpdFwiLnNwbGl0KFwiLFwiKSxcbiAgICAgIF9jaGVja1Byb3BQcmVmaXggPSBmdW5jdGlvbiBfY2hlY2tQcm9wUHJlZml4KHByb3BlcnR5LCBlbGVtZW50KSB7XG4gICAgdmFyIGUgPSBlbGVtZW50IHx8IF90ZW1wRGl2LFxuICAgICAgICBzID0gZS5zdHlsZSxcbiAgICAgICAgaSA9IDU7XG5cbiAgICBpZiAocHJvcGVydHkgaW4gcykge1xuICAgICAgcmV0dXJuIHByb3BlcnR5O1xuICAgIH1cblxuICAgIHByb3BlcnR5ID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zdWJzdHIoMSk7XG5cbiAgICB3aGlsZSAoaS0tICYmICEoX3ByZWZpeGVzW2ldICsgcHJvcGVydHkgaW4gcykpIHt9XG5cbiAgICByZXR1cm4gaSA8IDAgPyBudWxsIDogKGkgPT09IDMgPyBcIm1zXCIgOiBpID49IDAgPyBfcHJlZml4ZXNbaV0gOiBcIlwiKSArIHByb3BlcnR5O1xuICB9LFxuICAgICAgX2luaXRDb3JlID0gZnVuY3Rpb24gX2luaXRDb3JlKCkge1xuICAgIGlmIChfd2luZG93RXhpc3RzJDEoKSkge1xuICAgICAgX3dpbiQxID0gd2luZG93O1xuICAgICAgX2RvYyQxID0gX3dpbiQxLmRvY3VtZW50O1xuICAgICAgX2RvY0VsZW1lbnQgPSBfZG9jJDEuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgX3RlbXBEaXYgPSBfY3JlYXRlRWxlbWVudChcImRpdlwiKSB8fCB7XG4gICAgICAgIHN0eWxlOiB7fVxuICAgICAgfTtcbiAgICAgIF90ZW1wRGl2U3R5bGVyID0gX2NyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBfdHJhbnNmb3JtUHJvcCA9IF9jaGVja1Byb3BQcmVmaXgoX3RyYW5zZm9ybVByb3ApO1xuICAgICAgX3RyYW5zZm9ybU9yaWdpblByb3AgPSBfY2hlY2tQcm9wUHJlZml4KF90cmFuc2Zvcm1PcmlnaW5Qcm9wKTtcbiAgICAgIF90ZW1wRGl2LnN0eWxlLmNzc1RleHQgPSBcImJvcmRlci13aWR0aDowO2xpbmUtaGVpZ2h0OjA7cG9zaXRpb246YWJzb2x1dGU7cGFkZGluZzowXCI7XG4gICAgICBfc3VwcG9ydHMzRCA9ICEhX2NoZWNrUHJvcFByZWZpeChcInBlcnNwZWN0aXZlXCIpO1xuICAgICAgX3BsdWdpbkluaXR0ZWQgPSAxO1xuICAgIH1cbiAgfSxcbiAgICAgIF9nZXRCQm94SGFjayA9IGZ1bmN0aW9uIF9nZXRCQm94SGFjayhzd2FwSWZQb3NzaWJsZSkge1xuICAgIHZhciBzdmcgPSBfY3JlYXRlRWxlbWVudChcInN2Z1wiLCB0aGlzLm93bmVyU1ZHRWxlbWVudCAmJiB0aGlzLm93bmVyU1ZHRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ4bWxuc1wiKSB8fCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpLFxuICAgICAgICBvbGRQYXJlbnQgPSB0aGlzLnBhcmVudE5vZGUsXG4gICAgICAgIG9sZFNpYmxpbmcgPSB0aGlzLm5leHRTaWJsaW5nLFxuICAgICAgICBvbGRDU1MgPSB0aGlzLnN0eWxlLmNzc1RleHQsXG4gICAgICAgIGJib3g7XG5cbiAgICBfZG9jRWxlbWVudC5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKHRoaXMpO1xuICAgIHRoaXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgIGlmIChzd2FwSWZQb3NzaWJsZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYmJveCA9IHRoaXMuZ2V0QkJveCgpO1xuICAgICAgICB0aGlzLl9nc2FwQkJveCA9IHRoaXMuZ2V0QkJveDtcbiAgICAgICAgdGhpcy5nZXRCQm94ID0gX2dldEJCb3hIYWNrO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9IGVsc2UgaWYgKHRoaXMuX2dzYXBCQm94KSB7XG4gICAgICBiYm94ID0gdGhpcy5fZ3NhcEJCb3goKTtcbiAgICB9XG5cbiAgICBpZiAob2xkU2libGluZykge1xuICAgICAgb2xkUGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLCBvbGRTaWJsaW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2xkUGFyZW50LmFwcGVuZENoaWxkKHRoaXMpO1xuICAgIH1cblxuICAgIF9kb2NFbGVtZW50LnJlbW92ZUNoaWxkKHN2Zyk7XG5cbiAgICB0aGlzLnN0eWxlLmNzc1RleHQgPSBvbGRDU1M7XG4gICAgcmV0dXJuIGJib3g7XG4gIH0sXG4gICAgICBfZ2V0QXR0cmlidXRlRmFsbGJhY2tzID0gZnVuY3Rpb24gX2dldEF0dHJpYnV0ZUZhbGxiYWNrcyh0YXJnZXQsIGF0dHJpYnV0ZXNBcnJheSkge1xuICAgIHZhciBpID0gYXR0cmlidXRlc0FycmF5Lmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGlmICh0YXJnZXQuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZXNBcnJheVtpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlc0FycmF5W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICAgICBfZ2V0QkJveCA9IGZ1bmN0aW9uIF9nZXRCQm94KHRhcmdldCkge1xuICAgIHZhciBib3VuZHM7XG5cbiAgICB0cnkge1xuICAgICAgYm91bmRzID0gdGFyZ2V0LmdldEJCb3goKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYm91bmRzID0gX2dldEJCb3hIYWNrLmNhbGwodGFyZ2V0LCB0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYm91bmRzICYmICFib3VuZHMud2lkdGggJiYgIWJvdW5kcy54ICYmICFib3VuZHMueSA/IHtcbiAgICAgIHg6ICtfZ2V0QXR0cmlidXRlRmFsbGJhY2tzKHRhcmdldCwgW1wieFwiLCBcImN4XCIsIFwieDFcIl0pIHx8IDAsXG4gICAgICB5OiArX2dldEF0dHJpYnV0ZUZhbGxiYWNrcyh0YXJnZXQsIFtcInlcIiwgXCJjeVwiLCBcInkxXCJdKSB8fCAwLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDBcbiAgICB9IDogYm91bmRzO1xuICB9LFxuICAgICAgX2lzU1ZHID0gZnVuY3Rpb24gX2lzU1ZHKGUpIHtcbiAgICByZXR1cm4gISEoZS5nZXRDVE0gJiYgKCFlLnBhcmVudE5vZGUgfHwgZS5vd25lclNWR0VsZW1lbnQpICYmIF9nZXRCQm94KGUpKTtcbiAgfSxcbiAgICAgIF9yZW1vdmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIF9yZW1vdmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgaWYgKHByb3BlcnR5KSB7XG4gICAgICB2YXIgc3R5bGUgPSB0YXJnZXQuc3R5bGU7XG5cbiAgICAgIGlmIChwcm9wZXJ0eSBpbiBfdHJhbnNmb3JtUHJvcHMpIHtcbiAgICAgICAgcHJvcGVydHkgPSBfdHJhbnNmb3JtUHJvcDtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0eWxlLnJlbW92ZVByb3BlcnR5KSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eS5zdWJzdHIoMCwgMikgPT09IFwibXNcIiB8fCBwcm9wZXJ0eS5zdWJzdHIoMCwgNikgPT09IFwid2Via2l0XCIpIHtcbiAgICAgICAgICBwcm9wZXJ0eSA9IFwiLVwiICsgcHJvcGVydHk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wZXJ0eS5yZXBsYWNlKF9jYXBzRXhwLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0eWxlLnJlbW92ZUF0dHJpYnV0ZShwcm9wZXJ0eSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAgICAgX2FkZE5vblR3ZWVuaW5nUFQgPSBmdW5jdGlvbiBfYWRkTm9uVHdlZW5pbmdQVChwbHVnaW4sIHRhcmdldCwgcHJvcGVydHksIGJlZ2lubmluZywgZW5kLCBvbmx5U2V0QXRFbmQpIHtcbiAgICB2YXIgcHQgPSBuZXcgUHJvcFR3ZWVuKHBsdWdpbi5fcHQsIHRhcmdldCwgcHJvcGVydHksIDAsIDEsIG9ubHlTZXRBdEVuZCA/IF9yZW5kZXJOb25Ud2VlbmluZ1ZhbHVlT25seUF0RW5kIDogX3JlbmRlck5vblR3ZWVuaW5nVmFsdWUpO1xuICAgIHBsdWdpbi5fcHQgPSBwdDtcbiAgICBwdC5iID0gYmVnaW5uaW5nO1xuICAgIHB0LmUgPSBlbmQ7XG5cbiAgICBwbHVnaW4uX3Byb3BzLnB1c2gocHJvcGVydHkpO1xuXG4gICAgcmV0dXJuIHB0O1xuICB9LFxuICAgICAgX25vbkNvbnZlcnRpYmxlVW5pdHMgPSB7XG4gICAgZGVnOiAxLFxuICAgIHJhZDogMSxcbiAgICB0dXJuOiAxXG4gIH0sXG4gICAgICBfY29udmVydFRvVW5pdCA9IGZ1bmN0aW9uIF9jb252ZXJ0VG9Vbml0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlLCB1bml0KSB7XG4gICAgdmFyIGN1clZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSksXG4gICAgICAgIGN1clVuaXQgPSAodmFsdWUgKyBcIlwiKS5zdWJzdHIoKGN1clZhbHVlICsgXCJcIikubGVuZ3RoKSB8fCBcInB4XCIsXG4gICAgICAgIHN0eWxlID0gX3RlbXBEaXYuc3R5bGUsXG4gICAgICAgIGhvcml6b250YWwgPSBfaG9yaXpvbnRhbEV4cC50ZXN0KHByb3BlcnR5KSxcbiAgICAgICAgaXNSb290U1ZHID0gdGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzdmdcIixcbiAgICAgICAgbWVhc3VyZVByb3BlcnR5ID0gKGlzUm9vdFNWRyA/IFwiY2xpZW50XCIgOiBcIm9mZnNldFwiKSArIChob3Jpem9udGFsID8gXCJXaWR0aFwiIDogXCJIZWlnaHRcIiksXG4gICAgICAgIGFtb3VudCA9IDEwMCxcbiAgICAgICAgdG9QaXhlbHMgPSB1bml0ID09PSBcInB4XCIsXG4gICAgICAgIHB4LFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIGNhY2hlLFxuICAgICAgICBpc1NWRztcblxuICAgIGlmICh1bml0ID09PSBjdXJVbml0IHx8IF9ub25Db252ZXJ0aWJsZVVuaXRzW3VuaXRdIHx8IF9ub25Db252ZXJ0aWJsZVVuaXRzW2N1clVuaXRdKSB7XG4gICAgICByZXR1cm4gY3VyVmFsdWU7XG4gICAgfVxuXG4gICAgaXNTVkcgPSB0YXJnZXQuZ2V0Q1RNICYmIF9pc1NWRyh0YXJnZXQpO1xuXG4gICAgaWYgKHVuaXQgPT09IFwiJVwiICYmIF90cmFuc2Zvcm1Qcm9wc1twcm9wZXJ0eV0pIHtcbiAgICAgIHJldHVybiBfcm91bmQoY3VyVmFsdWUgLyAoaXNTVkcgPyB0YXJnZXQuZ2V0QkJveCgpW2hvcml6b250YWwgPyBcIndpZHRoXCIgOiBcImhlaWdodFwiXSA6IHRhcmdldFttZWFzdXJlUHJvcGVydHldKSAqIGFtb3VudCk7XG4gICAgfVxuXG4gICAgc3R5bGVbaG9yaXpvbnRhbCA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCJdID0gYW1vdW50ICsgKHRvUGl4ZWxzID8gY3VyVW5pdCA6IHVuaXQpO1xuICAgIHBhcmVudCA9IHVuaXQgPT09IFwiZW1cIiAmJiB0YXJnZXQuYXBwZW5kQ2hpbGQgJiYgIWlzUm9vdFNWRyA/IHRhcmdldCA6IHRhcmdldC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKGlzU1ZHKSB7XG4gICAgICBwYXJlbnQgPSAodGFyZ2V0Lm93bmVyU1ZHRWxlbWVudCB8fCB7fSkucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICBpZiAoIXBhcmVudCB8fCBwYXJlbnQgPT09IF9kb2MkMSB8fCAhcGFyZW50LmFwcGVuZENoaWxkKSB7XG4gICAgICBwYXJlbnQgPSBfZG9jJDEuYm9keTtcbiAgICB9XG5cbiAgICBjYWNoZSA9IHBhcmVudC5fZ3NhcDtcblxuICAgIGlmIChjYWNoZSAmJiB1bml0ID09PSBcIiVcIiAmJiBjYWNoZS53aWR0aCAmJiBob3Jpem9udGFsICYmIGNhY2hlLnRpbWUgPT09IF90aWNrZXIudGltZSkge1xuICAgICAgcHggPSBjYWNoZS53aWR0aCAqIGN1clZhbHVlIC8gYW1vdW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoX3RlbXBEaXYpO1xuICAgICAgcHggPSBfdGVtcERpdlttZWFzdXJlUHJvcGVydHldO1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKF90ZW1wRGl2KTtcblxuICAgICAgaWYgKGhvcml6b250YWwgJiYgdW5pdCA9PT0gXCIlXCIpIHtcbiAgICAgICAgY2FjaGUgPSBfZ2V0Q2FjaGUocGFyZW50KTtcbiAgICAgICAgY2FjaGUudGltZSA9IF90aWNrZXIudGltZTtcbiAgICAgICAgY2FjaGUud2lkdGggPSBweCAvIGN1clZhbHVlICogYW1vdW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfcm91bmQodG9QaXhlbHMgPyBweCAqIGN1clZhbHVlIC8gYW1vdW50IDogYW1vdW50IC8gcHggKiBjdXJWYWx1ZSk7XG4gIH0sXG4gICAgICBfZ2V0ID0gZnVuY3Rpb24gX2dldCh0YXJnZXQsIHByb3BlcnR5LCB1bml0LCB1bmNhY2hlKSB7XG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKCFfcGx1Z2luSW5pdHRlZCkge1xuICAgICAgX2luaXRDb3JlKCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnR5IGluIF9wcm9wZXJ0eUFsaWFzZXMpIHtcbiAgICAgIHByb3BlcnR5ID0gX3Byb3BlcnR5QWxpYXNlc1twcm9wZXJ0eV07XG5cbiAgICAgIGlmICh+cHJvcGVydHkuaW5kZXhPZihcIixcIikpIHtcbiAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0eS5zcGxpdChcIixcIilbMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKF90cmFuc2Zvcm1Qcm9wc1twcm9wZXJ0eV0pIHtcbiAgICAgIHZhbHVlID0gX3BhcnNlVHJhbnNmb3JtKHRhcmdldCwgdW5jYWNoZSk7XG4gICAgICB2YWx1ZSA9IHByb3BlcnR5ICE9PSBcInRyYW5zZm9ybU9yaWdpblwiID8gdmFsdWVbcHJvcGVydHldIDogX2ZpcnN0VHdvT25seShfZ2V0Q29tcHV0ZWRQcm9wZXJ0eSh0YXJnZXQsIF90cmFuc2Zvcm1PcmlnaW5Qcm9wKSkgKyB2YWx1ZS56T3JpZ2luICsgXCJweFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IHRhcmdldC5zdHlsZVtwcm9wZXJ0eV07XG5cbiAgICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09IFwiYXV0b1wiIHx8IHVuY2FjaGUgfHwgfnZhbHVlLmluZGV4T2YoXCJjYWxjKFwiKSkge1xuICAgICAgICB2YWx1ZSA9IF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpIHx8IF9nZXRQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5pdCA/IF9jb252ZXJ0VG9Vbml0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlLCB1bml0KSArIHVuaXQgOiB2YWx1ZTtcbiAgfSxcbiAgICAgIF90d2VlbkNvbXBsZXhDU1NTdHJpbmcgPSBmdW5jdGlvbiBfdHdlZW5Db21wbGV4Q1NTU3RyaW5nKHRhcmdldCwgcHJvcCwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBwdCA9IG5ldyBQcm9wVHdlZW4odGhpcy5fcHQsIHRhcmdldC5zdHlsZSwgcHJvcCwgMCwgMSwgX3JlbmRlckNvbXBsZXhTdHJpbmcpLFxuICAgICAgICBpbmRleCA9IDAsXG4gICAgICAgIG1hdGNoSW5kZXggPSAwLFxuICAgICAgICBhLFxuICAgICAgICByZXN1bHQsXG4gICAgICAgIHN0YXJ0VmFsdWVzLFxuICAgICAgICBzdGFydE51bSxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHN0YXJ0VmFsdWUsXG4gICAgICAgIGVuZFZhbHVlLFxuICAgICAgICBlbmROdW0sXG4gICAgICAgIGNodW5rLFxuICAgICAgICBlbmRVbml0LFxuICAgICAgICBzdGFydFVuaXQsXG4gICAgICAgIHJlbGF0aXZlLFxuICAgICAgICBlbmRWYWx1ZXM7XG4gICAgcHQuYiA9IHN0YXJ0O1xuICAgIHB0LmUgPSBlbmQ7XG4gICAgc3RhcnQgKz0gXCJcIjtcbiAgICBlbmQgKz0gXCJcIjtcblxuICAgIGlmIChlbmQgPT09IFwiYXV0b1wiKSB7XG4gICAgICB0YXJnZXQuc3R5bGVbcHJvcF0gPSBlbmQ7XG4gICAgICBlbmQgPSBfZ2V0Q29tcHV0ZWRQcm9wZXJ0eSh0YXJnZXQsIHByb3ApIHx8IGVuZDtcbiAgICAgIHRhcmdldC5zdHlsZVtwcm9wXSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIGEgPSBbc3RhcnQsIGVuZF07XG5cbiAgICBfY29sb3JTdHJpbmdGaWx0ZXIoYSk7XG5cbiAgICBzdGFydCA9IGFbMF07XG4gICAgZW5kID0gYVsxXTtcbiAgICBzdGFydFZhbHVlcyA9IHN0YXJ0Lm1hdGNoKF9udW1XaXRoVW5pdEV4cCkgfHwgW107XG4gICAgZW5kVmFsdWVzID0gZW5kLm1hdGNoKF9udW1XaXRoVW5pdEV4cCkgfHwgW107XG5cbiAgICBpZiAoZW5kVmFsdWVzLmxlbmd0aCkge1xuICAgICAgd2hpbGUgKHJlc3VsdCA9IF9udW1XaXRoVW5pdEV4cC5leGVjKGVuZCkpIHtcbiAgICAgICAgZW5kVmFsdWUgPSByZXN1bHRbMF07XG4gICAgICAgIGNodW5rID0gZW5kLnN1YnN0cmluZyhpbmRleCwgcmVzdWx0LmluZGV4KTtcblxuICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICBjb2xvciA9IChjb2xvciArIDEpICUgNTtcbiAgICAgICAgfSBlbHNlIGlmIChjaHVuay5zdWJzdHIoLTUpID09PSBcInJnYmEoXCIpIHtcbiAgICAgICAgICBjb2xvciA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kVmFsdWUgIT09IChzdGFydFZhbHVlID0gc3RhcnRWYWx1ZXNbbWF0Y2hJbmRleCsrXSB8fCBcIlwiKSkge1xuICAgICAgICAgIHN0YXJ0TnVtID0gcGFyc2VGbG9hdChzdGFydFZhbHVlKSB8fCAwO1xuICAgICAgICAgIHN0YXJ0VW5pdCA9IHN0YXJ0VmFsdWUuc3Vic3RyKChzdGFydE51bSArIFwiXCIpLmxlbmd0aCk7XG4gICAgICAgICAgcmVsYXRpdmUgPSBlbmRWYWx1ZS5jaGFyQXQoMSkgPT09IFwiPVwiID8gKyhlbmRWYWx1ZS5jaGFyQXQoMCkgKyBcIjFcIikgOiAwO1xuXG4gICAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlLnN1YnN0cigyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbmROdW0gPSBwYXJzZUZsb2F0KGVuZFZhbHVlKTtcbiAgICAgICAgICBlbmRVbml0ID0gZW5kVmFsdWUuc3Vic3RyKChlbmROdW0gKyBcIlwiKS5sZW5ndGgpO1xuICAgICAgICAgIGluZGV4ID0gX251bVdpdGhVbml0RXhwLmxhc3RJbmRleCAtIGVuZFVuaXQubGVuZ3RoO1xuXG4gICAgICAgICAgaWYgKCFlbmRVbml0KSB7XG4gICAgICAgICAgICBlbmRVbml0ID0gZW5kVW5pdCB8fCBfY29uZmlnLnVuaXRzW3Byb3BdIHx8IHN0YXJ0VW5pdDtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBlbmQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGVuZCArPSBlbmRVbml0O1xuICAgICAgICAgICAgICBwdC5lICs9IGVuZFVuaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXJ0VW5pdCAhPT0gZW5kVW5pdCkge1xuICAgICAgICAgICAgc3RhcnROdW0gPSBfY29udmVydFRvVW5pdCh0YXJnZXQsIHByb3AsIHN0YXJ0VmFsdWUsIGVuZFVuaXQpIHx8IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHQuX3B0ID0ge1xuICAgICAgICAgICAgX25leHQ6IHB0Ll9wdCxcbiAgICAgICAgICAgIHA6IGNodW5rIHx8IG1hdGNoSW5kZXggPT09IDEgPyBjaHVuayA6IFwiLFwiLFxuICAgICAgICAgICAgczogc3RhcnROdW0sXG4gICAgICAgICAgICBjOiByZWxhdGl2ZSA/IHJlbGF0aXZlICogZW5kTnVtIDogZW5kTnVtIC0gc3RhcnROdW0sXG4gICAgICAgICAgICBtOiBjb2xvciAmJiBjb2xvciA8IDQgPyBNYXRoLnJvdW5kIDogMFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHQuYyA9IGluZGV4IDwgZW5kLmxlbmd0aCA/IGVuZC5zdWJzdHJpbmcoaW5kZXgsIGVuZC5sZW5ndGgpIDogXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcHQuciA9IHByb3AgPT09IFwiZGlzcGxheVwiICYmIGVuZCA9PT0gXCJub25lXCIgPyBfcmVuZGVyTm9uVHdlZW5pbmdWYWx1ZU9ubHlBdEVuZCA6IF9yZW5kZXJOb25Ud2VlbmluZ1ZhbHVlO1xuICAgIH1cblxuICAgIGlmIChfcmVsRXhwLnRlc3QoZW5kKSkge1xuICAgICAgcHQuZSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5fcHQgPSBwdDtcbiAgICByZXR1cm4gcHQ7XG4gIH0sXG4gICAgICBfa2V5d29yZFRvUGVyY2VudCA9IHtcbiAgICB0b3A6IFwiMCVcIixcbiAgICBib3R0b206IFwiMTAwJVwiLFxuICAgIGxlZnQ6IFwiMCVcIixcbiAgICByaWdodDogXCIxMDAlXCIsXG4gICAgY2VudGVyOiBcIjUwJVwiXG4gIH0sXG4gICAgICBfY29udmVydEtleXdvcmRzVG9QZXJjZW50YWdlcyA9IGZ1bmN0aW9uIF9jb252ZXJ0S2V5d29yZHNUb1BlcmNlbnRhZ2VzKHZhbHVlKSB7XG4gICAgdmFyIHNwbGl0ID0gdmFsdWUuc3BsaXQoXCIgXCIpLFxuICAgICAgICB4ID0gc3BsaXRbMF0sXG4gICAgICAgIHkgPSBzcGxpdFsxXSB8fCBcIjUwJVwiO1xuXG4gICAgaWYgKHggPT09IFwidG9wXCIgfHwgeCA9PT0gXCJib3R0b21cIiB8fCB5ID09PSBcImxlZnRcIiB8fCB5ID09PSBcInJpZ2h0XCIpIHtcbiAgICAgIHZhbHVlID0geDtcbiAgICAgIHggPSB5O1xuICAgICAgeSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHNwbGl0WzBdID0gX2tleXdvcmRUb1BlcmNlbnRbeF0gfHwgeDtcbiAgICBzcGxpdFsxXSA9IF9rZXl3b3JkVG9QZXJjZW50W3ldIHx8IHk7XG4gICAgcmV0dXJuIHNwbGl0LmpvaW4oXCIgXCIpO1xuICB9LFxuICAgICAgX3JlbmRlckNsZWFyUHJvcHMgPSBmdW5jdGlvbiBfcmVuZGVyQ2xlYXJQcm9wcyhyYXRpbywgZGF0YSkge1xuICAgIGlmIChkYXRhLnR3ZWVuICYmIGRhdGEudHdlZW4uX3RpbWUgPT09IGRhdGEudHdlZW4uX2R1cikge1xuICAgICAgdmFyIHRhcmdldCA9IGRhdGEudCxcbiAgICAgICAgICBzdHlsZSA9IHRhcmdldC5zdHlsZSxcbiAgICAgICAgICBwcm9wcyA9IGRhdGEudSxcbiAgICAgICAgICBwcm9wLFxuICAgICAgICAgIGNsZWFyVHJhbnNmb3JtcyxcbiAgICAgICAgICBpO1xuXG4gICAgICBpZiAocHJvcHMgPT09IFwiYWxsXCIgfHwgcHJvcHMgPT09IHRydWUpIHtcbiAgICAgICAgc3R5bGUuY3NzVGV4dCA9IFwiXCI7XG4gICAgICAgIGNsZWFyVHJhbnNmb3JtcyA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9wcyA9IHByb3BzLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgaSA9IHByb3BzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoLS1pID4gLTEpIHtcbiAgICAgICAgICBwcm9wID0gcHJvcHNbaV07XG5cbiAgICAgICAgICBpZiAoX3RyYW5zZm9ybVByb3BzW3Byb3BdKSB7XG4gICAgICAgICAgICBjbGVhclRyYW5zZm9ybXMgPSAxO1xuICAgICAgICAgICAgcHJvcCA9IHByb3AgPT09IFwidHJhbnNmb3JtT3JpZ2luXCIgPyBfdHJhbnNmb3JtT3JpZ2luUHJvcCA6IF90cmFuc2Zvcm1Qcm9wO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9yZW1vdmVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjbGVhclRyYW5zZm9ybXMpIHtcbiAgICAgICAgX3JlbW92ZVByb3BlcnR5KHRhcmdldCwgX3RyYW5zZm9ybVByb3ApO1xuXG4gICAgICAgIGNsZWFyVHJhbnNmb3JtcyA9IHRhcmdldC5fZ3NhcDtcblxuICAgICAgICBpZiAoY2xlYXJUcmFuc2Zvcm1zKSB7XG4gICAgICAgICAgaWYgKGNsZWFyVHJhbnNmb3Jtcy5zdmcpIHtcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2xlYXJUcmFuc2Zvcm1zLnVuY2FjaGUgPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAgICAgX3NwZWNpYWxQcm9wcyA9IHtcbiAgICBjbGVhclByb3BzOiBmdW5jdGlvbiBjbGVhclByb3BzKHBsdWdpbiwgdGFyZ2V0LCBwcm9wZXJ0eSwgZW5kVmFsdWUsIHR3ZWVuKSB7XG4gICAgICBpZiAodHdlZW4uZGF0YSAhPT0gXCJpc0Zyb21TdGFydFwiKSB7XG4gICAgICAgIHZhciBwdCA9IHBsdWdpbi5fcHQgPSBuZXcgUHJvcFR3ZWVuKHBsdWdpbi5fcHQsIHRhcmdldCwgcHJvcGVydHksIDAsIDAsIF9yZW5kZXJDbGVhclByb3BzKTtcbiAgICAgICAgcHQudSA9IGVuZFZhbHVlO1xuICAgICAgICBwdC5wciA9IC0xMDtcbiAgICAgICAgcHQudHdlZW4gPSB0d2VlbjtcblxuICAgICAgICBwbHVnaW4uX3Byb3BzLnB1c2gocHJvcGVydHkpO1xuXG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgICAgIF9pZGVudGl0eTJETWF0cml4ID0gWzEsIDAsIDAsIDEsIDAsIDBdLFxuICAgICAgX3JvdGF0aW9uYWxQcm9wZXJ0aWVzID0ge30sXG4gICAgICBfaXNOdWxsVHJhbnNmb3JtID0gZnVuY3Rpb24gX2lzTnVsbFRyYW5zZm9ybSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gXCJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMClcIiB8fCB2YWx1ZSA9PT0gXCJub25lXCIgfHwgIXZhbHVlO1xuICB9LFxuICAgICAgX2dldENvbXB1dGVkVHJhbnNmb3JtTWF0cml4QXNBcnJheSA9IGZ1bmN0aW9uIF9nZXRDb21wdXRlZFRyYW5zZm9ybU1hdHJpeEFzQXJyYXkodGFyZ2V0KSB7XG4gICAgdmFyIG1hdHJpeFN0cmluZyA9IF9nZXRDb21wdXRlZFByb3BlcnR5KHRhcmdldCwgX3RyYW5zZm9ybVByb3ApO1xuXG4gICAgcmV0dXJuIF9pc051bGxUcmFuc2Zvcm0obWF0cml4U3RyaW5nKSA/IF9pZGVudGl0eTJETWF0cml4IDogbWF0cml4U3RyaW5nLnN1YnN0cig3KS5tYXRjaChfbnVtRXhwKS5tYXAoX3JvdW5kKTtcbiAgfSxcbiAgICAgIF9nZXRNYXRyaXggPSBmdW5jdGlvbiBfZ2V0TWF0cml4KHRhcmdldCwgZm9yY2UyRCkge1xuICAgIHZhciBjYWNoZSA9IHRhcmdldC5fZ3NhcCxcbiAgICAgICAgc3R5bGUgPSB0YXJnZXQuc3R5bGUsXG4gICAgICAgIG1hdHJpeCA9IF9nZXRDb21wdXRlZFRyYW5zZm9ybU1hdHJpeEFzQXJyYXkodGFyZ2V0KSxcbiAgICAgICAgcGFyZW50LFxuICAgICAgICBuZXh0U2libGluZyxcbiAgICAgICAgdGVtcCxcbiAgICAgICAgYWRkZWRUb0RPTTtcblxuICAgIGlmIChjYWNoZS5zdmcgJiYgdGFyZ2V0LmdldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKSkge1xuICAgICAgdGVtcCA9IHRhcmdldC50cmFuc2Zvcm0uYmFzZVZhbC5jb25zb2xpZGF0ZSgpLm1hdHJpeDtcbiAgICAgIG1hdHJpeCA9IFt0ZW1wLmEsIHRlbXAuYiwgdGVtcC5jLCB0ZW1wLmQsIHRlbXAuZSwgdGVtcC5mXTtcbiAgICAgIHJldHVybiBtYXRyaXguam9pbihcIixcIikgPT09IFwiMSwwLDAsMSwwLDBcIiA/IF9pZGVudGl0eTJETWF0cml4IDogbWF0cml4O1xuICAgIH0gZWxzZSBpZiAobWF0cml4ID09PSBfaWRlbnRpdHkyRE1hdHJpeCAmJiAhdGFyZ2V0Lm9mZnNldFBhcmVudCAmJiB0YXJnZXQgIT09IF9kb2NFbGVtZW50ICYmICFjYWNoZS5zdmcpIHtcbiAgICAgIHRlbXAgPSBzdHlsZS5kaXNwbGF5O1xuICAgICAgc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHBhcmVudCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXG4gICAgICBpZiAoIXBhcmVudCB8fCAhdGFyZ2V0Lm9mZnNldFBhcmVudCkge1xuICAgICAgICBhZGRlZFRvRE9NID0gMTtcbiAgICAgICAgbmV4dFNpYmxpbmcgPSB0YXJnZXQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgX2RvY0VsZW1lbnQuYXBwZW5kQ2hpbGQodGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgbWF0cml4ID0gX2dldENvbXB1dGVkVHJhbnNmb3JtTWF0cml4QXNBcnJheSh0YXJnZXQpO1xuXG4gICAgICBpZiAodGVtcCkge1xuICAgICAgICBzdHlsZS5kaXNwbGF5ID0gdGVtcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9yZW1vdmVQcm9wZXJ0eSh0YXJnZXQsIFwiZGlzcGxheVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFkZGVkVG9ET00pIHtcbiAgICAgICAgaWYgKG5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZSh0YXJnZXQsIG5leHRTaWJsaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGFyZ2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfZG9jRWxlbWVudC5yZW1vdmVDaGlsZCh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcmNlMkQgJiYgbWF0cml4Lmxlbmd0aCA+IDYgPyBbbWF0cml4WzBdLCBtYXRyaXhbMV0sIG1hdHJpeFs0XSwgbWF0cml4WzVdLCBtYXRyaXhbMTJdLCBtYXRyaXhbMTNdXSA6IG1hdHJpeDtcbiAgfSxcbiAgICAgIF9hcHBseVNWR09yaWdpbiA9IGZ1bmN0aW9uIF9hcHBseVNWR09yaWdpbih0YXJnZXQsIG9yaWdpbiwgb3JpZ2luSXNBYnNvbHV0ZSwgc21vb3RoLCBtYXRyaXhBcnJheSwgcGx1Z2luVG9BZGRQcm9wVHdlZW5zVG8pIHtcbiAgICB2YXIgY2FjaGUgPSB0YXJnZXQuX2dzYXAsXG4gICAgICAgIG1hdHJpeCA9IG1hdHJpeEFycmF5IHx8IF9nZXRNYXRyaXgodGFyZ2V0LCB0cnVlKSxcbiAgICAgICAgeE9yaWdpbk9sZCA9IGNhY2hlLnhPcmlnaW4gfHwgMCxcbiAgICAgICAgeU9yaWdpbk9sZCA9IGNhY2hlLnlPcmlnaW4gfHwgMCxcbiAgICAgICAgeE9mZnNldE9sZCA9IGNhY2hlLnhPZmZzZXQgfHwgMCxcbiAgICAgICAgeU9mZnNldE9sZCA9IGNhY2hlLnlPZmZzZXQgfHwgMCxcbiAgICAgICAgYSA9IG1hdHJpeFswXSxcbiAgICAgICAgYiA9IG1hdHJpeFsxXSxcbiAgICAgICAgYyA9IG1hdHJpeFsyXSxcbiAgICAgICAgZCA9IG1hdHJpeFszXSxcbiAgICAgICAgdHggPSBtYXRyaXhbNF0sXG4gICAgICAgIHR5ID0gbWF0cml4WzVdLFxuICAgICAgICBvcmlnaW5TcGxpdCA9IG9yaWdpbi5zcGxpdChcIiBcIiksXG4gICAgICAgIHhPcmlnaW4gPSBwYXJzZUZsb2F0KG9yaWdpblNwbGl0WzBdKSB8fCAwLFxuICAgICAgICB5T3JpZ2luID0gcGFyc2VGbG9hdChvcmlnaW5TcGxpdFsxXSkgfHwgMCxcbiAgICAgICAgYm91bmRzLFxuICAgICAgICBkZXRlcm1pbmFudCxcbiAgICAgICAgeCxcbiAgICAgICAgeTtcblxuICAgIGlmICghb3JpZ2luSXNBYnNvbHV0ZSkge1xuICAgICAgYm91bmRzID0gX2dldEJCb3godGFyZ2V0KTtcbiAgICAgIHhPcmlnaW4gPSBib3VuZHMueCArICh+b3JpZ2luU3BsaXRbMF0uaW5kZXhPZihcIiVcIikgPyB4T3JpZ2luIC8gMTAwICogYm91bmRzLndpZHRoIDogeE9yaWdpbik7XG4gICAgICB5T3JpZ2luID0gYm91bmRzLnkgKyAofihvcmlnaW5TcGxpdFsxXSB8fCBvcmlnaW5TcGxpdFswXSkuaW5kZXhPZihcIiVcIikgPyB5T3JpZ2luIC8gMTAwICogYm91bmRzLmhlaWdodCA6IHlPcmlnaW4pO1xuICAgIH0gZWxzZSBpZiAobWF0cml4ICE9PSBfaWRlbnRpdHkyRE1hdHJpeCAmJiAoZGV0ZXJtaW5hbnQgPSBhICogZCAtIGIgKiBjKSkge1xuICAgICAgeCA9IHhPcmlnaW4gKiAoZCAvIGRldGVybWluYW50KSArIHlPcmlnaW4gKiAoLWMgLyBkZXRlcm1pbmFudCkgKyAoYyAqIHR5IC0gZCAqIHR4KSAvIGRldGVybWluYW50O1xuICAgICAgeSA9IHhPcmlnaW4gKiAoLWIgLyBkZXRlcm1pbmFudCkgKyB5T3JpZ2luICogKGEgLyBkZXRlcm1pbmFudCkgLSAoYSAqIHR5IC0gYiAqIHR4KSAvIGRldGVybWluYW50O1xuICAgICAgeE9yaWdpbiA9IHg7XG4gICAgICB5T3JpZ2luID0geTtcbiAgICB9XG5cbiAgICBpZiAoc21vb3RoIHx8IHNtb290aCAhPT0gZmFsc2UgJiYgY2FjaGUuc21vb3RoKSB7XG4gICAgICB0eCA9IHhPcmlnaW4gLSB4T3JpZ2luT2xkO1xuICAgICAgdHkgPSB5T3JpZ2luIC0geU9yaWdpbk9sZDtcbiAgICAgIGNhY2hlLnhPZmZzZXQgPSB4T2Zmc2V0T2xkICsgKHR4ICogYSArIHR5ICogYykgLSB0eDtcbiAgICAgIGNhY2hlLnlPZmZzZXQgPSB5T2Zmc2V0T2xkICsgKHR4ICogYiArIHR5ICogZCkgLSB0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FjaGUueE9mZnNldCA9IGNhY2hlLnlPZmZzZXQgPSAwO1xuICAgIH1cblxuICAgIGNhY2hlLnhPcmlnaW4gPSB4T3JpZ2luO1xuICAgIGNhY2hlLnlPcmlnaW4gPSB5T3JpZ2luO1xuICAgIGNhY2hlLnNtb290aCA9ICEhc21vb3RoO1xuICAgIGNhY2hlLm9yaWdpbiA9IG9yaWdpbjtcbiAgICBjYWNoZS5vcmlnaW5Jc0Fic29sdXRlID0gISFvcmlnaW5Jc0Fic29sdXRlO1xuICAgIHRhcmdldC5zdHlsZVtfdHJhbnNmb3JtT3JpZ2luUHJvcF0gPSBcIjBweCAwcHhcIjtcblxuICAgIGlmIChwbHVnaW5Ub0FkZFByb3BUd2VlbnNUbykge1xuICAgICAgX2FkZE5vblR3ZWVuaW5nUFQocGx1Z2luVG9BZGRQcm9wVHdlZW5zVG8sIGNhY2hlLCBcInhPcmlnaW5cIiwgeE9yaWdpbk9sZCwgeE9yaWdpbik7XG5cbiAgICAgIF9hZGROb25Ud2VlbmluZ1BUKHBsdWdpblRvQWRkUHJvcFR3ZWVuc1RvLCBjYWNoZSwgXCJ5T3JpZ2luXCIsIHlPcmlnaW5PbGQsIHlPcmlnaW4pO1xuXG4gICAgICBfYWRkTm9uVHdlZW5pbmdQVChwbHVnaW5Ub0FkZFByb3BUd2VlbnNUbywgY2FjaGUsIFwieE9mZnNldFwiLCB4T2Zmc2V0T2xkLCBjYWNoZS54T2Zmc2V0KTtcblxuICAgICAgX2FkZE5vblR3ZWVuaW5nUFQocGx1Z2luVG9BZGRQcm9wVHdlZW5zVG8sIGNhY2hlLCBcInlPZmZzZXRcIiwgeU9mZnNldE9sZCwgY2FjaGUueU9mZnNldCk7XG4gICAgfVxuICB9LFxuICAgICAgX3BhcnNlVHJhbnNmb3JtID0gZnVuY3Rpb24gX3BhcnNlVHJhbnNmb3JtKHRhcmdldCwgdW5jYWNoZSkge1xuICAgIHZhciBjYWNoZSA9IHRhcmdldC5fZ3NhcCB8fCBuZXcgR1NDYWNoZSh0YXJnZXQpO1xuXG4gICAgaWYgKFwieFwiIGluIGNhY2hlICYmICF1bmNhY2hlICYmICFjYWNoZS51bmNhY2hlKSB7XG4gICAgICByZXR1cm4gY2FjaGU7XG4gICAgfVxuXG4gICAgdmFyIHN0eWxlID0gdGFyZ2V0LnN0eWxlLFxuICAgICAgICBpbnZlcnRlZFNjYWxlWCA9IGNhY2hlLnNjYWxlWCA8IDAsXG4gICAgICAgIHhPcmlnaW4gPSBjYWNoZS54T3JpZ2luIHx8IDAsXG4gICAgICAgIHlPcmlnaW4gPSBjYWNoZS55T3JpZ2luIHx8IDAsXG4gICAgICAgIHB4ID0gXCJweFwiLFxuICAgICAgICBkZWcgPSBcImRlZ1wiLFxuICAgICAgICBvcmlnaW4gPSBfZ2V0Q29tcHV0ZWRQcm9wZXJ0eSh0YXJnZXQsIF90cmFuc2Zvcm1PcmlnaW5Qcm9wKSB8fCBcIjBcIixcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgeixcbiAgICAgICAgc2NhbGVYLFxuICAgICAgICBzY2FsZVksXG4gICAgICAgIHJvdGF0aW9uLFxuICAgICAgICByb3RhdGlvblgsXG4gICAgICAgIHJvdGF0aW9uWSxcbiAgICAgICAgc2tld1gsXG4gICAgICAgIHNrZXdZLFxuICAgICAgICBwZXJzcGVjdGl2ZSxcbiAgICAgICAgbWF0cml4LFxuICAgICAgICBhbmdsZSxcbiAgICAgICAgY29zLFxuICAgICAgICBzaW4sXG4gICAgICAgIGEsXG4gICAgICAgIGIsXG4gICAgICAgIGMsXG4gICAgICAgIGQsXG4gICAgICAgIGExMixcbiAgICAgICAgYTIyLFxuICAgICAgICB0MSxcbiAgICAgICAgdDIsXG4gICAgICAgIHQzLFxuICAgICAgICBhMTMsXG4gICAgICAgIGEyMyxcbiAgICAgICAgYTMzLFxuICAgICAgICBhNDIsXG4gICAgICAgIGE0MyxcbiAgICAgICAgYTMyO1xuICAgIHggPSB5ID0geiA9IHJvdGF0aW9uID0gcm90YXRpb25YID0gcm90YXRpb25ZID0gc2tld1ggPSBza2V3WSA9IHBlcnNwZWN0aXZlID0gMDtcbiAgICBzY2FsZVggPSBzY2FsZVkgPSAxO1xuICAgIGNhY2hlLnN2ZyA9ICEhKHRhcmdldC5nZXRDVE0gJiYgX2lzU1ZHKHRhcmdldCkpO1xuICAgIG1hdHJpeCA9IF9nZXRNYXRyaXgodGFyZ2V0LCBjYWNoZS5zdmcpO1xuXG4gICAgaWYgKGNhY2hlLnN2Zykge1xuICAgICAgX2FwcGx5U1ZHT3JpZ2luKHRhcmdldCwgb3JpZ2luLCBjYWNoZS5vcmlnaW5Jc0Fic29sdXRlLCBjYWNoZS5zbW9vdGggIT09IGZhbHNlLCBtYXRyaXgpO1xuICAgIH1cblxuICAgIGlmIChtYXRyaXggIT09IF9pZGVudGl0eTJETWF0cml4KSB7XG4gICAgICBhID0gbWF0cml4WzBdO1xuICAgICAgYiA9IG1hdHJpeFsxXTtcbiAgICAgIGMgPSBtYXRyaXhbMl07XG4gICAgICBkID0gbWF0cml4WzNdO1xuICAgICAgeCA9IGExMiA9IG1hdHJpeFs0XTtcbiAgICAgIHkgPSBhMjIgPSBtYXRyaXhbNV07XG5cbiAgICAgIGlmIChtYXRyaXgubGVuZ3RoID09PSA2KSB7XG4gICAgICAgIHNjYWxlWCA9IE1hdGguc3FydChhICogYSArIGIgKiBiKTtcbiAgICAgICAgc2NhbGVZID0gTWF0aC5zcXJ0KGQgKiBkICsgYyAqIGMpO1xuICAgICAgICByb3RhdGlvbiA9IGEgfHwgYiA/IF9hdGFuMihiLCBhKSAqIF9SQUQyREVHIDogY2FjaGUucm90YXRpb24gfHwgMDtcbiAgICAgICAgc2tld1ggPSBjIHx8IGQgPyBfYXRhbjIoYywgZCkgKiBfUkFEMkRFRyArIHJvdGF0aW9uIDogY2FjaGUuc2tld1ggfHwgMDtcblxuICAgICAgICBpZiAoY2FjaGUuc3ZnKSB7XG4gICAgICAgICAgeCAtPSB4T3JpZ2luIC0gKHhPcmlnaW4gKiBhICsgeU9yaWdpbiAqIGMpO1xuICAgICAgICAgIHkgLT0geU9yaWdpbiAtICh4T3JpZ2luICogYiArIHlPcmlnaW4gKiBkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYTMyID0gbWF0cml4WzZdO1xuICAgICAgICBhNDIgPSBtYXRyaXhbN107XG4gICAgICAgIGExMyA9IG1hdHJpeFs4XTtcbiAgICAgICAgYTIzID0gbWF0cml4WzldO1xuICAgICAgICBhMzMgPSBtYXRyaXhbMTBdO1xuICAgICAgICBhNDMgPSBtYXRyaXhbMTFdO1xuICAgICAgICB4ID0gbWF0cml4WzEyXTtcbiAgICAgICAgeSA9IG1hdHJpeFsxM107XG4gICAgICAgIHogPSBtYXRyaXhbMTRdO1xuICAgICAgICBhbmdsZSA9IF9hdGFuMihhMzIsIGEzMyk7XG4gICAgICAgIHJvdGF0aW9uWCA9IGFuZ2xlICogX1JBRDJERUc7XG5cbiAgICAgICAgaWYgKGFuZ2xlKSB7XG4gICAgICAgICAgY29zID0gTWF0aC5jb3MoLWFuZ2xlKTtcbiAgICAgICAgICBzaW4gPSBNYXRoLnNpbigtYW5nbGUpO1xuICAgICAgICAgIHQxID0gYTEyICogY29zICsgYTEzICogc2luO1xuICAgICAgICAgIHQyID0gYTIyICogY29zICsgYTIzICogc2luO1xuICAgICAgICAgIHQzID0gYTMyICogY29zICsgYTMzICogc2luO1xuICAgICAgICAgIGExMyA9IGExMiAqIC1zaW4gKyBhMTMgKiBjb3M7XG4gICAgICAgICAgYTIzID0gYTIyICogLXNpbiArIGEyMyAqIGNvcztcbiAgICAgICAgICBhMzMgPSBhMzIgKiAtc2luICsgYTMzICogY29zO1xuICAgICAgICAgIGE0MyA9IGE0MiAqIC1zaW4gKyBhNDMgKiBjb3M7XG4gICAgICAgICAgYTEyID0gdDE7XG4gICAgICAgICAgYTIyID0gdDI7XG4gICAgICAgICAgYTMyID0gdDM7XG4gICAgICAgIH1cblxuICAgICAgICBhbmdsZSA9IF9hdGFuMigtYywgYTMzKTtcbiAgICAgICAgcm90YXRpb25ZID0gYW5nbGUgKiBfUkFEMkRFRztcblxuICAgICAgICBpZiAoYW5nbGUpIHtcbiAgICAgICAgICBjb3MgPSBNYXRoLmNvcygtYW5nbGUpO1xuICAgICAgICAgIHNpbiA9IE1hdGguc2luKC1hbmdsZSk7XG4gICAgICAgICAgdDEgPSBhICogY29zIC0gYTEzICogc2luO1xuICAgICAgICAgIHQyID0gYiAqIGNvcyAtIGEyMyAqIHNpbjtcbiAgICAgICAgICB0MyA9IGMgKiBjb3MgLSBhMzMgKiBzaW47XG4gICAgICAgICAgYTQzID0gZCAqIHNpbiArIGE0MyAqIGNvcztcbiAgICAgICAgICBhID0gdDE7XG4gICAgICAgICAgYiA9IHQyO1xuICAgICAgICAgIGMgPSB0MztcbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ2xlID0gX2F0YW4yKGIsIGEpO1xuICAgICAgICByb3RhdGlvbiA9IGFuZ2xlICogX1JBRDJERUc7XG5cbiAgICAgICAgaWYgKGFuZ2xlKSB7XG4gICAgICAgICAgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICAgIHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICAgICAgICB0MSA9IGEgKiBjb3MgKyBiICogc2luO1xuICAgICAgICAgIHQyID0gYTEyICogY29zICsgYTIyICogc2luO1xuICAgICAgICAgIGIgPSBiICogY29zIC0gYSAqIHNpbjtcbiAgICAgICAgICBhMjIgPSBhMjIgKiBjb3MgLSBhMTIgKiBzaW47XG4gICAgICAgICAgYSA9IHQxO1xuICAgICAgICAgIGExMiA9IHQyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvdGF0aW9uWCAmJiBNYXRoLmFicyhyb3RhdGlvblgpICsgTWF0aC5hYnMocm90YXRpb24pID4gMzU5LjkpIHtcbiAgICAgICAgICByb3RhdGlvblggPSByb3RhdGlvbiA9IDA7XG4gICAgICAgICAgcm90YXRpb25ZID0gMTgwIC0gcm90YXRpb25ZO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NhbGVYID0gX3JvdW5kKE1hdGguc3FydChhICogYSArIGIgKiBiICsgYyAqIGMpKTtcbiAgICAgICAgc2NhbGVZID0gX3JvdW5kKE1hdGguc3FydChhMjIgKiBhMjIgKyBhMzIgKiBhMzIpKTtcbiAgICAgICAgYW5nbGUgPSBfYXRhbjIoYTEyLCBhMjIpO1xuICAgICAgICBza2V3WCA9IE1hdGguYWJzKGFuZ2xlKSA+IDAuMDAwMiA/IGFuZ2xlICogX1JBRDJERUcgOiAwO1xuICAgICAgICBwZXJzcGVjdGl2ZSA9IGE0MyA/IDEgLyAoYTQzIDwgMCA/IC1hNDMgOiBhNDMpIDogMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhY2hlLnN2Zykge1xuICAgICAgICBtYXRyaXggPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIpO1xuICAgICAgICBjYWNoZS5mb3JjZUNTUyA9IHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJcIikgfHwgIV9pc051bGxUcmFuc2Zvcm0oX2dldENvbXB1dGVkUHJvcGVydHkodGFyZ2V0LCBfdHJhbnNmb3JtUHJvcCkpO1xuICAgICAgICBtYXRyaXggJiYgdGFyZ2V0LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBtYXRyaXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChNYXRoLmFicyhza2V3WCkgPiA5MCAmJiBNYXRoLmFicyhza2V3WCkgPCAyNzApIHtcbiAgICAgIGlmIChpbnZlcnRlZFNjYWxlWCkge1xuICAgICAgICBzY2FsZVggKj0gLTE7XG4gICAgICAgIHNrZXdYICs9IHJvdGF0aW9uIDw9IDAgPyAxODAgOiAtMTgwO1xuICAgICAgICByb3RhdGlvbiArPSByb3RhdGlvbiA8PSAwID8gMTgwIDogLTE4MDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjYWxlWSAqPSAtMTtcbiAgICAgICAgc2tld1ggKz0gc2tld1ggPD0gMCA/IDE4MCA6IC0xODA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2FjaGUueCA9ICgoY2FjaGUueFBlcmNlbnQgPSB4ICYmIE1hdGgucm91bmQodGFyZ2V0Lm9mZnNldFdpZHRoIC8gMikgPT09IE1hdGgucm91bmQoLXgpID8gLTUwIDogMCkgPyAwIDogeCkgKyBweDtcbiAgICBjYWNoZS55ID0gKChjYWNoZS55UGVyY2VudCA9IHkgJiYgTWF0aC5yb3VuZCh0YXJnZXQub2Zmc2V0SGVpZ2h0IC8gMikgPT09IE1hdGgucm91bmQoLXkpID8gLTUwIDogMCkgPyAwIDogeSkgKyBweDtcbiAgICBjYWNoZS56ID0geiArIHB4O1xuICAgIGNhY2hlLnNjYWxlWCA9IF9yb3VuZChzY2FsZVgpO1xuICAgIGNhY2hlLnNjYWxlWSA9IF9yb3VuZChzY2FsZVkpO1xuICAgIGNhY2hlLnJvdGF0aW9uID0gX3JvdW5kKHJvdGF0aW9uKSArIGRlZztcbiAgICBjYWNoZS5yb3RhdGlvblggPSBfcm91bmQocm90YXRpb25YKSArIGRlZztcbiAgICBjYWNoZS5yb3RhdGlvblkgPSBfcm91bmQocm90YXRpb25ZKSArIGRlZztcbiAgICBjYWNoZS5za2V3WCA9IHNrZXdYICsgZGVnO1xuICAgIGNhY2hlLnNrZXdZID0gc2tld1kgKyBkZWc7XG4gICAgY2FjaGUudHJhbnNmb3JtUGVyc3BlY3RpdmUgPSBwZXJzcGVjdGl2ZSArIHB4O1xuXG4gICAgaWYgKGNhY2hlLnpPcmlnaW4gPSBwYXJzZUZsb2F0KG9yaWdpbi5zcGxpdChcIiBcIilbMl0pIHx8IDApIHtcbiAgICAgIHN0eWxlW190cmFuc2Zvcm1PcmlnaW5Qcm9wXSA9IF9maXJzdFR3b09ubHkob3JpZ2luKTtcbiAgICB9XG5cbiAgICBjYWNoZS54T2Zmc2V0ID0gY2FjaGUueU9mZnNldCA9IDA7XG4gICAgY2FjaGUuZm9yY2UzRCA9IF9jb25maWcuZm9yY2UzRDtcbiAgICBjYWNoZS5yZW5kZXJUcmFuc2Zvcm0gPSBjYWNoZS5zdmcgPyBfcmVuZGVyU1ZHVHJhbnNmb3JtcyA6IF9zdXBwb3J0czNEID8gX3JlbmRlckNTU1RyYW5zZm9ybXMgOiBfcmVuZGVyTm9uM0RUcmFuc2Zvcm1zO1xuICAgIGNhY2hlLnVuY2FjaGUgPSAwO1xuICAgIHJldHVybiBjYWNoZTtcbiAgfSxcbiAgICAgIF9maXJzdFR3b09ubHkgPSBmdW5jdGlvbiBfZmlyc3RUd29Pbmx5KHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSA9IHZhbHVlLnNwbGl0KFwiIFwiKSlbMF0gKyBcIiBcIiArIHZhbHVlWzFdO1xuICB9LFxuICAgICAgX2FkZFB4VHJhbnNsYXRlID0gZnVuY3Rpb24gX2FkZFB4VHJhbnNsYXRlKHRhcmdldCwgc3RhcnQsIHZhbHVlKSB7XG4gICAgdmFyIHVuaXQgPSBnZXRVbml0KHN0YXJ0KTtcbiAgICByZXR1cm4gX3JvdW5kKHBhcnNlRmxvYXQoc3RhcnQpICsgcGFyc2VGbG9hdChfY29udmVydFRvVW5pdCh0YXJnZXQsIFwieFwiLCB2YWx1ZSArIFwicHhcIiwgdW5pdCkpKSArIHVuaXQ7XG4gIH0sXG4gICAgICBfcmVuZGVyTm9uM0RUcmFuc2Zvcm1zID0gZnVuY3Rpb24gX3JlbmRlck5vbjNEVHJhbnNmb3JtcyhyYXRpbywgY2FjaGUpIHtcbiAgICBjYWNoZS56ID0gXCIwcHhcIjtcbiAgICBjYWNoZS5yb3RhdGlvblkgPSBjYWNoZS5yb3RhdGlvblggPSBcIjBkZWdcIjtcbiAgICBjYWNoZS5mb3JjZTNEID0gMDtcblxuICAgIF9yZW5kZXJDU1NUcmFuc2Zvcm1zKHJhdGlvLCBjYWNoZSk7XG4gIH0sXG4gICAgICBfemVyb0RlZyA9IFwiMGRlZ1wiLFxuICAgICAgX3plcm9QeCA9IFwiMHB4XCIsXG4gICAgICBfZW5kUGFyZW50aGVzaXMgPSBcIikgXCIsXG4gICAgICBfcmVuZGVyQ1NTVHJhbnNmb3JtcyA9IGZ1bmN0aW9uIF9yZW5kZXJDU1NUcmFuc2Zvcm1zKHJhdGlvLCBjYWNoZSkge1xuICAgIHZhciBfcmVmID0gY2FjaGUgfHwgdGhpcyxcbiAgICAgICAgeFBlcmNlbnQgPSBfcmVmLnhQZXJjZW50LFxuICAgICAgICB5UGVyY2VudCA9IF9yZWYueVBlcmNlbnQsXG4gICAgICAgIHggPSBfcmVmLngsXG4gICAgICAgIHkgPSBfcmVmLnksXG4gICAgICAgIHogPSBfcmVmLnosXG4gICAgICAgIHJvdGF0aW9uID0gX3JlZi5yb3RhdGlvbixcbiAgICAgICAgcm90YXRpb25ZID0gX3JlZi5yb3RhdGlvblksXG4gICAgICAgIHJvdGF0aW9uWCA9IF9yZWYucm90YXRpb25YLFxuICAgICAgICBza2V3WCA9IF9yZWYuc2tld1gsXG4gICAgICAgIHNrZXdZID0gX3JlZi5za2V3WSxcbiAgICAgICAgc2NhbGVYID0gX3JlZi5zY2FsZVgsXG4gICAgICAgIHNjYWxlWSA9IF9yZWYuc2NhbGVZLFxuICAgICAgICB0cmFuc2Zvcm1QZXJzcGVjdGl2ZSA9IF9yZWYudHJhbnNmb3JtUGVyc3BlY3RpdmUsXG4gICAgICAgIGZvcmNlM0QgPSBfcmVmLmZvcmNlM0QsXG4gICAgICAgIHRhcmdldCA9IF9yZWYudGFyZ2V0LFxuICAgICAgICB6T3JpZ2luID0gX3JlZi56T3JpZ2luLFxuICAgICAgICB0cmFuc2Zvcm1zID0gXCJcIixcbiAgICAgICAgdXNlM0QgPSBmb3JjZTNEID09PSBcImF1dG9cIiAmJiByYXRpbyAmJiByYXRpbyAhPT0gMSB8fCBmb3JjZTNEID09PSB0cnVlO1xuXG4gICAgaWYgKHpPcmlnaW4gJiYgKHJvdGF0aW9uWCAhPT0gX3plcm9EZWcgfHwgcm90YXRpb25ZICE9PSBfemVyb0RlZykpIHtcbiAgICAgIHZhciBhbmdsZSA9IHBhcnNlRmxvYXQocm90YXRpb25ZKSAqIF9ERUcyUkFELFxuICAgICAgICAgIGExMyA9IE1hdGguc2luKGFuZ2xlKSxcbiAgICAgICAgICBhMzMgPSBNYXRoLmNvcyhhbmdsZSksXG4gICAgICAgICAgY29zO1xuXG4gICAgICBhbmdsZSA9IHBhcnNlRmxvYXQocm90YXRpb25YKSAqIF9ERUcyUkFEO1xuICAgICAgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgeCA9IF9hZGRQeFRyYW5zbGF0ZSh0YXJnZXQsIHgsIGExMyAqIGNvcyAqIC16T3JpZ2luKTtcbiAgICAgIHkgPSBfYWRkUHhUcmFuc2xhdGUodGFyZ2V0LCB5LCAtTWF0aC5zaW4oYW5nbGUpICogLXpPcmlnaW4pO1xuICAgICAgeiA9IF9hZGRQeFRyYW5zbGF0ZSh0YXJnZXQsIHosIGEzMyAqIGNvcyAqIC16T3JpZ2luICsgek9yaWdpbik7XG4gICAgfVxuXG4gICAgaWYgKHhQZXJjZW50IHx8IHlQZXJjZW50KSB7XG4gICAgICB0cmFuc2Zvcm1zID0gXCJ0cmFuc2xhdGUoXCIgKyB4UGVyY2VudCArIFwiJSwgXCIgKyB5UGVyY2VudCArIFwiJSkgXCI7XG4gICAgfVxuXG4gICAgaWYgKHVzZTNEIHx8IHggIT09IF96ZXJvUHggfHwgeSAhPT0gX3plcm9QeCB8fCB6ICE9PSBfemVyb1B4KSB7XG4gICAgICB0cmFuc2Zvcm1zICs9IHogIT09IF96ZXJvUHggfHwgdXNlM0QgPyBcInRyYW5zbGF0ZTNkKFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiwgXCIgKyB6ICsgXCIpIFwiIDogXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsIFwiICsgeSArIF9lbmRQYXJlbnRoZXNpcztcbiAgICB9XG5cbiAgICBpZiAodHJhbnNmb3JtUGVyc3BlY3RpdmUgIT09IF96ZXJvUHgpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0gXCJwZXJzcGVjdGl2ZShcIiArIHRyYW5zZm9ybVBlcnNwZWN0aXZlICsgX2VuZFBhcmVudGhlc2lzO1xuICAgIH1cblxuICAgIGlmIChyb3RhdGlvbiAhPT0gX3plcm9EZWcpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0gXCJyb3RhdGUoXCIgKyByb3RhdGlvbiArIF9lbmRQYXJlbnRoZXNpcztcbiAgICB9XG5cbiAgICBpZiAocm90YXRpb25ZICE9PSBfemVyb0RlZykge1xuICAgICAgdHJhbnNmb3JtcyArPSBcInJvdGF0ZVkoXCIgKyByb3RhdGlvblkgKyBfZW5kUGFyZW50aGVzaXM7XG4gICAgfVxuXG4gICAgaWYgKHJvdGF0aW9uWCAhPT0gX3plcm9EZWcpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0gXCJyb3RhdGVYKFwiICsgcm90YXRpb25YICsgX2VuZFBhcmVudGhlc2lzO1xuICAgIH1cblxuICAgIGlmIChza2V3WCAhPT0gX3plcm9EZWcgfHwgc2tld1kgIT09IF96ZXJvRGVnKSB7XG4gICAgICB0cmFuc2Zvcm1zICs9IFwic2tldyhcIiArIHNrZXdYICsgXCIsIFwiICsgc2tld1kgKyBfZW5kUGFyZW50aGVzaXM7XG4gICAgfVxuXG4gICAgaWYgKHNjYWxlWCAhPT0gMSB8fCBzY2FsZVkgIT09IDEpIHtcbiAgICAgIHRyYW5zZm9ybXMgKz0gXCJzY2FsZShcIiArIHNjYWxlWCArIFwiLCBcIiArIHNjYWxlWSArIF9lbmRQYXJlbnRoZXNpcztcbiAgICB9XG5cbiAgICB0YXJnZXQuc3R5bGVbX3RyYW5zZm9ybVByb3BdID0gdHJhbnNmb3JtcyB8fCBcInRyYW5zbGF0ZSgwLCAwKVwiO1xuICB9LFxuICAgICAgX3JlbmRlclNWR1RyYW5zZm9ybXMgPSBmdW5jdGlvbiBfcmVuZGVyU1ZHVHJhbnNmb3JtcyhyYXRpbywgY2FjaGUpIHtcbiAgICB2YXIgX3JlZjIgPSBjYWNoZSB8fCB0aGlzLFxuICAgICAgICB4UGVyY2VudCA9IF9yZWYyLnhQZXJjZW50LFxuICAgICAgICB5UGVyY2VudCA9IF9yZWYyLnlQZXJjZW50LFxuICAgICAgICB4ID0gX3JlZjIueCxcbiAgICAgICAgeSA9IF9yZWYyLnksXG4gICAgICAgIHJvdGF0aW9uID0gX3JlZjIucm90YXRpb24sXG4gICAgICAgIHNrZXdYID0gX3JlZjIuc2tld1gsXG4gICAgICAgIHNrZXdZID0gX3JlZjIuc2tld1ksXG4gICAgICAgIHNjYWxlWCA9IF9yZWYyLnNjYWxlWCxcbiAgICAgICAgc2NhbGVZID0gX3JlZjIuc2NhbGVZLFxuICAgICAgICB0YXJnZXQgPSBfcmVmMi50YXJnZXQsXG4gICAgICAgIHhPcmlnaW4gPSBfcmVmMi54T3JpZ2luLFxuICAgICAgICB5T3JpZ2luID0gX3JlZjIueU9yaWdpbixcbiAgICAgICAgeE9mZnNldCA9IF9yZWYyLnhPZmZzZXQsXG4gICAgICAgIHlPZmZzZXQgPSBfcmVmMi55T2Zmc2V0LFxuICAgICAgICBmb3JjZUNTUyA9IF9yZWYyLmZvcmNlQ1NTLFxuICAgICAgICB0eCA9IHBhcnNlRmxvYXQoeCksXG4gICAgICAgIHR5ID0gcGFyc2VGbG9hdCh5KSxcbiAgICAgICAgYTExLFxuICAgICAgICBhMjEsXG4gICAgICAgIGExMixcbiAgICAgICAgYTIyLFxuICAgICAgICB0ZW1wO1xuXG4gICAgcm90YXRpb24gPSBwYXJzZUZsb2F0KHJvdGF0aW9uKTtcbiAgICBza2V3WCA9IHBhcnNlRmxvYXQoc2tld1gpO1xuICAgIHNrZXdZID0gcGFyc2VGbG9hdChza2V3WSk7XG5cbiAgICBpZiAoc2tld1kpIHtcbiAgICAgIHNrZXdZID0gcGFyc2VGbG9hdChza2V3WSk7XG4gICAgICBza2V3WCArPSBza2V3WTtcbiAgICAgIHJvdGF0aW9uICs9IHNrZXdZO1xuICAgIH1cblxuICAgIGlmIChyb3RhdGlvbiB8fCBza2V3WCkge1xuICAgICAgcm90YXRpb24gKj0gX0RFRzJSQUQ7XG4gICAgICBza2V3WCAqPSBfREVHMlJBRDtcbiAgICAgIGExMSA9IE1hdGguY29zKHJvdGF0aW9uKSAqIHNjYWxlWDtcbiAgICAgIGEyMSA9IE1hdGguc2luKHJvdGF0aW9uKSAqIHNjYWxlWDtcbiAgICAgIGExMiA9IE1hdGguc2luKHJvdGF0aW9uIC0gc2tld1gpICogLXNjYWxlWTtcbiAgICAgIGEyMiA9IE1hdGguY29zKHJvdGF0aW9uIC0gc2tld1gpICogc2NhbGVZO1xuXG4gICAgICBpZiAoc2tld1gpIHtcbiAgICAgICAgc2tld1kgKj0gX0RFRzJSQUQ7XG4gICAgICAgIHRlbXAgPSBNYXRoLnRhbihza2V3WCAtIHNrZXdZKTtcbiAgICAgICAgdGVtcCA9IE1hdGguc3FydCgxICsgdGVtcCAqIHRlbXApO1xuICAgICAgICBhMTIgKj0gdGVtcDtcbiAgICAgICAgYTIyICo9IHRlbXA7XG5cbiAgICAgICAgaWYgKHNrZXdZKSB7XG4gICAgICAgICAgdGVtcCA9IE1hdGgudGFuKHNrZXdZKTtcbiAgICAgICAgICB0ZW1wID0gTWF0aC5zcXJ0KDEgKyB0ZW1wICogdGVtcCk7XG4gICAgICAgICAgYTExICo9IHRlbXA7XG4gICAgICAgICAgYTIxICo9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYTExID0gX3JvdW5kKGExMSk7XG4gICAgICBhMjEgPSBfcm91bmQoYTIxKTtcbiAgICAgIGExMiA9IF9yb3VuZChhMTIpO1xuICAgICAgYTIyID0gX3JvdW5kKGEyMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGExMSA9IHNjYWxlWDtcbiAgICAgIGEyMiA9IHNjYWxlWTtcbiAgICAgIGEyMSA9IGExMiA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHR4ICYmICF+KHggKyBcIlwiKS5pbmRleE9mKFwicHhcIikgfHwgdHkgJiYgIX4oeSArIFwiXCIpLmluZGV4T2YoXCJweFwiKSkge1xuICAgICAgdHggPSBfY29udmVydFRvVW5pdCh0YXJnZXQsIFwieFwiLCB4LCBcInB4XCIpO1xuICAgICAgdHkgPSBfY29udmVydFRvVW5pdCh0YXJnZXQsIFwieVwiLCB5LCBcInB4XCIpO1xuICAgIH1cblxuICAgIGlmICh4T3JpZ2luIHx8IHlPcmlnaW4gfHwgeE9mZnNldCB8fCB5T2Zmc2V0KSB7XG4gICAgICB0eCA9IF9yb3VuZCh0eCArIHhPcmlnaW4gLSAoeE9yaWdpbiAqIGExMSArIHlPcmlnaW4gKiBhMTIpICsgeE9mZnNldCk7XG4gICAgICB0eSA9IF9yb3VuZCh0eSArIHlPcmlnaW4gLSAoeE9yaWdpbiAqIGEyMSArIHlPcmlnaW4gKiBhMjIpICsgeU9mZnNldCk7XG4gICAgfVxuXG4gICAgaWYgKHhQZXJjZW50IHx8IHlQZXJjZW50KSB7XG4gICAgICB0ZW1wID0gdGFyZ2V0LmdldEJCb3goKTtcbiAgICAgIHR4ID0gX3JvdW5kKHR4ICsgeFBlcmNlbnQgLyAxMDAgKiB0ZW1wLndpZHRoKTtcbiAgICAgIHR5ID0gX3JvdW5kKHR5ICsgeVBlcmNlbnQgLyAxMDAgKiB0ZW1wLmhlaWdodCk7XG4gICAgfVxuXG4gICAgdGVtcCA9IFwibWF0cml4KFwiICsgYTExICsgXCIsXCIgKyBhMjEgKyBcIixcIiArIGExMiArIFwiLFwiICsgYTIyICsgXCIsXCIgKyB0eCArIFwiLFwiICsgdHkgKyBcIilcIjtcbiAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIHRlbXApO1xuXG4gICAgaWYgKGZvcmNlQ1NTKSB7XG4gICAgICB0YXJnZXQuc3R5bGVbX3RyYW5zZm9ybVByb3BdID0gdGVtcDtcbiAgICB9XG4gIH0sXG4gICAgICBfYWRkUm90YXRpb25hbFByb3BUd2VlbiA9IGZ1bmN0aW9uIF9hZGRSb3RhdGlvbmFsUHJvcFR3ZWVuKHBsdWdpbiwgdGFyZ2V0LCBwcm9wZXJ0eSwgc3RhcnROdW0sIGVuZFZhbHVlLCByZWxhdGl2ZSkge1xuICAgIHZhciBjYXAgPSAzNjAsXG4gICAgICAgIGlzU3RyaW5nID0gX2lzU3RyaW5nKGVuZFZhbHVlKSxcbiAgICAgICAgZW5kTnVtID0gcGFyc2VGbG9hdChlbmRWYWx1ZSkgKiAoaXNTdHJpbmcgJiYgfmVuZFZhbHVlLmluZGV4T2YoXCJyYWRcIikgPyBfUkFEMkRFRyA6IDEpLFxuICAgICAgICBjaGFuZ2UgPSByZWxhdGl2ZSA/IGVuZE51bSAqIHJlbGF0aXZlIDogZW5kTnVtIC0gc3RhcnROdW0sXG4gICAgICAgIGZpbmFsVmFsdWUgPSBzdGFydE51bSArIGNoYW5nZSArIFwiZGVnXCIsXG4gICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgcHQ7XG5cbiAgICBpZiAoaXNTdHJpbmcpIHtcbiAgICAgIGRpcmVjdGlvbiA9IGVuZFZhbHVlLnNwbGl0KFwiX1wiKVsxXTtcblxuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJzaG9ydFwiKSB7XG4gICAgICAgIGNoYW5nZSAlPSBjYXA7XG5cbiAgICAgICAgaWYgKGNoYW5nZSAhPT0gY2hhbmdlICUgKGNhcCAvIDIpKSB7XG4gICAgICAgICAgY2hhbmdlICs9IGNoYW5nZSA8IDAgPyBjYXAgOiAtY2FwO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwiY3dcIiAmJiBjaGFuZ2UgPCAwKSB7XG4gICAgICAgIGNoYW5nZSA9IChjaGFuZ2UgKyBjYXAgKiBfYmlnTnVtJDEpICUgY2FwIC0gfn4oY2hhbmdlIC8gY2FwKSAqIGNhcDtcbiAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcImNjd1wiICYmIGNoYW5nZSA+IDApIHtcbiAgICAgICAgY2hhbmdlID0gKGNoYW5nZSAtIGNhcCAqIF9iaWdOdW0kMSkgJSBjYXAgLSB+fihjaGFuZ2UgLyBjYXApICogY2FwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBsdWdpbi5fcHQgPSBwdCA9IG5ldyBQcm9wVHdlZW4ocGx1Z2luLl9wdCwgdGFyZ2V0LCBwcm9wZXJ0eSwgc3RhcnROdW0sIGNoYW5nZSwgX3JlbmRlclByb3BXaXRoRW5kKTtcbiAgICBwdC5lID0gZmluYWxWYWx1ZTtcbiAgICBwdC51ID0gXCJkZWdcIjtcblxuICAgIHBsdWdpbi5fcHJvcHMucHVzaChwcm9wZXJ0eSk7XG5cbiAgICByZXR1cm4gcHQ7XG4gIH0sXG4gICAgICBfYWRkUmF3VHJhbnNmb3JtUFRzID0gZnVuY3Rpb24gX2FkZFJhd1RyYW5zZm9ybVBUcyhwbHVnaW4sIHRyYW5zZm9ybXMsIHRhcmdldCkge1xuICAgIHZhciBzdHlsZSA9IF90ZW1wRGl2U3R5bGVyLnN0eWxlLFxuICAgICAgICBzdGFydENhY2hlID0gdGFyZ2V0Ll9nc2FwLFxuICAgICAgICBlbmRDYWNoZSxcbiAgICAgICAgcCxcbiAgICAgICAgc3RhcnRWYWx1ZSxcbiAgICAgICAgZW5kVmFsdWUsXG4gICAgICAgIHN0YXJ0TnVtLFxuICAgICAgICBlbmROdW0sXG4gICAgICAgIHN0YXJ0VW5pdCxcbiAgICAgICAgZW5kVW5pdDtcbiAgICBzdHlsZS5jc3NUZXh0ID0gZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpLmNzc1RleHQgKyBcIjtwb3NpdGlvbjphYnNvbHV0ZTtkaXNwbGF5OmJsb2NrO1wiO1xuICAgIHN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9IHRyYW5zZm9ybXM7XG5cbiAgICBfZG9jJDEuYm9keS5hcHBlbmRDaGlsZChfdGVtcERpdlN0eWxlcik7XG5cbiAgICBlbmRDYWNoZSA9IF9wYXJzZVRyYW5zZm9ybShfdGVtcERpdlN0eWxlciwgMSk7XG5cbiAgICBmb3IgKHAgaW4gX3RyYW5zZm9ybVByb3BzKSB7XG4gICAgICBzdGFydFZhbHVlID0gc3RhcnRDYWNoZVtwXTtcbiAgICAgIGVuZFZhbHVlID0gZW5kQ2FjaGVbcF07XG5cbiAgICAgIGlmIChzdGFydFZhbHVlICE9PSBlbmRWYWx1ZSAmJiBwICE9PSBcInBlcnNwZWN0aXZlXCIpIHtcbiAgICAgICAgc3RhcnRVbml0ID0gZ2V0VW5pdChzdGFydFZhbHVlKTtcbiAgICAgICAgZW5kVW5pdCA9IGdldFVuaXQoZW5kVmFsdWUpO1xuICAgICAgICBzdGFydE51bSA9IHN0YXJ0VW5pdCAhPT0gZW5kVW5pdCA/IF9jb252ZXJ0VG9Vbml0KHRhcmdldCwgcCwgc3RhcnRWYWx1ZSwgZW5kVW5pdCkgOiBwYXJzZUZsb2F0KHN0YXJ0VmFsdWUpO1xuICAgICAgICBlbmROdW0gPSBwYXJzZUZsb2F0KGVuZFZhbHVlKTtcbiAgICAgICAgcGx1Z2luLl9wdCA9IG5ldyBQcm9wVHdlZW4ocGx1Z2luLl9wdCwgc3RhcnRDYWNoZSwgcCwgc3RhcnROdW0sIGVuZE51bSAtIHN0YXJ0TnVtLCBfcmVuZGVyQ1NTUHJvcCk7XG4gICAgICAgIHBsdWdpbi5fcHQudSA9IGVuZFVuaXQ7XG5cbiAgICAgICAgcGx1Z2luLl9wcm9wcy5wdXNoKHApO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9kb2MkMS5ib2R5LnJlbW92ZUNoaWxkKF90ZW1wRGl2U3R5bGVyKTtcbiAgfTtcblxuICB2YXIgQ1NTUGx1Z2luID0ge1xuICAgIG5hbWU6IFwiY3NzXCIsXG4gICAgcmVnaXN0ZXI6IF9pbml0Q29yZSxcbiAgICB0YXJnZXRUZXN0OiBmdW5jdGlvbiB0YXJnZXRUZXN0KHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRhcmdldC5zdHlsZSAmJiB0YXJnZXQubm9kZVR5cGU7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KHRhcmdldCwgdmFycywgdHdlZW4sIGluZGV4LCB0YXJnZXRzKSB7XG4gICAgICB2YXIgcHJvcHMgPSB0aGlzLl9wcm9wcyxcbiAgICAgICAgICBzdHlsZSA9IHRhcmdldC5zdHlsZSxcbiAgICAgICAgICBzdGFydFZhbHVlLFxuICAgICAgICAgIGVuZFZhbHVlLFxuICAgICAgICAgIGVuZE51bSxcbiAgICAgICAgICBzdGFydE51bSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIHNwZWNpYWxQcm9wLFxuICAgICAgICAgIHAsXG4gICAgICAgICAgc3RhcnRVbml0LFxuICAgICAgICAgIGVuZFVuaXQsXG4gICAgICAgICAgcmVsYXRpdmUsXG4gICAgICAgICAgaXNUcmFuc2Zvcm1SZWxhdGVkLFxuICAgICAgICAgIHRyYW5zZm9ybVByb3BUd2VlbixcbiAgICAgICAgICBjYWNoZSxcbiAgICAgICAgICBzbW9vdGgsXG4gICAgICAgICAgaGFzUHJpb3JpdHk7XG5cbiAgICAgIGlmICghX3BsdWdpbkluaXR0ZWQpIHtcbiAgICAgICAgX2luaXRDb3JlKCk7XG4gICAgICB9XG5cbiAgICAgIGZvciAocCBpbiB2YXJzKSB7XG4gICAgICAgIGlmIChwID09PSBcImF1dG9Sb3VuZFwiKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBlbmRWYWx1ZSA9IHZhcnNbcF07XG5cbiAgICAgICAgaWYgKF9wbHVnaW5zW3BdICYmIF9jaGVja1BsdWdpbihwLCB2YXJzLCB0d2VlbiwgaW5kZXgsIHRhcmdldCwgdGFyZ2V0cykpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGUgPSB0eXBlb2YgZW5kVmFsdWU7XG4gICAgICAgIHNwZWNpYWxQcm9wID0gX3NwZWNpYWxQcm9wc1twXTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgZW5kVmFsdWUgPSBlbmRWYWx1ZS5jYWxsKHR3ZWVuLCBpbmRleCwgdGFyZ2V0LCB0YXJnZXRzKTtcbiAgICAgICAgICB0eXBlID0gdHlwZW9mIGVuZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIgJiYgfmVuZFZhbHVlLmluZGV4T2YoXCJyYW5kb20oXCIpKSB7XG4gICAgICAgICAgZW5kVmFsdWUgPSBfcmVwbGFjZVJhbmRvbShlbmRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3BlY2lhbFByb3ApIHtcbiAgICAgICAgICBpZiAoc3BlY2lhbFByb3AodGhpcywgdGFyZ2V0LCBwLCBlbmRWYWx1ZSwgdHdlZW4pKSB7XG4gICAgICAgICAgICBoYXNQcmlvcml0eSA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHAuc3Vic3RyKDAsIDIpID09PSBcIi0tXCIpIHtcbiAgICAgICAgICB0aGlzLmFkZChzdHlsZSwgXCJzZXRQcm9wZXJ0eVwiLCBnZXRDb21wdXRlZFN0eWxlKHRhcmdldCkuZ2V0UHJvcGVydHlWYWx1ZShwKSArIFwiXCIsIGVuZFZhbHVlICsgXCJcIiwgaW5kZXgsIHRhcmdldHMsIDAsIDAsIHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0YXJ0VmFsdWUgPSBfZ2V0KHRhcmdldCwgcCk7XG4gICAgICAgICAgc3RhcnROdW0gPSBwYXJzZUZsb2F0KHN0YXJ0VmFsdWUpO1xuICAgICAgICAgIHJlbGF0aXZlID0gdHlwZSA9PT0gXCJzdHJpbmdcIiAmJiBlbmRWYWx1ZS5jaGFyQXQoMSkgPT09IFwiPVwiID8gKyhlbmRWYWx1ZS5jaGFyQXQoMCkgKyBcIjFcIikgOiAwO1xuXG4gICAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlLnN1YnN0cigyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbmROdW0gPSBwYXJzZUZsb2F0KGVuZFZhbHVlKTtcblxuICAgICAgICAgIGlmIChwIGluIF9wcm9wZXJ0eUFsaWFzZXMpIHtcbiAgICAgICAgICAgIGlmIChwID09PSBcImF1dG9BbHBoYVwiKSB7XG4gICAgICAgICAgICAgIGlmIChzdGFydE51bSA9PT0gMSAmJiBfZ2V0KHRhcmdldCwgXCJ2aXNpYmlsaXR5XCIpID09PSBcImhpZGRlblwiICYmIGVuZE51bSkge1xuICAgICAgICAgICAgICAgIHN0YXJ0TnVtID0gMDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF9hZGROb25Ud2VlbmluZ1BUKHRoaXMsIHN0eWxlLCBcInZpc2liaWxpdHlcIiwgc3RhcnROdW0gPyBcImluaGVyaXRcIiA6IFwiaGlkZGVuXCIsIGVuZE51bSA/IFwiaW5oZXJpdFwiIDogXCJoaWRkZW5cIiwgIWVuZE51bSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwICE9PSBcInNjYWxlXCIpIHtcbiAgICAgICAgICAgICAgcCA9IF9wcm9wZXJ0eUFsaWFzZXNbcF07XG5cbiAgICAgICAgICAgICAgaWYgKH5wLmluZGV4T2YoXCIsXCIpKSB7XG4gICAgICAgICAgICAgICAgcCA9IHAuc3BsaXQoXCIsXCIpWzBdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaXNUcmFuc2Zvcm1SZWxhdGVkID0gcCBpbiBfdHJhbnNmb3JtUHJvcHM7XG5cbiAgICAgICAgICBpZiAoaXNUcmFuc2Zvcm1SZWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRyYW5zZm9ybVByb3BUd2Vlbikge1xuICAgICAgICAgICAgICBjYWNoZSA9IHRhcmdldC5fZ3NhcDtcbiAgICAgICAgICAgICAgc21vb3RoID0gdmFycy5zbW9vdGhPcmlnaW4gIT09IGZhbHNlICYmIGNhY2hlLnNtb290aDtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtUHJvcFR3ZWVuID0gdGhpcy5fcHQgPSBuZXcgUHJvcFR3ZWVuKHRoaXMuX3B0LCBzdHlsZSwgX3RyYW5zZm9ybVByb3AsIDAsIDEsIGNhY2hlLnJlbmRlclRyYW5zZm9ybSwgY2FjaGUsIDAsIC0xKTtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtUHJvcFR3ZWVuLmRlcCA9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwID09PSBcInNjYWxlXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5fcHQgPSBuZXcgUHJvcFR3ZWVuKHRoaXMuX3B0LCBjYWNoZSwgXCJzY2FsZVlcIiwgY2FjaGUuc2NhbGVZLCByZWxhdGl2ZSA/IHJlbGF0aXZlICogZW5kTnVtIDogZW5kTnVtIC0gY2FjaGUuc2NhbGVZKTtcbiAgICAgICAgICAgICAgcHJvcHMucHVzaChcInNjYWxlWVwiLCBwKTtcbiAgICAgICAgICAgICAgcCArPSBcIlhcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCA9PT0gXCJ0cmFuc2Zvcm1PcmlnaW5cIikge1xuICAgICAgICAgICAgICBlbmRWYWx1ZSA9IF9jb252ZXJ0S2V5d29yZHNUb1BlcmNlbnRhZ2VzKGVuZFZhbHVlKTtcblxuICAgICAgICAgICAgICBpZiAoY2FjaGUuc3ZnKSB7XG4gICAgICAgICAgICAgICAgX2FwcGx5U1ZHT3JpZ2luKHRhcmdldCwgZW5kVmFsdWUsIDAsIHNtb290aCwgMCwgdGhpcyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kVW5pdCA9IHBhcnNlRmxvYXQoZW5kVmFsdWUuc3BsaXQoXCIgXCIpWzJdKTtcblxuICAgICAgICAgICAgICAgIGlmIChlbmRVbml0ICE9PSBjYWNoZS56T3JpZ2luKSB7XG4gICAgICAgICAgICAgICAgICBfYWRkTm9uVHdlZW5pbmdQVCh0aGlzLCBjYWNoZSwgXCJ6T3JpZ2luXCIsIGNhY2hlLnpPcmlnaW4sIGVuZFVuaXQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIF9hZGROb25Ud2VlbmluZ1BUKHRoaXMsIHN0eWxlLCBwLCBfZmlyc3RUd29Pbmx5KHN0YXJ0VmFsdWUpLCBfZmlyc3RUd29Pbmx5KGVuZFZhbHVlKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCA9PT0gXCJzdmdPcmlnaW5cIikge1xuICAgICAgICAgICAgICBfYXBwbHlTVkdPcmlnaW4odGFyZ2V0LCBlbmRWYWx1ZSwgMSwgc21vb3RoLCAwLCB0aGlzKTtcblxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCBpbiBfcm90YXRpb25hbFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgX2FkZFJvdGF0aW9uYWxQcm9wVHdlZW4odGhpcywgY2FjaGUsIHAsIHN0YXJ0TnVtLCBlbmRWYWx1ZSwgcmVsYXRpdmUpO1xuXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwID09PSBcInNtb290aE9yaWdpblwiKSB7XG4gICAgICAgICAgICAgIF9hZGROb25Ud2VlbmluZ1BUKHRoaXMsIGNhY2hlLCBcInNtb290aFwiLCBjYWNoZS5zbW9vdGgsIGVuZFZhbHVlKTtcblxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCA9PT0gXCJmb3JjZTNEXCIpIHtcbiAgICAgICAgICAgICAgY2FjaGVbcF0gPSBlbmRWYWx1ZTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHAgPT09IFwidHJhbnNmb3JtXCIpIHtcbiAgICAgICAgICAgICAgX2FkZFJhd1RyYW5zZm9ybVBUcyh0aGlzLCBlbmRWYWx1ZSwgdGFyZ2V0KTtcblxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKCEocCBpbiBzdHlsZSkpIHtcbiAgICAgICAgICAgIHAgPSBfY2hlY2tQcm9wUHJlZml4KHApIHx8IHA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzVHJhbnNmb3JtUmVsYXRlZCB8fCAoZW5kTnVtIHx8IGVuZE51bSA9PT0gMCkgJiYgKHN0YXJ0TnVtIHx8IHN0YXJ0TnVtID09PSAwKSAmJiAhX2NvbXBsZXhFeHAudGVzdChlbmRWYWx1ZSkgJiYgcCBpbiBzdHlsZSkge1xuICAgICAgICAgICAgc3RhcnRVbml0ID0gKHN0YXJ0VmFsdWUgKyBcIlwiKS5zdWJzdHIoKHN0YXJ0TnVtICsgXCJcIikubGVuZ3RoKTtcbiAgICAgICAgICAgIGVuZFVuaXQgPSAoZW5kVmFsdWUgKyBcIlwiKS5zdWJzdHIoKGVuZE51bSArIFwiXCIpLmxlbmd0aCkgfHwgKHAgaW4gX2NvbmZpZy51bml0cyA/IF9jb25maWcudW5pdHNbcF0gOiBzdGFydFVuaXQpO1xuXG4gICAgICAgICAgICBpZiAoc3RhcnRVbml0ICE9PSBlbmRVbml0KSB7XG4gICAgICAgICAgICAgIHN0YXJ0TnVtID0gX2NvbnZlcnRUb1VuaXQodGFyZ2V0LCBwLCBzdGFydFZhbHVlLCBlbmRVbml0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcHQgPSBuZXcgUHJvcFR3ZWVuKHRoaXMuX3B0LCBpc1RyYW5zZm9ybVJlbGF0ZWQgPyBjYWNoZSA6IHN0eWxlLCBwLCBzdGFydE51bSwgcmVsYXRpdmUgPyByZWxhdGl2ZSAqIGVuZE51bSA6IGVuZE51bSAtIHN0YXJ0TnVtLCBlbmRVbml0ID09PSBcInB4XCIgJiYgdmFycy5hdXRvUm91bmQgIT09IGZhbHNlICYmICFpc1RyYW5zZm9ybVJlbGF0ZWQgPyBfcmVuZGVyUm91bmRlZENTU1Byb3AgOiBfcmVuZGVyQ1NTUHJvcCk7XG4gICAgICAgICAgICB0aGlzLl9wdC51ID0gZW5kVW5pdCB8fCAwO1xuXG4gICAgICAgICAgICBpZiAoc3RhcnRVbml0ICE9PSBlbmRVbml0KSB7XG4gICAgICAgICAgICAgIHRoaXMuX3B0LmIgPSBzdGFydFZhbHVlO1xuICAgICAgICAgICAgICB0aGlzLl9wdC5yID0gX3JlbmRlckNTU1Byb3BXaXRoQmVnaW5uaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIShwIGluIHN0eWxlKSkge1xuICAgICAgICAgICAgaWYgKHAgaW4gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkKHRhcmdldCwgcCwgdGFyZ2V0W3BdLCBlbmRWYWx1ZSwgaW5kZXgsIHRhcmdldHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX21pc3NpbmdQbHVnaW4ocCwgZW5kVmFsdWUpO1xuXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdHdlZW5Db21wbGV4Q1NTU3RyaW5nLmNhbGwodGhpcywgdGFyZ2V0LCBwLCBzdGFydFZhbHVlLCBlbmRWYWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJvcHMucHVzaChwKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaGFzUHJpb3JpdHkpIHtcbiAgICAgICAgX3NvcnRQcm9wVHdlZW5zQnlQcmlvcml0eSh0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldDogX2dldCxcbiAgICBhbGlhc2VzOiBfcHJvcGVydHlBbGlhc2VzLFxuICAgIGdldFNldHRlcjogZnVuY3Rpb24gZ2V0U2V0dGVyKHRhcmdldCwgcHJvcGVydHksIHBsdWdpbikge1xuICAgICAgcmV0dXJuIHByb3BlcnR5IGluIF90cmFuc2Zvcm1Qcm9wcyAmJiBwcm9wZXJ0eSAhPT0gX3RyYW5zZm9ybU9yaWdpblByb3AgJiYgKHRhcmdldC5fZ3NhcC54IHx8IF9nZXQodGFyZ2V0LCBcInhcIikpID8gcGx1Z2luICYmIF9yZWNlbnRTZXR0ZXJQbHVnaW4gPT09IHBsdWdpbiA/IHByb3BlcnR5ID09PSBcInNjYWxlXCIgPyBfc2V0dGVyU2NhbGUgOiBfc2V0dGVyVHJhbnNmb3JtIDogKF9yZWNlbnRTZXR0ZXJQbHVnaW4gPSBwbHVnaW4gfHwge30pICYmIChwcm9wZXJ0eSA9PT0gXCJzY2FsZVwiID8gX3NldHRlclNjYWxlV2l0aFJlbmRlciA6IF9zZXR0ZXJUcmFuc2Zvcm1XaXRoUmVuZGVyKSA6IHRhcmdldC5zdHlsZSAmJiAhX2lzVW5kZWZpbmVkKHRhcmdldC5zdHlsZVtwcm9wZXJ0eV0pID8gX3NldHRlckNTU1N0eWxlIDogfnByb3BlcnR5LmluZGV4T2YoXCItXCIpID8gX3NldHRlckNTU1Byb3AgOiBfZ2V0U2V0dGVyKHRhcmdldCwgcHJvcGVydHkpO1xuICAgIH1cbiAgfTtcbiAgZ3NhcC51dGlscy5jaGVja1ByZWZpeCA9IF9jaGVja1Byb3BQcmVmaXg7XG5cbiAgKGZ1bmN0aW9uIChwb3NpdGlvbkFuZFNjYWxlLCByb3RhdGlvbiwgb3RoZXJzLCBhbGlhc2VzKSB7XG4gICAgdmFyIGFsbCA9IF9mb3JFYWNoTmFtZShwb3NpdGlvbkFuZFNjYWxlICsgXCIsXCIgKyByb3RhdGlvbiArIFwiLFwiICsgb3RoZXJzLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgX3RyYW5zZm9ybVByb3BzW25hbWVdID0gMTtcbiAgICB9KTtcblxuICAgIF9mb3JFYWNoTmFtZShyb3RhdGlvbiwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIF9jb25maWcudW5pdHNbbmFtZV0gPSBcImRlZ1wiO1xuICAgICAgX3JvdGF0aW9uYWxQcm9wZXJ0aWVzW25hbWVdID0gMTtcbiAgICB9KTtcblxuICAgIF9wcm9wZXJ0eUFsaWFzZXNbYWxsWzEzXV0gPSBwb3NpdGlvbkFuZFNjYWxlICsgXCIsXCIgKyByb3RhdGlvbjtcblxuICAgIF9mb3JFYWNoTmFtZShhbGlhc2VzLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNwbGl0ID0gbmFtZS5zcGxpdChcIjpcIik7XG4gICAgICBfcHJvcGVydHlBbGlhc2VzW3NwbGl0WzFdXSA9IGFsbFtzcGxpdFswXV07XG4gICAgfSk7XG4gIH0pKFwieCx5LHosc2NhbGUsc2NhbGVYLHNjYWxlWSx4UGVyY2VudCx5UGVyY2VudFwiLCBcInJvdGF0aW9uLHJvdGF0aW9uWCxyb3RhdGlvblksc2tld1gsc2tld1lcIiwgXCJ0cmFuc2Zvcm0sdHJhbnNmb3JtT3JpZ2luLHN2Z09yaWdpbixmb3JjZTNELHNtb290aE9yaWdpbix0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiLCBcIjA6dHJhbnNsYXRlWCwxOnRyYW5zbGF0ZVksMjp0cmFuc2xhdGVaLDg6cm90YXRlLDg6cm90YXRpb25aLDk6cm90YXRlWCwxMDpyb3RhdGVZXCIpO1xuXG4gIF9mb3JFYWNoTmFtZShcIngseSx6LHRvcCxyaWdodCxib3R0b20sbGVmdCx3aWR0aCxoZWlnaHQsZm9udFNpemUscGFkZGluZyxtYXJnaW4scGVyc3BlY3RpdmVcIiwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBfY29uZmlnLnVuaXRzW25hbWVdID0gXCJweFwiO1xuICB9KTtcblxuICBnc2FwLnJlZ2lzdGVyUGx1Z2luKENTU1BsdWdpbik7XG5cbiAgdmFyIGdzYXBXaXRoQ1NTID0gZ3NhcC5yZWdpc3RlclBsdWdpbihDU1NQbHVnaW4pIHx8IGdzYXA7XG5cbiAgZXhwb3J0cy5CYWNrID0gQmFjaztcbiAgZXhwb3J0cy5Cb3VuY2UgPSBCb3VuY2U7XG4gIGV4cG9ydHMuQ1NTUGx1Z2luID0gQ1NTUGx1Z2luO1xuICBleHBvcnRzLkNpcmMgPSBDaXJjO1xuICBleHBvcnRzLkN1YmljID0gQ3ViaWM7XG4gIGV4cG9ydHMuRWxhc3RpYyA9IEVsYXN0aWM7XG4gIGV4cG9ydHMuRXhwbyA9IEV4cG87XG4gIGV4cG9ydHMuTGluZWFyID0gTGluZWFyO1xuICBleHBvcnRzLlBvd2VyMCA9IFBvd2VyMDtcbiAgZXhwb3J0cy5Qb3dlcjEgPSBQb3dlcjE7XG4gIGV4cG9ydHMuUG93ZXIyID0gUG93ZXIyO1xuICBleHBvcnRzLlBvd2VyMyA9IFBvd2VyMztcbiAgZXhwb3J0cy5Qb3dlcjQgPSBQb3dlcjQ7XG4gIGV4cG9ydHMuUXVhZCA9IFF1YWQ7XG4gIGV4cG9ydHMuUXVhcnQgPSBRdWFydDtcbiAgZXhwb3J0cy5RdWludCA9IFF1aW50O1xuICBleHBvcnRzLlNpbmUgPSBTaW5lO1xuICBleHBvcnRzLlN0ZXBwZWRFYXNlID0gU3RlcHBlZEVhc2U7XG4gIGV4cG9ydHMuU3Ryb25nID0gU3Ryb25nO1xuICBleHBvcnRzLlRpbWVsaW5lTGl0ZSA9IFRpbWVsaW5lO1xuICBleHBvcnRzLlRpbWVsaW5lTWF4ID0gVGltZWxpbmU7XG4gIGV4cG9ydHMuVHdlZW5MaXRlID0gVHdlZW47XG4gIGV4cG9ydHMuVHdlZW5NYXggPSBUd2VlbjtcbiAgZXhwb3J0cy5kZWZhdWx0ID0gZ3NhcFdpdGhDU1M7XG4gIGV4cG9ydHMuZ3NhcCA9IGdzYXBXaXRoQ1NTO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKSk7XG4iLCJpbXBvcnQgeyBUd2VlbkxpdGUgfSBmcm9tIFwiZ3NhcFwiO1xuXG5mdW5jdGlvbiBoZWxsbyhjb21waWxlcjogc3RyaW5nKSB7XG4gICAgY29uc29sZS5sb2coYEhlbGxvIGZyb20gJHtjb21waWxlcn1gKTtcbiAgICBjb25zb2xlLmxvZyhUd2VlbkxpdGUudG8oJy5kZG8nLCAyMCwge3Njb3JlOjEwMH0pKTtcbiAgICBjb25zb2xlLmxvZygnb2tkZHNzc2RkJyk7XG59XG5oZWxsbygnVHlwZVNjcmlwdCcpOyJdfQ==
