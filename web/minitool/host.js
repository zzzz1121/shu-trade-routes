/* Offline-container adapter. No SDK, user account or network connection is created. */
(function (w) {
  'use strict';

  var keys = ['shu-trade-progress-v2', 'shu-trade-run-v1', 'shu-audio-settings-v1', 'shu-story-read-v1', 'shu-history-read-v1', 'shu-campaign-memory-v1'];
  var memory = Object.create(null),
    nativeStore = null,
    queue = Promise.resolve(),
    failed = false;
  function notice() {
    failed = true;
    var n = document.getElementById('minitool-storage-status');
    if (!n) {
      n = document.createElement('p');
      n.id = 'minitool-storage-status';
      n.setAttribute('role', 'status');
      n.textContent = '本机记录暂时无法保存，本次仍可继续游玩。';
      document.body.appendChild(n);
    }
  }
  function localRead(key) {
    try {
      var raw = w.localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
  function schedule(key, value, remove) {
    queue = queue.then(function () {
      return remove ? nativeStore.removeStorage({
        key: key
      }) : nativeStore.setStorage({
        key: key,
        data: JSON.stringify(value)
      });
    }).catch(notice);
    return queue;
  }
  var storage = {
    read: function (key) {
      return memory[key] === undefined ? null : JSON.parse(JSON.stringify(memory[key]));
    },
    write: function (key, value) {
      memory[key] = JSON.parse(JSON.stringify(value));
      if (nativeStore) {
        if (JSON.stringify(value).length > 1024 * 1024) {
          notice();
          throw Error('Save too large');
        }
        schedule(key, value, false);
      } else try {
        w.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        notice();
      }
    },
    remove: function (key) {
      delete memory[key];
      if (nativeStore) schedule(key, null, true);else try {
        w.localStorage.removeItem(key);
      } catch (e) {
        notice();
      }
    },
    flush: function () {
      return queue;
    },
    get failed() {
      return failed;
    }
  };
  function bounded(p) {
    return Promise.race([p, new Promise(function (_, reject) {
      setTimeout(function () {
        reject(Error('Host timeout'));
      }, 4000);
    })]);
  }
  async function init() {
    var xhs = w.xhs,
      mt = xhs && xhs.miniTool,
      opts = xhs && xhs.launchOptions;
    if (!opts && mt && typeof mt.getLaunchOptions === 'function') try {
      opts = await bounded(mt.getLaunchOptions());
    } catch (e) {}
    var version = Math.floor(Number(opts && opts.miniToolEnv && opts.miniToolEnv.buildVersion || 0) / 1000);
    if (version >= 9460 && mt && typeof mt.getStorage === 'function' && typeof mt.setStorage === 'function' && typeof mt.removeStorage === 'function') nativeStore = mt;
    await Promise.all(keys.map(async function (key) {
      var local = localRead(key);
      if (nativeStore) {
        try {
          var result = await bounded(mt.getStorage({
            key: key
          }));
          memory[key] = result.data == null ? local : JSON.parse(result.data);
          if (result.data == null && local != null) schedule(key, local, false);
        } catch (e) {
          memory[key] = local;
          notice();
        }
      } else memory[key] = local;
    }));
    async function windowInfo() {
      if (version < 9490 || !mt || typeof mt.getWindowInfo !== 'function') return;
      try {
        var info = await bounded(mt.getWindowInfo()),
          safe = info.safeArea || {},
          h = Number(info.windowHeight) || innerHeight,
          width = Number(info.windowWidth) || innerWidth,
          style = document.documentElement.style;
        style.setProperty('--safe-area-inset-top', Math.max(0, Number(safe.top) || 0) + 'px');
        style.setProperty('--safe-area-inset-bottom', Math.max(0, h - (Number(safe.bottom) || h)) + 'px');
        style.setProperty('--safe-area-inset-left', Math.max(0, Number(safe.left) || 0) + 'px');
        style.setProperty('--safe-area-inset-right', Math.max(0, width - (Number(safe.right) || width)) + 'px');
        var bottom = 0;
        Object.keys(info.menuButtons || {}).forEach(function (k) {
          var r = info.menuButtons[k];
          if (r) bottom = Math.max(bottom, Number(r.bottom) || 0);
        });
        style.setProperty('--host-toolbar-top', Math.max(bottom + 8, (Number(safe.top) || 0) + 8) + 'px');
      } catch (e) {}
    }
    windowInfo();
    w.addEventListener('resize', windowInfo);
  }
  w.ShuMiniTool = {
    storage: storage,
    ready: init()
  };
})(window);