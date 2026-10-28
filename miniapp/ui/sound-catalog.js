(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();else root.ShuSoundCatalog = factory();
})(this, function () {
  'use strict';

  // Original procedural stand-ins, not field recordings. Replace file paths here.
  const entries = {
    'music.market': {
      file: 'music-market',
      loop: true,
      gain: .44
    },
    'music.old-note': {
      file: 'music-old-note',
      loop: true,
      gain: .4
    },
    'music.homecoming': {
      file: 'music-homecoming',
      loop: true,
      gain: .44
    },
    'prop.box': {
      file: 'prop-box',
      gain: .35,
      cooldown: 450
    },
    'prop.paper': {
      file: 'prop-paper',
      gain: .25,
      cooldown: 300
    },
    'prop.cloth': {
      file: 'prop-cloth',
      gain: .3,
      cooldown: 350
    },
    'ambience.market': {
      file: 'ambience-market',
      loop: true,
      gain: .38
    },
    'ambience.water': {
      file: 'ambience-water',
      loop: true,
      gain: .3
    },
    'ambience.paper': {
      file: 'ambience-paper',
      loop: true,
      gain: .22
    },
    'move.step': {
      file: 'step-earth',
      gain: .46,
      cooldown: 130
    },
    'move.bridge': {
      file: 'step-wood',
      gain: .4,
      cooldown: 130
    },
    'move.arrive': {
      file: 'arrive',
      gain: .28,
      cooldown: 180
    },
    'ui.click': {
      file: 'ui-click-paper',
      gain: 0,
      cooldown: 160
    },
    'ui.page': {
      file: 'ui-page',
      gain: 0,
      cooldown: 180
    },
    'ui.dialogue': {
      file: 'ui-dialogue',
      gain: 0,
      cooldown: 180
    },
    'ui.continue': {
      file: 'ui-continue',
      gain: 0,
      cooldown: 100
    },
    'trade.exchange': {
      file: 'exchange',
      gain: .44,
      cooldown: 350
    },
    'trade.iron': {
      file: 'pay-iron',
      gain: .42,
      cooldown: 250
    },
    'trade.note': {
      file: 'pay-note',
      gain: .4,
      cooldown: 250
    },
    'trade.purchase': {
      file: 'purchase',
      gain: .34,
      cooldown: 300
    },
    'trade.delivery': {
      file: 'delivery',
      gain: .42,
      cooldown: 500
    },
    'system.error': {
      file: 'error',
      gain: .34,
      cooldown: 500
    },
    'system.win': {
      file: 'win',
      gain: .4,
      cooldown: 700
    },
    'system.unlock': {
      file: 'unlock',
      gain: .3,
      cooldown: 700
    }
  };
  return {
    entries,
    source: 'original-procedural-placeholder',
    version: 1
  };
});