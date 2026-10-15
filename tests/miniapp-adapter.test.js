const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');
function page() {
  const file = path.resolve(__dirname, '../miniapp/pages/index/index.js');
  let instance;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
    require: createRequire(file),
    Page: definition => { instance = definition; },
  });
  instance.setData = function (next) { Object.assign(this.data, next); };
  instance.onLoad();
  return instance;
}
function action(p, name) { p.onAction({ currentTarget: { dataset: { action: name } } }); }
function move(p, node) { p.onMove({ currentTarget: { dataset: { node } } }); }
test('小程序 Page 适配器：两种路线事件绑定与结算数据（非官方编译验证）', () => {
  for (const route of [['bridge', 'shop'], ['street', 'alley', 'shop']]) {
    const p = page();
    action(p, 'intro'); action(p, 'play');
    action(p, 'x+'); action(p, 'x+'); action(p, 'exchange'); action(p, 'depart');
    route.forEach(n => move(p, n));
    action(p, 'buy'); move(p, 'delivery'); action(p, 'deliver');
    assert.equal(p.data.s.status, 'won');
    action(p, 'undo'); assert.equal(p.data.s.status, 'playing');
    assert.equal(p.data.s.cloth, 1);
    action(p, 'retry'); assert.equal(p.data.s.iron, 8);
    assert.equal(p.data.canUndo, false);
  }
});
test('小程序 Page 适配器：非法移动反馈、选择器范围与规则开关', () => {
  const p = page(); move(p, 'bridge');
  assert.equal(p.data.error, true);
  assert.equal(p.data.s.steps, 0);
  for (let i = 0; i < 12; i++) action(p, 'x+');
  assert.equal(p.data.x, 8);
  for (let i = 0; i < 12; i++) action(p, 'p-');
  assert.equal(p.data.p, 0);
  action(p, 'rules'); assert.equal(p.data.rules, true);
});
