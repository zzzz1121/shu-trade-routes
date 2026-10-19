// Build the hosted browser edition from the same files used by local preview.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.resolve(process.argv[2] || path.join(root, 'dist'));
function copy(source, target = source) {
  const dest = path.join(out, target);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(root, source), dest);
}
copy('web/index.html', 'index.html');
copy('web/app.js');
for (const file of ['engine.js', 'level.js', 'presenter.js', 'controller.js']) copy('miniapp/core/' + file);
copy('miniapp/ui/scene.js');
copy('miniapp/ui/narrative.js');
for (const file of ['tokens.css', 'game.css', 'narrative.css','presentation.css']) copy('miniapp/styles/' + file);
for (const file of ['town-atlas.png', 'town-extended.png']) copy('miniapp/assets/approved/' + file);
for (const file of ['iron.png', 'note.png', 'cloth.png', 'warehouse.png', 'delivery.png']) copy('miniapp/assets/generated/' + file);
console.log('Static game ready: ' + out);

for (const file of ['buildings.png','terrain.png','goods.png']) copy('miniapp/assets/v2/' + file);

for (const file of ['ahe.png','luo.png','xu.png']) copy('miniapp/assets/characters/' + file);

copy('miniapp/assets/chapters/chapter-scenes.png');
