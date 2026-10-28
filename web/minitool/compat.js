(function (w) {
  'use strict';

  if (!Object.fromEntries) Object.fromEntries = function (entries) {
    var out = {};
    entries.forEach(function (e) {
      Object.defineProperty(out, e[0], {
        value: e[1],
        writable: true,
        enumerable: true,
        configurable: true
      });
    });
    return out;
  };
  if (!Array.prototype.flatMap) Object.defineProperty(Array.prototype, 'flatMap', {
    value: function (fn, ctx) {
      return [].concat.apply([], this.map(fn, ctx));
    },
    configurable: true,
    writable: true
  });
  if (!Array.prototype.at) Object.defineProperty(Array.prototype, 'at', {
    value: function (i) {
      i = Math.trunc(i) || 0;
      return this[i < 0 ? this.length + i : i];
    },
    configurable: true,
    writable: true
  });
  var css = w.CSS,
    ratio = !!(css && css.supports && css.supports('aspect-ratio', '2 / 3'));
  var flex = document.createElement('div');
  flex.style.cssText = 'position:absolute;visibility:hidden;display:flex;flex-direction:column;row-gap:1px';
  flex.appendChild(document.createElement('div'));
  flex.appendChild(document.createElement('div'));
  document.body.appendChild(flex);
  var flexGap = flex.scrollHeight === 1;
  flex.remove();
  function size() {
    document.documentElement.style.setProperty('--app-height', w.innerHeight + 'px');
  }
  size();
  w.addEventListener('resize', size);
  var enhance = function (root) {
    Array.prototype.forEach.call(root.querySelectorAll('[inert]'), function (el) {
      el.style.pointerEvents = 'none';
      Array.prototype.forEach.call(el.querySelectorAll('button,a,input'), function (b) {
        b.setAttribute('tabindex', '-1');
        if (b.tagName === 'BUTTON') b.disabled = true;
      });
    });
    if (!ratio) {
      Array.prototype.forEach.call(root.querySelectorAll('.map.reference-map'), function (el) {
        el.style.height = el.clientWidth * (el.classList.contains('modular-map') ? 1000 / 634 : 522 / 634) + 'px';
      });
      Array.prototype.forEach.call(root.querySelectorAll('.continuation-frame'), function (el) {
        el.style.height = el.clientWidth * 1.5 + 'px';
      });
      Array.prototype.forEach.call(root.querySelectorAll('.actor-frame'), function (el) {
        if (el.classList.contains('trade-portrait') || el.classList.contains('backlog-portrait') || el.classList.contains('node-portrait')) return;
        var stage = el.parentNode;
        if (el.classList.contains('vn-cast')) {
          var h = Math.min(stage.clientHeight * .94, stage.clientWidth * .86 * 1.5);
          el.style.height = h + 'px';
          el.style.width = h / 1.5 + 'px';
        } else if (el.classList.contains('shop-cast')) el.style.height = el.clientWidth * 1.5 + 'px';
      });
      Array.prototype.forEach.call(root.querySelectorAll('.journey-scene'), function (el) {
        el.style.height = el.clientWidth + 'px';
      });
      Array.prototype.forEach.call(root.querySelectorAll('.embark-round'), function (el) {
        el.style.height = el.clientWidth + 'px';
      });
      Array.prototype.forEach.call(root.querySelectorAll('.arrival-person'), function (el) {
        el.style.width = Math.min(el.clientHeight / 1.5, el.parentNode.clientWidth * .92) + 'px';
      });
    }
    if (!flexGap) Array.prototype.forEach.call(root.querySelectorAll('*'), function (el) {
      var style = w.getComputedStyle(el);
      if (style.display !== 'flex' && style.display !== 'inline-flex') return;
      var gap = parseFloat(style.getPropertyValue('--mini-gap')) || 0;
      if (!gap) return;
      var column = style.flexDirection.indexOf('column') === 0;
      Array.prototype.forEach.call(el.children, function (child, i) {
        child.style[column ? 'marginTop' : 'marginLeft'] = i ? gap + 'px' : '0px';
      });
    });
  };
  w.ShuMiniToolEnhance = enhance;
})(window);