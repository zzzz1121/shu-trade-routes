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
copy('web/portrait-review.html');
copy('web/app.js');
for (const file of ['engine.js', 'level.js', 'presenter.js', 'controller.js','dialogue.js','chapter-one.js','chapter-flow.js']) copy('miniapp/core/' + file);
copy('miniapp/ui/scene.js');
copy('miniapp/ui/narrative.js');
for(const file of ['sound-catalog.js','sound.js','sound-backends.js','experience.js','map-actors.js'])copy('miniapp/ui/'+file);
for (const file of ['tokens.css', 'game.css', 'narrative.css','presentation.css','immersion.css']) copy('miniapp/styles/' + file);
for (const file of ['town-atlas.png', 'town-extended.png']) copy('miniapp/assets/approved/' + file);
for (const file of ['iron.png', 'note.png', 'cloth.png', 'warehouse.png', 'delivery.png']) copy('miniapp/assets/generated/' + file);

for (const file of ['buildings.png','terrain.png','goods.png']) copy('miniapp/assets/v2/' + file);

for (const file of ['ahe.png','luo.png','xu.png']) copy('miniapp/assets/characters/' + file);

copy('miniapp/assets/chapters/chapter-scenes.png');

for(const file of ["ahe","luo","xu"]) copy("miniapp/assets/characters/v3/"+file+"-expressions.png");

for(const cue of Object.values(require('../miniapp/ui/sound-catalog').entries))copy('miniapp/assets/audio/'+cue.file);

console.log('Static game ready: ' + out);

for(const file of ['player.png','ahe.png'])copy('miniapp/assets/characters/map-v4/'+file);
copy('miniapp/assets/characters/v3/shen-expressions.png');

copy('web/story-ui.js');copy('miniapp/styles/story.css');copy('miniapp/ui/story-view.js');

copy('miniapp/assets/chapters/warehouse-interior.png');

copy('miniapp/styles/ui-v33.css');

copy('miniapp/styles/art-direction.css');
for(const file of ['home-town.png','merchant-room.png','cloth-shop.png','market-lane.png','paper-frame.png','ending-town.png','warehouse-counter.png'])copy('miniapp/assets/art-v34/'+file);

copy('miniapp/assets/characters/v34/luo-expressions.png');

copy('miniapp/assets/characters/v34/ahe-expressions.png');

copy('miniapp/assets/characters/v34/shen-expressions.png');

for(const actor of ['ahe','luo','shen','xu'])for(const emotion of ['neutral','smile','thinking','puzzled','worried','firm'])copy('miniapp/assets/characters/v35/'+actor+'/'+emotion+'.png');
