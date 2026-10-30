import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,validate,constrain,normalizeRoom} from './model.js';
test('starter layout survives export and import',()=>{const l=initial();assert.deepEqual(validate(JSON.parse(JSON.stringify(l))),l);});
test('rotated furniture stays inside walls',()=>{const l=initial(),i={...l.items[1],x:100,z:-100,rotation:90};const r=constrain(i,l.room);assert.ok(Math.abs(r.x)<=l.room.width/2-i.size[2]/2+.001);assert.ok(Math.abs(r.z)<=l.room.depth/2-i.size[0]/2+.001);});
test('invalid imported data is rejected',()=>{for(const value of [null,{}, {version:1,name:'test',room:{},items:[{}]}])assert.throws(()=>validate(value));const l=initial();l.items[0].size[0]=Infinity;assert.throws(()=>validate(l));});
test('opening dimensions remain within resized walls',()=>{const r=normalizeRoom({...initial().room,width:2,height:2,windowWidth:5,windowOffset:4,windowHeight:4,windowSill:3});assert.ok(r.windowWidth<=1.8);assert.ok(r.windowSill+r.windowHeight<=2);assert.ok(r.windowOffset+r.windowWidth/2<=1);});
test('duplicate object identifiers are rejected',()=>{const l=initial();l.items.push({...l.items[0]});assert.throws(()=>validate(l));});

test('photo reference keeps annotations and estimates through export/import', async()=>{
 const {photoReference}=await import('./model.js');
 const l=photoReference();
 assert.deepEqual(validate(JSON.parse(JSON.stringify(l))),l);
 assert.equal(l.room.height,2.45);
 assert.equal(l.room.depth,3.83);
 assert.equal(l.room.windowEnabled,false);
 const wardrobe=l.items.find(i=>i.type==='wardrobe');
 assert.deepEqual(wardrobe.size,[1.59,1.99,.55]);
 assert.equal(wardrobe.rotation,180);
 assert.equal(l.reference,'bedroom-photos-1');
});
test('old exported layouts keep their existing scene when new finishes default',()=>{
 const l=initial();
 for(const key of ['windowEnabled','doorLeaf','doorColor','skirting','skirtingColor'])delete l.room[key];
 const restored=validate(l);
 assert.equal(restored.room.windowEnabled,true);
 assert.equal(restored.room.doorLeaf,false);
 assert.equal(restored.room.skirting,false);
 assert.deepEqual(restored.items,l.items);
 assert.equal(restored.room.width,l.room.width);
});
test('import rejects malformed photo finish controls',()=>{
 const l=initial();l.room.windowEnabled='false';assert.throws(()=>validate(l));
 l.room.windowEnabled=false;l.room.doorColor='invalid';assert.throws(()=>validate(l));
});

test('full home reference preserves measured wardrobe, new furniture and separate windows',async()=>{
 const {homeReference}=await import('./model.js');const l=homeReference();
 assert.deepEqual(validate(JSON.parse(JSON.stringify(l))),l);
 assert.equal(l.room.height,2.45);
 assert.equal(l.reference,'home-photos-2');
 assert.equal(l.room.secondWindowEnabled,true);
 assert.notEqual(l.room.windowWall,l.room.secondWindowWall);
 assert.deepEqual(l.items.find(i=>i.type==='wardrobe').size,[1.59,1.99,.55]);
 assert.equal(l.items.find(i=>i.type==='wallcabinet').elevation,1.5);
 for(const type of ['sink','cabinet','fridge','sofa','ottoman','divan','doorway'])assert.ok(l.items.some(i=>i.type===type));
 for(const i of l.items)assert.deepEqual(constrain(i,l.room),i);
});
test('second opening must stay inside room and cannot share an occupied wall',async()=>{
 const {homeReference}=await import('./model.js');const l=homeReference();
 l.room.secondWindowWidth=30;l.room.secondWindowOffset=100;l.room.secondWindowHeight=20;
 const r=normalizeRoom(l.room);
 assert.ok(r.secondWindowWidth<=r.width-.2);
 assert.ok(r.secondWindowOffset+r.secondWindowWidth/2<=r.width/2);
 assert.ok(r.secondWindowSill+r.secondWindowHeight<=r.height);
 l.room.secondWindowWall=l.room.doorWall;assert.throws(()=>validate(l));
});
test('invalid elevations and coverings are rejected',()=>{
 const l=initial();l.items[0].elevation=NaN;assert.throws(()=>validate(l));
 l.items[0].elevation=0;l.room.secondWindowCover='bad';assert.throws(()=>validate(l));
});

test('home reference places the bed head against the wardrobe back with the kitchen across the aisle',async()=>{
 const {homeReference}=await import('./model.js');const {items}=homeReference();
 const wardrobe=items.find(i=>i.type==='wardrobe'),bed=items.find(i=>i.type==='divan'),fridge=items.find(i=>i.type==='fridge');
 // The wardrobe doors face the aisle on -X; the wide back faces the bed on +X.
 assert.equal(wardrobe.rotation,270);
 assert.equal(bed.rotation,90);
 assert.ok(Math.abs(wardrobe.z-bed.z)<=(wardrobe.size[0]-bed.size[0])/2);
 const back=wardrobe.x+wardrobe.size[2]/2, head=bed.x-bed.size[2]/2;
 assert.ok(head>=back-.01&&head<=back+.1);
 const fridgeAisleEdge=fridge.x+fridge.size[2]/2;
 const wardrobeAisleEdge=wardrobe.x-wardrobe.size[2]/2;
 assert.ok(wardrobeAisleEdge-fridgeAisleEdge>=.6);
});

test('photo reference wardrobes are fixed and keep their position through a room resize and JSON round trip',async()=>{
 const {homeReference,photoReference}=await import('./model.js');
 for (const layout of [homeReference(),photoReference()]) {
  const wardrobe=layout.items.find(i=>i.type==='wardrobe');
  assert.equal(wardrobe.fixed,true);
  const smallerRoom={...layout.room,width:2,depth:2};
  assert.deepEqual(constrain(wardrobe,smallerRoom),wardrobe);
  assert.equal(validate(JSON.parse(JSON.stringify(layout))).items.find(i=>i.id===wardrobe.id).fixed,true);
 }
});
test('older layouts without fixed fields load as movable and invalid lock flags are rejected',()=>{
 const old=initial();delete old.items[0].fixed;
 assert.equal(validate(old).items[0].fixed,false);
 old.items[0].fixed='false';assert.throws(()=>validate(old),/fixed/);
 old.items[0].fixed=null;assert.throws(()=>validate(old),/fixed/);
});

test('old photo reference fixtures upgrade in place without changing other furniture',async()=>{
 const {homeReference}=await import('./model.js');const l=homeReference();
 const wardrobe=l.items.find(i=>i.type==='wardrobe');wardrobe.name='Measured wardrobe (depth estimated)';delete wardrobe.fixed;wardrobe.x=.15;
 const doorway=l.items.find(i=>i.type==='doorway');doorway.name='Side doorway (location estimated)';delete doorway.fixed;
 const bed=l.items.find(i=>i.type==='divan');delete bed.fixed;
 const restored=validate(l);const upgraded=restored.items.find(i=>i.id===wardrobe.id);
 assert.equal(upgraded.fixed,true);assert.equal(upgraded.x,.15);assert.equal(restored.items.find(i=>i.id===doorway.id).fixed,true);
 assert.equal(restored.items.find(i=>i.id===bed.id).fixed,false);
 upgraded.fixed=false;assert.equal(validate(restored).items.find(i=>i.id===wardrobe.id).fixed,false);
});
