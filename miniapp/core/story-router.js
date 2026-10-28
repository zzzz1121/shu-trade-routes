(function (r, f) {
  if (typeof module === 'object' && module.exports) module.exports = f(require('./chapter-flow'), require('./campaign-flow'), require('./campaign'));else r.ShuStoryRouter = f(r.ShuChapterFlow, r.ShuCampaignFlow, r.ShuCampaign);
})(this, function (First, Campaign, Registry) {
  function create(host, storage) {
    const later = Campaign.create(host, storage),
      firstHost = Object.create(host);
    firstHost.completeLevel = function () {
      later.record('l01', host.ui.story.flags);
      host.completeLevel();
    };
    const first = First.create(firstHost, storage);
    let legacyTarget = null,
      legacyId = null;
    try {
      const raw = storage.read && storage.read('shu-trade-run-v1');
      if (raw && raw.session && Registry.chapters[raw.session.levelId] && !later.validate(raw)) legacyId = raw.session.levelId;
    } catch (_ignored) {}
    function handle(id) {
      if (id === 'legacy-restart' && legacyTarget) {
        const target = legacyTarget;
        legacyTarget = null;
        legacyId = null;
        later.begin(target);
        return true;
      }
      const match = /^(chapter-open:|enter:)(l\d\d)$/.exec(id);
      if (match && Registry.chapters[match[2]]) {
        const target = match[2];
        if (!host.unlocked(target)) return true;
        const saved = host.resume;
        if (legacyId === target) {
          legacyTarget = target;
          host.ui.modal = {
            kind: 'legacy',
            title: '本章故事已更新',
            body: '旧版中途局面无法接入完整剧情。重新开始本章，已完成章节记录保留。'
          };
          return true;
        }
        if (saved && saved.session.levelId === target) {
          if (later.validate(saved)) later.restore(saved);else {
            legacyTarget = target;
            host.ui.modal = {
              kind: 'legacy',
              title: '本章故事已更新',
              body: '旧版中途局面无法接入完整剧情。重新开始本章，已完成章节记录保留。'
            };
          }
        } else later.begin(target);
        return true;
      }
      if (id === 'resume' && host.resume && host.resume.version === 3) {
        later.restore(host.resume);
        return true;
      }
      if (match && match[2] === 'l01') return first.handle('chapter-open:l01');
      if (later.active) return later.handle(id);
      return first.handle(id);
    }
    return {
      handle,
      decorate(v) {
        return later.active ? later.decorate(v) : first.decorate(v);
      },
      snapshot() {
        return later.active ? later.snapshot() : first.snapshot();
      },
      validate(d) {
        return d && d.version === 3 ? later.validate(d) : first.validate(d);
      },
      restore(d) {
        return d.version === 3 ? later.restore(d) : first.restore(d);
      },
      reset() {
        first.reset();
        later.reset();
        legacyTarget = null;
      },
      resetRead() {
        first.resetRead();
        later.resetRead();
      },
      get active() {
        return first.active || later.active;
      },
      get canResume() {
        return later.active ? later.canResume : first.canResume;
      }
    };
  }
  return {
    create
  };
});