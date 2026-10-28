(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();else root.ShuMapActors = factory();
})(this, function () {
  'use strict';

  const rows = {
    down: 0,
    up: 1,
    right: 2,
    left: 3
  };
  function frame(heading = 'down', step = 0) {
    return 'left:' + -Math.max(0, Math.min(2, step)) * 100 + '%;top:' + -(rows[heading] || 0) * 100 + '%;';
  }
  function cast(point, heading = 'down', step = 0, companion, base = './miniapp/assets') {
    return [{
      id: 'player',
      name: '行商',
      point,
      style: 'left:' + point[0] + '%;top:' + point[1] + '%;',
      image: base + '/characters/map-v4/player.webp',
      frameStyle: frame(heading, step)
    }, {
      id: 'ahe',
      name: '阿禾',
      point: companion || point,
      style: 'left:' + (companion || point)[0] + '%;top:' + (companion || point)[1] + '%;',
      image: base + '/characters/map-v4/ahe.webp',
      frameStyle: frame(heading, step)
    }];
  }
  return {
    frame,
    cast
  };
});