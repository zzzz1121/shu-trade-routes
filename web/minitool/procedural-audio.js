(function (w) {
  'use strict';

  const rate = 22050,
    R = rate;
  let seed = 4173;
  function noise() {
    seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
    return seed / 2147483648 - 1;
  }
  function make(seconds) {
    return new Float64Array(Math.ceil(seconds * rate));
  }
  function add(a, b, start = 0, scale = 1) {
    const offset = Math.round(start * rate);
    for (let i = 0; i < b.length && i + offset < a.length; i++) a[i + offset] += b[i] * scale;
    return a;
  }
  function rustle(seconds = .18, level = .3) {
    const a = make(seconds);
    let low = 0;
    for (let i = 0; i < a.length; i++) {
      const n = noise();
      low += .14 * (n - low);
      const t = i / rate;
      const env = Math.pow(Math.sin(Math.PI * t / seconds), 1.5);
      a[i] = (n - low) * env * level * (.7 + .3 * Math.sin(2 * Math.PI * 43 * t));
    }
    return a;
  }
  function tap(wood = false) {
    const a = make(.14);
    let low = 0;
    for (let i = 0; i < a.length; i++) {
      const t = i / rate,
        n = noise();
      low += .1 * (n - low);
      a[i] = (low * .8 + Math.sin(2 * Math.PI * (wood ? 260 : 125) * t) * .18) * Math.exp(-t * (wood ? 48 : 36)) * Math.min(1, t / .003);
    }
    return a;
  }
  // A short unpitched paper/fingertip touch; no footstep oscillator or hard transient.
  function paperTouch() {
    const seconds = .055,
      a = make(seconds);
    let fast = 0,
      slow = 0;
    for (let i = 0; i < a.length; i++) {
      const t = i / rate,
        n = noise();
      fast += .18 * (n - fast);
      slow += .055 * (n - slow);
      const attack = Math.min(1, t / .006),
        release = Math.max(0, 1 - t / seconds);
      a[i] = (fast - slow) * .42 * Math.sin(attack * Math.PI / 2) * release * release;
    }
    return a;
  }
  function coin(seconds = .28) {
    const a = make(seconds);
    for (let i = 0; i < a.length; i++) {
      const t = i / rate;
      let v = 0;
      for (const f of [920, 1435, 2121]) v += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * (15 + f / 400));
      a[i] = v * .085 * Math.min(1, t / .003);
    }
    return a;
  }
  function softTone(freq, seconds = .22) {
    const a = make(seconds);
    for (let i = 0; i < a.length; i++) {
      const t = i / rate;
      a[i] = (Math.sin(2 * Math.PI * freq * t) + .12 * Math.sin(2 * Math.PI * freq * 2 * t)) * .1 * Math.pow(Math.sin(Math.PI * t / seconds), 2);
    }
    return a;
  }
  function env(kind) {
    const a = make(8);
    let low = 0,
      slow = 0;
    for (let i = 0; i < a.length; i++) {
      const t = i / rate,
        n = noise();
      low += .025 * (n - low);
      slow += .003 * (n - slow);
      const fade = Math.min(1, t / .3, (8 - t) / .3);
      a[i] = (kind === 'water' ? low * .35 * (.7 + .3 * Math.sin(2 * Math.PI * .7 * t)) + slow * .3 : slow * .8 + low * .1) * fade;
    }
    if (kind === 'market') {
      for (const start of [1.4, 4.8, 6.6]) add(a, tap(), start, .06);
    }
    if (kind === 'paper') {
      for (const start of [1.1, 4.7]) add(a, rustle(.35), start, .13);
      for (let i = 0; i < a.length; i++) a[i] *= .35;
    }
    return a;
  }
  const sounds = {
    'ambience-market': () => env('market'),
    'ambience-water': () => env('water'),
    'ambience-paper': () => env('paper'),
    'step-earth': () => tap(),
    'step-wood': () => tap(true),
    'arrive': () => add(make(.2), tap(), 0, .55),
    'ui-click-paper': () => paperTouch(),
    'ui-page': () => rustle(.2, .17),
    'ui-dialogue': () => rustle(.14, .15),
    'ui-continue': () => rustle(.085, .13),
    'exchange': () => add(add(make(.48), coin(), 0, .8), rustle(.2), .2, .55),
    'pay-iron': () => add(add(make(.36), coin(), 0, .65), coin(), .08, .32),
    'pay-note': () => rustle(.23, .22),
    'purchase': () => add(add(make(.25), tap(), 0, .5), rustle(.13), .08, .35),
    'delivery': () => add(add(make(.4), tap(true), 0, .6), rustle(.25), .09, .45),
    'error': () => add(add(make(.23), tap(), 0, .48), tap(), .09, .25),
    'win': () => add(add(add(make(.85), softTone(294, .35), 0), softTone(392, .4), .18, .8), softTone(440, .4), .4, .6),
    'unlock': () => add(add(make(.45), rustle(.18), 0, .4), softTone(392, .3), .1, .7)
  };
  function note(a, midi, start, duration, volume, breath = false) {
    const f = 440 * 2 ** ((midi - 69) / 12),
      len = Math.floor(duration * R);
    for (let i = 0; i < len; i++) {
      const t = i / R,
        attack = Math.min(1, t / (breath ? .18 : .012)),
        end = Math.min(1, (duration - t) / .35);
      let x = breath ? Math.sin(2 * Math.PI * f * t + .025 * Math.sin(t * 25)) + .15 * Math.sin(4 * Math.PI * f * t) : Math.sin(2 * Math.PI * f * t) + .32 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t * 2) + .1 * Math.sin(6 * Math.PI * f * t) * Math.exp(-t * 5);
      x *= attack * end * Math.exp(-t / (breath ? 3.8 : 1.25)) * volume;
      a[(Math.floor(start * R) + i) % a.length] += x;
    }
  }
  const themes = {
    'music-market': {
      melody: [62, 65, 69, null, 67, 65, 62, null, 60, 62, 65, 67, 69, null, 67, null, 65, 62, 60, null, 57, 60, 62, null, 65, 67, 65, 62, 60, null, 62, null],
      bass: [38, 41, 36, 38]
    },
    'music-old-note': {
      melody: [62, null, null, 69, null, 67, null, null, 65, null, 62, null, null, 60, null, null, 62, null, 65, null, 69, null, 67, null, 65, null, 60, null, 57, null, 62, null],
      bass: [38, 36, 34, 38]
    },
    'music-homecoming': {
      melody: [65, null, 67, 69, 72, null, 69, null, 67, 65, 62, null, 65, null, 67, null, 69, 72, 74, null, 72, 69, 67, null, 65, 67, 69, 65, 62, null, 65, null],
      bass: [41, 36, 38, 41]
    }
  };
  function makeMusic(name) {
    const t = themes[name],
      a = new Float32Array(R * 32);
    t.melody.forEach((m, i) => {
      if (m !== null) note(a, m, i, 2.6, .12);
    });
    t.bass.forEach((m, i) => {
      note(a, m, i * 8, 6, .075);
      note(a, m + 19, i * 8 + 4, 3, .04, true);
    });
    for (let i = 0; i < a.length; i++) a[i] = Math.tanh(a[i]) * 0.7 * Math.min(1, i / (R * .1), (a.length - i) / (R * .12));
    return a;
  }
  w.ShuProceduralAudio = {
    rate: rate,
    make: function (id) {
      id = id.split('/').pop();
      id = {
        'prop-box': 'step-wood',
        'prop-paper': 'pay-note',
        'prop-cloth': 'delivery'
      }[id] || id;
      if (themes[id]) return makeMusic(id);
      if (!sounds[id]) return null;
      const a = sounds[id]();
      let peak = 0;
      for (const v of a) peak = Math.max(peak, Math.abs(v));
      if (peak > .8) for (let i = 0; i < a.length; i++) a[i] *= .8 / peak;
      return a;
    }
  };
})(window);