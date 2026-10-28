(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();else root.ShuSoundBackends = factory();
})(this, function () {
  'use strict';

  function browser(host) {
    let ctx = null,
      epoch = 0,
      enabled = false,
      dead = false;
    const cache = new Map(),
      voices = new Set(),
      loops = new Map();
    let wanted = {};
    function load(url) {
      if (!cache.has(url)) {
        const a = ShuProceduralAudio.make(url);
        if (!a) return Promise.resolve(null);
        const b = ctx.createBuffer(1, a.length, ShuProceduralAudio.rate);
        b.getChannelData(0).set(a);
        cache.set(url, Promise.resolve(b));
      }
      return cache.get(url);
    }
    function stopVoice(v) {
      try {
        v.source.stop();
      } catch (_ignored) {}
      v.source.disconnect();
      v.gain.disconnect();
      voices.delete(v);
    }
    function stopLoop(v) {
      try {
        v.source.stop();
      } catch (_ignored2) {}
      v.source.disconnect();
      v.gain.disconnect();
    }
    function stopEffects() {
      epoch++;
      for (const v of [...voices]) stopVoice(v);
    }
    function gain(node, value, seconds = .25) {
      node.gain.cancelScheduledValues(ctx.currentTime);
      node.gain.setTargetAtTime(value, ctx.currentTime, seconds / 4);
    }
    async function environment(next) {
      wanted = next;
      if (!ctx || !enabled || dead) return;
      for (const [id, v] of loops) {
        const target = next[id] ? next[id].gain : 0;
        v.target = target;
        gain(v.gain, target);
        if (!target) host.setTimeout(() => {
          if (v.target === 0 && loops.get(id) === v) {
            stopLoop(v);
            loops.delete(id);
          }
        }, 300);
      }
      for (const [id, spec] of Object.entries(next)) {
        if (!spec.gain || loops.has(id)) continue;
        const buffer = await load(spec.url);
        if (!buffer || dead || !enabled || !wanted[id] || !wanted[id].gain || loops.has(id)) continue;
        const source = ctx.createBufferSource(),
          g = ctx.createGain();
        source.buffer = buffer;
        source.loop = true;
        g.gain.value = 0;
        source.connect(g);
        g.connect(ctx.destination);
        const v = {
          source,
          gain: g,
          target: wanted[id].gain
        };
        loops.set(id, v);
        gain(g, v.target, .45);
        source.start();
      }
    }
    return {
      activate() {
        if (dead) return;
        if (!ctx) {
          const Type = host.AudioContext || host.webkitAudioContext;
          if (!Type) return;
          ctx = new Type();
        }
        enabled = true;
        return ctx.resume();
      },
      async play(id, url, volume) {
        if (!ctx || !enabled || dead) return;
        const turn = epoch,
          deadline = Date.now() + 400,
          buffer = await load(url);
        if (!buffer || turn !== epoch || !enabled || dead || Date.now() > deadline || ctx.state !== 'running') return;
        if (voices.size >= 4) stopVoice(voices.values().next().value);
        const source = ctx.createBufferSource(),
          g = ctx.createGain();
        source.buffer = buffer;
        g.gain.value = volume;
        source.connect(g);
        g.connect(ctx.destination);
        const v = {
          source,
          gain: g
        };
        voices.add(v);
        source.onended = () => {
          if (voices.delete(v)) {
            source.disconnect();
            g.disconnect();
          }
        };
        source.start();
      },
      environment,
      stopEffects,
      effectsVolume() {
        stopEffects();
      },
      suspend() {
        enabled = false;
        stopEffects();
        for (const v of loops.values()) stopLoop(v);
        loops.clear();
        if (ctx) return ctx.suspend();
      },
      destroy() {
        dead = true;
        enabled = false;
        stopEffects();
        for (const v of loops.values()) stopLoop(v);
        loops.clear();
        cache.clear();
        if (ctx) return ctx.close();
      },
      get diagnostics() {
        return {
          effects: voices.size,
          loops: loops.size,
          context: ctx ? ctx.state : 'locked'
        };
      }
    };
  }
  return {
    browser
  };
});