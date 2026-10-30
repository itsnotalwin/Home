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
