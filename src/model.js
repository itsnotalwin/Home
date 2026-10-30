export const catalog = [
 {type:'bed',name:'Platform bed',size:[1.6,.9,2.1],color:'#b8b49b',icon:'▰'},
 {type:'divan',name:'Divan bed',size:[1.37,.62,1.88],color:'#626169',icon:'▰'},
 {type:'desk',name:'Writing desk',size:[1.3,.76,.65],color:'#b78a58',icon:'▤'},
 {type:'wardrobe',name:'Wardrobe',size:[1.2,2,.6],color:'#c4b6a0',icon:'▥'},
 {type:'shelf',name:'Open shelving',size:[.9,1.7,.35],color:'#b78a58',icon:'▦'},
 {type:'chair',name:'Lounge chair',size:[.7,.85,.75],color:'#9eaa8a',icon:'▧'},
 {type:'nightstand',name:'Bedside table',size:[.45,.5,.4],color:'#b78a58',icon:'▣'},
 {type:'rug',name:'Woven rug',size:[2.2,.025,2.8],color:'#d5c1a1',icon:'▱'},
 {type:'plant',name:'Indoor plant',size:[.5,1.2,.5],color:'#597653',icon:'♧'},
 {type:'lamp',name:'Floor lamp',size:[.45,1.6,.45],color:'#e1cba8',icon:'♙'},
 {type:'cabinet',name:'Kitchen base cabinet',size:[1,.9,.6],color:'#e2e1d5',icon:'▤'},
 {type:'sink',name:'Sink cabinet',size:[1.5,.9,.6],color:'#e2e1d5',icon:'▣'},
 {type:'fridge',name:'Fridge freezer',size:[.6,1.65,.65],color:'#f1eee4',icon:'▥'},
 {type:'wallcabinet',name:'Wall cupboard',size:[1,.7,.32],elevation:1.5,color:'#e2e1d5',icon:'▥'},
 {type:'sofa',name:'Two-seat sofa',size:[1.65,.85,.85],color:'#4c403a',icon:'▰'},
 {type:'ottoman',name:'Ottoman',size:[.7,.42,.75],color:'#4c403a',icon:'▱'},
 {type:'doorway',name:'Doorway marker',size:[.85,2.1,.12],color:'#eee9d9',icon:'⊓'},
 {type:'custom',name:'Custom object',size:[.7,.7,.7],color:'#a6b6bb',icon:'□'}
];
export const uid=()=>crypto.randomUUID();
export function makeItem(type,extra={}) {return {...structuredClone(catalog.find(x=>x.type===type)||catalog[0]),id:uid(),x:0,z:0,rotation:0,fixed:false,...extra};}
export function initial(){return {version:1,name:'My bedroom',room:{width:4.6,depth:4.2,height:2.7,wall:'#e4e1d5',floor:'#ba9974',flooring:'oak',light:1,windowCover:'none',secondWindowEnabled:false,secondWindowWall:'front',secondWindowOffset:0,secondWindowWidth:1.6,secondWindowHeight:1.2,secondWindowSill:1,secondWindowCover:'curtain',windowEnabled:true,doorLeaf:false,doorColor:'#643e34',skirting:false,skirtingColor:'#463027',doorWall:'front',doorOffset:1.2,doorWidth:.9,doorHeight:2.1,windowWall:'back',windowOffset:.6,windowWidth:1.5,windowHeight:1.15,windowSill:1},items:[makeItem('rug',{z:.3}),makeItem('bed',{x:-.65,z:-.8}),makeItem('nightstand',{x:-1.8,z:-1.35}),makeItem('desk',{x:1.5,z:-1.7}),makeItem('chair',{x:1.5,z:-.85}),makeItem('wardrobe',{x:-1.65,z:1.65,rotation:180}),makeItem('plant',{x:1.8,z:1.6}),makeItem('lamp',{x:-1.85,z:.2})]};}
export const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function constrain(item,room){if(item.fixed)return {...item};const r=item.rotation*Math.PI/180; const w=(Math.abs(Math.cos(r))*item.size[0]+Math.abs(Math.sin(r))*item.size[2])/2;const d=(Math.abs(Math.sin(r))*item.size[0]+Math.abs(Math.cos(r))*item.size[2])/2;return {...item,x:clamp(item.x,-Math.max(0,room.width/2-w),Math.max(0,room.width/2-w)),z:clamp(item.z,-Math.max(0,room.depth/2-d),Math.max(0,room.depth/2-d))};}
export function normalizeRoom(room){const r={...room};for(const kind of ['door','window','secondWindow']){const span=['front','back'].includes(r[kind+'Wall'])?r.width:r.depth;r[kind+'Width']=clamp(r[kind+'Width'],.3,span-.2);r[kind+'Offset']=clamp(r[kind+'Offset'],-(span-r[kind+'Width'])/2,(span-r[kind+'Width'])/2);if(kind!=='door')r[kind+'Sill']=clamp(r[kind+'Sill'],.1,r.height-.4);r[kind+'Height']=clamp(r[kind+'Height'],.3,r.height-(kind!=='door'?r[kind+'Sill']:0));}return r;}
export function validate(data){if(!data||data.version!==1||typeof data.name!=='string'||data.name.length>120||!data.room||!Array.isArray(data.items)||data.items.length>200)throw Error('This is not a valid Home layout.');const base=initial().room;const r={...base,...data.room};for(const k of Object.keys(base)){if(typeof r[k]!==typeof base[k]||(typeof r[k]==='number'&&!Number.isFinite(r[k])))throw Error('Invalid room settings.');}for(const k of ['width','depth','height'])if(r[k]<2||r[k]>20)throw Error('Room dimensions must be 2–20 metres.');if(!['front','back','left','right'].includes(r.doorWall)||!['front','back','left','right'].includes(r.windowWall)||r.windowEnabled&&r.doorWall===r.windowWall)throw Error('Door and window must use different walls.');if(!['front','back','left','right'].includes(r.secondWindowWall)||r.secondWindowEnabled&&(r.secondWindowWall===r.doorWall||r.windowEnabled&&r.secondWindowWall===r.windowWall))throw Error('Enabled openings must use different walls.');if(!['none','blinds','curtain'].includes(r.windowCover)||!['none','blinds','curtain'].includes(r.secondWindowCover))throw Error('Invalid window covering.');if(!['oak','tile','carpet'].includes(r.flooring)||r.light<.1||r.light>3)throw Error('Invalid room finish.');const color=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);if(!color(r.wall)||!color(r.floor)||!color(r.doorColor)||!color(r.skirtingColor))throw Error('Invalid room colour.');const ids=new Set();const items=data.items.map(i=>{if(!i||typeof i.id!=='string'||ids.has(i.id)||typeof i.name!=='string'||i.name.length>120||!catalog.some(c=>c.type===i.type)||!Array.isArray(i.size)||i.size.length!==3||!i.size.every(n=>Number.isFinite(n)&&n>=.02&&n<=20)||![i.x,i.z,i.rotation].every(Number.isFinite)||!color(i.color))throw Error('Invalid furniture data.');if(i.elevation!==undefined&&(!Number.isFinite(i.elevation)||i.elevation<0||i.elevation>20))throw Error('Invalid furniture elevation.');if(i.fixed!==undefined&&typeof i.fixed!=='boolean')throw Error('Invalid fixed setting.');ids.add(i.id);const oldFixture=['home-photos-2','bedroom-photos-1'].includes(data.reference)&&((i.type==='wardrobe'&&['Measured wardrobe (depth estimated)','Wardrobe (depth estimated)','Fixed wardrobe (depth estimated)'].includes(i.name))||(data.reference==='home-photos-2'&&['Side doorway (location estimated)','Side partition (estimated)','Passage partition (estimated)','Bathroom hallway entrance (estimated)','Bathroom hallway wall (estimated)','Hallway partition (estimated)'].includes(i.name)));const names={'Side doorway (location estimated)':'Bathroom hallway entrance (estimated)','Side partition (estimated)':'Bathroom hallway wall (estimated)','Passage partition (estimated)':'Hallway partition (estimated)'};return constrain({...i,name:(data.reference==='home-photos-2'?names[i.name]:null)||i.name,fixed:i.fixed??oldFixture},r);});return {version:1,name:data.name,room:normalizeRoom(r),items,...(['bedroom-photos-1','home-photos-2'].includes(data.reference)?{reference:data.reference}:{})};}


// Annotation values are transcribed from the supplied photos, not survey measurements.
// The unmeasured width and object placements deliberately remain editable placeholders.
export function photoReference(){
 const room=normalizeRoom({...initial().room,
  width:3,depth:3.83,height:2.45,wall:'#eee9d9',floor:'#d3c2a5',flooring:'tile',
  windowEnabled:false,doorWall:'back',doorOffset:1.0,doorWidth:.8,doorHeight:2.05,
  windowWall:'left',doorLeaf:true,doorColor:'#633c33',skirting:true,skirtingColor:'#473027'
 });
 return {version:1,name:'My bedroom · photo reference',reference:'bedroom-photos-1',room,
  items:[
   makeItem('divan',{name:'Grey bed (size estimated)',x:-.65,z:.15}),
   makeItem('wardrobe',{fixed:true,name:'Fixed wardrobe (depth estimated)',size:[1.59,1.99,.55],color:'#ebe8d8',x:-.65,z:-1.15,rotation:180})
  ].map(i=>constrain(i,room))
 };
}


// Six-photo interpretation: dimensions not annotated in the photos are placeholders.
// Preserve the original bedroom reference rather than treating 3.83 m as the full home span.
export function homeReference(){
 const room=normalizeRoom({...photoReference().room,width:4.0,depth:5.2,
  doorWall:'right',doorOffset:-.65,windowEnabled:true,windowWall:'back',windowOffset:-1.25,
  windowWidth:1.25,windowHeight:1.25,windowSill:1.05,windowCover:'blinds',
  secondWindowEnabled:true,secondWindowWall:'front',secondWindowOffset:-.95,
  secondWindowWidth:1.6,secondWindowHeight:1.2,secondWindowSill:1,secondWindowCover:'curtain'
 });
 return {version:1,name:'My home · photo reference',reference:'home-photos-2',room,items:[
  makeItem('sink',{name:'Kitchen sink (estimated)',x:-1.25,z:-2.3}),
  makeItem('cabinet',{name:'Kitchen counter (estimated)',size:[1.3,.9,.6],x:-1.7,z:-1.55,rotation:90}),
  makeItem('wallcabinet',{name:'Kitchen wall cupboard (estimated)',size:[1.3,.7,.32],x:-1.84,z:-1.55,rotation:90}),
  makeItem('fridge',{name:'Fridge freezer (estimated)',x:-1.65,z:-.5,rotation:90}),
  makeItem('wardrobe',{fixed:true,name:'Fixed wardrobe (depth estimated)',size:[1.59,1.99,.55],color:'#ebe8d8',x:-.17,z:-.7,rotation:270}),
  makeItem('divan',{name:'Grey bed (estimated)',x:1.05,z:-.7,rotation:90}),
  makeItem('sofa',{name:'Brown sofa (estimated)',x:-1.55,z:1.05,rotation:90}),
  makeItem('ottoman',{name:'Matching ottoman (estimated)',x:-1.65,z:2.225}),
  makeItem('doorway',{fixed:true,name:'Bathroom hallway entrance (estimated)',x:.38,z:-1.75}),
  makeItem('custom',{fixed:true,name:'Bathroom hallway wall (estimated)',size:[1.1,2.45,.1],color:'#eee9d9',x:1.38,z:-1.75}),
  makeItem('custom',{fixed:true,name:'Hallway partition (estimated)',size:[.1,2.45,.85],color:'#eee9d9',x:-.17,z:-2.175})
 ].map(i=>constrain(i,room))};
}
