const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('web/concept/story.json','utf8')),bible=JSON.parse(fs.readFileSync('docs/story/story-bible.json','utf8')),map=new Map(data.scenes.map(s=>[s.id,s]));
test('文游台本节点、表情、选择及后续引用完整',()=>{
 assert.equal(map.size,data.scenes.length);const ids=new Set();
 for(const s of data.scenes){assert.ok(s.lines.length,s.id);for(const l of s.lines){assert.ok(!ids.has(l.id),l.id);ids.add(l.id);assert.ok(l.text.trim());const c=bible.characters.find(c=>c.name===l.speaker);if(c&&bible.expressions[c.id])assert.ok(bible.expressions[c.id].includes(l.expression),l.speaker+':'+l.expression);}
 if(s.next)assert.ok(map.has(s.next),s.next);if(s.choice)for(const o of s.choice.options){assert.ok(map.has(o.target),o.target);for(const [k,v] of Object.entries(o.set))assert.ok(bible.flags[k].split('/').includes(v));}}
 assert.equal(data.scenes.filter(s=>s.interlude).length,6);assert.ok(data.scenes.filter(s=>s.interlude).every(s=>s.interlude.optional));
});
test('所有96条选择路径可到结尾，无死循环，条件回响只读已经产生的标记',()=>{
 const endings={e1:0,e2:0,e3:0};function walk(id,flags,visited){assert.ok(!visited.has(id),'cycle '+id);const s=map.get(id);assert.ok(s);const nextVisited=new Set([...visited,id]);for(const l of s.lines)if(l.condition)for(const k of Object.keys(l.condition))assert.ok(k in flags,'unknown flag before callback: '+k);
 if(s.choice){for(const o of s.choice.options)walk(o.target,{...flags,...o.set},nextVisited);}
 else if(s.next)walk(s.next,flags,nextVisited);else{assert.ok(id in endings);endings[id]++;}}
 walk(data.start,{},new Set());assert.deepEqual(endings,{e1:32,e2:32,e3:32});
});
