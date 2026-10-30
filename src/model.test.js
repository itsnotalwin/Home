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
